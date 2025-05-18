
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoFieldsProps {
  documentType: string;
  yearOfTax: string;
  name: string;
  dateOfBirth?: string;
  taxId: string;
  address: string;
  email: string;
  onUpdateField: (field: string, value: string) => void;
  documentTypes: Array<{ value: string; label: string }>;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  documentType,
  yearOfTax,
  name,
  dateOfBirth,
  taxId,
  address,
  email,
  onUpdateField,
  documentTypes,
}) => {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Základní informace</h3>
        <p className="text-sm text-muted-foreground">
          Vyplňte své osobní údaje pro generování dokumentu
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-type">Typ dokumentu *</Label>
          <Select 
            value={documentType}
            onValueChange={(value) => onUpdateField("documentType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte typ dokumentu" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(docType => (
                <SelectItem key={docType.value} value={docType.value}>
                  {docType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year-of-tax">Zdanitelné období *</Label>
          <Input
            id="year-of-tax"
            type="number"
            value={yearOfTax}
            onChange={(e) => onUpdateField("yearOfTax", e.target.value)}
            min="2000"
            max={new Date().getFullYear()}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Jméno a příjmení *</Label>
          <Input
            id="name"
            placeholder="Jan Novák"
            value={name}
            onChange={(e) => onUpdateField("name", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date-of-birth">Datum narození</Label>
          <Input
            id="date-of-birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => onUpdateField("dateOfBirth", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tax-id">Daňové identifikační číslo (Steuer-ID) *</Label>
          <Input
            id="tax-id"
            placeholder="12345678912"
            value={taxId}
            onChange={(e) => onUpdateField("taxId", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresa trvalého bydliště *</Label>
          <Textarea
            id="address"
            placeholder="Ulice, číslo, PSČ, město"
            value={address}
            onChange={(e) => onUpdateField("address", e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="jan.novak@email.cz"
            value={email}
            onChange={(e) => onUpdateField("email", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoFields;
