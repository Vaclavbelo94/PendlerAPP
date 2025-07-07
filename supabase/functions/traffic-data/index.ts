
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
      const routingUrl = `https://router.hereapi.com/v8/routes?transportMode=${hereMode}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&return=summary,polyline,incidents,actions,instructions&departure=now&alternatives=3&apikey=${hereApiKey}`
      
      console.log(`Fetching HERE Maps data for mode ${transportMode} (${hereMode})`)
      
      try {
        const response = await fetch(routingUrl)
        const data = await response.json()
        
        console.log(`HERE Maps API Response for ${transportMode}:`, JSON.stringify(data, null, 2))
        
        if (data.error) {
          console.error(`HERE Maps API Error for ${transportMode}:`, data.error)
          return { transport_mode: transportMode, routes: [] }
        }
        
        // Get traffic incidents for the route
        const trafficData = await getHereTrafficIncidents(origin, destination, hereApiKey)
        
        return {
          transport_mode: transportMode,
          routes: data.routes?.map((route: any) => {
            const section = route.sections?.[0]
            const summary = section?.summary || route.summary
            const incidents = extractHereTrafficIncidents(route, trafficData)
            const trafficCondition = getHereTrafficCondition(summary, incidents)
            
            console.log(`HERE Route: ${trafficCondition} traffic, incidents: ${incidents.length}`)
            
            return {
              duration: formatDuration(summary?.duration),
              duration_in_traffic: formatDuration(summary?.duration), // HERE doesn't separate this
              distance: formatDistance(summary?.length),
              traffic_conditions: trafficCondition,
              cost_estimate: calculateCostEstimate(summary?.length, transportMode),
              carbon_footprint: calculateCarbonFootprint((summary?.length || 0) / 1000, transportMode),
              polyline: route.sections?.[0]?.polyline,
              warnings: incidents.filter((i: any) => i.severity === 'medium').map((i: any) => i.description),
              incidents: incidents,
              summary: `Trasa přes ${getRouteSummary(route)}`
            }
          }) || []
        }
      } catch (error) {
        console.error(`Error fetching HERE Maps data for ${transportMode}:`, error)
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

async function getHereTrafficIncidents(origin: string, destination: string, apiKey: string) {
  try {
    // Get traffic incidents along the route
    const trafficUrl = `https://traffic.hereapi.com/v6.1/incidents?routeId=route&apikey=${apiKey}`
    const response = await fetch(trafficUrl)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Error fetching HERE traffic incidents:', error)
  }
  return { incidents: [] }
}

function extractHereTrafficIncidents(route: any, trafficData: any): any[] {
  const incidents: any[] = []
  const allIncidents = trafficData?.incidents || []
  
  // Check route sections for notices and incidents
  if (route.sections) {
    route.sections.forEach((section: any) => {
      // Check for notices (construction, closures, etc.)
      if (section.notices) {
        section.notices.forEach((notice: any) => {
          let severity = 'low'
          const code = notice.code?.toLowerCase() || ''
          const text = notice.text?.toLowerCase() || ''
          
          // Check for critical issues
          if (code.includes('closure') || code.includes('blocked') || 
              text.includes('uzavřen') || text.includes('geschlossen') || 
              text.includes('closed') || text.includes('tunnel') ||
              text.includes('bridge') || text.includes('most') ||
              text.includes('brücke')) {
            severity = 'high'
          } else if (code.includes('construction') || code.includes('roadwork') ||
                     text.includes('stavba') || text.includes('baustelle') ||
                     text.includes('construction')) {
            severity = 'medium'
          }
          
          incidents.push({
            type: 'route_notice',
            description: notice.text || `Dopravní upozornění: ${notice.code}`,
            severity: severity,
            code: notice.code
          })
        })
      }
      
      // Check for transport incidents
      if (section.incidents) {
        section.incidents.forEach((incident: any) => {
          incidents.push({
            type: 'traffic_incident',
            description: incident.description || 'Dopravní nehoda',
            severity: mapHereIncidentSeverity(incident.criticality),
            criticality: incident.criticality
          })
        })
      }
    })
  }
  
  return incidents
}

function mapHereIncidentSeverity(criticality: number): 'low' | 'medium' | 'high' {
  if (criticality >= 3) return 'high'
  if (criticality >= 2) return 'medium'
  return 'low'
}

function getHereTrafficCondition(summary: any, incidents: any[] = []): 'light' | 'normal' | 'heavy' {
  // Check for high-priority incidents first
  const highSeverityIncidents = incidents.filter(i => i.severity === 'high')
  if (highSeverityIncidents.length > 0) {
    console.log('High severity incidents found:', highSeverityIncidents.map(i => i.description))
    return 'heavy'
  }
  
  // Check for multiple medium severity incidents
  const mediumSeverityIncidents = incidents.filter(i => i.severity === 'medium')
  if (mediumSeverityIncidents.length >= 2) {
    console.log('Multiple medium severity incidents found:', mediumSeverityIncidents.map(i => i.description))
    return 'heavy'
  }
  
  // Check traffic delay based on HERE's traffic data
  if (summary?.trafficTime && summary?.baseTime) {
    const ratio = summary.trafficTime / summary.baseTime
    console.log(`HERE Traffic ratio: ${ratio.toFixed(2)} (${summary.trafficTime}s vs ${summary.baseTime}s)`)
    
    if (ratio > 1.5) return 'heavy'
    if (ratio > 1.2) return 'normal'
    return 'light'
  }
  
  // If we have any incidents, default to normal
  if (incidents.length > 0) {
    return 'normal'
  }
  
  return 'light'
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
