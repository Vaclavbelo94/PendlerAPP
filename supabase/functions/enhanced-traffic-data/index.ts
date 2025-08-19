import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, user_id, transport_modes = ['driving'] } = await req.json();

    if (!origin || !destination) {
      return new Response(
        JSON.stringify({ error: 'Origin and destination are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const hereMapsApiKey = Deno.env.get('HERE_MAPS_API_KEY');
    if (!hereMapsApiKey) {
      console.log('HERE Maps API key not configured, using mock data');
      
      return new Response(
        JSON.stringify({
          routes: [{
            duration: '25 min',
            duration_in_traffic: '32 min',
            distance: '15.2 km',
            traffic_conditions: 'normal',
            incidents: [],
            warnings: []
          }],
          weather_impact: {
            conditions: 'Clear',
            temperature: 18,
            description: 'Good driving conditions',
            trafficImpact: 'low',
            recommendations: ['Normal driving conditions']
          },
          recommendations: ['Current route is optimal'],
          summary: {
            total_routes: 1,
            best_route_index: 0,
            analysis_timestamp: new Date().toISOString()
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enhanced HERE Maps API integration
    const routingUrl = `https://router.hereapi.com/v8/routes`;
    
    const routeParams = new URLSearchParams({
      'transportMode': transport_modes[0] || 'car',
      'origin': origin,
      'destination': destination,
      'return': 'summary,polyline,instructions,incidents,tolls',
      'departureTime': 'now',
      'routingMode': 'fast',
      'alternatives': '2',
      'apikey': hereMapsApiKey
    });

    console.log('Fetching route from HERE Maps:', `${routingUrl}?${routeParams}`);

    const routeResponse = await fetch(`${routingUrl}?${routeParams}`);
    const routeData = await routeResponse.json();

    console.log('HERE Maps response:', JSON.stringify(routeData, null, 2));

    if (!routeResponse.ok) {
      throw new Error(`HERE Maps API error: ${routeData.error?.description || 'Unknown error'}`);
    }

    // Enhanced processing of HERE Maps data
    const processedRoutes = routeData.routes?.map((route: any, index: number) => {
      const section = route.sections?.[0] || {};
      const summary = section.summary || {};
      
      // Calculate traffic level based on duration vs baseline
      const baseDuration = summary.baseDuration || summary.duration;
      const currentDuration = summary.duration;
      const trafficRatio = currentDuration / baseDuration;
      
      let trafficConditions = 'normal';
      if (trafficRatio > 1.5) trafficConditions = 'heavy';
      else if (trafficRatio > 1.2) trafficConditions = 'moderate';
      else if (trafficRatio < 0.9) trafficConditions = 'light';

      // Process incidents
      const incidents = section.incidents?.map((incident: any) => ({
        description: incident.description?.text || 'Traffic incident',
        severity: incident.criticality || 'medium',
        location: incident.location?.description || 'Unknown location',
        type: incident.type || 'unknown'
      })) || [];

      // Process notices/warnings
      const warnings = section.notices?.map((notice: any) => 
        notice.text || notice.title || 'Route notice'
      ) || [];

      return {
        duration: formatDuration(summary.duration),
        duration_in_traffic: formatDuration(currentDuration),
        distance: formatDistance(summary.length),
        traffic_conditions: trafficConditions,
        incidents,
        warnings,
        summary: route.summary || `Route ${index + 1}`,
        polyline: route.sections?.[0]?.polyline,
        traffic_delay: Math.max(0, currentDuration - baseDuration)
      };
    }) || [];

    // Get weather data if coordinates are available
    let weatherImpact = null;
    try {
      const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');
      if (openWeatherApiKey && origin) {
        // Try to geocode origin to get coordinates
        const geocodingUrl = `https://geocoder.hereapi.com/6.2/geocode.json`;
        const geocodingParams = new URLSearchParams({
          'searchtext': origin,
          'apikey': hereMapsApiKey
        });

        const geocodingResponse = await fetch(`${geocodingUrl}?${geocodingParams}`);
        const geocodingData = await geocodingResponse.json();
        
        if (geocodingData.Response?.View?.[0]?.Result?.[0]) {
          const location = geocodingData.Response.View[0].Result[0].Location.DisplayPosition;
          const lat = location.Latitude;
          const lon = location.Longitude;

          // Fetch weather data
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
          const weatherResponse = await fetch(weatherUrl);
          const weatherData = await weatherResponse.json();

          if (weatherResponse.ok) {
            const { main, weather, visibility, wind } = weatherData;
            
            // Analyze weather impact on traffic
            let trafficImpact = 'low';
            const recommendations = [];

            if (main.temp < -5) {
              trafficImpact = 'high';
              recommendations.push('Icy conditions possible - drive carefully');
            } else if (main.temp > 35) {
              trafficImpact = 'medium';
              recommendations.push('Hot weather - ensure vehicle cooling');
            }

            if (visibility && visibility < 1000) {
              trafficImpact = 'high';
              recommendations.push('Low visibility - reduce speed');
            }

            if (wind && wind.speed > 10) {
              trafficImpact = trafficImpact === 'high' ? 'high' : 'medium';
              recommendations.push('Strong winds - maintain control');
            }

            if (weather[0].main === 'Rain' || weather[0].main === 'Snow') {
              trafficImpact = weather[0].main === 'Snow' ? 'high' : 'medium';
              recommendations.push(`${weather[0].main.toLowerCase()} conditions - increase following distance`);
            }

            if (recommendations.length === 0) {
              recommendations.push('Good driving conditions');
            }

            weatherImpact = {
              conditions: weather[0].main,
              temperature: Math.round(main.temp),
              description: weather[0].description,
              visibility: visibility ? Math.round(visibility / 1000) + ' km' : 'Good',
              wind_speed: wind ? Math.round(wind.speed) + ' m/s' : 'Calm',
              trafficImpact,
              recommendations
            };
          }
        }
      }
    } catch (weatherError) {
      console.error('Weather data fetch failed:', weatherError);
    }

    // Generate smart recommendations
    const recommendations = generateSmartRecommendations(processedRoutes, weatherImpact);

    // Store analytics data if user_id provided
    if (user_id && processedRoutes.length > 0) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const bestRoute = processedRoutes[0];
        const routeHash = btoa(`${origin}-${destination}`).substring(0, 16);

        await supabase
          .from('route_analytics')
          .insert({
            user_id,
            route_hash,
            origin_address: origin,
            destination_address: destination,
            travel_time: parseInt(bestRoute.duration.split(' ')[0]) || 0,
            distance: parseFloat(bestRoute.distance.split(' ')[0]) || 0,
            weather_conditions: weatherImpact?.conditions || 'Unknown',
            traffic_level: bestRoute.traffic_conditions,
            transport_mode: transport_modes[0] || 'driving'
          });

        console.log('Analytics data stored successfully');
      } catch (analyticsError) {
        console.error('Failed to store analytics:', analyticsError);
      }
    }

    const response = {
      routes: processedRoutes,
      weather_impact: weatherImpact,
      recommendations,
      summary: {
        total_routes: processedRoutes.length,
        best_route_index: 0,
        analysis_timestamp: new Date().toISOString(),
        origin,
        destination
      }
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Enhanced traffic data error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch traffic data',
        details: error.message,
        // Provide fallback data
        routes: [{
          duration: '-- min',
          duration_in_traffic: '-- min',
          distance: '-- km',
          traffic_conditions: 'unknown',
          incidents: [],
          warnings: []
        }]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper functions
function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)} m` : `${km.toFixed(1)} km`;
}

function generateSmartRecommendations(routes: any[], weatherImpact: any): string[] {
  const recommendations = [];
  
  if (!routes || routes.length === 0) {
    return ['Unable to generate route recommendations'];
  }

  const bestRoute = routes[0];
  
  // Traffic-based recommendations
  switch (bestRoute.traffic_conditions) {
    case 'heavy':
      recommendations.push('Consider leaving earlier or taking alternative route');
      break;
    case 'moderate':
      recommendations.push('Allow extra time for your journey');
      break;
    case 'light':
      recommendations.push('Good time to travel - light traffic conditions');
      break;
    default:
      recommendations.push('Normal traffic conditions expected');
  }

  // Incident-based recommendations
  if (bestRoute.incidents && bestRoute.incidents.length > 0) {
    const highSeverityIncidents = bestRoute.incidents.filter((incident: any) => 
      incident.severity === 'high' || incident.severity === 'major'
    );
    
    if (highSeverityIncidents.length > 0) {
      recommendations.push('Major incidents on route - consider alternative paths');
    } else {
      recommendations.push('Minor incidents reported - proceed with caution');
    }
  }

  // Weather-based recommendations
  if (weatherImpact) {
    if (weatherImpact.trafficImpact === 'high') {
      recommendations.push('Weather conditions may significantly impact travel time');
    } else if (weatherImpact.trafficImpact === 'medium') {
      recommendations.push('Weather may cause minor delays');
    }
  }

  // Multi-route recommendations
  if (routes.length > 1) {
    const timeDifference = parseInt(routes[1].duration) - parseInt(bestRoute.duration);
    if (timeDifference < 5) {
      recommendations.push('Alternative routes available with similar travel times');
    }
  }

  return recommendations;
}