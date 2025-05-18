
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { TestResult, SkillsData } from '@/models/VocabularyItem';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SkillsRadarChartProps {
  testHistory: TestResult[];
  className?: string;
}

const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ testHistory, className }) => {
  const [compareMode, setCompareMode] = React.useState<'progress' | 'latest'>('latest');
  
  // Get the latest test with skills data
  const latestTestWithSkills = testHistory
    .filter(test => test.skillsData)
    .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())[0];
    
  // Get an older test for comparison (if available and in progress mode)
  const olderTestWithSkills = compareMode === 'progress' && testHistory
    .filter(test => test.skillsData && test !== latestTestWithSkills)
    .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())[0];
    
  // Default skills data if none available
  const defaultSkillsData: SkillsData = {
    reading: 0,
    writing: 0,
    speaking: 0,
    listening: 0,
    grammar: 0
  };
  
  // Current skills data
  const currentSkills = latestTestWithSkills?.skillsData || defaultSkillsData;
  
  // Previous skills data (for comparison)
  const previousSkills = olderTestWithSkills?.skillsData || defaultSkillsData;
  
  // Format data for radar chart
  const radarData = [
    { skill: 'Čtení', current: currentSkills.reading, previous: previousSkills.reading },
    { skill: 'Psaní', current: currentSkills.writing, previous: previousSkills.writing },
    { skill: 'Mluvení', current: currentSkills.speaking, previous: previousSkills.speaking },
    { skill: 'Poslech', current: currentSkills.listening, previous: previousSkills.listening },
    { skill: 'Gramatika', current: currentSkills.grammar, previous: previousSkills.grammar }
  ];
  
  // Calculate overall score
  const calculateOverallScore = (skills: SkillsData) => {
    return Math.round(
      (skills.reading + skills.writing + skills.speaking + skills.listening + skills.grammar) / 5
    );
  };
  
  const currentScore = calculateOverallScore(currentSkills);
  const previousScore = calculateOverallScore(previousSkills);
  const scoreDifference = currentScore - previousScore;

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Analýza dovedností</CardTitle>
            {scoreDifference > 0 && compareMode === 'progress' && (
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                +{scoreDifference}%
              </Badge>
            )}
          </div>
          {testHistory.filter(test => test.skillsData).length > 1 && (
            <Select value={compareMode} onValueChange={(value: 'progress' | 'latest') => setCompareMode(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Zobrazení" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Aktuální</SelectItem>
                <SelectItem value="progress">Pokrok</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <CardDescription>
          {compareMode === 'progress' 
            ? 'Srovnání vašich jazykových dovedností'
            : 'Vaše aktuální jazykové dovednosti'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {testHistory.filter(test => test.skillsData).length > 0 ? (
          <div className="w-full h-[250px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Aktuální"
                  dataKey="current"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                {compareMode === 'progress' && olderTestWithSkills && (
                  <Radar
                    name="Předchozí"
                    dataKey="previous"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.3}
                  />
                )}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <p className="text-muted-foreground mb-2">Zatím nemáte žádná data o dovednostech</p>
            <p className="text-sm text-muted-foreground">
              Dokončete několik testů pro zobrazení vaší analýzy dovedností
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsRadarChart;
