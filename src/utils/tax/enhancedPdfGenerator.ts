
import { jsPDF } from 'jspdf';
import { DocumentData } from './types';
import { getDocumentTitle } from './documentUtils';
import { generateTaxDocument, downloadTaxDocument } from './pdfGenerator';

// Pro zpětnou kompatibilitu - přesměrování na hlavní generátor
export const generateEnhancedTaxDocument = async (data: DocumentData): Promise<jsPDF> => {
  return generateTaxDocument(data);
};

export const downloadEnhancedTaxDocument = async (data: DocumentData): Promise<void> => {
  return downloadTaxDocument(data);
};
