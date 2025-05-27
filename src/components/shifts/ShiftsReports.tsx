
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar } from 'lucide-react';
import { Shift } from '@/hooks/useShiftsManagement';

interface ShiftsReportsProps {
  shifts: Shift[];
}

const ShiftsReports: React.FC<ShiftsReportsProps> = ({ shifts }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exporty a reporty</CardTitle>
          <CardDescription>
            Stáhněte si přehledy svých směn v různých formátech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Měsíční report PDF</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Detailní přehled směn za vybraný měsíc včetně statistik
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Stáhnout PDF
              </Button>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Excel export</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Export všech směn do Excel souboru pro další zpracování
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Stáhnout Excel
              </Button>
            </div>
          </div>

          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Funkce exportů bude k dispozici brzy</p>
            <p className="text-sm">Nyní máte {shifts.length} směn k exportu</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftsReports;
