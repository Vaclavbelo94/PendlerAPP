
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
    const { lat, lon } = await req.json()
    
    // OpenWeatherMap API integration (requires OPENWEATHER_API_KEY secret)
    const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY')
    if (!openWeatherApiKey) {
      // Return mock data if API key is not available
      const mockWeatherData = {
        temperature: 15,
        conditions: "Částečně oblačno",
        description: "Mírné oblačnosti, bez srážek",
        visibility: 10,
        windSpeed: 12,
        trafficImpact: "low" as const,
        recommendations: [
          "Normální jízdní podmínky",
          "Doporučujeme standardní rychlost"
        ]
      }
      
      return new Response(
        JSON.stringify(mockWeatherData),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Get current weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric&lang=cs`
    
    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()

    // Analyze traffic impact based on weather conditions
    const analyzeTrafficImpact = (weather: any) => {
      const temp = weather.main.temp
      const visibility = weather.visibility / 1000 // Convert to km
      const windSpeed = weather.wind?.speed || 0
      const precipitation = weather.rain?.['1h'] || weather.snow?.['1h'] || 0
      
      let impact = 'low'
      const recommendations = []
      
      if (precipitation > 0.5) {
        impact = 'high'
        recommendations.push('Zvýšená opatrnost při jízdě v dešti/sněhu')
        recommendations.push('Prodloužte si čas na cestu o 20-30%')
      } else if (temp < 2 || temp > 35) {
        impact = 'medium'
        recommendations.push('Extrémní teploty mohou ovlivnit provoz')
      } else if (visibility < 5) {
        impact = 'high'
        recommendations.push('Snížená viditelnost - jezděte opatrně')
      } else if (windSpeed > 15) {
        impact = 'medium'
        recommendations.push('Silný vítr - opatrnost při jízdě')
      } else {
        recommendations.push('Dobré podmínky pro jízdu')
      }
      
      return { impact, recommendations }
    }

    const { impact, recommendations } = analyzeTrafficImpact(weatherData)

    const weatherImpact = {
      temperature: Math.round(weatherData.main.temp),
      conditions: weatherData.weather[0].description,
      description: `${weatherData.weather[0].description}, pocitová teplota ${Math.round(weatherData.main.feels_like)}°C`,
      visibility: weatherData.visibility ? weatherData.visibility / 1000 : 10,
      windSpeed: weatherData.wind?.speed || 0,
      trafficImpact: impact,
      recommendations
    }

    return new Response(
      JSON.stringify(weatherImpact),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in weather-impact function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        // Return basic mock data on error
        temperature: 15,
        conditions: "Nedostupné",
        description: "Data o počasí nejsou dostupná",
        visibility: 10,
        windSpeed: 0,
        trafficImpact: "low",
        recommendations: ["Použijte opatrnost při jízdě"]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})
