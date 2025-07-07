import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, MessageSquare, Calendar, User, FileText, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AssistedSubmission {
  id: string;
  user_id: string;
  form_code: string | null;
  user_data: any;
  calculation_result: any;
  contact_info: any;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'standard' | 'high' | 'urgent';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const priorityColors = {
  standard: 'bg-gray-100 text-gray-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Čeká na vyřízení',
  in_progress: 'Zpracovává se',
  completed: 'Dokončeno',
  cancelled: 'Zrušeno'
};

const priorityLabels = {
  standard: 'Standardní',
  high: 'Vysoká',
  urgent: 'Urgentní'
};

export const AssistedSubmissionsPanel = () => {
  const [submissions, setSubmissions] = useState<AssistedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<AssistedSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('assisted_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data || []) as AssistedSubmission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se načíst žádosti',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (id: string, updates: Partial<AssistedSubmission>) => {
    try {
      const oldSubmission = submissions.find(s => s.id === id);
      
      const { error } = await supabase
        .from('assisted_submissions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, ...updates } : sub
        )
      );

      // Send email notification if status changed
      if (updates.status && oldSubmission && updates.status !== oldSubmission.status) {
        try {
          await supabase.functions.invoke('send-submission-notification', {
            body: {
              type: 'status_update',
              submission_id: id,
              old_status: oldSubmission.status,
              new_status: updates.status
            }
          });
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
          // Don't throw - update was successful even if email failed
        }
      }

      toast({
        title: 'Úspěch',
        description: 'Žádost byla aktualizována'
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se aktualizovat žádost',
        variant: 'destructive'
      });
    }
  };

  const openDetailDialog = (submission: AssistedSubmission) => {
    setSelectedSubmission(submission);
    setAdminNotes(submission.admin_notes || '');
    setSelectedStatus(submission.status);
  };

  const saveUpdates = () => {
    if (selectedSubmission) {
      updateSubmission(selectedSubmission.id, {
        status: selectedStatus as any,
        admin_notes: adminNotes
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Žádosti o asistované podání</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Načítání...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Žádosti o asistované podání ({submissions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priorita</TableHead>
                <TableHead>Odhad návratu</TableHead>
                <TableHead>Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(submission.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{submission.contact_info.contactEmail}</span>
                      </div>
                      {submission.contact_info.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{submission.contact_info.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[submission.status]}>
                      {statusLabels[submission.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[submission.priority]}>
                      {priorityLabels[submission.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(submission.calculation_result.totalDeductions * 0.25)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDetailDialog(submission)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detail žádosti</DialogTitle>
                        </DialogHeader>
                        
                        {selectedSubmission && (
                          <div className="space-y-6">
                            {/* Základní info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Status</Label>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Čeká na vyřízení</SelectItem>
                                    <SelectItem value="in_progress">Zpracovává se</SelectItem>
                                    <SelectItem value="completed">Dokončeno</SelectItem>
                                    <SelectItem value="cancelled">Zrušeno</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Priorita</Label>
                                <Input value={priorityLabels[selectedSubmission.priority]} disabled />
                              </div>
                            </div>

                            {/* Kontaktní údaje */}
                            <div>
                              <h4 className="font-semibold mb-2">Kontaktní údaje</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>Email:</strong> {selectedSubmission.contact_info.contactEmail}
                                </div>
                                <div>
                                  <strong>Telefon:</strong> {selectedSubmission.contact_info.phone || 'Nezadán'}
                                </div>
                              </div>
                              {selectedSubmission.contact_info.additionalNotes && (
                                <div className="mt-2">
                                  <strong>Poznámky:</strong> {selectedSubmission.contact_info.additionalNotes}
                                </div>
                              )}
                            </div>

                            {/* Daňové údaje */}
                            <div>
                              <h4 className="font-semibold mb-2">Daňové údaje</h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <strong>Jméno:</strong> {selectedSubmission.user_data.personalInfo.firstName} {selectedSubmission.user_data.personalInfo.lastName}
                                </div>
                                <div>
                                  <strong>Zaměstnavatel:</strong> {selectedSubmission.user_data.employment.employerName || 'Nezadán'}
                                </div>
                                <div>
                                  <strong>Roční příjem:</strong> {selectedSubmission.user_data.employment.annualIncome || 'Nezadán'}€
                                </div>
                              </div>
                            </div>

                            {/* Výsledky kalkulace */}
                            <div>
                              <h4 className="font-semibold mb-2">Výsledky kalkulace</h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <strong>Cestovné:</strong> {formatCurrency(selectedSubmission.calculation_result.reisepausaleBenefit)}
                                </div>
                                <div>
                                  <strong>Celkové odpočty:</strong> {formatCurrency(selectedSubmission.calculation_result.totalDeductions)}
                                </div>
                                <div>
                                  <strong>Odhad návratu:</strong> <span className="text-green-600 font-semibold">{formatCurrency(selectedSubmission.calculation_result.totalDeductions * 0.25)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Admin poznámky */}
                            <div>
                              <Label htmlFor="admin-notes">Poznámky administrátora</Label>
                              <Textarea
                                id="admin-notes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Vepište poznámky o průběhu vyřizování..."
                                rows={4}
                              />
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                                Zrušit
                              </Button>
                              <Button onClick={saveUpdates}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Uložit změny
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {submissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Žádné žádosti o asistované podání
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistedSubmissionsPanel;