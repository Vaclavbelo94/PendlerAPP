
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { loadUserShifts } from "../services/shiftService";
import { Shift } from "../types";

export const useShiftLoading = (user: any) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load shifts from Supabase when user is available
  useEffect(() => {
    const loadShifts = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        console.log("Loading shifts for user:", user.id);
        const formattedShifts = await loadUserShifts(user.id);
        console.log("Loaded shifts:", formattedShifts.length);
        setShifts(formattedShifts);
        
        // Also save to localStorage as backup
        localStorage.setItem("shifts", JSON.stringify(formattedShifts));
      } catch (error) {
        console.error("Error loading shifts:", error);
        toast({
          title: "Chyba při načítání",
          description: "Nepodařilo se načíst směny. Zkusíme obnovit data z místní zálohy.",
          variant: "destructive"
        });
        
        // Fallback to localStorage if Supabase fails
        try {
          const savedShifts = localStorage.getItem("shifts");
          if (savedShifts) {
            const parsedShifts = JSON.parse(savedShifts).map((shift: any) => ({
              ...shift,
              date: new Date(shift.date)
            }));
            setShifts(parsedShifts);
            toast({
              title: "Data obnovena",
              description: "Směny byly načteny z místní zálohy.",
            });
          }
        } catch (e) {
          console.error("Error loading shifts from localStorage:", e);
          toast({
            title: "Chyba",
            description: "Nepodařilo se načíst žádná data směn.",
            variant: "destructive"
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadShifts();
    }
  }, [user]);

  return {
    shifts,
    setShifts,
    isLoading
  };
};
