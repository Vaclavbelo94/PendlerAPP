
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    // Google Maps API integration
    const googleApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!googleApiKey) {
      throw new Error('Google Maps API key not configured')
    }

    // Get address suggestions using Google Places Autocomplete API
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&components=country:cz|country:de&key=${googleApiKey}`
    
    const response = await fetch(autocompleteUrl)
    const data = await response.json()

    if (data.status === 'OK') {
      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      console.error('Google Places API error:', data.status, data.error_message)
      throw new Error(`Google Places API error: ${data.status}`)
    }
  } catch (error) {
    console.error('Error in address-autocomplete function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'ERROR',
        predictions: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to prevent client errors, but with error info
      },
    )
  }
})
