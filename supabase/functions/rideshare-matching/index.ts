
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { origin, destination, date, flexibility = 30 } = await req.json()

    // Find matching offers based on route similarity and time flexibility
    const { data: offers, error } = await supabaseClient
      .from('rideshare_offers')
      .select(`
        *,
        profiles:user_id(username, email)
      `)
      .eq('is_active', true)
      .gte('departure_date', date)
      .gt('seats_available', 0)

    if (error) throw error

    // Calculate match scores based on route similarity and time
    const matches = offers?.map(offer => {
      const routeScore = calculateRouteMatch(origin, destination, offer.origin_address, offer.destination_address)
      const timeScore = calculateTimeMatch(date, offer.departure_date, flexibility)
      const overallScore = (routeScore * 0.7) + (timeScore * 0.3)
      
      return {
        ...offer,
        matchScore: overallScore,
        routeCompatibility: routeScore,
        timeCompatibility: timeScore
      }
    }).filter(match => match.matchScore > 0.3)
     .sort((a, b) => b.matchScore - a.matchScore)
     .slice(0, 10) || []

    return new Response(
      JSON.stringify({ matches }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function calculateRouteMatch(userOrigin: string, userDest: string, offerOrigin: string, offerDest: string): number {
  // Simple string similarity - in production, use actual geographical distance
  const originSimilarity = stringSimilarity(userOrigin.toLowerCase(), offerOrigin.toLowerCase())
  const destSimilarity = stringSimilarity(userDest.toLowerCase(), offerDest.toLowerCase())
  return (originSimilarity + destSimilarity) / 2
}

function calculateTimeMatch(userDate: string, offerDate: string, flexibility: number): number {
  const userTime = new Date(userDate).getTime()
  const offerTime = new Date(offerDate).getTime()
  const diffDays = Math.abs(userTime - offerTime) / (1000 * 60 * 60 * 24)
  
  if (diffDays <= flexibility) {
    return 1 - (diffDays / flexibility)
  }
  return 0
}

function stringSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ')
  const words2 = str2.split(' ')
  
  let matches = 0
  words1.forEach(word1 => {
    if (words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
      matches++
    }
  })
  
  return matches / Math.max(words1.length, words2.length)
}
