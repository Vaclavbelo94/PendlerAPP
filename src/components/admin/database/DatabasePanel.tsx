
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Play, 
  Download, 
  Upload, 
  BarChart3,
  Table as TableIcon,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface TableStat {
  table_name: string;
  row_count: number;
  size_mb: number;
  last_updated: string;
}

interface QueryResult {
  columns: string[];
  rows: any[][];
  execution_time: number;
  row_count: number;
}

const DatabasePanel: React.FC = () => {
  const { t } = useTranslation('admin-database');
  const { toast } = useToast();
  const [tableStats, setTableStats] = useState<TableStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  // Mock data for demonstration
  const mockTableStats: TableStat[] = [
    {
      table_name: 'profiles',
      row_count: 1234,
      size_mb: 15.7,
      last_updated: new Date().toISOString()
    },
    {
      table_name: 'shifts',
      row_count: 5678,
      size_mb: 89.2,
      last_updated: new Date(Date.now() - 300000).toISOString()
    },
    {
      table_name: 'vehicles',
      row_count: 456,
      size_mb: 8.4,
      last_updated: new Date(Date.now() - 600000).toISOString()
    },
    {
      table_name: 'vocabulary_items',
      row_count: 9876,
      size_mb: 45.3,
      last_updated: new Date(Date.now() - 900000).toISOString()
    }
  ];

  useEffect(() => {
    fetchTableStats();
  }, []);

  const fetchTableStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTableStats(mockTableStats);
      toast({ title: t('toast.statsLoaded') });
    } catch (error) {
      console.error('Error fetching table stats:', error);
      toast({ title: t('toast.statsError'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({ title: t('toast.queryEmpty'), variant: "destructive" });
      return;
    }

    // Basic security check - only allow SELECT queries
    const trimmedQuery = sqlQuery.trim().toLowerCase();
    if (!trimmedQuery.startsWith('select')) {
      toast({ title: 'Pouze SELECT dotazy jsou povoleny', variant: "destructive" });
      return;
    }

    setIsExecuting(true);
    try {
      // TODO: Replace with actual Supabase query execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result
      const mockResult: QueryResult = {
        columns: ['id', 'email', 'created_at', 'is_premium'],
        rows: [
          ['1', 'user1@example.com', '2024-01-15 10:30:00', 'true'],
          ['2', 'user2@example.com', '2024-01-16 14:22:00', 'false'],
          ['3', 'user3@example.com', '2024-01-17 09:15:00', 'true']
        ],
        execution_time: 145,
        row_count: 3
      };
      
      setQueryResult(mockResult);
      toast({ title: t('toast.querySuccess') + ` (${mockResult.execution_time}ms)` });
    } catch (error) {
      console.error('Error executing query:', error);
      toast({ title: t('toast.queryError'), variant: "destructive" });
    } finally {
      setIsExecuting(false);
    }
  };

  const createBackup = async () => {
    setBackupStatus('running');
    try {
      // TODO: Replace with actual backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      setBackupStatus('success');
      toast({ title: t('toast.backupCreated') });
      
      // Reset status after 3 seconds
      setTimeout(() => setBackupStatus('idle'), 3000);
    } catch (error) {
      console.error('Error creating backup:', error);
      setBackupStatus('error');
      toast({ title: t('toast.backupError'), variant: "destructive" });
      setTimeout(() => setBackupStatus('idle'), 3000);
    }
  };

  const exportData = (format: 'csv' | 'json') => {
    if (!queryResult) {
      toast.error('Nejprve proveďte dotaz');
      return;
    }

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'csv') {
      content = [
        queryResult.columns.join(','),
        ...queryResult.rows.map(row => row.join(','))
      ].join('\n');
      mimeType = 'text/csv';
      filename = `query-result-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      const jsonData = queryResult.rows.map(row => {
        const obj: any = {};
        queryResult.columns.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });
      content = JSON.stringify(jsonData, null, 2);
      mimeType = 'application/json';
      filename = `query-result-${new Date().toISOString().split('T')[0]}.json`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Data exportována jako ${format.toUpperCase()}`);
  };

  const totalSize = tableStats.reduce((sum, table) => sum + table.size_mb, 0);
  const totalRows = tableStats.reduce((sum, table) => sum + table.row_count, 0);

  return (
    <div className="space-y-6">
      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              {t('overview.table')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableStats.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('metrics.totalRecords')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRows.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              {t('metrics.databaseSize')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="query">{t('tabs.query')}</TabsTrigger>
          <TabsTrigger value="backup">{t('tabs.backup')}</TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {t('overview.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('subtitle')}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={fetchTableStats} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {t('overview.refresh')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('overview.table')}</TableHead>
                    <TableHead>{t('overview.rows')}</TableHead>
                    <TableHead>{t('overview.size')}</TableHead>
                    <TableHead>{t('overview.lastUpdate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableStats.map((table) => (
                    <TableRow key={table.table_name}>
                      <TableCell className="font-medium">{table.table_name}</TableCell>
                      <TableCell>{table.row_count.toLocaleString()}</TableCell>
                      <TableCell>{table.size_mb.toFixed(1)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(table.last_updated).toLocaleString('cs-CZ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                {t('query.title')}
              </CardTitle>
              <CardDescription>
                {t('query.executionTime')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('query.securityNote')}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="sqlQuery">{t('query.title')}</Label>
                <Textarea
                  id="sqlQuery"
                  placeholder={t('query.placeholder')}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  rows={6}
                  className="font-mono"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={executeQuery} disabled={isExecuting}>
                  <Play className={`h-4 w-4 mr-2 ${isExecuting ? 'animate-spin' : ''}`} />
                  {isExecuting ? t('query.executing') : t('query.execute')}
                </Button>
                
                {queryResult && (
                  <>
                    <Button variant="outline" onClick={() => exportData('csv')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => exportData('json')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  </>
                )}
              </div>

              {queryResult && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{t('query.results')}: {queryResult.row_count}</span>
                    <span>{t('query.executionTime')}: {queryResult.execution_time}ms</span>
                  </div>

                  <ScrollArea className="h-64 border rounded">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {queryResult.columns.map((column) => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {queryResult.rows.map((row, index) => (
                          <TableRow key={index}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex} className="text-sm">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('backup.title')}
              </CardTitle>
              <CardDescription>
                {t('subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('backup.create.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('backup.create.description')}
                  </p>
                  <Button 
                    onClick={createBackup} 
                    disabled={backupStatus === 'running'}
                    className="w-full"
                  >
                    {backupStatus === 'running' ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {t('backup.status.running')}
                      </>
                    ) : backupStatus === 'success' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t('backup.status.success')}
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        {t('backup.create.button')}
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Automatické zálohy</h3>
                  <p className="text-sm text-muted-foreground">
                    Konfigurace pravidelných automatických záloh.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="secondary">Denní záloha: 02:00</Badge>
                    <Badge variant="secondary">Týdenní záloha: Neděle 01:00</Badge>
                    <Badge variant="secondary">Uchování: 30 dní</Badge>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Zálohy jsou automaticky šifrovány a ukládány do zabezpečeného úložiště. 
                  Pro obnovu dat kontaktujte systémového administrátora.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabasePanel;
