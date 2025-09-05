import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Uživatel není přihlášen' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    console.log('Creating test notification for user:', user.id)

    // Generate fictional shift change data
    const originalTime = "06:00"
    const newTime = "07:30"
    const shiftDate = new Date()
    shiftDate.setDate(shiftDate.getDate() + 1) // Tomorrow
    const formattedDate = shiftDate.toLocaleDateString('cs-CZ')

    // Create enhanced notification using database function
    const { data: notificationResult, error: notificationError } = await supabaseClient
      .rpc('create_enhanced_notification', {
        p_user_id: user.id,
        p_title: 'Změna směny',
        p_message: `🔄 ZMĚNA: Směna ${formattedDate} přesunuta z ${originalTime} na ${newTime}`,
        p_type: 'warning',
        p_category: 'shift_change',
        p_priority: 'high',
        p_language: 'cs',
        p_action_url: '/shifts',
        p_metadata: {
          shift_type: 'morning_shift',
          location: 'DHL Hub Praha',
          reason: 'Operační změna'
        },
        p_related_to: {
          type: 'shift_change',
          old_time: originalTime,
          new_time: newTime,
          date: formattedDate,
          shift_type: 'ranní směna'
        }
      })

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      return new Response(
        JSON.stringify({ error: 'Chyba při vytváření oznámení', details: notificationError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('Notification created successfully:', notificationResult)

    // Also create additional fictional notifications for variety
    const additionalNotifications = [
      {
        title: 'Připomenutí směny',
        message: `📅 Připomínáme: Zítra máte směnu v ${newTime}`,
        type: 'info',
        category: 'system',
        priority: 'medium'
      },
      {
        title: 'Nový dokument',
        message: '📄 Byl přidán nový pracovní pokyn do systému',
        type: 'info', 
        category: 'system',
        priority: 'low'
      }
    ]

    const additionalResults = []
    for (const notification of additionalNotifications) {
      const { data: result, error } = await supabaseClient
        .rpc('create_enhanced_notification', {
          p_user_id: user.id,
          p_title: notification.title,
          p_message: notification.message,
          p_type: notification.type,
          p_category: notification.category,
          p_priority: notification.priority,
          p_language: 'cs'
        })
      
      if (!error) {
        additionalResults.push(result)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Fiktivní oznámení byla úspěšně vytvořena',
        notification_id: notificationResult,
        additional_notifications: additionalResults.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Neočekávaná chyba serveru', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})