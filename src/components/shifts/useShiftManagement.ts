
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
    
    const shiftData = {
      date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      type: shiftType,
      notes: shiftNotes.trim(),
      user_id: user.id
    };
    
    try {
      let savedShift;
      
      if (currentShift) {
        // Update existing shift
        const { data, error } = await supabase
          .from('shifts')
          .update({
            type: shiftType,
            notes: shiftNotes.trim()
          })
          .eq('id', currentShift.id)
          .eq('user_id', user.id)
          .select()
          .single();
          
        if (error) throw error;
        savedShift = data;
        
        toast({
          title: "Směna aktualizována",
          description: `Směna byla úspěšně upravena.`,
        });
      } else {
        // Check if shift already exists for this date
        const { data: existingShift, error: checkError } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', shiftData.date)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        if (existingShift) {
          // Update existing shift instead of creating new one
          const { data, error } = await supabase
            .from('shifts')
            .update({
              type: shiftType,
              notes: shiftNotes.trim()
            })
            .eq('id', existingShift.id)
            .eq('user_id', user.id)
            .select()
            .single();
            
          if (error) throw error;
          savedShift = data;
          
          toast({
            title: "Směna aktualizována",
            description: `Směna byla úspěšně upravena.`,
          });
        } else {
          // Add new shift
          const { data, error } = await supabase
            .from('shifts')
            .insert(shiftData)
            .select()
            .single();
            
          if (error) throw error;
          savedShift = data;
          
          toast({
            title: "Směna přidána",
            description: `Nová směna byla úspěšně přidána.`,
          });
        }
      }
      
      // Update local state - reload all shifts to ensure consistency
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
