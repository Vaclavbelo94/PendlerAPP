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

async function fetchNDICData(): Promise<TrafficEvent[]> {
  const events: TrafficEvent[] = [];
  
  try {
    // NDIC DATEX II Common Traffic Information
    console.log("📡 Fetching NDIC traffic data...");
    
    // Mock data for now since NDIC API requires proper authentication
    // In production, you would fetch from NDIC DATEX II endpoints
    const mockNDICEvents: TrafficEvent[] = [
      {
        id: 'ndic-d8-1',
        source: 'ndic',
        type: 'congestion',
        title: 'Zpomalení na D8',
        description: 'Kolona v oblasti km 85-87 směr Německo, délka cca 2 km',
        location: 'D8 km 85-87',
        coordinates: [50.7814, 14.1956],
        timestamp: new Date().toISOString(),
        severity: 'medium',
        icon: '🚙'
      }
    ];
    
    events.push(...mockNDICEvents);
    console.log(`✅ NDIC: Found ${mockNDICEvents.length} events`);
    
  } catch (error) {
    console.error("❌ NDIC API error:", error);
  }
  
  return events;
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
    const [ndicEvents, autobahnEvents] = await Promise.all([
      fetchNDICData(),
      fetchAutobahnData()
    ]);
    
    // Combine and sort events by timestamp (newest first)
    const allEvents = [...ndicEvents, ...autobahnEvents]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Add route coordinates for map display
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