import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Starting rideshare offers cleanup...')

    // Get current date
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    console.log(`Deactivating offers older than: ${yesterdayStr}`)

    // Deactivate offers with departure_date older than yesterday
    const { data: deactivatedOffers, error: deactivateError } = await supabaseClient
      .from('rideshare_offers')
      .update({ is_active: false })
      .eq('is_active', true)
      .lt('departure_date', yesterdayStr)
      .select('id, departure_date, origin_address, destination_address')

    if (deactivateError) {
      console.error('Error deactivating old offers:', deactivateError)
      throw deactivateError
    }

    console.log(`Deactivated ${deactivatedOffers?.length || 0} expired offers`)

    // Delete very old offers (older than 30 days) to keep database clean
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    console.log(`Deleting offers older than: ${thirtyDaysAgoStr}`)

    const { data: deletedOffers, error: deleteError } = await supabaseClient
      .from('rideshare_offers')
      .delete()
      .lt('departure_date', thirtyDaysAgoStr)
      .select('id')

    if (deleteError) {
      console.error('Error deleting very old offers:', deleteError)
      throw deleteError
    }

    console.log(`Deleted ${deletedOffers?.length || 0} very old offers`)

    const result = {
      success: true,
      deactivated: deactivatedOffers?.length || 0,
      deleted: deletedOffers?.length || 0,
      message: `Cleanup completed: ${deactivatedOffers?.length || 0} offers deactivated, ${deletedOffers?.length || 0} offers deleted`
    }

    console.log('Cleanup completed successfully:', result)

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Cleanup error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
