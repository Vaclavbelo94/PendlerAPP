
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { origin, destination, mode = 'driving', transportModes = ['driving'], userId } = await req.json()
    
    console.log(`Traffic data request: ${origin} -> ${destination}, modes: ${transportModes.join(', ')}`)
    
    // HERE Maps API integration
    const hereApiKey = Deno.env.get('HERE_MAPS_API_KEY')
    if (!hereApiKey) {
      console.error('HERE Maps API key not found')
      // Return mock data if API key is not available
      const mockTrafficData = {
        routes: [{
          duration: "45 min",
          duration_in_traffic: "52 min",
          distance: "35.2 km",
          traffic_conditions: 'normal' as const,
          transport_mode: mode,
          cost_estimate: mode === 'driving' ? 8.5 : mode === 'public_transport' ? 2.5 : 0,
          carbon_footprint: calculateCarbonFootprint(35.2, mode)
        }],
        status: 'OK',
        multi_modal_options: await getMultiModalOptions(origin, destination, transportModes)
      }
      
      return new Response(JSON.stringify(mockTrafficData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Get directions for multiple transport modes using HERE Maps
    const routePromises = transportModes.map(async (transportMode: string) => {
      const hereMode = convertToHereMode(transportMode)
      
      // Use HERE Routing API v8 with proper parameters for traffic data
      const routingUrl = `https://router.hereapi.com/v8/routes?transportMode=${hereMode}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&return=summary,polyline,notices,spans,actions,instructions,typedIntersections&departure=now&spans=names,length,duration,baseDuration,flags,functionalClass,routeNumbers&alternatives=2&apikey=${hereApiKey}`
      
      console.log(`🚗 Fetching HERE Maps data for ${transportMode} (${hereMode})`)
      console.log(`📍 Route: ${origin} → ${destination}`)
      
      try {
        const response = await fetch(routingUrl)
        const data = await response.json()
        
        if (data.error) {
          console.error(`❌ HERE Maps API Error for ${transportMode}:`, data.error)
          return { transport_mode: transportMode, routes: [] }
        }
        
        console.log(`📊 HERE Maps found ${data.routes?.length || 0} routes for ${transportMode}`)
        
        // Get real-time traffic data using HERE Flow API
        const trafficFlowData = await getHereTrafficFlow(origin, destination, hereApiKey)
        
        return {
          transport_mode: transportMode,
          routes: data.routes?.map((route: any, index: number) => {
            const section = route.sections?.[0]
            const summary = section?.summary || route.summary
            
            // Extract all traffic incidents and notices
            const incidents = extractComprehensiveTrafficIssues(route, trafficFlowData)
            const trafficCondition = determineTrafficCondition(summary, incidents, route.sections)
            
            console.log(`🔍 Route ${index + 1}: ${trafficCondition} traffic, ${incidents.length} issues found`)
            if (incidents.length > 0) {
              console.log(`⚠️ Issues:`, incidents.map(i => `${i.severity}: ${i.description}`))
            }
            
            // Calculate real travel time vs optimal time
            const baseTime = summary?.baseDuration || summary?.duration
            const trafficTime = summary?.duration
            const delayMinutes = baseTime && trafficTime ? Math.round((trafficTime - baseTime) / 60) : 0
            
            return {
              duration: formatDuration(trafficTime),
              duration_in_traffic: formatDuration(trafficTime),
              distance: formatDistance(summary?.length),
              traffic_conditions: trafficCondition,
              cost_estimate: calculateCostEstimate(summary?.length, transportMode),
              carbon_footprint: calculateCarbonFootprint((summary?.length || 0) / 1000, transportMode),
              polyline: route.sections?.[0]?.polyline,
              warnings: incidents.filter((i: any) => i.severity !== 'low').map((i: any) => i.description),
              incidents: incidents,
              summary: `Trasa přes ${getRouteSummary(route)}`,
              delay_minutes: delayMinutes,
              base_duration: formatDuration(baseTime),
              has_closures: incidents.some(i => i.type === 'closure'),
              has_accidents: incidents.some(i => i.type === 'accident'),
              route_quality: assessRouteQuality(incidents, delayMinutes)
            }
          }) || []
        }
      } catch (error) {
        console.error(`💥 Error fetching HERE Maps data for ${transportMode}:`, error)
        return { transport_mode: transportMode, routes: [] }
      }
    })

    const multiModalResults = await Promise.all(routePromises)
    
    // Store analytics if user is provided
    if (userId && multiModalResults.length > 0) {
      const bestRoute = multiModalResults[0]?.routes?.[0]
      if (bestRoute) {
        await storeRouteAnalytics(userId, origin, destination, bestRoute, mode)
      }
    }

    const trafficData = {
      multi_modal_results: multiModalResults,
      recommendations: generateRecommendations(multiModalResults),
      status: 'OK'
    }

    return new Response(
      JSON.stringify(trafficData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Traffic data error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

// HERE Maps helper functions
function convertToHereMode(transportMode: string): string {
  const modeMapping: Record<string, string> = {
    'driving': 'car',
    'walking': 'pedestrian',
    'cycling': 'bicycle',
    'public_transport': 'publicTransport',
    'transit': 'publicTransport'
  }
  return modeMapping[transportMode] || 'car'
}

async function getHereTrafficFlow(origin: string, destination: string, apiKey: string) {
  try {
    // Get coordinates for origin and destination
    const originCoords = await geocodeAddress(origin, apiKey)
    const destCoords = await geocodeAddress(destination, apiKey)
    
    if (!originCoords || !destCoords) {
      return { flow: [] }
    }
    
    // Get traffic flow data for the area
    const bbox = calculateBoundingBox(originCoords, destCoords)
    const flowUrl = `https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:${bbox}&apikey=${apiKey}`
    
    console.log(`🌊 Fetching traffic flow data for bbox: ${bbox}`)
    
    const response = await fetch(flowUrl)
    if (response.ok) {
      const flowData = await response.json()
      console.log(`📊 Flow data: ${flowData.results?.length || 0} segments`)
      return flowData
    }
  } catch (error) {
    console.error('❌ Error fetching HERE traffic flow:', error)
  }
  return { results: [] }
}

async function geocodeAddress(address: string, apiKey: string) {
  try {
    const geocodeUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apikey=${apiKey}`
    const response = await fetch(geocodeUrl)
    const data = await response.json()
    
    if (data.items?.[0]?.position) {
      return data.items[0].position
    }
  } catch (error) {
    console.error('❌ Error geocoding address:', address, error)
  }
  return null
}

function calculateBoundingBox(origin: any, destination: any) {
  const margin = 0.05 // ~5km margin
  const minLat = Math.min(origin.lat, destination.lat) - margin
  const maxLat = Math.max(origin.lat, destination.lat) + margin
  const minLng = Math.min(origin.lng, destination.lng) - margin
  const maxLng = Math.max(origin.lng, destination.lng) + margin
  
  return `${minLng},${minLat},${maxLng},${maxLat}`
}

function extractComprehensiveTrafficIssues(route: any, flowData: any): any[] {
  const issues: any[] = []
  
  console.log(`🔍 Analyzing route for traffic issues...`)
  
  // Check route sections for notices and incidents
  if (route.sections) {
    route.sections.forEach((section: any, sectionIndex: number) => {
      console.log(`📋 Checking section ${sectionIndex + 1}`)
      
      // Check for notices (construction, closures, etc.)
      if (section.notices) {
        console.log(`⚠️ Found ${section.notices.length} notices in section ${sectionIndex + 1}`)
        section.notices.forEach((notice: any) => {
          const issue = analyzeTrafficNotice(notice)
          if (issue) {
            console.log(`🚨 Notice: ${issue.severity} - ${issue.description}`)
            issues.push(issue)
          }
        })
      }
      
      // Check for transport incidents
      if (section.incidents) {
        console.log(`🚗 Found ${section.incidents.length} incidents in section ${sectionIndex + 1}`)
        section.incidents.forEach((incident: any) => {
          issues.push({
            type: 'accident',
            description: incident.description || 'Dopravní nehoda na trase',
            severity: mapHereIncidentSeverity(incident.criticality),
            criticality: incident.criticality
          })
        })
      }
      
      // Analyze spans for traffic conditions
      if (section.spans) {
        section.spans.forEach((span: any) => {
          if (span.flags && span.flags.length > 0) {
            span.flags.forEach((flag: string) => {
              const issue = analyzeSpanFlag(flag, span)
              if (issue) {
                console.log(`🚩 Span flag: ${issue.severity} - ${issue.description}`)
                issues.push(issue)
              }
            })
          }
        })
      }
    })
  }
  
  // Analyze flow data for congestion
  if (flowData?.results) {
    flowData.results.forEach((segment: any) => {
      const congestionIssue = analyzeTrafficFlow(segment)
      if (congestionIssue) {
        issues.push(congestionIssue)
      }
    })
  }
  
  console.log(`📊 Total issues found: ${issues.length}`)
  return issues
}

function analyzeTrafficNotice(notice: any): any | null {
  const code = notice.code?.toLowerCase() || ''
  const text = notice.text?.toLowerCase() || ''
  
  // Critical closures and blockages
  const closureKeywords = [
    'closure', 'closed', 'blocked', 'gesperrt', 'geschlossen', 'uzavřen', 'uzavření',
    'tunnel', 'bridge', 'most', 'brücke', 'autobahn', 'dálnice'
  ]
  
  const constructionKeywords = [
    'construction', 'roadwork', 'repair', 'stavba', 'oprava', 'baustelle', 'bauarbeiten'
  ]
  
  const restrictionKeywords = [
    'restriction', 'lane', 'pruh', 'spur', 'omezení', 'einschränkung'
  ]
  
  // Check for critical closures
  if (closureKeywords.some(keyword => code.includes(keyword) || text.includes(keyword))) {
    return {
      type: 'closure',
      description: notice.text || `Uzavírka na trase: ${notice.code}`,
      severity: 'high',
      code: notice.code
    }
  }
  
  // Check for construction
  if (constructionKeywords.some(keyword => code.includes(keyword) || text.includes(keyword))) {
    return {
      type: 'construction',
      description: notice.text || `Stavební práce: ${notice.code}`,
      severity: 'medium',
      code: notice.code
    }
  }
  
  // Check for restrictions
  if (restrictionKeywords.some(keyword => code.includes(keyword) || text.includes(keyword))) {
    return {
      type: 'restriction',
      description: notice.text || `Dopravní omezení: ${notice.code}`,
      severity: 'medium',
      code: notice.code
    }
  }
  
  return null
}

function analyzeSpanFlag(flag: string, span: any): any | null {
  const flagLower = flag.toLowerCase()
  
  if (flagLower.includes('closure') || flagLower.includes('blocked')) {
    return {
      type: 'closure',
      description: `Uzavírka na ${span.names?.[0]?.value || 'neznámé silnici'}`,
      severity: 'high'
    }
  }
  
  if (flagLower.includes('construction') || flagLower.includes('roadwork')) {
    return {
      type: 'construction', 
      description: `Stavební práce na ${span.names?.[0]?.value || 'trase'}`,
      severity: 'medium'
    }
  }
  
  return null
}

function analyzeTrafficFlow(segment: any): any | null {
  const currentFlow = segment.currentFlow
  if (!currentFlow) return null
  
  const speed = currentFlow.speed
  const freeFlowSpeed = currentFlow.freeFlowSpeed
  const jamFactor = currentFlow.jamFactor
  
  if (jamFactor >= 8 || (speed && freeFlowSpeed && speed / freeFlowSpeed < 0.3)) {
    return {
      type: 'congestion',
      description: `Těžký provoz - rychlost ${speed || 'neznámá'} km/h`,
      severity: 'high',
      jamFactor: jamFactor
    }
  }
  
  if (jamFactor >= 5 || (speed && freeFlowSpeed && speed / freeFlowSpeed < 0.6)) {
    return {
      type: 'congestion',
      description: `Zpomalený provoz - rychlost ${speed || 'neznámá'} km/h`,
      severity: 'medium',
      jamFactor: jamFactor
    }
  }
  
  return null
}

function mapHereIncidentSeverity(criticality: number): 'low' | 'medium' | 'high' {
  if (criticality >= 3) return 'high'
  if (criticality >= 2) return 'medium'
  return 'low'
}

function determineTrafficCondition(summary: any, issues: any[] = [], sections: any[] = []): 'light' | 'normal' | 'heavy' {
  console.log(`🚦 Determining traffic condition...`)
  
  // Check for closures first - these are critical
  const closures = issues.filter(i => i.type === 'closure')
  if (closures.length > 0) {
    console.log(`🚫 ${closures.length} closures found - marking as HEAVY traffic`)
    return 'heavy'
  }
  
  // Check for accidents
  const accidents = issues.filter(i => i.type === 'accident')
  if (accidents.length > 0) {
    console.log(`💥 ${accidents.length} accidents found - marking as HEAVY traffic`)
    return 'heavy'
  }
  
  // Check for high-severity congestion
  const heavyCongestion = issues.filter(i => i.type === 'congestion' && i.severity === 'high')
  if (heavyCongestion.length > 0) {
    console.log(`🐌 Heavy congestion detected - marking as HEAVY traffic`)
    return 'heavy'
  }
  
  // Check traffic delay based on HERE's traffic data
  if (summary?.baseDuration && summary?.duration) {
    const ratio = summary.duration / summary.baseDuration
    const delayMinutes = Math.round((summary.duration - summary.baseDuration) / 60)
    
    console.log(`⏱️ Traffic delay: ${delayMinutes} min (ratio: ${ratio.toFixed(2)})`)
    
    if (ratio > 1.8 || delayMinutes > 30) {
      console.log(`🔴 Significant delay detected - marking as HEAVY traffic`)
      return 'heavy'
    }
    if (ratio > 1.3 || delayMinutes > 10) {
      console.log(`🟡 Moderate delay detected - marking as NORMAL traffic`)
      return 'normal'
    }
    if (ratio <= 1.1 && delayMinutes <= 5) {
      console.log(`🟢 Minimal delay - marking as LIGHT traffic`) 
      return 'light'
    }
  }
  
  // Check for multiple medium-severity issues
  const mediumIssues = issues.filter(i => i.severity === 'medium')
  if (mediumIssues.length >= 3) {
    console.log(`⚠️ Multiple medium issues (${mediumIssues.length}) - marking as HEAVY traffic`)
    return 'heavy'
  }
  if (mediumIssues.length >= 1) {
    console.log(`⚠️ Some medium issues (${mediumIssues.length}) - marking as NORMAL traffic`)
    return 'normal'
  }
  
  // If we have any issues at all, default to normal
  if (issues.length > 0) {
    console.log(`ℹ️ ${issues.length} minor issues - marking as NORMAL traffic`)
    return 'normal'
  }
  
  console.log(`✅ No issues detected - marking as LIGHT traffic`)
  return 'light'
}

function assessRouteQuality(issues: any[], delayMinutes: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (issues.some(i => i.type === 'closure' || i.type === 'accident')) {
    return 'poor'
  }
  
  if (delayMinutes > 20 || issues.filter(i => i.severity === 'high').length > 0) {
    return 'poor'
  }
  
  if (delayMinutes > 10 || issues.filter(i => i.severity === 'medium').length >= 2) {
    return 'fair'
  }
  
  if (delayMinutes > 5 || issues.length > 0) {
    return 'good'
  }
  
  return 'excellent'
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0 min'
  const minutes = Math.round(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}min`
  }
  return `${minutes} min`
}

function formatDistance(meters: number): string {
  if (!meters) return '0 km'
  const km = (meters / 1000).toFixed(1)
  return `${km} km`
}

function getRouteSummary(route: any): string {
  const sections = route.sections || []
  if (sections.length === 0) return 'neznámou trasu'
  
  // Try to extract street names or landmarks
  const instructions = []
  sections.forEach((section: any) => {
    if (section.actions) {
      section.actions.forEach((action: any) => {
        if (action.instruction && action.instruction.includes('na')) {
          instructions.push(action.instruction.split(' ')[action.instruction.split(' ').length - 1])
        }
      })
    }
  })
  
  if (instructions.length > 0) {
    return instructions.slice(0, 2).join(', ')
  }
  
  return 'hlavní silnice'
}

function calculateCostEstimate(distanceMeters: number, mode: string): number {
  if (!distanceMeters) return 0
  
  const distanceKm = distanceMeters / 1000
  
  switch (mode) {
    case 'driving':
      return distanceKm * 0.25 // €0.25 per km (fuel + wear)
    case 'public_transport':
      return Math.max(2.5, distanceKm * 0.08) // Min €2.5, or €0.08/km
    case 'rideshare':
      return distanceKm * 0.15 // €0.15 per km shared
    default:
      return 0
  }
}

function calculateCarbonFootprint(distanceKm: number, mode: string): number {
  if (!distanceKm) return 0
  
  const carbonFactors: Record<string, number> = {
    driving: 0.21,
    walking: 0.0,
    cycling: 0.0,
    public_transport: 0.05,
    train: 0.04,
    rideshare: 0.11
  }
  
  return distanceKm * (carbonFactors[mode] || 0.21)
}

async function getMultiModalOptions(origin: string, destination: string, modes: string[]) {
  // Get transport modes from database
  const { data: transportModes } = await supabase
    .from('transport_modes')
    .select('*')
    .in('mode_name', modes)
  
  return transportModes || []
}

function generateRecommendations(results: any[]): string[] {
  const recommendations: string[] = []
  
  if (results.length === 0) return recommendations
  
  // Find fastest and most eco-friendly options
  const fastestMode = results.reduce((prev, current) => {
    const prevTime = prev.routes?.[0]?.duration || '999 min'
    const currentTime = current.routes?.[0]?.duration || '999 min'
    return parseInt(prevTime) < parseInt(currentTime) ? prev : current
  })
  
  const ecoFriendlyMode = results.reduce((prev, current) => {
    const prevCarbon = prev.routes?.[0]?.carbon_footprint || 999
    const currentCarbon = current.routes?.[0]?.carbon_footprint || 999
    return prevCarbon < currentCarbon ? prev : current
  })
  
  recommendations.push(`Nejrychlejší: ${fastestMode.transport_mode} (${fastestMode.routes?.[0]?.duration})`)
  recommendations.push(`Nejšetrnější: ${ecoFriendlyMode.transport_mode} (${ecoFriendlyMode.routes?.[0]?.carbon_footprint?.toFixed(2)} kg CO₂)`)
  
  return recommendations
}

async function storeRouteAnalytics(userId: string, origin: string, destination: string, routeData: any, mode: string) {
  try {
    const routeHash = btoa(`${origin}->${destination}`)
    
    // Parse HERE Maps format duration and distance
    const travelTime = typeof routeData.duration === 'string' 
      ? parseInt(routeData.duration.replace(/[^\d]/g, '')) || 0
      : routeData.duration || 0
    
    const distance = typeof routeData.distance === 'string'
      ? parseFloat(routeData.distance.replace(/[^\d.]/g, '')) || 0
      : (routeData.distance || 0) / 1000 // Convert meters to km if needed
    
    await supabase
      .from('route_analytics')
      .insert({
        user_id: userId,
        route_hash: routeHash,
        origin_address: origin,
        destination_address: destination,
        travel_time: travelTime,
        distance: distance,
        traffic_level: routeData.traffic_conditions,
        transport_mode: mode,
        cost_estimate: routeData.cost_estimate,
        carbon_footprint: routeData.carbon_footprint
      })
  } catch (error) {
    console.error('Error storing route analytics:', error)
  }
}
