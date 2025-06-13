
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { origin, destination, mode = 'driving' } = await req.json()
    
    // Google Maps API integration (requires GOOGLE_MAPS_API_KEY secret)
    const googleApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!googleApiKey) {
      throw new Error('Google Maps API key not configured')
    }

    // Get directions with traffic info
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&departure_time=now&traffic_model=best_guess&key=${googleApiKey}`
    
    const directionsResponse = await fetch(directionsUrl)
    const directionsData = await directionsResponse.json()

    // Get current traffic conditions
    const trafficData = {
      routes: directionsData.routes?.map((route: any) => ({
        duration: route.legs[0]?.duration?.text,
        duration_in_traffic: route.legs[0]?.duration_in_traffic?.text,
        distance: route.legs[0]?.distance?.text,
        traffic_conditions: route.legs[0]?.duration_in_traffic?.value > route.legs[0]?.duration?.value * 1.2 ? 'heavy' : 'normal'
      })) || [],
      status: directionsData.status
    }

    return new Response(
      JSON.stringify(trafficData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
