
export const translations = {
  cs: {
    shifts: {
      title: 'Směny',
      subtitle: 'Plánujte a sledujte své pracovní směny efektivně',
      calendar: 'Kalendář',
      analytics: 'Analýzy',
      reports: 'Reporty',
      addShift: 'Přidat směnu',
      editShift: 'Upravit směnu',
      deleteShift: 'Smazat směnu',
      saveShift: 'Uložit směnu',
      updateShift: 'Aktualizovat směnu',
      shiftType: 'Typ směny',
      shiftNotes: 'Poznámka ke směně',
      selectDate: 'Vyberte datum pro přidání nebo úpravu směny',
      noShift: 'Žádná směna naplánována',
      types: {
        morning: '🌅 Ranní (6:00 - 14:00)',
        afternoon: '☀️ Odpolední (14:00 - 22:00)',
        night: '🌙 Noční (22:00 - 6:00)'
      },
      notifications: {
        saved: 'Směna byla úspěšně uložena',
        updated: 'Směna byla úspěšně aktualizována',
        deleted: 'Směna byla úspěšně odstraněna',
        error: 'Došlo k chybě při zpracování směny',
        syncComplete: 'Synchronizace dokončena',
        conflictsResolved: 'konflikty vyřešeny'
      }
    }
  },
  en: {
    shifts: {
      title: 'Shifts',
      subtitle: 'Plan and track your work shifts efficiently',
      calendar: 'Calendar',
      analytics: 'Analytics',
      reports: 'Reports',
      addShift: 'Add Shift',
      editShift: 'Edit Shift',
      deleteShift: 'Delete Shift',
      saveShift: 'Save Shift',
      updateShift: 'Update Shift',
      shiftType: 'Shift Type',
      shiftNotes: 'Shift Notes',
      selectDate: 'Select a date to add or edit a shift',
      noShift: 'No shift scheduled',
      types: {
        morning: '🌅 Morning (6:00 - 14:00)',
        afternoon: '☀️ Afternoon (14:00 - 22:00)',
        night: '🌙 Night (22:00 - 6:00)'
      },
      notifications: {
        saved: 'Shift saved successfully',
        updated: 'Shift updated successfully',
        deleted: 'Shift deleted successfully',
        error: 'Error processing shift',
        syncComplete: 'Synchronization complete',
        conflictsResolved: 'conflicts resolved'
      }
    }
  },
  de: {
    shifts: {
      title: 'Schichten',
      subtitle: 'Planen und verfolgen Sie Ihre Arbeitsschichten effizient',
      calendar: 'Kalender',
      analytics: 'Analysen',
      reports: 'Berichte',
      addShift: 'Schicht hinzufügen',
      editShift: 'Schicht bearbeiten',
      deleteShift: 'Schicht löschen',
      saveShift: 'Schicht speichern',
      updateShift: 'Schicht aktualisieren',
      shiftType: 'Schichttyp',
      shiftNotes: 'Schichtnotizen',
      selectDate: 'Wählen Sie ein Datum zum Hinzufügen oder Bearbeiten einer Schicht',
      noShift: 'Keine Schicht geplant',
      types: {
        morning: '🌅 Morgen (6:00 - 14:00)',
        afternoon: '☀️ Nachmittag (14:00 - 22:00)',
        night: '🌙 Nacht (22:00 - 6:00)'
      },
      notifications: {
        saved: 'Schicht erfolgreich gespeichert',
        updated: 'Schicht erfolgreich aktualisiert',
        deleted: 'Schicht erfolgreich gelöscht',
        error: 'Fehler beim Verarbeiten der Schicht',
        syncComplete: 'Synchronisation abgeschlossen',
        conflictsResolved: 'Konflikte gelöst'
      }
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.cs.shifts;
