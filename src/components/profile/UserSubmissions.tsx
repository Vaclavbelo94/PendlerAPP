import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, FileText, Calendar, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface UserSubmission {
  id: string;
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

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  in_progress: <AlertCircle className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
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

export const UserSubmissions = () => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<UserSubmission | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation(['common', 'taxAdvisor']);

  useEffect(() => {
    fetchUserSubmissions();
  }, []);

  const fetchUserSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('assisted_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data || []) as UserSubmission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: t('error'),
        description: 'Nepodařilo se načíst vaše žádosti',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
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
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Moje žádosti o asistované podání
          </CardTitle>
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
          Moje žádosti o asistované podání ({submissions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Zatím jste nepodali žádnou žádost o asistované podání.</p>
            <p className="text-sm mt-2">
              Návštivte sekci Daňový poradce a použijte Průvodce daňovým přiznáním.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum podání</TableHead>
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
                      <Badge className={statusColors[submission.status]}>
                        <span className="flex items-center gap-1">
                          {statusIcons[submission.status]}
                          {statusLabels[submission.status]}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{priorityLabels[submission.priority]}</span>
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
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detail žádosti</DialogTitle>
                          </DialogHeader>
                          
                          {selectedSubmission && (
                            <div className="space-y-6">
                              {/* Status a základní info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Aktuální status</h4>
                                  <Badge className={statusColors[selectedSubmission.status]}>
                                    <span className="flex items-center gap-1">
                                      {statusIcons[selectedSubmission.status]}
                                      {statusLabels[selectedSubmission.status]}
                                    </span>
                                  </Badge>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Priorita</h4>
                                  <span>{priorityLabels[selectedSubmission.priority]}</span>
                                </div>
                              </div>

                              {/* Daňové informace */}
                              <div>
                                <h4 className="font-semibold mb-2">Souhrn daňových údajů</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                                  <div>
                                    <strong>Cestovné:</strong>
                                    <div>{formatCurrency(selectedSubmission.calculation_result.reisepausaleBenefit)}</div>
                                  </div>
                                  <div>
                                    <strong>Celkové odpočty:</strong>
                                    <div>{formatCurrency(selectedSubmission.calculation_result.totalDeductions)}</div>
                                  </div>
                                  <div>
                                    <strong>Odhad návratu:</strong>
                                    <div className="text-green-600 font-semibold">
                                      {formatCurrency(selectedSubmission.calculation_result.totalDeductions * 0.25)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Kontaktní údaje */}
                              <div>
                                <h4 className="font-semibold mb-2">Kontaktní údaje</h4>
                                <div className="text-sm space-y-1">
                                  <div><strong>Email:</strong> {selectedSubmission.contact_info.contactEmail}</div>
                                  {selectedSubmission.contact_info.phone && (
                                    <div><strong>Telefon:</strong> {selectedSubmission.contact_info.phone}</div>
                                  )}
                                  {selectedSubmission.contact_info.additionalNotes && (
                                    <div><strong>Poznámky:</strong> {selectedSubmission.contact_info.additionalNotes}</div>
                                  )}
                                </div>
                              </div>

                              {/* Admin poznámky */}
                              {selectedSubmission.admin_notes && (
                                <div>
                                  <h4 className="font-semibold mb-2">Poznámky od administrátora</h4>
                                  <div className="bg-blue-50 p-3 rounded-lg text-sm">
                                    {selectedSubmission.admin_notes}
                                  </div>
                                </div>
                              )}

                              {/* Časové údaje */}
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div>Vytvořeno: {formatDate(selectedSubmission.created_at)}</div>
                                <div>Aktualizováno: {formatDate(selectedSubmission.updated_at)}</div>
                                {selectedSubmission.form_code && (
                                  <div>Kód formuláře: {selectedSubmission.form_code}</div>
                                )}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSubmissions;