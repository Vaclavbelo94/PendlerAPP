
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RedemptionRateCardProps {
  redeemed: number;
  created: number;
}

export const RedemptionRateCard = ({ redeemed, created }: RedemptionRateCardProps) => {
  const redemptionRate = created > 0 ? Math.round((redeemed / created) * 100) : 0;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">Míra uplatnění</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold">{redemptionRate}%</h3>
            <span className="text-sm text-muted-foreground">z kódů</span>
          </div>
          <Progress value={redemptionRate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground pt-1">
            <span>{redeemed} uplatněno</span>
            <span>{created} vytvořeno</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
