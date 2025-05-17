
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale } from "lucide-react";

export const RightsAndDuties = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Práva a povinnosti nájemce</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-green-700">
              <Scale className="h-5 w-5 mr-2" />
              Práva nájemce
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Právo na klidné užívání pronajatého prostoru</li>
              <li>Právo na včasné řešení závad ze strany pronajímatele</li>
              <li>Právo na ochranu před bezdůvodným zvyšováním nájemného</li>
              <li>Právo na vrácení kauce při řádném ukončení nájmu</li>
              <li>Právo na každoroční vyúčtování služeb</li>
              <li>Právo na ochranu před neoprávněnou výpovědí</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center text-red-700">
              <FileText className="h-5 w-5 mr-2" />
              Povinnosti nájemce
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Včasné placení nájemného a záloh na služby</li>
              <li>Užívání prostoru v souladu se smlouvou</li>
              <li>Dodržování domovního řádu</li>
              <li>Hlášení závad pronajímateli</li>
              <li>Umožnění přístupu pronajímateli v odůvodněných případech</li>
              <li>Drobné opravy a údržba (podle smlouvy)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
