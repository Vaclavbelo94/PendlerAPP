
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
    
    // Google Maps API integration (requires GOOGLE_MAPS_API_KEY secret)
    const googleApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!googleApiKey) {
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

    // Get directions for multiple transport modes
    const routePromises = transportModes.map(async (transportMode: string) => {
      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${transportMode}&departure_time=now&traffic_model=best_guess&alternatives=true&key=${googleApiKey}`
      
      const response = await fetch(directionsUrl)
      const data = await response.json()
      
      return {
        transport_mode: transportMode,
        routes: data.routes?.map((route: any) => ({
          duration: route.legs[0]?.duration?.text,
          duration_in_traffic: route.legs[0]?.duration_in_traffic?.text || route.legs[0]?.duration?.text,
          distance: route.legs[0]?.distance?.text,
          traffic_conditions: getTrafficCondition(route.legs[0]),
          cost_estimate: calculateCostEstimate(route.legs[0]?.distance?.value, transportMode),
          carbon_footprint: calculateCarbonFootprint(route.legs[0]?.distance?.value / 1000, transportMode),
          polyline: route.overview_polyline?.points
        })) || []
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

function getTrafficCondition(leg: any): 'light' | 'normal' | 'heavy' {
  if (!leg.duration_in_traffic || !leg.duration) {
    return 'normal'
  }
  
  const ratio = leg.duration_in_traffic.value / leg.duration.value
  if (ratio > 1.3) return 'heavy'
  if (ratio > 1.1) return 'normal'
  return 'light'
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
    
    await supabase
      .from('route_analytics')
      .insert({
        user_id: userId,
        route_hash: routeHash,
        origin_address: origin,
        destination_address: destination,
        travel_time: parseInt(routeData.duration) || 0,
        distance: parseInt(routeData.distance) || 0,
        traffic_level: routeData.traffic_conditions,
        transport_mode: mode,
        cost_estimate: routeData.cost_estimate,
        carbon_footprint: routeData.carbon_footprint
      })
  } catch (error) {
    console.error('Error storing route analytics:', error)
  }
}
