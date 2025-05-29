
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  action: 'create' | 'markRead' | 'markAllRead' | 'delete' | 'getPreferences' | 'updatePreferences';
  notificationId?: string;
  title?: string;
  message?: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  relatedTo?: any;
  preferences?: any;
}

// Rate limiting store (in production use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `notifications_${clientIP}`;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 50;

    const rateLimit = rateLimitStore.get(rateLimitKey);
    if (rateLimit && rateLimit.resetTime > now) {
      if (rateLimit.count >= maxRequests) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      rateLimit.count++;
    } else {
      rateLimitStore.set(rateLimitKey, { count: 1, resetTime: now + windowMs });
    }

    // Get auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const requestData: NotificationRequest = await req.json();
    
    // Input validation and sanitization
    const sanitizedData = sanitizeInput(requestData);
    
    let result;
    
    switch (sanitizedData.action) {
      case 'create':
        result = await createNotification(supabase, user.id, sanitizedData);
        break;
      case 'markRead':
        result = await markNotificationRead(supabase, user.id, sanitizedData.notificationId!);
        break;
      case 'markAllRead':
        result = await markAllNotificationsRead(supabase, user.id);
        break;
      case 'delete':
        result = await deleteNotification(supabase, user.id, sanitizedData.notificationId!);
        break;
      case 'getPreferences':
        result = await getUserPreferences(supabase, user.id);
        break;
      case 'updatePreferences':
        result = await updateUserPreferences(supabase, user.id, sanitizedData.preferences);
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Notification management error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function sanitizeInput(data: NotificationRequest): NotificationRequest {
  const sanitized = { ...data };
  
  // Sanitize strings
  if (sanitized.title) {
    sanitized.title = sanitized.title.substring(0, 200).trim();
  }
  if (sanitized.message) {
    sanitized.message = sanitized.message.substring(0, 1000).trim();
  }
  
  // Validate type
  if (sanitized.type && !['info', 'warning', 'success', 'error'].includes(sanitized.type)) {
    sanitized.type = 'info';
  }
  
  // Validate UUID format for notificationId
  if (sanitized.notificationId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sanitized.notificationId)) {
    throw new Error('Invalid notification ID format');
  }
  
  return sanitized;
}

async function createNotification(supabase: any, userId: string, data: NotificationRequest) {
  if (!data.title || !data.message) {
    throw new Error('Title and message are required');
  }

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      related_to: data.relatedTo || null
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, notification };
}

async function markNotificationRead(supabase: any, userId: string, notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true, updated_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

async function markAllNotificationsRead(supabase: any, userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
  return { success: true };
}

async function deleteNotification(supabase: any, userId: string, notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

async function getUserPreferences(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('user_notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return { preferences: data };
}

async function updateUserPreferences(supabase: any, userId: string, preferences: any) {
  const { data, error } = await supabase
    .from('user_notification_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, preferences: data };
}
