import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    console.log('Processing calendar export for user:', user.id)

    const { format } = await req.json()

    // Step 1: Generate shifts for 60 days ahead
    console.log('Step 1: Generating shifts for 60 days ahead...')
    
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + 60)

    // Get user's DHL assignment to determine their position and woche
    const { data: assignment, error: assignmentError } = await supabaseClient
      .from('user_dhl_assignments')
      .select(`
        *,
        dhl_positions (
          id,
          name,
          position_type
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (assignmentError || !assignment) {
      throw new Error('No active DHL assignment found')
    }

    console.log('Found DHL assignment:', assignment)

    // Generate shifts using the service logic
    const shifts = await generateShiftsForDateRange(
      supabaseClient,
      user.id,
      startDate,
      endDate,
      assignment
    )

    console.log(`Generated ${shifts.length} shifts`)

    // Step 2: Save generated shifts to database
    if (shifts.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('shifts')
        .upsert(shifts, { 
          onConflict: 'user_id,date',
          ignoreDuplicates: false 
        })

      if (insertError) {
        console.error('Error saving shifts:', insertError)
        throw new Error('Failed to save generated shifts')
      }
      
      console.log(`Successfully saved ${shifts.length} shifts`)
    }

    // Step 3: Fetch all user shifts for export
    const { data: allShifts, error: shiftsError } = await supabaseClient
      .from('shifts')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (shiftsError) {
      throw new Error('Failed to fetch shifts for export')
    }

    console.log(`Exporting ${allShifts?.length || 0} shifts in ${format} format`)

    // Step 4: Generate calendar export
    if (format === 'ics') {
      const icsContent = generateICSContent(allShifts || [])
      
      return new Response(icsContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/calendar',
          'Content-Disposition': `attachment; filename="dhl-shifts-${new Date().getFullYear()}.ics"`,
        },
      })
    } else if (format === 'google') {
      // For Google Calendar, we'll create a URL for the first upcoming shift
      const nextShift = allShifts?.find(shift => new Date(shift.date) >= new Date())
      
      if (nextShift) {
        const googleUrl = generateGoogleCalendarUrl(nextShift)
        
        return new Response(JSON.stringify({ googleCalendarUrl: googleUrl }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        })
      } else {
        throw new Error('No upcoming shifts found for Google Calendar export')
      }
    }

    throw new Error('Invalid format specified')

  } catch (error) {
    console.error('Calendar export error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})

// Generate shifts for date range using existing service logic
async function generateShiftsForDateRange(
  supabaseClient: any,
  userId: string,
  startDate: Date,
  endDate: Date,
  assignment: any
) {
  const shifts = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const shift = await generateShiftForDate(supabaseClient, userId, currentDate, assignment)
    if (shift) {
      shifts.push(shift)
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return shifts
}

// Generate shift for specific date
async function generateShiftForDate(
  supabaseClient: any,
  userId: string,
  date: Date,
  assignment: any
) {
  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
  const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to Monday = 0

  // Check if this is a Wechselschicht position
  const positionName = assignment.dhl_positions?.name || ''
  const isWechselschicht = positionName.toLowerCase().includes('wechselschicht') || 
                          positionName.toLowerCase().includes('30h')

  if (isWechselschicht) {
    return await generateWechselschichtShift(supabaseClient, userId, date, assignment, mondayBasedDay)
  } else {
    return await generateRegularDHLShift(supabaseClient, userId, date, assignment, mondayBasedDay)
  }
}

// Generate shift for Wechselschicht positions using patterns
async function generateWechselschichtShift(
  supabaseClient: any,
  userId: string,
  date: Date,
  assignment: any,
  mondayBasedDay: number
) {
  // Skip weekends for Wechselschicht (Monday=0 to Friday=4)
  if (mondayBasedDay > 4) {
    return null
  }

  // Calculate which Woche to use based on 15-week cycle
  const calendarWeek = getCalendarWeek(date)
  const userCurrentWoche = assignment.current_woche || 1
  const targetWoche = calculateWocheForDate(userCurrentWoche, calendarWeek)

  console.log(`Wechselschicht calculation: CW${calendarWeek}, userWoche=${userCurrentWoche}, targetWoche=${targetWoche}`)

  // Get the pattern for the calculated Woche
  const { data: pattern } = await supabaseClient
    .from('dhl_wechselschicht_patterns')
    .select('*')
    .eq('woche_number', targetWoche)
    .eq('is_active', true)
    .single()

  if (!pattern) {
    console.log(`No pattern found for Woche ${targetWoche}`)
    return null
  }

  // Get shift data for this day of week
  const dayFields = ['monday_shift', 'tuesday_shift', 'wednesday_shift', 'thursday_shift', 'friday_shift']
  const shiftType = pattern[dayFields[mondayBasedDay]]

  if (!shiftType || shiftType === 'volno') {
    return null
  }

  // Map shift type to actual times
  const shiftTimes = getWechselschichtTimes(pattern, shiftType)
  if (!shiftTimes) {
    return null
  }

  return {
    user_id: userId,
    date: date.toISOString().split('T')[0],
    start_time: shiftTimes.start,
    end_time: shiftTimes.end,
    type: convertWechselschichtType(shiftType),
    dhl_position_id: assignment.dhl_positions?.id,
    is_dhl_managed: true,
    is_wechselschicht_generated: true,
    notes: `Wechselschicht ${pattern.pattern_name} - ${shiftType}`
  }
}

// Generate shift for regular DHL positions using templates
async function generateRegularDHLShift(
  supabaseClient: any,
  userId: string,
  date: Date,
  assignment: any,
  mondayBasedDay: number
) {
  const calendarWeek = getCalendarWeek(date)
  const userWoche = assignment.dhl_positions?.woche || 1

  // Get shift template for this position, woche, and calendar week
  const { data: template } = await supabaseClient
    .from('dhl_position_shift_templates')
    .select('*')
    .eq('position_id', assignment.dhl_positions?.id)
    .eq('woche_number', userWoche)
    .eq('calendar_week', calendarWeek)
    .single()

  if (!template) {
    return null
  }

  // Get shift data for this day of week
  const dayFields = ['monday_shift', 'tuesday_shift', 'wednesday_shift', 'thursday_shift', 'friday_shift', 'saturday_shift', 'sunday_shift']
  const shiftData = template[dayFields[mondayBasedDay]]

  if (!shiftData || shiftData === 'OFF') {
    return null
  }

  // Parse shift data (format: "06:00-14:30" or similar)
  const [startTime, endTime] = shiftData.split('-')
  
  return {
    user_id: userId,
    date: date.toISOString().split('T')[0],
    start_time: startTime + ':00',
    end_time: endTime + ':00',
    type: convertDHLShiftType(shiftData),
    dhl_position_id: assignment.dhl_positions?.id,
    is_dhl_managed: true,
    is_wechselschicht_generated: false,
    notes: `Auto-generated from DHL position: ${assignment.dhl_positions?.name}`
  }
}

// Helper function to get calendar week
function getCalendarWeek(date: Date): number {
  const target = new Date(date.valueOf())
  const dayNr = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
}

// Calculate Woche for specific date based on 15-week rotation
function calculateWocheForDate(userCurrentWoche: number, targetCalendarWeek: number): number {
  if (!userCurrentWoche || userCurrentWoche < 1 || userCurrentWoche > 15) {
    console.warn('Invalid currentWoche:', userCurrentWoche);
    return 1;
  }

  // Get current calendar week
  const today = new Date();
  const currentCalendarWeek = getCalendarWeek(today);
  
  // Calculate week difference
  let weeksDiff = targetCalendarWeek - currentCalendarWeek;
  
  // Handle year rollover
  if (weeksDiff > 26) {
    weeksDiff -= 52;
  } else if (weeksDiff < -26) {
    weeksDiff += 52;
  }

  let result = userCurrentWoche + weeksDiff;
  
  // Handle overflow/underflow with 15-week cycle
  while (result > 15) {
    result -= 15;
  }
  while (result < 1) {
    result += 15;
  }
  
  return result;
}

// Get shift times from pattern based on shift type
function getWechselschichtTimes(pattern: any, shiftType: string): { start: string, end: string } | null {
  switch (shiftType.toLowerCase()) {
    case 'ranní':
      return { 
        start: pattern.morning_start_time, 
        end: pattern.morning_end_time 
      }
    case 'odpolední':
      return { 
        start: pattern.afternoon_start_time, 
        end: pattern.afternoon_end_time 
      }
    case 'noční':
      return { 
        start: pattern.night_start_time, 
        end: pattern.night_end_time 
      }
    default:
      return null
  }
}

// Convert Wechselschicht shift type
function convertWechselschichtType(shiftType: string): string {
  switch (shiftType.toLowerCase()) {
    case 'ranní': return 'morning'
    case 'odpolední': return 'afternoon'
    case 'noční': return 'night'
    default: return 'morning'
  }
}

// Convert DHL shift type
function convertDHLShiftType(shiftData: string): string {
  if (shiftData.startsWith('06:') || shiftData.startsWith('07:')) return 'morning'
  if (shiftData.startsWith('14:') || shiftData.startsWith('15:')) return 'afternoon'
  if (shiftData.startsWith('22:') || shiftData.startsWith('23:')) return 'night'
  return 'morning'
}

// Generate ICS content
function generateICSContent(shifts: any[]): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DHL Shifts//DHL Shifts Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ]

  shifts.forEach(shift => {
    const startDateTime = new Date(`${shift.date}T${shift.start_time}`)
    const endDateTime = new Date(`${shift.date}T${shift.end_time}`)
    
    const startFormatted = startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endFormatted = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    ics.push(
      'BEGIN:VEVENT',
      `UID:dhl-shift-${shift.id}@dhl-app.com`,
      `DTSTAMP:${now}`,
      `DTSTART:${startFormatted}`,
      `DTEND:${endFormatted}`,
      `SUMMARY:DHL Shift - ${shift.type}`,
      `DESCRIPTION:${shift.notes || 'DHL Work Shift'}`,
      'END:VEVENT'
    )
  })

  ics.push('END:VCALENDAR')
  return ics.join('\r\n')
}

// Generate Google Calendar URL
function generateGoogleCalendarUrl(shift: any): string {
  const startDateTime = new Date(`${shift.date}T${shift.start_time}`)
  const endDateTime = new Date(`${shift.date}T${shift.end_time}`)
  
  const startFormatted = startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const endFormatted = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  const title = encodeURIComponent(`DHL Shift - ${shift.type}`)
  const details = encodeURIComponent(shift.notes || 'DHL Work Shift')
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}`
}