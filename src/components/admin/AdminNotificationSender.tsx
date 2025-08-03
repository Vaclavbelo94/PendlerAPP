import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Users, Building2, Globe, Eye, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { multilingualNotificationService } from '@/components/shifts/services/MultilingualNotificationService';

interface User {
  id: string;
  username: string;
  email: string;
  company: string;
}

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  target_type: string;
  target_companies: string[];
  target_user_ids: string[];
  language: string;
  sent_count: number;
  created_at: string;
}

export const AdminNotificationSender = () => {
  const { t } = useTranslation(['admin', 'notifications']);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<AdminNotification[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'info' | 'warning' | 'success' | 'error'>('info');
  const [targetType, setTargetType] = useState<'user' | 'company' | 'all'>('all');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [language, setLanguage] = useState<'cs' | 'de' | 'pl'>('cs');
  const [previewMode, setPreviewMode] = useState(false);

  const companies = ['adecco', 'randstad', 'dhl'];

  useEffect(() => {
    loadUsers();
    loadRecentNotifications();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, company')
        .order('username');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    }
  };

  const loadRecentNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentNotifications(data || []);
    } catch (error: any) {
      console.error('Error loading recent notifications:', error);
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and message are required",
        variant: "destructive"
      });
      return;
    }

    if (targetType === 'company' && selectedCompanies.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Please select at least one company",
        variant: "destructive"
      });
      return;
    }

    if (targetType === 'user' && selectedUserIds.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one user", 
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          title,
          message,
          notificationType,
          targetType,
          targetCompanies: targetType === 'company' ? selectedCompanies : undefined,
          targetUserIds: targetType === 'user' ? selectedUserIds : undefined,
          language
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Notification sent to ${data.sentCount} users`,
      });

      // Reset form
      setTitle('');
      setMessage('');
      setSelectedCompanies([]);
      setSelectedUserIds([]);
      setPreviewMode(false);
      
      // Reload recent notifications
      loadRecentNotifications();

    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send notification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and message are required for preview",
        variant: "destructive"
      });
      return;
    }

    // Show preview using the notification service
    multilingualNotificationService.showCustomNotification({
      title,
      description: message,
      type: notificationType,
      duration: 5000
    });
  };

  const getTargetDescription = () => {
    switch (targetType) {
      case 'all':
        return 'All users';
      case 'company':
        return `Companies: ${selectedCompanies.join(', ')}`;
      case 'user':
        return `${selectedUserIds.length} selected users`;
      default:
        return '';
    }
  };

  const filteredUsers = users.filter(user => 
    targetType !== 'company' || selectedCompanies.includes(user.company)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Admin Notification Sender
          </CardTitle>
          <CardDescription>
            Send notifications to users, companies, or everyone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compose" className="space-y-4">
              <div className="grid gap-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Notification title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Language</label>
                    <Select value={language} onValueChange={(value: 'cs' | 'de' | 'pl') => setLanguage(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Czech</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="pl">Polish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Notification message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Type and Target */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select value={notificationType} onValueChange={(value: typeof notificationType) => setNotificationType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target</label>
                    <Select value={targetType} onValueChange={(value: typeof targetType) => setTargetType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            All Users
                          </div>
                        </SelectItem>
                        <SelectItem value="company">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            By Company
                          </div>
                        </SelectItem>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Specific Users
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Company Selection */}
                {targetType === 'company' && (
                  <div>
                    <label className="text-sm font-medium">Companies</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {companies.map((company) => (
                        <div key={company} className="flex items-center space-x-2">
                          <Checkbox
                            id={company}
                            checked={selectedCompanies.includes(company)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCompanies(prev => [...prev, company]);
                              } else {
                                setSelectedCompanies(prev => prev.filter(c => c !== company));
                              }
                            }}
                          />
                          <label htmlFor={company} className="text-sm capitalize">
                            {company}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Selection */}
                {targetType === 'user' && (
                  <div>
                    <label className="text-sm font-medium">Users</label>
                    <div className="max-h-48 overflow-y-auto mt-2 border rounded p-2">
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={user.id}
                            checked={selectedUserIds.includes(user.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUserIds(prev => [...prev, user.id]);
                              } else {
                                setSelectedUserIds(prev => prev.filter(id => id !== user.id));
                              }
                            }}
                          />
                          <label htmlFor={user.id} className="text-sm flex-1">
                            {user.username || user.email} 
                            <span className="text-muted-foreground ml-2">({user.company})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Summary */}
                <div className="p-3 bg-muted rounded">
                  <p className="text-sm">
                    <strong>Target:</strong> {getTargetDescription()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handlePreview}
                    variant="outline"
                    disabled={!title.trim() || !message.trim()}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={handleSendNotification}
                    disabled={isLoading || !title.trim() || !message.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Notification'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Notifications
                </h3>
                {recentNotifications.length === 0 ? (
                  <p className="text-muted-foreground">No notifications sent yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentNotifications.map((notification) => (
                      <Card key={notification.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">
                                  {notification.notification_type}
                                </Badge>
                                <Badge variant="outline">
                                  {notification.target_type}
                                </Badge>
                                <Badge variant="outline">
                                  {notification.language}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>{notification.sent_count} recipients</p>
                              <p>{new Date(notification.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};