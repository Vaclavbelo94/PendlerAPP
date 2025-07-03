
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
    const { query, type = 'address' } = await req.json()
    
    // Google Maps API integration
    const googleApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!googleApiKey) {
      throw new Error('Google Maps API key not configured')
    }

    // Determine the search type and components
    const searchType = type === 'cities' ? '(cities)' : 'address'
    const components = 'country:cz|country:de|country:pl'

    // Get address/city suggestions using Google Places Autocomplete API
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=${searchType}&components=${components}&key=${googleApiKey}`
    
    const response = await fetch(autocompleteUrl)
    const data = await response.json()

    if (data.status === 'OK') {
      // For cities, simplify the response format
      if (type === 'cities') {
        const simplifiedPredictions = data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          display_name: prediction.description,
          main_text: prediction.structured_formatting?.main_text || prediction.description,
          secondary_text: prediction.structured_formatting?.secondary_text || ''
        }))
        
        return new Response(
          JSON.stringify({
            status: 'OK',
            predictions: simplifiedPredictions
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }
      
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
