
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  Play, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle,
  BarChart3,
  HardDrive,
  Users,
  Table as TableIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TableStats {
  table_name: string;
  row_count: number;
  size_mb: number;
  last_modified: string;
}

interface QueryResult {
  columns: string[];
  rows: any[];
  execution_time?: number;
}

const DatabasePanel: React.FC = () => {
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);

  // Mock data for demonstration
  const mockTableStats: TableStats[] = [
    { table_name: 'profiles', row_count: 1234, size_mb: 2.5, last_modified: new Date().toISOString() },
    { table_name: 'vehicles', row_count: 567, size_mb: 1.8, last_modified: new Date().toISOString() },
    { table_name: 'shifts', row_count: 8901, size_mb: 12.3, last_modified: new Date().toISOString() },
    { table_name: 'fuel_records', row_count: 2345, size_mb: 4.7, last_modified: new Date().toISOString() },
    { table_name: 'promo_codes', row_count: 45, size_mb: 0.1, last_modified: new Date().toISOString() },
  ];

  useEffect(() => {
    fetchTableStats();
  }, []);

  const fetchTableStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase query to get table statistics
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTableStats(mockTableStats);
      toast.success('Statistiky databáze načteny');
    } catch (error) {
      console.error('Error fetching table stats:', error);
      toast.error('Nepodařilo se načíst statistiky databáze');
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      toast.error('Zadejte SQL dotaz');
      return;
    }

    setQueryLoading(true);
    try {
      const startTime = Date.now();
      
      // For safety, only allow SELECT queries in production
      if (!query.trim().toLowerCase().startsWith('select')) {
        toast.error('Povoleny jsou pouze SELECT dotazy');
        return;
      }

      // TODO: Replace with actual query execution
      // const { data, error } = await supabase.rpc('admin_execute_query', { query });
      
      // Mock result for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockResult: QueryResult = {
        columns: ['id', 'email', 'created_at'],
        rows: [
          { id: '1', email: 'user1@example.com', created_at: '2024-01-01' },
          { id: '2', email: 'user2@example.com', created_at: '2024-01-02' },
        ],
        execution_time: Date.now() - startTime
      };

      setQueryResult(mockResult);
      toast.success(`Dotaz dokončen za ${mockResult.execution_time}ms`);
    } catch (error) {
      console.error('Query execution error:', error);
      toast.error('Chyba při vykonávání dotazu');
    } finally {
      setQueryLoading(false);
    }
  };

  const exportBackup = async () => {
    try {
      toast.info('Spouští se backup databáze...');
      // TODO: Implement actual backup functionality
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Backup byl vytvořen a stažen');
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Nepodařilo se vytvořit backup');
    }
  };

  const totalRows = tableStats.reduce((sum, table) => sum + table.row_count, 0);
  const totalSize = tableStats.reduce((sum, table) => sum + table.size_mb, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              Tabulky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableStats.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Celkem řádků
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
              Velikost DB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Výkon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.8%</div>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tables">Tabulky</TabsTrigger>
          <TabsTrigger value="query">SQL Runner</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Statistiky tabulek
                  </CardTitle>
                  <CardDescription>
                    Přehled všech tabulek v databázi
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={fetchTableStats} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Obnovit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Název tabulky</TableHead>
                    <TableHead>Počet řádků</TableHead>
                    <TableHead>Velikost (MB)</TableHead>
                    <TableHead>Poslední změna</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableStats.map((table) => (
                    <TableRow key={table.table_name}>
                      <TableCell className="font-mono">{table.table_name}</TableCell>
                      <TableCell>{table.row_count.toLocaleString()}</TableCell>
                      <TableCell>{table.size_mb.toFixed(2)}</TableCell>
                      <TableCell>{new Date(table.last_modified).toLocaleDateString('cs-CZ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                SQL Runner
              </CardTitle>
              <CardDescription>
                Spouštění SQL dotazů (pouze SELECT)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Z bezpečnostních důvodů jsou povoleny pouze SELECT dotazy.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Zadejte SQL dotaz..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="font-mono text-sm"
                  rows={6}
                />
                <Button onClick={executeQuery} disabled={queryLoading}>
                  <Play className={`h-4 w-4 mr-2 ${queryLoading ? 'animate-pulse' : ''}`} />
                  {queryLoading ? 'Spouští se...' : 'Spustit dotaz'}
                </Button>
              </div>

              {queryResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Výsledek</CardTitle>
                    <CardDescription>
                      {queryResult.rows.length} řádků za {queryResult.execution_time}ms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {queryResult.columns.map((col) => (
                              <TableHead key={col} className="font-mono">{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.rows.map((row, idx) => (
                            <TableRow key={idx}>
                              {queryResult.columns.map((col) => (
                                <TableCell key={col} className="font-mono text-sm">
                                  {row[col]?.toString() || '-'}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Backup databáze
                </CardTitle>
                <CardDescription>
                  Vytvoření a stažení zálohy databáze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Backup může trvat několik minut v závislosti na velikosti databáze.
                  </AlertDescription>
                </Alert>
                
                <Button onClick={exportBackup} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Vytvořit backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Restore databáze
                </CardTitle>
                <CardDescription>
                  Obnovení databáze ze zálohy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Restore přepíše všechna současná data. Tato akce je nevratná!
                  </AlertDescription>
                </Alert>
                
                <Input type="file" accept=".sql,.dump" />
                <Button variant="destructive" className="w-full" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Obnovit ze zálohy
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabasePanel;
