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
    const { 
      origin, 
      destination, 
      preferences = {}, 
      userId,
      departureTime,
      optimizationCriteria = 'time' // 'time', 'cost', 'eco', 'balanced'
    } = await req.json()
    
    console.log(`Route optimization: ${origin} -> ${destination}, criteria: ${optimizationCriteria}`)
    
    // Get user's historical data for ML recommendations
    const userHistory = userId ? await getUserRouteHistory(userId, origin, destination) : null
    
    // Get current traffic and weather data
    const [trafficData, weatherData] = await Promise.all([
      getTrafficData(origin, destination),
      getWeatherData(origin, destination)
    ])
    
    // Get multi-modal transport options
    const transportModes = await getAvailableTransportModes()
    
    // Optimize routes based on criteria
    const optimizedRoutes = await optimizeRoutes({
      origin,
      destination,
      transportModes,
      trafficData,
      weatherData,
      userHistory,
      preferences,
      optimizationCriteria,
      departureTime
    })
    
    // Generate smart recommendations
    const recommendations = generateSmartRecommendations(optimizedRoutes, weatherData, userHistory)
    
    // Store optimization request for learning
    if (userId) {
      await storeOptimizationRequest(userId, {
        origin,
        destination,
        criteria: optimizationCriteria,
        selectedRoute: optimizedRoutes[0]
      })
    }
    
    return new Response(
      JSON.stringify({
        optimized_routes: optimizedRoutes,
        recommendations,
        weather_impact: weatherData,
        user_insights: userHistory ? generateUserInsights(userHistory) : null,
        optimization_criteria: optimizationCriteria,
        status: 'success'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Route optimization error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function getUserRouteHistory(userId: string, origin: string, destination: string) {
  const { data } = await supabase
    .from('route_analytics')
    .select('*')
    .eq('user_id', userId)
    .or(`origin_address.ilike.%${origin.split(',')[0]}%,destination_address.ilike.%${destination.split(',')[0]}%`)
    .order('created_at', { ascending: false })
    .limit(50)
    
  return data || []
}

async function getTrafficData(origin: string, destination: string) {
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/traffic-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ 
        origin, 
        destination, 
        transportModes: ['driving', 'public_transport', 'walking', 'cycling']
      })
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error getting traffic data:', error)
    return null
  }
}

async function getWeatherData(origin: string, destination: string) {
  try {
    // Get approximate coordinates for weather (simplified)
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/weather-impact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ lat: 50.0755, lon: 14.4378 }) // Prague as default
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error getting weather data:', error)
    return null
  }
}

async function getAvailableTransportModes() {
  const { data } = await supabase
    .from('transport_modes')
    .select('*')
    .eq('is_active', true)
    
  return data || []
}

async function optimizeRoutes(params: any) {
  const { origin, destination, transportModes, trafficData, weatherData, userHistory, optimizationCriteria } = params
  
  const routes = []
  
  // Create routes for each transport mode
  for (const mode of transportModes) {
    const route = {
      transport_mode: mode.mode_name,
      display_name: mode.display_name_cs,
      icon: mode.icon_name,
      carbon_factor: mode.carbon_factor,
      // Mock route data - in real implementation this would come from routing APIs
      duration: calculateDuration(mode.mode_name, weatherData),
      distance: calculateDistance(origin, destination),
      cost: calculateCost(mode.mode_name, calculateDistance(origin, destination)),
      carbon_footprint: mode.carbon_factor * calculateDistance(origin, destination),
      traffic_impact: calculateTrafficImpact(mode.mode_name, trafficData),
      weather_impact: calculateWeatherImpact(mode.mode_name, weatherData),
      user_preference_score: calculateUserPreference(mode.mode_name, userHistory),
      optimization_score: 0
    }
    
    // Calculate optimization score based on criteria
    route.optimization_score = calculateOptimizationScore(route, optimizationCriteria)
    routes.push(route)
  }
  
  // Sort by optimization score
  routes.sort((a, b) => b.optimization_score - a.optimization_score)
  
  return routes
}

function calculateOptimizationScore(route: any, criteria: string): number {
  const weights = {
    time: { duration: 0.6, cost: 0.1, carbon: 0.1, traffic: 0.2 },
    cost: { duration: 0.2, cost: 0.6, carbon: 0.1, traffic: 0.1 },
    eco: { duration: 0.1, cost: 0.1, carbon: 0.6, traffic: 0.2 },
    balanced: { duration: 0.25, cost: 0.25, carbon: 0.25, traffic: 0.25 }
  }
  
  const w = weights[criteria as keyof typeof weights] || weights.balanced
  
  // Normalize and score (lower is better for most metrics)
  const durationScore = Math.max(0, 100 - route.duration)
  const costScore = Math.max(0, 100 - route.cost * 10)
  const carbonScore = Math.max(0, 100 - route.carbon_footprint * 10)
  const trafficScore = route.traffic_impact === 'low' ? 100 : route.traffic_impact === 'medium' ? 50 : 0
  
  return (
    durationScore * w.duration +
    costScore * w.cost +
    carbonScore * w.carbon +
    trafficScore * w.traffic
  )
}

function calculateDuration(mode: string, weatherData: any): number {
  const baseTimes = {
    driving: 35,
    walking: 120,
    cycling: 60,
    public_transport: 45,
    train: 40,
    rideshare: 35
  }
  
  let duration = baseTimes[mode as keyof typeof baseTimes] || 45
  
  // Weather adjustments
  if (weatherData?.trafficImpact === 'high') {
    duration *= 1.3
  } else if (weatherData?.trafficImpact === 'medium') {
    duration *= 1.1
  }
  
  return duration
}

function calculateDistance(origin: string, destination: string): number {
  // Mock distance calculation - in real implementation use geolocation APIs
  return 25.5 // km
}

function calculateCost(mode: string, distance: number): number {
  const costFactors = {
    driving: 0.25,
    walking: 0,
    cycling: 0,
    public_transport: 0.08,
    train: 0.12,
    rideshare: 0.15
  }
  
  const baseCost = distance * (costFactors[mode as keyof typeof costFactors] || 0.25)
  return mode === 'public_transport' ? Math.max(2.5, baseCost) : baseCost
}

function calculateTrafficImpact(mode: string, trafficData: any): 'low' | 'medium' | 'high' {
  if (mode === 'walking' || mode === 'cycling') return 'low'
  
  // Mock traffic impact based on mode
  const impacts = {
    driving: 'high',
    public_transport: 'medium',
    train: 'low',
    rideshare: 'high'
  }
  
  return impacts[mode as keyof typeof impacts] || 'medium'
}

function calculateWeatherImpact(mode: string, weatherData: any): 'low' | 'medium' | 'high' {
  if (!weatherData) return 'low'
  
  if (mode === 'walking' || mode === 'cycling') {
    return weatherData.trafficImpact
  }
  
  return 'low'
}

function calculateUserPreference(mode: string, userHistory: any[]): number {
  if (!userHistory || userHistory.length === 0) return 50
  
  const modeUsage = userHistory.filter(h => h.transport_mode === mode).length
  const totalUsage = userHistory.length
  
  return (modeUsage / totalUsage) * 100
}

function generateSmartRecommendations(routes: any[], weatherData: any, userHistory: any[]): string[] {
  const recommendations = []
  
  if (routes.length === 0) return recommendations
  
  const bestRoute = routes[0]
  recommendations.push(`Doporučujeme: ${bestRoute.display_name} (${bestRoute.duration} min, ${bestRoute.cost.toFixed(2)} €)`)
  
  if (weatherData?.trafficImpact === 'high') {
    recommendations.push('⚠️ Počasí může ovlivnit dopravu - počítejte s prodlením')
  }
  
  if (userHistory && userHistory.length > 5) {
    const avgTime = userHistory.reduce((sum, h) => sum + h.travel_time, 0) / userHistory.length
    recommendations.push(`Obvykle vám tato trasa trvá ${avgTime.toFixed(0)} minut`)
  }
  
  const ecoRoute = routes.find(r => r.carbon_footprint < 0.1)
  if (ecoRoute && ecoRoute !== bestRoute) {
    recommendations.push(`🌱 Ekologická volba: ${ecoRoute.display_name} (${ecoRoute.carbon_footprint.toFixed(2)} kg CO₂)`)
  }
  
  return recommendations
}

function generateUserInsights(userHistory: any[]) {
  const insights = {
    total_trips: userHistory.length,
    average_time: userHistory.reduce((sum, h) => sum + h.travel_time, 0) / userHistory.length,
    most_used_mode: findMostUsedMode(userHistory),
    total_carbon: userHistory.reduce((sum, h) => sum + (h.carbon_footprint || 0), 0),
    total_cost: userHistory.reduce((sum, h) => sum + (h.cost_estimate || 0), 0)
  }
  
  return insights
}

function findMostUsedMode(userHistory: any[]): string {
  const modeCounts = userHistory.reduce((acc, h) => {
    acc[h.transport_mode] = (acc[h.transport_mode] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(modeCounts).reduce((a, b) => modeCounts[a[0]] > modeCounts[b[0]] ? a : b)[0]
}

async function storeOptimizationRequest(userId: string, requestData: any) {
  try {
    await supabase
      .from('route_analytics')
      .insert({
        user_id: userId,
        route_hash: btoa(`${requestData.origin}->${requestData.destination}`),
        origin_address: requestData.origin,
        destination_address: requestData.destination,
        travel_time: requestData.selectedRoute?.duration || 0,
        distance: requestData.selectedRoute?.distance || 0,
        transport_mode: requestData.selectedRoute?.transport_mode || 'driving',
        cost_estimate: requestData.selectedRoute?.cost || 0,
        carbon_footprint: requestData.selectedRoute?.carbon_footprint || 0
      })
  } catch (error) {
    console.error('Error storing optimization request:', error)
  }
}