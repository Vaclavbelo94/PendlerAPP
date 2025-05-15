
// Edge funkce pro získání dostupných prémiových funkcí
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Obsluha CORS pre-flight požadavků
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Vytvoření Supabase klienta
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Získání prémiových funkcí
    const { data, error } = await supabase
      .from('premium_features')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ features: data }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
    
  } catch (error) {
    console.error("Chyba při získávání prémiových funkcí:", error);
    
    return new Response(
      JSON.stringify({ error: "Interní chyba serveru", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
