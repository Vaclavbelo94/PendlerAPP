import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  title: string;
  message: string;
  notificationType: string;
  targetType: 'all' | 'company' | 'user';
  targetCompanies?: string[];
  targetUserIds?: string[];
  language: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    console.log('Authenticated user:', user.id);

    // Check admin permissions
    const { data: adminPermission, error: permissionError } = await supabase
      .from('admin_permissions')
      .select('permission_level')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (permissionError || !adminPermission) {
      throw new Error('Admin permissions required');
    }

    console.log('Admin permission level:', adminPermission.permission_level);

    // Parse request body
    const body: NotificationRequest = await req.json();
    console.log('Request body:', body);

    // Validate required fields
    if (!body.title || !body.message) {
      throw new Error('Title and message are required');
    }

    // Use the existing admin notification function
    const { data: notificationResult, error: notificationError } = await supabase
      .rpc('send_admin_notification', {
        p_admin_user_id: user.id,
        p_title: body.title,
        p_message: body.message,
        p_notification_type: body.notificationType || 'info',
        p_target_type: body.targetType,
        p_target_companies: body.targetCompanies || null,
        p_target_user_ids: body.targetUserIds || null,
        p_language: body.language || 'cs'
      });

    if (notificationError) {
      console.error('Error calling send_admin_notification:', notificationError);
      throw new Error(`Failed to send notification: ${notificationError.message}`);
    }

    console.log('Notification sent successfully:', notificationResult);

    // Get the sent count from the created admin notification
    const { data: adminNotification, error: countError } = await supabase
      .from('admin_notifications')
      .select('sent_count')
      .eq('id', notificationResult)
      .single();

    if (countError) {
      console.warn('Could not fetch sent count:', countError);
    }

    const sent_count = adminNotification?.sent_count || 0;

    return new Response(JSON.stringify({
      success: true,
      notification_id: notificationResult,
      sent_count
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-admin-notification function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});