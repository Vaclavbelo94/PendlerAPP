import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserProfileData } from '@/utils/tax';
import { TaxCalculatorFormProps, FormData } from './types';

const formSchema = z.object({
  country: z.string().min(1, "Zadejte zemi"),
  income: z.string().min(1, "Zadejte výši příjmu"),
  taxClass: z.string().optional(),
  children: z.string().default("0"),
  married: z.boolean().default(false),
  church: z.boolean().default(false),
  commuteDistance: z.string().optional(),
  workDays: z.string().optional(),
  housingCosts: z.string().optional(),
  workEquipment: z.string().optional(),
  insurance: z.string().optional(),
  otherExpenses: z.string().optional(),
});

const TaxCalculatorForm: React.FC<TaxCalculatorFormProps> = ({ 
  onCalculate,
  onCountryChange, 
  displayCurrency 
}) => {
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "de",
      income: "50000",
      taxClass: "1",
      children: "0",
      married: false,
      church: false,
      commuteDistance: "",
      workDays: "220",
      housingCosts: "",
      workEquipment: "",
      insurance: "",
      otherExpenses: "",
    },
  });

  const watchCountry = form.watch("country");

  // Notify parent component when country changes
  useEffect(() => {
    onCountryChange(watchCountry);
  }, [watchCountry, onCountryChange]);

  // Load user profile data if available
  useEffect(() => {
    if (user) {
      const loadUserProfile = async () => {
        try {
          const profileData = await fetchUserProfileData(user.id);
          
          if (profileData && profileData.commuteDistance) {
            form.setValue("commuteDistance", profileData.commuteDistance);
          }
        } catch (error) {
          console.error("Error loading profile data:", error);
        }
      };
      
      loadUserProfile();
    }
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Ensure all required properties for FormData are present
    const formData: FormData = {
      country: values.country,
      income: values.income,
      taxClass: values.taxClass,
      children: values.children,
      married: values.married,
      church: values.church,
      commuteDistance: values.commuteDistance,
      workDays: values.workDays,
      housingCosts: values.housingCosts,
      workEquipment: values.workEquipment,
      insurance: values.insurance,
      otherExpenses: values.otherExpenses,
    };
    
    onCalculate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Základní údaje */}
        <div>
          <h3 className="text-lg font-medium mb-4">Základní údaje</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Země</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte zemi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="de">Německo</SelectItem>
                      <SelectItem value="cz">Česká republika</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roční hrubý příjem ({displayCurrency})</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchCountry === "de" && (
              <FormField
                control={form.control}
                name="taxClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daňová třída</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte třídu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Třída I</SelectItem>
                        <SelectItem value="2">Třída II</SelectItem>
                        <SelectItem value="3">Třída III</SelectItem>
                        <SelectItem value="4">Třída IV</SelectItem>
                        <SelectItem value="5">Třída V</SelectItem>
                        <SelectItem value="6">Třída VI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="children"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Počet dětí</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="married"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Ženatý/vdaná</FormLabel>
                    <FormDescription>
                      Zohlednit manželský stav
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {watchCountry === "de" && (
              <FormField
                control={form.control}
                name="church"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Církevní daň</FormLabel>
                      <FormDescription>
                        Platíte církevní daň
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Odpočitatelné položky */}
        <div>
          <h3 className="text-lg font-medium mb-4">Odpočitatelné položky</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="commuteDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vzdálenost dojíždění (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Jednosměrná vzdálenost do práce
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="workDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Počet pracovních dnů v roce</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="housingCosts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Náklady na bydlení ({displayCurrency})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Např. druhé bydlení v Německu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="workEquipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pracovní vybavení ({displayCurrency})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Oděv, nástroje, vybavení
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="insurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pojištění ({displayCurrency})</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Soukromé zdravotní, životní pojištění
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="otherExpenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ostatní výdaje ({displayCurrency})</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Další odpočitatelné položky
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button type="submit" size="lg" className="gap-2">
            <Calculator className="h-5 w-5" />
            Vypočítat daňovou optimalizaci
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaxCalculatorForm;
