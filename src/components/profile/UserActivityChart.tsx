
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateActivityData } from "@/utils/chartData";
import { useTranslation } from 'react-i18next';

const UserActivityChart = () => {
  const [timeRange, setTimeRange] = useState("14");
  const { t } = useTranslation('profile');
  const data = generateActivityData(parseInt(timeRange));
  
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{t('userActivity')}</CardTitle>
          <CardDescription>
            {t('userActivity')} za posledních {timeRange} {t('days')}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t('period')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 {t('days')}</SelectItem>
            <SelectItem value="14">14 {t('days')}</SelectItem>
            <SelectItem value="30">30 {t('days')}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="date" tickFormatter={formatXAxis} />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => `${t('date')}: ${new Date(value).toLocaleDateString("cs-CZ")}`}
              />
              <Legend />
              <Bar dataKey="activities" fill="#8884d8" name={t('activitiesTotal')} />
              <Bar dataKey="lessons" fill="#82ca9d" name={t('lessons')} />
              <Bar dataKey="translations" fill="#ffc658" name={t('translations')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
