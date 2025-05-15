
// Edge funkce pro zpracování offline dat a jejich synchronizaci s databází
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Chybí autentizační údaje" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    // Získání dat z požadavku
    const { syncData } = await req.json();
    
    if (!syncData || !syncData.length) {
      return new Response(
        JSON.stringify({ error: "Chybí data pro synchronizaci" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Autentizace a získání uživatele
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Neplatné autentizační údaje" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Zpracování offline dat
    const results = [];
    
    for (const item of syncData) {
      try {
        if (!item.entity_type || !item.action || !item.entity_id) {
          results.push({ success: false, item, message: "Neplatná data pro synchronizaci" });
          continue;
        }
        
        // Kontrola, že uživatel je vlastníkem dat
        if (item.user_id !== user.id) {
          results.push({ success: false, item, message: "Nemáte oprávnění k těmto datům" });
          continue;
        }
        
        let success = false;
        let error = null;
        
        // Zpracování podle typu entity a akce
        switch (item.entity_type) {
          case "shifts": 
            if (item.action === "INSERT") {
              const { data, error: insertError } = await supabase
                .from('shifts')
                .insert(item.data)
                .select();
                
              success = !insertError;
              error = insertError;
            }
            else if (item.action === "UPDATE") {
              const { data, error: updateError } = await supabase
                .from('shifts')
                .update(item.data)
                .eq('id', item.entity_id)
                .eq('user_id', user.id)
                .select();
                
              success = !updateError;
              error = updateError;
            }
            else if (item.action === "DELETE") {
              const { data, error: deleteError } = await supabase
                .from('shifts')
                .delete()
                .eq('id', item.entity_id)
                .eq('user_id', user.id);
                
              success = !deleteError;
              error = deleteError;
            }
            break;
            
          case "reports":
            if (item.action === "INSERT") {
              const { data, error: insertError } = await supabase
                .from('reports')
                .insert(item.data)
                .select();
                
              success = !insertError;
              error = insertError;
            }
            break;
            
          default:
            success = false;
            error = { message: "Neznámý typ entity" };
        }
        
        // Záznam výsledku
        if (success) {
          // Aktualizace stavu synchronizace v sync_logs
          const { data, error: logError } = await supabase
            .from('sync_logs')
            .insert({
              user_id: user.id,
              entity_type: item.entity_type,
              entity_id: item.entity_id,
              action: item.action,
              synced: true,
              synced_at: new Date().toISOString()
            });
            
          results.push({ success: true, item, message: "Úspěšně synchronizováno" });
        } else {
          results.push({ success: false, item, message: error?.message || "Chyba při synchronizaci" });
        }
        
      } catch (err) {
        console.error("Chyba při zpracování položky:", err);
        results.push({ success: false, item, message: err.message });
      }
    }
    
    return new Response(
      JSON.stringify({ results, success: results.some(r => r.success) }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
    
  } catch (error) {
    console.error("Neočekávaná chyba:", error);
    
    return new Response(
      JSON.stringify({ error: "Interní chyba serveru", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
