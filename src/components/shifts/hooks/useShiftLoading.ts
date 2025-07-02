
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { loadUserShifts } from "../services/shiftService";
import { Shift } from "@/types/shifts";

export const useShiftLoading = (user: any) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized load function to prevent infinite loops
  const loadShifts = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Loading shifts for user:", user.id);
      const formattedShifts = await loadUserShifts(user.id);
      console.log("Loaded shifts:", formattedShifts.length);
      
      // Ensure all shifts have the required properties
      const typedShifts: Shift[] = formattedShifts.map(shift => ({
        id: shift.id,
        user_id: shift.userId || shift.user_id || user.id,
        date: shift.date,
        type: shift.type,
        start_time: shift.start_time || '08:00', // Default time if missing
        end_time: shift.end_time || '16:00', // Default time if missing
        notes: shift.notes,
        created_at: shift.created_at,
        updated_at: shift.updated_at,
      }));
      
      setShifts(typedShifts);
      
      // Also save to localStorage as backup
      localStorage.setItem("shifts", JSON.stringify(typedShifts));
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
          const parsedShifts = JSON.parse(savedShifts);
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
  }, [user?.id]);

  // Load shifts from Supabase when user is available
  useEffect(() => {
    if (user?.id) {
      loadShifts();
    }
  }, [loadShifts]);

  return {
    shifts,
    setShifts,
    isLoading
  };
};
