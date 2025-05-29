
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  Calendar, 
  BookOpen,
  Car,
  DollarSign,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  dataSize: string;
  lastExport?: Date;
  isSelected: boolean;
}

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  features: string[];
}

export const DataExportImport: React.FC = () => {
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    {
      id: 'vocabulary',
      name: 'Slovní zásoba',
      description: 'Všechna naučená slova a fráze',
      icon: <BookOpen className="h-4 w-4" />,
      dataSize: '2.3 MB',
      lastExport: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isSelected: true
    },
    {
      id: 'shifts',
      name: 'Pracovní směny',
      description: 'Historie a plánované směny',
      icon: <Calendar className="h-4 w-4" />,
      dataSize: '856 KB',
      lastExport: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isSelected: true
    },
    {
      id: 'vehicles',
      name: 'Vozidla a náklady',
      description: 'Informace o vozidlech a jízdách',
      icon: <Car className="h-4 w-4" />,
      dataSize: '1.2 MB',
      lastExport: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isSelected: false
    },
    {
      id: 'finances',
      name: 'Finanční data',
      description: 'Příjmy, výdaje a kalkulace',
      icon: <DollarSign className="h-4 w-4" />,
      dataSize: '673 KB',
      isSelected: false
    },
    {
      id: 'analytics',
      name: 'Analytická data',
      description: 'Statistiky pokroku a výkonu',
      icon: <Database className="h-4 w-4" />,
      dataSize: '3.1 MB',
      isSelected: true
    },
    {
      id: 'settings',
      name: 'Nastavení aplikace',
      description: 'Personální preference a konfigurace',
      icon: <Settings className="h-4 w-4" />,
      dataSize: '45 KB',
      lastExport: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isSelected: true
    }
  ]);

  const [selectedFormat, setSelectedFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportFormats: ExportFormat[] = [
    {
      id: 'json',
      name: 'JSON',
      extension: '.json',
      description: 'Univerzální formát pro většinu aplikací',
      features: ['Kompletní data', 'Snadno čitelné', 'Podporuje všechny funkce']
    },
    {
      id: 'csv',
      name: 'CSV',
      extension: '.csv',
      description: 'Tabulkový formát pro Excel a podobné aplikace',
      features: ['Tabulkový formát', 'Excel kompatibilní', 'Omezené možnosti']
    },
    {
      id: 'xml',
      name: 'XML',
      extension: '.xml',
      description: 'Strukturovaný formát pro pokročilé použití',
      features: ['Strukturované data', 'Metadata podpora', 'Validace schématu']
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      extension: '.pdf',
      description: 'Formátovaný report pro tisk a sdílení',
      features: ['Formátovaný výstup', 'Tisknutelný', 'Jen pro čtení']
    }
  ];

  const toggleOption = (optionId: string) => {
    setExportOptions(prev =>
      prev.map(option =>
        option.id === optionId
          ? { ...option, isSelected: !option.isSelected }
          : option
      )
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const selectedOptions = exportOptions.filter(opt => opt.isSelected);
    const totalSteps = selectedOptions.length;
    
    for (let i = 0; i < totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExportProgress(((i + 1) / totalSteps) * 100);
    }

    // Create and download file
    const exportData = {
      exportDate: new Date().toISOString(),
      format: selectedFormat,
      data: selectedOptions.reduce((acc, option) => {
        acc[option.id] = `Mock data for ${option.name}`;
        return acc;
      }, {} as Record<string, any>)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pendler-export-${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportProgress(0);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv,.xml';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsImporting(false);
      console.log('Import completed:', file.name);
    };
    input.click();
  };

  const selectedCount = exportOptions.filter(opt => opt.isSelected).length;
  const totalSize = exportOptions
    .filter(opt => opt.isSelected)
    .reduce((total, opt) => {
      const size = parseFloat(opt.dataSize.replace(/[^\d.]/g, ''));
      const unit = opt.dataSize.includes('MB') ? 1024 : 1;
      return total + (size * unit);
    }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          Export & Import dat
        </h2>
        <p className="text-muted-foreground">
          Zálohujte svá data nebo je přeneste do jiné aplikace
        </p>
      </div>

      <Tabs defaultValue="export" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">Export dat</TabsTrigger>
          <TabsTrigger value="import">Import dat</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4">
          {/* Export Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Souhrn exportu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{selectedCount}</div>
                  <div className="text-sm text-muted-foreground">Vybrané kategorie</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize.toFixed(0)} KB`}
                  </div>
                  <div className="text-sm text-muted-foreground">Velikost dat</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{selectedFormat.toUpperCase()}</div>
                  <div className="text-sm text-muted-foreground">Formát</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vyberte data k exportu</CardTitle>
              <CardDescription>
                Označte kategorie dat, které chcete exportovat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exportOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={option.id}
                      checked={option.isSelected}
                      onCheckedChange={() => toggleOption(option.id)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      {option.icon}
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="font-medium">
                          {option.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{option.dataSize}</div>
                        {option.lastExport && (
                          <div className="text-xs text-muted-foreground">
                            Naposledy: {option.lastExport.toLocaleDateString('cs-CZ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vyberte formát</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exportFormats.map((format) => (
                    <div key={format.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value={format.id} id={format.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={format.id} className="font-medium">
                          {format.name} <span className="text-muted-foreground">({format.extension})</span>
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {format.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Export Progress */}
          {isExporting && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exportuji data...</span>
                    <span>{Math.round(exportProgress)}%</span>
                  </div>
                  <Progress value={exportProgress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Button */}
          <Button 
            onClick={handleExport} 
            disabled={selectedCount === 0 || isExporting}
            className="w-full"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exportuji...' : 'Exportovat data'}
          </Button>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          {/* Import Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import dat
              </CardTitle>
              <CardDescription>
                Importujte data z jiné instance aplikace nebo ze zálohy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Vyberte soubor k importu</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Podporované formáty: JSON, CSV, XML
                </p>
                <Button onClick={handleImport} disabled={isImporting}>
                  {isImporting ? 'Importuji...' : 'Vybrat soubor'}
                </Button>
              </div>

              {/* Import Warnings */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Upozornění</h4>
                    <p className="text-sm text-yellow-700">
                      Import dat přepíše stávající data ve vybraných kategoriích. 
                      Doporučujeme před importem vytvořit zálohu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Tip</h4>
                    <p className="text-sm text-blue-700">
                      Pro nejlepší kompatibilitu používejte JSON formát exportovaný z této aplikace.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historie importů</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">pendler-backup-2024-01-15.json</div>
                    <div className="text-sm text-muted-foreground">
                      Importováno 15. ledna 2024, 14:30
                    </div>
                  </div>
                  <Badge variant="secondary">Úspěšný</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">vocabulary-export.csv</div>
                    <div className="text-sm text-muted-foreground">
                      Importováno 10. ledna 2024, 09:15
                    </div>
                  </div>
                  <Badge variant="secondary">Úspěšný</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataExportImport;
