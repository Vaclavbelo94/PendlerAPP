
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Calculator, 
  Car, 
  Calendar, 
  BookOpen, 
  Home, 
  Settings, 
  User, 
  Shield, 
  Crown,
  Plane,
  Languages,
  Scale,
  FileText
} from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  category: string;
}

const searchItems: SearchItem[] = [
  // Hlavní stránky
  { id: 'home', title: 'Domů', description: 'Hlavní stránka aplikace', path: '/', icon: Home, category: 'Navigace' },
  { id: 'dashboard', title: 'Dashboard', description: 'Přehled aktivit a statistik', path: '/dashboard', icon: Home, category: 'Navigace' },
  { id: 'profile', title: 'Profil', description: 'Správa osobních údajů a nastavení', path: '/profile', icon: User, category: 'Navigace' },
  { id: 'settings', title: 'Nastavení', description: 'Konfigurace aplikace', path: '/settings', icon: Settings, category: 'Navigace' },
  
  // Kalkulačky
  { id: 'calculator', title: 'Kalkulačky', description: 'Matematické a daňové kalkulačky', path: '/calculator', icon: Calculator, category: 'Nástroje' },
  { id: 'tax-advisor', title: 'Daňový poradce', description: 'Pomoc s daněmi a dokumenty', path: '/tax-advisor', icon: FileText, category: 'Nástroje' },
  
  // Vozidla a cestování
  { id: 'vehicle', title: 'Vozidla', description: 'Správa vozidel a dokumentů', path: '/vehicle', icon: Car, category: 'Vozidla' },
  { id: 'travel-planning', title: 'Plánování cest', description: 'Optimalizace tras a sdílení jízd', path: '/travel-planning', icon: Plane, category: 'Vozidla' },
  
  // Směny a práce
  { id: 'shifts', title: 'Směny', description: 'Kalendář směn a reporty', path: '/shifts', icon: Calendar, category: 'Práce' },
  
  // Vzdělávání
  { id: 'vocabulary', title: 'Slovník', description: 'Učení německých slov a frází', path: '/vocabulary', icon: BookOpen, category: 'Vzdělávání' },
  { id: 'translator', title: 'Překladač', description: 'Překlad textů a frází', path: '/translator', icon: Languages, category: 'Vzdělávání' },
  { id: 'laws', title: 'Právní informace', description: 'Německé zákony a předpisy', path: '/laws', icon: Scale, category: 'Vzdělávání' },
  
  // Premium a admin
  { id: 'premium', title: 'Premium', description: 'Prémiové funkce aplikace', path: '/premium', icon: Crown, category: 'Premium' },
  { id: 'admin', title: 'Administrace', description: 'Správa aplikace', path: '/admin', icon: Shield, category: 'Admin' },
];

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch = ({ open, onOpenChange }: GlobalSearchProps) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    if (!search) return searchItems;
    
    const query = search.toLowerCase();
    return searchItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [search]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const handleSelect = useCallback((path: string) => {
    navigate(path);
    onOpenChange(false);
    setSearch('');
  }, [navigate, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl">
        <Command>
          <CommandInput 
            placeholder="Hledat stránky, nástroje..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Nenalezeny žádné výsledky.</CommandEmpty>
            {Object.entries(groupedItems).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleSelect(item.path)}
                      className="flex items-center gap-3 p-3"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
