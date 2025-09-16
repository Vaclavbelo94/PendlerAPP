import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting rideshare notifications sync...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Run the synchronization function
    const { data, error } = await supabaseClient.rpc('sync_rideshare_notifications')

    if (error) {
      console.error('❌ Error during sync:', error)
      throw error
    }

    console.log('✅ Rideshare notifications sync completed successfully')

    // Also perform a cleanup of old processed notifications (older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { error: cleanupError } = await supabaseClient
      .from('notifications')
      .delete()
      .eq('category', 'rideshare')
      .eq('read', true)
      .lt('created_at', thirtyDaysAgo.toISOString())

    if (cleanupError) {
      console.warn('⚠️ Cleanup warning:', cleanupError)
    } else {
      console.log('🧹 Old rideshare notifications cleaned up')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Rideshare notifications synchronized and cleaned up',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('💥 Sync function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})