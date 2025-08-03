import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminNotificationRequest {
  title: string;
  message: string;
  notificationType: 'info' | 'warning' | 'success' | 'error';
  targetType: 'user' | 'company' | 'all';
  targetCompanies?: string[];
  targetUserIds?: string[];
  language: 'cs' | 'de' | 'pl';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Admin notification request received');

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
      console.error('Auth error:', authError);
      throw new Error('Authentication failed');
    }

    console.log('User authenticated:', user.id);

    // Verify admin permissions
    const { data: adminPermissions, error: permError } = await supabase
      .from('admin_permissions')
      .select('permission_level')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .in('permission_level', ['admin', 'super_admin'])
      .single();

    if (permError || !adminPermissions) {
      console.error('Permission check failed:', permError);
      throw new Error('Insufficient permissions to send admin notifications');
    }

    console.log('Admin permissions verified:', adminPermissions.permission_level);

    const requestData: AdminNotificationRequest = await req.json();
    console.log('Request data:', requestData);
    
    // Validate input
    if (!requestData.title || !requestData.message) {
      throw new Error('Title and message are required');
    }

    if (!['user', 'company', 'all'].includes(requestData.targetType)) {
      throw new Error('Invalid target type');
    }

    if (!['info', 'warning', 'success', 'error'].includes(requestData.notificationType)) {
      throw new Error('Invalid notification type');
    }

    if (!['cs', 'de', 'pl'].includes(requestData.language)) {
      throw new Error('Invalid language');
    }

    // Call the database function to send notifications
    const { data: result, error: functionError } = await supabase
      .rpc('send_admin_notification', {
        p_admin_user_id: user.id,
        p_title: requestData.title,
        p_message: requestData.message,
        p_notification_type: requestData.notificationType,
        p_target_type: requestData.targetType,
        p_target_companies: requestData.targetCompanies || null,
        p_target_user_ids: requestData.targetUserIds || null,
        p_language: requestData.language
      });

    if (functionError) {
      console.error('Database function error:', functionError);
      throw new Error(`Failed to send notification: ${functionError.message}`);
    }

    console.log('Notification sent successfully. Admin notification ID:', result);

    // Get the sent count from admin_notifications table
    const { data: adminNotification, error: countError } = await supabase
      .from('admin_notifications')
      .select('sent_count')
      .eq('id', result)
      .single();

    if (countError) {
      console.warn('Could not get sent count:', countError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      notificationId: result,
      sentCount: adminNotification?.sent_count || 0,
      message: 'Notification sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Admin notification error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});