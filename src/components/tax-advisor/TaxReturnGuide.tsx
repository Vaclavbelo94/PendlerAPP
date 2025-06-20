
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Wallet, ArrowRight, Check } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLanguage } from "@/hooks/useLanguage";

const TaxReturnGuide = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useLanguage();
  
  const steps = [
    {
      title: t('taxReturnGuide.steps.prepareDocuments.title'),
      content: t('taxReturnGuide.steps.prepareDocuments.content')
    },
    {
      title: t('taxReturnGuide.steps.createElsterAccount.title'),
      content: t('taxReturnGuide.steps.createElsterAccount.content')
    },
    {
      title: t('taxReturnGuide.steps.fillForms.title'),
      content: t('taxReturnGuide.steps.fillForms.content')
    },
    {
      title: t('taxReturnGuide.steps.submitReturn.title'),
      content: t('taxReturnGuide.steps.submitReturn.content')
    },
    {
      title: t('taxReturnGuide.steps.checkDecision.title'),
      content: t('taxReturnGuide.steps.checkDecision.content')
    }
  ];
  
  const deadlines = [
    {
      title: t('taxReturnGuide.deadlines.standard.title'),
      date: t('taxReturnGuide.deadlines.standard.date'),
      description: t('taxReturnGuide.deadlines.standard.description')
    },
    {
      title: t('taxReturnGuide.deadlines.extended.title'),
      date: t('taxReturnGuide.deadlines.extended.date'),
      description: t('taxReturnGuide.deadlines.extended.description')
    },
    {
      title: t('taxReturnGuide.deadlines.late.title'),
      fee: t('taxReturnGuide.deadlines.late.fee'),
      description: t('taxReturnGuide.deadlines.late.description')
    }
  ];
  
  const documents = [
    {
      title: "Lohnsteuerbescheinigung",
      description: t('taxReturnGuide.documents.lohnsteuerbescheinigung')
    },
    {
      title: "Pendlerpauschale",
      description: t('taxReturnGuide.documents.pendlerpauschale')
    },
    {
      title: "Werbungskosten",
      description: t('taxReturnGuide.documents.werbungskosten')
    },
    {
      title: "Sonderausgaben",
      description: t('taxReturnGuide.documents.sonderausgaben')
    },
    {
      title: "Außergewöhnliche Belastungen",
      description: t('taxReturnGuide.documents.aussergewoehnlicheBelastungen')
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">{t('taxReturnGuide.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2 text-xs md:text-sm">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">{t('overview')}</span>
                <span className="sm:hidden">{t('overview')}</span>
              </TabsTrigger>
              <TabsTrigger value="deadlines" className="flex items-center gap-2 text-xs md:text-sm">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">{t('deadlines')}</span>
                <span className="sm:hidden">{t('deadlines')}</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2 text-xs md:text-sm">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">{t('documents')}</span>
                <span className="sm:hidden">{t('documents')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4 space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('taxReturnGuide.overviewTitle')}</h3>
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 rounded-full bg-primary/20 p-2 mt-1">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{t('taxReturnGuide.needHelp')}</h3>
                    <p className="text-sm text-muted-foreground">{t('taxReturnGuide.needHelpDescription')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("documents")}>
                      {t('taxReturnGuide.requiredDocuments')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deadlines" className="pt-4 space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('taxReturnGuide.importantDeadlines')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {deadlines.map((deadline, index) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4 space-y-2">
                        <h4 className="font-medium">{deadline.title}</h4>
                        {deadline.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm">{deadline.date}</span>
                          </div>
                        )}
                        {deadline.fee && (
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{deadline.fee}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">{deadline.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">{t('warning')}:</span> {t('taxReturnGuide.deadlineWarning')}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="pt-4 space-y-4">
              <h3 className="text-lg font-medium">{t('taxReturnGuide.requiredDocuments')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 rounded-md border">
                    <Check className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm">{doc.title}</h4>
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <AspectRatio ratio={16/9}>
                  <div className="w-full h-full bg-muted/50 flex items-center justify-center rounded-md border border-dashed">
                    <div className="text-center p-4">
                      <FileText className="h-10 w-10 text-muted-foreground/70 mx-auto mb-2" />
                      <h3 className="text-sm font-medium">{t('taxReturnGuide.documentExamples')}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('taxReturnGuide.documentExamplesDescription')}
                      </p>
                      <Button variant="outline" size="sm" className="mt-3" disabled>
                        {t('showExamples')}
                      </Button>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReturnGuide;
