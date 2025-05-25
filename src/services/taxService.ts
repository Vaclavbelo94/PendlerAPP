
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
      .insert({
        ...calculation,
        inputs: calculation.inputs as any,
        results: calculation.results as any
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      inputs: data.inputs as Record<string, any>,
      results: data.results as Record<string, any>
    } as TaxCalculation;
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
    
    return data?.map(item => ({
      ...item,
      inputs: item.inputs as Record<string, any>,
      results: item.results as Record<string, any>
    })) as TaxCalculation[] || [];
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
      .insert({
        ...document,
        document_data: document.document_data as any
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      document_data: data.document_data as unknown as DocumentData
    } as TaxDocument;
  }

  async getTaxDocuments(userId: string) {
    const { data, error } = await supabase
      .from('tax_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(item => ({
      ...item,
      document_data: item.document_data as unknown as DocumentData
    })) as TaxDocument[] || [];
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
      .upsert({
        ...draft,
        form_data: draft.form_data as any
      }, { onConflict: 'user_id,form_type' })
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      form_data: data.form_data as Record<string, any>
    } as TaxFormDraft;
  }

  async getFormDraft(userId: string, formType: string) {
    const { data, error } = await supabase
      .from('tax_form_drafts')
      .select('*')
      .eq('user_id', userId)
      .eq('form_type', formType)
      .maybeSingle();
    
    if (error) throw error;
    return data ? {
      ...data,
      form_data: data.form_data as Record<string, any>
    } as TaxFormDraft : null;
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
