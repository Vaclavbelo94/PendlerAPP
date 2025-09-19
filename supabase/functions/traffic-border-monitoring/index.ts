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

// A17 coordinates (Dresden - Czech border)
const A17_COORDINATES = [
  [50.8314, 14.0147], // Border
  [51.0447, 13.7372]  // Dresden
];

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
    console.log("🚗 Starting A17 traffic monitoring fetch...");
    
    // Fetch only German Autobahn data
    const autobahnEvents = await fetchAutobahnData();
    
    // Sort events by timestamp (newest first)
    const allEvents = autobahnEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Add route coordinates for map display
    const response = {
      events: allEvents,
      route: {
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