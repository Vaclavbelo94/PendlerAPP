import React, { useState, useEffect } from "react";
import { TaxCalculatorFormProps, FormData } from "./types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const formSchema = z.object({
  country: z.string().min(1, { message: "Vyberte zemi" }),
  income: z.string().min(1, { message: "Zadejte výši příjmu" }),
  taxClass: z.string().optional(),
  children: z.string().default("0"),
  married: z.boolean().default(false),
  church: z.boolean().default(false),
  commuteDistance: z.string().optional(),
  workDays: z.string().optional(),
  housingCosts: z.string().optional(),
  workEquipment: z.string().optional(),
  insurance: z.string().optional(),
  otherExpenses: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const TaxCalculatorForm = ({ onCalculate, onCountryChange, displayCurrency }: TaxCalculatorFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "de",
      income: "0",
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
    }
  });

  const watchCountry = form.watch("country");

  // Trigger the country change effect
  useEffect(() => {
    onCountryChange(watchCountry);
  }, [watchCountry, onCountryChange]);

  function onSubmit(values: FormValues) {
    // Ensure we have all required fields for FormData type
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
      otherExpenses: values.otherExpenses
    };
    
    onCalculate(formData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Základní údaje</TabsTrigger>
            <TabsTrigger value="deductions">Odpočty</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Země</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        onCountryChange(value);
                      }} 
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
                      <Input type="number" min="0" step="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchCountry === "de" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="taxClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daňová třída</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vyberte daňovou třídu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Třída 1 - Svobodní</SelectItem>
                          <SelectItem value="2">Třída 2 - Samoživitelé</SelectItem>
                          <SelectItem value="3">Třída 3 - Manželé (vyšší příjem)</SelectItem>
                          <SelectItem value="4">Třída 4 - Manželé (podobný příjem)</SelectItem>
                          <SelectItem value="5">Třída 5 - Manželé (nižší příjem)</SelectItem>
                          <SelectItem value="6">Třída 6 - Vedlejší příjem</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Daňová třída ovlivní výši srážek z příjmu.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Počet dětí</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="married"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Ženatý/vdaná</FormLabel>
                            <FormDescription className="text-xs">
                              Ovlivňuje daňový výpočet a příspěvky.
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

                    <FormField
                      control={form.control}
                      name="church"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Církevní daň</FormLabel>
                            <FormDescription className="text-xs">
                              Platíte církevní daň?
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
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deductions" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="commuteDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vzdálenost dojíždění (km)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Jedna cesta z domu do práce.
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
                    <FormLabel>Počet pracovních dní</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="365" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Za rok (obvykle 220-250 dní).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Collapsible
              open={isAdvancedOpen}
              onOpenChange={setIsAdvancedOpen}
              className="space-y-4"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full flex items-center justify-between"
                >
                  <span>Další odpočty</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isAdvancedOpen ? "transform rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="housingCosts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Náklady na bydlení ({displayCurrency})</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Nájem v Německu (ročně).
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
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Nářadí, pracovní oděv, počítač atd.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="insurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pojištění ({displayCurrency})</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Soukromé pojištění odpovědnosti atd.
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
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Vzdělávání, příspěvky atd.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
        </Tabs>

        <div className="pt-2">
          <Button type="submit" className="w-full sm:w-auto">
            Vypočítat
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaxCalculatorForm;
