
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
    
    const weatherApiKey = Deno.env.get('OPENWEATHER_API_KEY')
    if (!weatherApiKey) {
      throw new Error('OpenWeather API key not configured')
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
    
    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()

    const impact = {
      temperature: weatherData.main?.temp,
      conditions: weatherData.weather?.[0]?.main,
      description: weatherData.weather?.[0]?.description,
      visibility: weatherData.visibility,
      windSpeed: weatherData.wind?.speed,
      trafficImpact: calculateTrafficImpact(weatherData),
      recommendations: getRecommendations(weatherData)
    }

    return new Response(
      JSON.stringify(impact),
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

function calculateTrafficImpact(weather: any): string {
  const condition = weather.weather?.[0]?.main?.toLowerCase()
  const windSpeed = weather.wind?.speed || 0
  const visibility = weather.visibility || 10000

  if (condition?.includes('rain') || condition?.includes('snow')) {
    return 'high'
  }
  if (windSpeed > 15 || visibility < 5000) {
    return 'medium'
  }
  return 'low'
}

function getRecommendations(weather: any): string[] {
  const recommendations = []
  const condition = weather.weather?.[0]?.main?.toLowerCase()
  
  if (condition?.includes('rain')) {
    recommendations.push('Počítejte s delší cestou kvůli dešti')
    recommendations.push('Zvyšte bezpečnostní vzdálenost')
  }
  if (condition?.includes('snow')) {
    recommendations.push('Použijte zimní pneumatiky')
    recommendations.push('Odjíždějte dříve kvůli sněhu')
  }
  if (weather.wind?.speed > 15) {
    recommendations.push('Silný vítr - opatrnost při řízení')
  }
  
  return recommendations
}
