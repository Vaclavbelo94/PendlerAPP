
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateActivityData } from "@/utils/chartData";

const UserActivityChart = () => {
  const [timeRange, setTimeRange] = useState("14");
  const data = generateActivityData(parseInt(timeRange));
  
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Vaše aktivita</CardTitle>
          <CardDescription>
            Přehled vašich aktivit za posledních {timeRange} dní
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Období" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 dní</SelectItem>
            <SelectItem value="14">14 dní</SelectItem>
            <SelectItem value="30">30 dní</SelectItem>
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
                labelFormatter={(value) => `Datum: ${new Date(value).toLocaleDateString("cs-CZ")}`}
              />
              <Legend />
              <Bar dataKey="activities" fill="#8884d8" name="Aktivity celkem" />
              <Bar dataKey="lessons" fill="#82ca9d" name="Lekce" />
              <Bar dataKey="translations" fill="#ffc658" name="Překlady" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
