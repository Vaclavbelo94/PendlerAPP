import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { userIds } = await req.json()

    if (!userIds || !Array.isArray(userIds)) {
      return new Response(
        JSON.stringify({ error: 'userIds array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = []

    for (const userId of userIds) {
      try {
        console.log(`Starting cleanup for user ${userId}`)

        // First, delete all dependent records that reference auth.users
        const dependentTables = [
          'user_notification_preferences',
          'tax_form_drafts', 
          'rideshare_contacts',
          'calculation_history',
          'rideshare_offers',
          'rideshare_requests',
          'route_analytics',
          'route_search_history',
          'commute_analytics',
          'traffic_alerts',
          'fuel_records',
          'insurance_records',
          'vehicle_inspections',
          'user_appearance_settings',
          'user_work_preferences',
          'user_extended_profiles',
          'user_social_links',
          'tax_calculations',
          'assisted_submissions',
          'reports',
          'shifts'
        ]

        for (const table of dependentTables) {
          try {
            const { error: deleteError } = await supabaseAdmin
              .from(table)
              .delete()
              .eq('user_id', userId)

            if (deleteError && !deleteError.message.includes('No rows')) {
              console.warn(`Warning deleting from ${table} for user ${userId}:`, deleteError.message)
            } else {
              console.log(`Cleaned ${table} for user ${userId}`)
            }
          } catch (tableError) {
            console.warn(`Error cleaning ${table} for user ${userId}:`, tableError)
            // Continue with other tables
          }
        }

        // Special case for rideshare_contacts which has requester_user_id
        try {
          const { error: contactsError } = await supabaseAdmin
            .from('rideshare_contacts')
            .delete()
            .eq('requester_user_id', userId)

          if (contactsError && !contactsError.message.includes('No rows')) {
            console.warn(`Warning deleting rideshare_contacts for user ${userId}:`, contactsError.message)
          }
        } catch (contactsError) {
          console.warn(`Error cleaning rideshare_contacts for user ${userId}:`, contactsError)
        }

        // Special case for vehicles table which might be referenced by other tables
        try {
          const { error: vehiclesError } = await supabaseAdmin
            .from('vehicles')
            .delete()
            .eq('user_id', userId)

          if (vehiclesError && !vehiclesError.message.includes('No rows')) {
            console.warn(`Warning deleting vehicles for user ${userId}:`, vehiclesError.message)
          }
        } catch (vehiclesError) {
          console.warn(`Error cleaning vehicles for user ${userId}:`, vehiclesError)
        }

        // Delete from profiles table
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', userId)

        if (profileError && !profileError.message.includes('No rows')) {
          console.error(`Failed to delete profile ${userId}:`, profileError)
          results.push({ userId, success: false, error: profileError.message })
          continue
        }

        // Finally, delete from auth.users using admin client
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        
        if (authError && !authError.message.includes('User not found')) {
          console.error(`Failed to delete auth user ${userId}:`, authError)
          results.push({ userId, success: false, error: authError.message })
          continue
        }

        results.push({ userId, success: true })
        console.log(`Successfully deleted user ${userId}`)
      } catch (error) {
        console.error(`Error deleting user ${userId}:`, error)
        results.push({ userId, success: false, error: error.message })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Cleanup completed',
        results: results,
        successCount: results.filter(r => r.success).length,
        failureCount: results.filter(r => !r.success).length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in admin-cleanup-users function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})