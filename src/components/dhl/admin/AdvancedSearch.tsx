import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, X, Calendar, Clock, MapPin, User, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SearchFilters {
  dateFrom?: Date;
  dateTo?: Date;
  positions: string[];
  workGroups: string[];
  shiftTypes: string[];
  conflictsOnly: boolean;
  noAssignmentOnly: boolean;
  textSearch: string;
  employeeIds: string[];
}

interface SearchResult {
  id: string;
  type: 'shift' | 'employee' | 'position' | 'schedule';
  title: string;
  description: string;
  metadata: any;
  date?: string;
  relevanceScore: number;
}

interface AdvancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onResultSelect }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    positions: [],
    workGroups: [],
    shiftTypes: [],
    conflictsOnly: false,
    noAssignmentOnly: false,
    textSearch: '',
    employeeIds: []
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availablePositions, setAvailablePositions] = useState<any[]>([]);
  const [availableWorkGroups, setAvailableWorkGroups] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetadata();
    loadRecentSearches();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [positionsData, workGroupsData] = await Promise.all([
        supabase.from('dhl_positions').select('id, name, position_type').eq('is_active', true),
        supabase.from('dhl_work_groups').select('id, name').eq('is_active', true)
      ]);

      if (positionsData.data) setAvailablePositions(positionsData.data);
      if (workGroupsData.data) setAvailableWorkGroups(workGroupsData.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const loadRecentSearches = () => {
    const saved = localStorage.getItem('dhl-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  };

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('dhl-recent-searches', JSON.stringify(updated));
  };

  const performSearch = async () => {
    if (!filters.textSearch.trim() && Object.values(filters).every(v => 
      Array.isArray(v) ? v.length === 0 : !v
    )) {
      toast({
        title: "Prázdný dotaz",
        description: "Zadejte alespoň jeden vyhledávací kritérium",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    saveRecentSearch(filters.textSearch);

    try {
      const searchResults: SearchResult[] = [];

      // Search shifts
      let shiftsQuery = supabase
        .from('shifts')
        .select(`
          id,
          date,
          start_time,
          end_time,
          type,
          notes,
          user_id,
          dhl_positions (
            name
          )
        `);

      if (filters.dateFrom) {
        shiftsQuery = shiftsQuery.gte('date', filters.dateFrom.toISOString().split('T')[0]);
      }
      if (filters.dateTo) {
        shiftsQuery = shiftsQuery.lte('date', filters.dateTo.toISOString().split('T')[0]);
      }
      if (filters.shiftTypes.length > 0) {
        shiftsQuery = shiftsQuery.in('type', filters.shiftTypes);
      }

      const { data: shifts } = await shiftsQuery;

      if (shifts) {
        shifts.forEach(shift => {
          const relevance = calculateRelevance(shift, filters.textSearch);
          if (relevance > 0) {
            searchResults.push({
              id: shift.id,
              type: 'shift',
              title: `Směna ${shift.type} - ${shift.date}`,
              description: `${shift.start_time} - ${shift.end_time} | User ID: ${shift.user_id}`,
              metadata: shift,
              date: shift.date,
              relevanceScore: relevance
            });
          }
        });
      }

      // Search employees
      let employeesQuery = supabase
        .from('profiles')
        .select(`
          id,
          username,
          email,
          is_dhl_employee,
          user_dhl_assignments (
            dhl_positions (
              name
            ),
            dhl_work_groups (
              name
            )
          )
        `)
        .eq('is_dhl_employee', true);

      const { data: employees } = await employeesQuery;

      if (employees) {
        employees.forEach(employee => {
          const relevance = calculateRelevance(employee, filters.textSearch);
          if (relevance > 0) {
            const assignment = Array.isArray(employee.user_dhl_assignments) 
              ? employee.user_dhl_assignments[0] 
              : employee.user_dhl_assignments;
              
            searchResults.push({
              id: employee.id,
              type: 'employee',
              title: employee.username || employee.email || 'Nepojmenovaný uživatel',
              description: `${assignment?.dhl_positions?.name || 'Bez pozice'} | ${assignment?.dhl_work_groups?.name || 'Bez skupiny'}`,
              metadata: employee,
              relevanceScore: relevance
            });
          }
        });
      }

      // Search positions
      if (filters.textSearch) {
        const { data: positions } = await supabase
          .from('dhl_positions')
          .select('*')
          .ilike('name', `%${filters.textSearch}%`)
          .eq('is_active', true);

        if (positions) {
          positions.forEach(position => {
            searchResults.push({
              id: position.id,
              type: 'position',
              title: position.name,
              description: `Typ: ${position.position_type} | ${position.description || 'Bez popisu'}`,
              metadata: position,
              relevanceScore: 3
            });
          });
        }
      }

      // Sort by relevance
      searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
      setResults(searchResults);

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Chyba vyhledávání",
        description: "Nepodařilo se provést vyhledávání",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateRelevance = (item: any, searchTerm: string): number => {
    if (!searchTerm) return 1;
    
    const term = searchTerm.toLowerCase();
    let score = 0;

    // Check various fields for matches
    const fields = [
      item.username, item.email, item.name, item.type, 
      item.notes, item.description
    ].filter(Boolean);

    fields.forEach(field => {
      if (typeof field === 'string') {
        const fieldLower = field.toLowerCase();
        if (fieldLower.includes(term)) {
          score += fieldLower.indexOf(term) === 0 ? 3 : 1; // Higher score for prefix matches
        }
      }
    });

    return score;
  };

  const clearFilters = () => {
    setFilters({
      positions: [],
      workGroups: [],
      shiftTypes: [],
      conflictsOnly: false,
      noAssignmentOnly: false,
      textSearch: '',
      employeeIds: []
    });
    setResults([]);
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    
    toast({
      title: "Výsledek vybrán",
      description: `Vybrán: ${result.title}`,
    });
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'shift':
        return <Clock className="h-4 w-4" />;
      case 'employee':
        return <User className="h-4 w-4" />;
      case 'position':
        return <MapPin className="h-4 w-4" />;
      case 'schedule':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'shift':
        return 'Směna';
      case 'employee':
        return 'Zaměstnanec';
      case 'position':
        return 'Pozice';
      case 'schedule':
        return 'Rozvrh';
      default:
        return 'Ostatní';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pokročilé vyhledávání
          </CardTitle>
          <CardDescription>
            Vyhledávejte ve směnách, zaměstnancích, pozicích a rozvrzích
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hledat ve všech záznamech..."
                value={filters.textSearch}
                onChange={(e) => setFilters(prev => ({ ...prev, textSearch: e.target.value }))}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              />
            </div>
            <Button onClick={performSearch} disabled={loading}>
              {loading ? 'Hledám...' : 'Hledat'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtry
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <Label className="text-sm text-muted-foreground">Nedávná vyhledávání:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, textSearch: search }))}
                    className="h-auto p-1 px-2 text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          {showAdvanced && (
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Pokročilé filtry</h4>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Vymazat vše
                  </Button>
                </div>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Date Range */}
                  <div>
                    <Label>Datum od</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateFrom: e.target.value ? new Date(e.target.value) : undefined 
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label>Datum do</Label>
                    <Input
                      type="date"
                      value={filters.dateTo?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateTo: e.target.value ? new Date(e.target.value) : undefined 
                      }))}
                    />
                  </div>

                  {/* Position Filter */}
                  <div>
                    <Label>Pozice</Label>
                    <Select
                      value={filters.positions[0] || ''}
                      onValueChange={(value) => 
                        setFilters(prev => ({ 
                          ...prev, 
                          positions: value ? [value] : [] 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte pozici" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Všechny pozice</SelectItem>
                        {availablePositions.map(pos => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Work Group Filter */}
                  <div>
                    <Label>Pracovní skupina</Label>
                    <Select
                      value={filters.workGroups[0] || ''}
                      onValueChange={(value) => 
                        setFilters(prev => ({ 
                          ...prev, 
                          workGroups: value ? [value] : [] 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte skupinu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Všechny skupiny</SelectItem>
                        {availableWorkGroups.map(group => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Shift Type Filter */}
                  <div>
                    <Label>Typ směny</Label>
                    <Select
                      value={filters.shiftTypes[0] || ''}
                      onValueChange={(value) => 
                        setFilters(prev => ({ 
                          ...prev, 
                          shiftTypes: value ? [value] : [] 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Všechny typy</SelectItem>
                        <SelectItem value="ranní">Ranní</SelectItem>
                        <SelectItem value="odpolední">Odpolední</SelectItem>
                        <SelectItem value="noční">Noční</SelectItem>
                        <SelectItem value="víkendová">Víkendová</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="conflicts-only"
                      checked={filters.conflictsOnly}
                      onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, conflictsOnly: !!checked }))
                      }
                    />
                    <Label htmlFor="conflicts-only" className="text-sm">
                      Pouze konflikty
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-assignment"
                      checked={filters.noAssignmentOnly}
                      onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, noAssignmentOnly: !!checked }))
                      }
                    />
                    <Label htmlFor="no-assignment" className="text-sm">
                      Bez přiřazení
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Výsledky vyhledávání ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2 mt-1">
                        {getResultIcon(result.type)}
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{result.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.description}
                        </p>
                        {result.date && (
                          <p className="text-xs text-muted-foreground mt-2">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(result.date).toLocaleDateString('cs-CZ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Relevance: {result.relevanceScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && filters.textSearch && !loading && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenalezeny žádné výsledky pro "{filters.textSearch}"</p>
            <p className="text-sm mt-2">Zkuste upravit vyhledávací kritéria nebo použít jiná klíčová slova</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;