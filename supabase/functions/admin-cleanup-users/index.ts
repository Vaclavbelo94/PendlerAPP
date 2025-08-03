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
        // Delete from auth.users using admin client
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        
        if (authError && !authError.message.includes('User not found')) {
          console.error(`Failed to delete auth user ${userId}:`, authError)
          results.push({ userId, success: false, error: authError.message })
          continue
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