import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Shift {
  id: string
  user_id: string
  date: string
  start_time: string
  end_time: string
  type: string
  notes?: string
}

interface Profile {
  id: string
  email: string
  preferred_language?: string
  company?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting daily shift notifications job...')

    // Get tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0]

    console.log(`Looking for shifts on ${tomorrowDateStr}`)

    // Get all shifts for tomorrow with user profiles
    const { data: shifts, error: shiftsError } = await supabase
      .from('shifts')
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          preferred_language,
          company
        )
      `)
      .eq('date', tomorrowDateStr)

    if (shiftsError) {
      console.error('Error fetching shifts:', shiftsError)
      throw shiftsError
    }

    console.log(`Found ${shifts?.length || 0} shifts for tomorrow`)

    if (!shifts || shifts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No shifts found for tomorrow',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let notificationsCreated = 0

    for (const shift of shifts) {
      const profile = shift.profiles

      if (!profile) {
        console.warn(`No profile found for shift ${shift.id}`)
        continue
      }

      // Check if notification already exists for this shift
      const { data: existingNotification, error: checkError } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', shift.user_id)
        .contains('related_to', { type: 'shift', shift_id: shift.id })
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking existing notification:', checkError)
        continue
      }

      if (existingNotification) {
        console.log(`Notification already exists for shift ${shift.id}`)
        continue
      }

      // Determine language (default to Czech)
      const language = profile.preferred_language || 'cs'
      
      // Create localized notification content
      const shiftTime = shift.start_time.substring(0, 5) // HH:MM format
      const endTime = shift.end_time.substring(0, 5)
      
      let title: string
      let message: string
      let shiftTypeName: string

      // Localized content based on language
      if (language === 'pl') {
        title = 'Jutro rozpoczyna się zmiana'
        shiftTypeName = getShiftTypeNamePL(shift.type)
        message = `${shiftTypeName} jutro od ${shiftTime} do ${endTime}`
      } else { // Default to Czech
        title = 'Zítra začíná směna'
        shiftTypeName = getShiftTypeNameCS(shift.type)
        message = `${shiftTypeName} zítra od ${shiftTime} do ${endTime}`
      }

      // Add additional info if available
      if (shift.notes && shift.notes.trim()) {
        message += ` | ${shift.notes}`
      }

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: shift.user_id,
          title,
          message,
          type: 'shift_reminder',
          category: 'shift',
          priority: 'medium',
          language,
          related_to: {
            type: 'shift',
            shift_id: shift.id,
            shift_date: shift.date,
            shift_time: shiftTime
          },
          metadata: {
            shift_type: shift.type,
            start_time: shift.start_time,
            end_time: shift.end_time,
            auto_generated: true,
            created_by: 'daily-shift-notifications'
          }
        })

      if (notificationError) {
        console.error(`Error creating notification for shift ${shift.id}:`, notificationError)
        continue
      }

      console.log(`Created notification for ${profile.email} - ${shiftTypeName} shift at ${shiftTime}`)
      notificationsCreated++
    }

    console.log(`Daily shift notifications job completed. Created ${notificationsCreated} notifications.`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Created ${notificationsCreated} shift notifications for tomorrow`,
        processed: shifts.length,
        created: notificationsCreated,
        date: tomorrowDateStr
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in daily-shift-notifications:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function getShiftTypeNameCS(type: string): string {
  switch (type?.toLowerCase()) {
    case 'morning':
    case 'ranní':
      return 'Ranní směna'
    case 'afternoon':
    case 'odpolední':
      return 'Odpolední směna'
    case 'night':
    case 'noční':
      return 'Noční směna'
    case 'overtime':
      return 'Přesčas'
    default:
      return 'Směna'
  }
}

function getShiftTypeNamePL(type: string): string {
  switch (type?.toLowerCase()) {
    case 'morning':
    case 'ranní':
      return 'Zmiana poranna'
    case 'afternoon':
    case 'odpolední':
      return 'Zmiana popołudniowa'
    case 'night':
    case 'noční':
      return 'Zmiana nocna'
    case 'overtime':
      return 'Nadgodziny'
    default:
      return 'Zmiana'
  }
}