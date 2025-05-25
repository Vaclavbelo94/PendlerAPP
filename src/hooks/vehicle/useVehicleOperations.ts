
import { VehicleData } from '@/types/vehicle';
import { saveVehicle } from '@/services/vehicle/vehicleCore';
import { toast } from 'sonner';

export const useVehicleOperations = (
  user: any,
  setVehicles: (vehicles: VehicleData[]) => void,
  setVehicleData: (data: VehicleData) => void,
  setSelectedVehicleId: (id: string) => void
) => {
  const handleSaveVehicle = async (vehicle: VehicleData) => {
    try {
      if (!user) {
        toast.error("Pro uložení vozidla je nutné být přihlášen");
        return;
      }
      
      console.log("Saving vehicle with operations hook");
      const updatedVehicle = await saveVehicle({
        ...vehicle,
        user_id: user.id
      });
      
      if (updatedVehicle) {
        // Pokud je to úprava existujícího vozidla
        if (vehicle.id) {
          setVehicleData(updatedVehicle);
          setVehicles(prev => prev.map(v => v.id === vehicle.id ? updatedVehicle : v));
        } 
        // Pokud je to nové vozidlo
        else {
          setVehicles(prev => [...prev, updatedVehicle]);
          setSelectedVehicleId(updatedVehicle.id!);
          setVehicleData(updatedVehicle);
        }
        return updatedVehicle;
      }
    } catch (error) {
      console.error("Chyba při ukládání vozidla:", error);
      toast.error("Nepodařilo se uložit vozidlo");
    }
  };

  return {
    handleSaveVehicle
  };
};
