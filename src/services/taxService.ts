
import { supabase } from '@/integrations/supabase/client';
import { DocumentData } from '@/utils/tax/types';

export interface TaxCalculation {
  id?: string;
  user_id: string;
  calculation_type: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface TaxDocument {
  id?: string;
  user_id: string;
  document_type: string;
  document_data: DocumentData;
  file_name?: string;
  created_at?: string;
}

export interface TaxFormDraft {
  id?: string;
  user_id: string;
  form_type: string;
  form_data: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

class TaxService {
  // Tax calculations
  async saveTaxCalculation(calculation: Omit<TaxCalculation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tax_calculations')
      .insert(calculation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTaxCalculations(userId: string, calculationType?: string) {
    let query = supabase
      .from('tax_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (calculationType) {
      query = query.eq('calculation_type', calculationType);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async deleteTaxCalculation(id: string) {
    const { error } = await supabase
      .from('tax_calculations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Tax documents
  async saveTaxDocument(document: Omit<TaxDocument, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('tax_documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTaxDocuments(userId: string) {
    const { data, error } = await supabase
      .from('tax_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async deleteTaxDocument(id: string) {
    const { error } = await supabase
      .from('tax_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Form drafts
  async saveFormDraft(draft: Omit<TaxFormDraft, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tax_form_drafts')
      .upsert(draft, { onConflict: 'user_id,form_type' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getFormDraft(userId: string, formType: string) {
    const { data, error } = await supabase
      .from('tax_form_drafts')
      .select('*')
      .eq('user_id', userId)
      .eq('form_type', formType)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  async deleteFormDraft(userId: string, formType: string) {
    const { error } = await supabase
      .from('tax_form_drafts')
      .delete()
      .eq('user_id', userId)
      .eq('form_type', formType);
    
    if (error) throw error;
  }
}

export const taxService = new TaxService();
