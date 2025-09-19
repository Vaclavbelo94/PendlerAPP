import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrafficEvent {
  id: string;
  source: 'ndic' | 'autobahn';
  type: 'accident' | 'closure' | 'congestion' | 'warning';
  title: string;
  description: string;
  location: string;
  coordinates?: [number, number];
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  detailUrl?: string;
  icon: string;
}

// D8 coordinates for km 82-92 (approximate)
const D8_START_KM82 = [50.7547, 14.2764];
const D8_END_KM92 = [50.8314, 14.0147];

// A17 coordinates (Dresden - Czech border)
const A17_COORDINATES = [
  [50.8314, 14.0147], // Border
  [51.0447, 13.7372]  // Dresden
];

// TomTom Configuration - Corrected bbox for D8 km 82-92
const D8_BORDER_BBOX = "13.97,50.75,14.28,50.84"; // minLon,minLat,maxLon,maxLat format
const D8_FLOW_POINTS = [
  [50.7547, 14.2764], // km 82
  [50.7681, 14.2356], // km 84
  [50.7814, 14.1956], // km 86
  [50.7947, 14.1556], // km 88
  [50.8081, 14.1156], // km 90
  [50.8314, 14.0147]  // km 92 (border)
];

async function fetchTomTomIncidents(): Promise<TrafficEvent[]> {
  const events: TrafficEvent[] = [];
  
  try {
    const tomtomApiKey = Deno.env.get('TOMTOM_API_KEY');
    if (!tomtomApiKey) {
      console.error("❌ TomTom API key not configured");
      // Add fallback event to show TomTom is not available
      events.push({
        id: 'tomtom-fallback-config',
        source: 'ndic',
        type: 'warning',
        title: 'TomTom data nedostupná',
        description: 'TomTom API klíč není nakonfigurován',
        location: 'D8 hranice',
        timestamp: new Date().toISOString(),
        severity: 'low',
        icon: '⚠️'
      });
      return events;
    }

    console.log("📡 Fetching TomTom traffic incidents...");
    console.log(`🔑 TomTom API Key configured: ${tomtomApiKey.substring(0, 8)}...`);
    console.log(`📍 TomTom bbox: ${D8_BORDER_BBOX}`);
    
    // Use correct TomTom Traffic Incidents API v5 endpoint with proper field formatting
    const incidentsUrl = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${tomtomApiKey}&bbox=${D8_BORDER_BBOX}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,incidentCategory,description,startTime,endTime,from,to,roadNumbers,magnitude}}}&language=cs-CZ&timeValidityFilter=present`;
    console.log(`🌐 TomTom URL: ${incidentsUrl.replace(tomtomApiKey, '***')}`);
    
    const response = await fetch(incidentsUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log(`📡 TomTom response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ TomTom API error ${response.status}: ${errorText}`);
      
      // Add fallback event to show TomTom API error
      events.push({
        id: 'tomtom-fallback-error',
        source: 'ndic',
        type: 'warning',
        title: 'TomTom API chyba',
        description: `HTTP ${response.status}: Nepodařilo se načíst data z TomTom`,
        location: 'D8 hranice',
        timestamp: new Date().toISOString(),
        severity: 'low',
        icon: '⚠️'
      });
      return events;
    }
    
    const data = await response.json();
    console.log(`📊 TomTom raw data:`, JSON.stringify(data, null, 2));
    
    if (data.incidents && Array.isArray(data.incidents)) {
      console.log(`📋 TomTom incidents found: ${data.incidents.length}`);
      
      for (const incident of data.incidents) {
        console.log(`🔍 Processing incident:`, JSON.stringify(incident, null, 2));
        
        const event: TrafficEvent = {
          id: `tomtom-${incident.id}`,
          source: 'ndic', // TomTom data displayed as NDIC for consistent UI
          type: mapTomTomIncidentType(incident.properties?.iconCategory || incident.properties?.incidentCategory),
          title: incident.properties?.description || 'Dopravní událost',
          description: buildTomTomDescription(incident),
          location: `D8 ${incident.properties?.from || incident.properties?.to || 'hranice'}`,
          coordinates: extractTomTomCoordinates(incident.geometry),
          timestamp: incident.properties?.startTime || new Date().toISOString(),
          severity: mapTomTomSeverity(incident.properties?.magnitude),
          icon: getIncidentIcon(mapTomTomIncidentType(incident.properties?.iconCategory || incident.properties?.incidentCategory))
        };
        events.push(event);
        console.log(`✅ Added TomTom event: ${event.title}`);
      }
    } else {
      console.log(`ℹ️ No TomTom incidents in response or invalid format`);
      
      // If no incidents but API call succeeded, add informative event
      events.push({
        id: 'tomtom-no-incidents',
        source: 'ndic',
        type: 'warning',
        title: 'D8 - Bez událostí',
        description: 'TomTom hlásí žádné aktuální dopravní události na D8',
        location: 'D8 hranice',
        timestamp: new Date().toISOString(),
        severity: 'low',
        icon: '✅'
      });
    }
    
    console.log(`✅ TomTom: Found ${events.length} incidents`);
    
  } catch (error) {
    console.error("❌ TomTom API critical error:", error);
    console.error("❌ Error details:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    // Add fallback event for critical errors
    events.push({
      id: 'tomtom-fallback-critical',
      source: 'ndic',
      type: 'warning',
      title: 'TomTom nedostupné',
      description: `Chyba při načítání dat: ${error.message}`,
      location: 'D8 hranice',
      timestamp: new Date().toISOString(),
      severity: 'low',
      icon: '⚠️'
    });
  }
  
  return events;
}

async function fetchTomTomFlow(): Promise<any> {
  try {
    const tomtomApiKey = Deno.env.get('TOMTOM_API_KEY');
    if (!tomtomApiKey) {
      console.error("❌ TomTom API key not configured for flow data");
      return null;
    }

    console.log("🌊 Fetching TomTom flow data...");
    console.log(`🔑 Using TomTom API Key: ${tomtomApiKey.substring(0, 8)}...`);
    
    const flowPromises = D8_FLOW_POINTS.map(async (point, index) => {
      const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${point[0]},${point[1]}&unit=KMPH&openLr=false&key=${tomtomApiKey}`;
      console.log(`📍 Fetching flow for point ${index + 1}: ${point[0]},${point[1]}`);
      
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        console.log(`📡 Flow point ${index + 1} response: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Flow point ${index + 1} data:`, JSON.stringify(data, null, 2));
          return data;
        } else {
          const errorText = await response.text();
          console.error(`❌ Flow point ${index + 1} error ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.error(`❌ Flow data error for point ${index + 1} (${point}):`, error);
      }
      return null;
    });
    
    const flowResults = await Promise.all(flowPromises);
    const validFlows = flowResults.filter(f => f && f.flowSegmentData);
    
    console.log(`📊 Valid flow results: ${validFlows.length}/${flowResults.length}`);
    
    if (validFlows.length > 0) {
      const avgCurrentSpeed = validFlows.reduce((sum, f) => sum + (f.flowSegmentData.currentSpeed || 0), 0) / validFlows.length;
      const avgFreeFlowSpeed = validFlows.reduce((sum, f) => sum + (f.flowSegmentData.freeFlowSpeed || 0), 0) / validFlows.length;
      const avgRelative = avgFreeFlowSpeed > 0 ? avgCurrentSpeed / avgFreeFlowSpeed : 1;
      const avgConfidence = validFlows.reduce((sum, f) => sum + (f.flowSegmentData.confidence || 0), 0) / validFlows.length;
      
      console.log(`🌊 Flow summary: avg speed ${avgCurrentSpeed.toFixed(1)} km/h, relative ${(avgRelative * 100).toFixed(1)}%, confidence ${avgConfidence.toFixed(2)}`);
      
      return {
        avgRelative,
        avgCurrentSpeed,
        avgFreeFlowSpeed,
        confidence: avgConfidence,
        validPoints: validFlows.length,
        totalPoints: flowResults.length
      };
    } else {
      console.log("⚠️ No valid flow data received from any points");
    }
    
  } catch (error) {
    console.error("❌ TomTom Flow API critical error:", error);
    console.error("❌ Flow error details:", error.message);
  }
  
  return null;
}

function mapTomTomIncidentType(category: string): 'accident' | 'closure' | 'congestion' | 'warning' {
  if (!category) return 'warning';
  
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('accident') || lowerCategory.includes('crash')) return 'accident';
  if (lowerCategory.includes('closure') || lowerCategory.includes('blocked')) return 'closure';
  if (lowerCategory.includes('congestion') || lowerCategory.includes('jam') || lowerCategory.includes('slow')) return 'congestion';
  return 'warning';
}

function mapTomTomSeverity(magnitude: number): 'low' | 'medium' | 'high' {
  if (!magnitude) return 'medium';
  if (magnitude >= 3) return 'high';
  if (magnitude >= 2) return 'medium';
  return 'low';
}

function buildTomTomDescription(incident: any): string {
  const props = incident.properties || {};
  let description = props.description || 'Dopravní událost';
  
  if (props.from && props.to) {
    description += ` (${props.from} → ${props.to})`;
  } else if (props.from) {
    description += ` (od ${props.from})`;
  } else if (props.to) {
    description += ` (do ${props.to})`;
  }
  
  if (props.roadNumbers && props.roadNumbers.length > 0) {
    description += ` - ${props.roadNumbers.join(', ')}`;
  }
  
  return description;
}

function extractTomTomCoordinates(geometry: any): [number, number] | undefined {
  if (!geometry) return undefined;
  
  if (geometry.type === 'Point' && geometry.coordinates) {
    return [geometry.coordinates[1], geometry.coordinates[0]]; // TomTom uses [lon, lat]
  }
  
  if (geometry.type === 'LineString' && geometry.coordinates && geometry.coordinates.length > 0) {
    const firstPoint = geometry.coordinates[0];
    return [firstPoint[1], firstPoint[0]]; // TomTom uses [lon, lat]
  }
  
  return undefined;
}

function getIncidentIcon(type: string): string {
  switch (type) {
    case 'accident': return '⚠️';
    case 'closure': return '🚧';
    case 'congestion': return '🚙';
    default: return '⚠️';
  }
}

async function fetchAutobahnData(): Promise<TrafficEvent[]> {
  const events: TrafficEvent[] = [];
  
  try {
    console.log("📡 Fetching Autobahn A17 data...");
    
    // Fetch warnings
    const warningsResponse = await fetch('https://verkehr.autobahn.de/o/autobahn/A17/services/warning');
    if (warningsResponse.ok) {
      const warningsData = await warningsResponse.json();
      
      if (warningsData.warning) {
        for (const warning of warningsData.warning) {
          events.push({
            id: `autobahn-warning-${warning.identifier}`,
            source: 'autobahn',
            type: 'warning',
            title: warning.title || 'Dopravní varování A17',
            description: warning.description || warning.title || 'Dopravní omezení',
            location: `A17 ${warning.subtitle || ''}`,
            coordinates: warning.coordinate ? [warning.coordinate.lat, warning.coordinate.long] : undefined,
            timestamp: warning.startTimestamp || new Date().toISOString(),
            severity: 'medium',
            detailUrl: warning.detailsRef,
            icon: '⚠️'
          });
        }
      }
    }
    
    // Fetch closures
    const closuresResponse = await fetch('https://verkehr.autobahn.de/o/autobahn/A17/services/closure');
    if (closuresResponse.ok) {
      const closuresData = await closuresResponse.json();
      
      if (closuresData.closure) {
        for (const closure of closuresData.closure) {
          events.push({
            id: `autobahn-closure-${closure.identifier}`,
            source: 'autobahn',
            type: 'closure',
            title: closure.title || 'Uzavírka A17',
            description: closure.description || closure.title || 'Uzavírka komunikace',
            location: `A17 ${closure.subtitle || ''}`,
            coordinates: closure.coordinate ? [closure.coordinate.lat, closure.coordinate.long] : undefined,
            timestamp: closure.startTimestamp || new Date().toISOString(),
            severity: 'high',
            detailUrl: closure.detailsRef,
            icon: '🚧'
          });
        }
      }
    }
    
    console.log(`✅ Autobahn: Found ${events.length} events`);
    
  } catch (error) {
    console.error("❌ Autobahn API error:", error);
  }
  
  return events;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚗 Starting D8/A17 traffic monitoring fetch...");
    
    // Fetch data from both sources in parallel
    const [tomtomEvents, autobahnEvents, flowSummary] = await Promise.all([
      fetchTomTomIncidents(),
      fetchAutobahnData(),
      fetchTomTomFlow()
    ]);
    
    // Combine and sort events by timestamp (newest first)
    const allEvents = [...tomtomEvents, ...autobahnEvents]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Add route coordinates for map display and flow summary
    const response = {
      events: allEvents,
      route: {
        d8: {
          start: D8_START_KM82,
          end: D8_END_KM92,
          name: 'D8 km 82-92'
        },
        a17: {
          coordinates: A17_COORDINATES,
          name: 'A17 Dresden - CZ border'
        }
      },
      flowSummary,
      lastUpdate: new Date().toISOString(),
      totalEvents: allEvents.length
    };
    
    console.log(`✅ Total events found: ${allEvents.length}`);
    
    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    console.error("❌ Traffic monitoring error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch traffic data',
        events: [],
        route: null,
        flowSummary: null,
        lastUpdate: new Date().toISOString(),
        totalEvents: 0
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});