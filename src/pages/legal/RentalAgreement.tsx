
import { Helmet } from "react-helmet";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { RentalHeader } from "@/components/legal/rental/RentalHeader";
import { ContractDetails } from "@/components/legal/rental/ContractDetails";
import { RentalTypes } from "@/components/legal/rental/RentalTypes";
import { RightsAndDuties } from "@/components/legal/rental/RightsAndDuties";
import { PendlerSpecifics } from "@/components/legal/rental/PendlerSpecifics";
import { RentalFooter } from "@/components/legal/rental/RentalFooter";

const RentalAgreement = () => {
  return (
    <PremiumCheck featureKey="legal-assistant">
      <div className="flex flex-col">
        <Helmet>
          <title>Nájemní smlouva | Právní asistent</title>
        </Helmet>
        
        <RentalHeader />
        
        {/* Main content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <ContractDetails />
            <RentalTypes />
            <RightsAndDuties />
            <PendlerSpecifics />
            <RentalFooter />
          </div>
        </section>
      </div>
    </PremiumCheck>
  );
};

export default RentalAgreement;
