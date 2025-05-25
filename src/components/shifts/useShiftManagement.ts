import { useState, useEffect } from "react";
import { Shift, ShiftType } from "./types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useShiftManagement = (user: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [shiftNotes, setShiftNotes] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [analyticsPeriod, setAnalyticsPeriod] = useState<import("./types").AnalyticsPeriod>("month");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load shifts from Supabase when user is available
  useEffect(() => {
    const loadShifts = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;

        const formattedShifts = data?.map(shift => ({
          id: shift.id,
          date: new Date(shift.date),
          type: shift.type as ShiftType,
          notes: shift.notes || "",
          userId: shift.user_id
        })) || [];

        setShifts(formattedShifts);
        
        // Also save to localStorage as backup
        localStorage.setItem("shifts", JSON.stringify(formattedShifts));
      } catch (error) {
        console.error("Error loading shifts:", error);
        // Fallback to localStorage if Supabase fails
        try {
          const savedShifts = localStorage.getItem("shifts");
          if (savedShifts) {
            const parsedShifts = JSON.parse(savedShifts).map((shift: any) => ({
              ...shift,
              date: new Date(shift.date)
            }));
            setShifts(parsedShifts);
          }
        } catch (e) {
          console.error("Error loading shifts from localStorage:", e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadShifts();
    }
  }, [user]);

  // Find current shift for the selected date
  const getCurrentShift = () => {
    if (!selectedDate) return null;
    
    return shifts.find(
      (shift) => new Date(shift.date).toDateString() === selectedDate.toDateString()
    );
  };
  
  const currentShift = getCurrentShift();
  
  // Set shiftType and notes when currentShift changes
  useEffect(() => {
    if (currentShift) {
      setShiftType(currentShift.type);
      setShiftNotes(currentShift.notes || "");
    } else {
      setShiftType("morning");
      setShiftNotes("");
    }
  }, [currentShift]);
  
  // Helper function to format date correctly for database
  const formatDateForDB = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Handle saving shift
  const handleSaveShift = async () => {
    if (!selectedDate || !user) {
      toast({
        title: "Chyba",
        description: "Pro uložení směny musíte být přihlášeni a vybrat datum.",
        variant: "destructive"
      });
      return;
    }
    
    const formattedDate = formatDateForDB(selectedDate);
    console.log("Saving shift for date:", formattedDate, "from selected date:", selectedDate);
    
    const shiftData = {
      date: formattedDate,
      type: shiftType,
      notes: shiftNotes.trim(),
      user_id: user.id
    };
    
    try {
      // First, check for existing shifts for this date and user
      const { data: existingShifts, error: checkError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', formattedDate);
        
      if (checkError) throw checkError;
      
      // If there are multiple shifts for the same date, delete all but keep the first one
      if (existingShifts && existingShifts.length > 1) {
        console.log(`Found ${existingShifts.length} duplicate shifts, cleaning up...`);
        
        // Keep the first shift, delete the rest
        const shiftsToDelete = existingShifts.slice(1);
        for (const shift of shiftsToDelete) {
          await supabase
            .from('shifts')
            .delete()
            .eq('id', shift.id)
            .eq('user_id', user.id);
        }
      }
      
      let savedShift;
      
      if (existingShifts && existingShifts.length > 0) {
        // Update the existing shift (using the first one after cleanup)
        const shiftToUpdate = existingShifts[0];
        const { data, error } = await supabase
          .from('shifts')
          .update({
            type: shiftType,
            notes: shiftNotes.trim()
          })
          .eq('id', shiftToUpdate.id)
          .eq('user_id', user.id)
          .select()
          .maybeSingle();
          
        if (error) throw error;
        savedShift = data;
        
        toast({
          title: "Směna aktualizována",
          description: `Směna byla úspěšně upravena.`,
        });
      } else {
        // Create new shift
        const { data, error } = await supabase
          .from('shifts')
          .insert(shiftData)
          .select()
          .maybeSingle();
          
        if (error) throw error;
        savedShift = data;
        
        toast({
          title: "Směna přidána",
          description: `Nová směna byla úspěšně přidána.`,
        });
      }
      
      // Reload all shifts to ensure consistency
      const { data: allShifts, error: reloadError } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (reloadError) throw reloadError;
      
      const formattedShifts = allShifts?.map(shift => ({
        id: shift.id,
        date: new Date(shift.date),
        type: shift.type as ShiftType,
        notes: shift.notes || "",
        userId: shift.user_id
      })) || [];
      
      setShifts(formattedShifts);
      
      // Update localStorage backup
      localStorage.setItem("shifts", JSON.stringify(formattedShifts));
      
    } catch (error) {
      console.error("Error saving shift:", error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit směnu. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    }
  };
  
  // Handle deleting shift
  const handleDeleteShift = async () => {
    if (!currentShift || !user) return;
    
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', currentShift.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      const updatedShifts = shifts.filter((shift) => shift.id !== currentShift.id);
      setShifts(updatedShifts);
      
      // Update localStorage backup
      localStorage.setItem("shifts", JSON.stringify(updatedShifts));
      
      // Reset form
      setShiftType("morning");
      setShiftNotes("");
      
      toast({
        title: "Směna odstraněna",
        description: `Směna byla úspěšně odstraněna.`,
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error deleting shift:", error);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se odstranit směnu. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    }
  };
  
  // Handle saving notes from dialog
  const handleSaveNotes = async (notes: string) => {
    setShiftNotes(notes);
    setNoteDialogOpen(false);
    
    // If there is a current shift, update it immediately
    if (currentShift) {
      await handleSaveShift();
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    shifts,
    setShifts,
    shiftType,
    setShiftType,
    shiftNotes,
    setShiftNotes,
    selectedMonth,
    setSelectedMonth,
    analyticsPeriod,
    setAnalyticsPeriod,
    noteDialogOpen,
    setNoteDialogOpen,
    exportDialogOpen,
    setExportDialogOpen,
    currentShift,
    handleSaveShift,
    handleDeleteShift,
    handleSaveNotes,
    isLoading
  };
};
