import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation('about');
  
  return (
    <div className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Info className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('mission.title')}</h2>
              <p className="mb-4">
                {t('mission.text1')}
              </p>
              <p>
                {t('mission.text2')}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('history.title')}</h2>
              <p className="mb-4">
                {t('history.text1')}
              </p>
              <p>
                {t('history.text2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{t('team.title')}</h2>
              <p className="mb-4">
                {t('team.text1')}
              </p>
              <p>
                {t('team.text2')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
