
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Volume2, Filter, Languages } from "lucide-react";
import { germanPhrases, phraseCategories, GermanPhrase } from "@/data/germanPhrases";

type LanguageFilter = 'all' | 'cz' | 'pl' | 'de';

const Language = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all');

  // Mock audio play function
  const playAudio = (phrase: GermanPhrase) => {
    console.log(`Playing audio for: ${phrase.de}`);
    // TODO: Implement real audio playback
    alert(`Playing: "${phrase.de}"`);
  };

  const filteredPhrases = useMemo(() => {
    return germanPhrases.filter(phrase => {
      // Category filter
      if (selectedCategory !== 'all' && phrase.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          phrase.cz.toLowerCase().includes(searchLower) ||
          phrase.pl.toLowerCase().includes(searchLower) ||
          phrase.de.toLowerCase().includes(searchLower) ||
          phrase.category.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [searchTerm, selectedCategory]);

  const getDisplayLanguages = (phrase: GermanPhrase) => {
    switch (languageFilter) {
      case 'cz':
        return [
          { label: 'Čeština', text: phrase.cz, flag: '🇨🇿' },
          { label: 'Němčina', text: phrase.de, flag: '🇩🇪' }
        ];
      case 'pl':
        return [
          { label: 'Polski', text: phrase.pl, flag: '🇵🇱' },
          { label: 'Deutsch', text: phrase.de, flag: '🇩🇪' }
        ];
      case 'de':
        return [
          { label: 'Deutsch', text: phrase.de, flag: '🇩🇪' }
        ];
      default:
        return [
          { label: 'Čeština', text: phrase.cz, flag: '🇨🇿' },
          { label: 'Polski', text: phrase.pl, flag: '🇵🇱' },
          { label: 'Deutsch', text: phrase.de, flag: '🇩🇪' }
        ];
    }
  };

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Languages className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Německý jazyk</h1>
        </div>
        <p className="text-muted-foreground">
          Užitečné německé fráze pro českou a polskou obsluhu v třídících centrech
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Hledat fráze..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category and Language filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Vyberte kategorii" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všechny kategorie</SelectItem>
                    {phraseCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={languageFilter} onValueChange={(value: LanguageFilter) => setLanguageFilter(value)}>
                  <SelectTrigger>
                    <Languages className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Jazykový filtr" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🌍 Všechny jazyky</SelectItem>
                    <SelectItem value="cz">🇨🇿 Čeština → Němčina</SelectItem>
                    <SelectItem value="pl">🇵🇱 Polski → Deutsch</SelectItem>
                    <SelectItem value="de">🇩🇪 Pouze němčina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Zobrazeno {filteredPhrases.length} z {germanPhrases.length} frází
        </p>
      </div>

      {/* Phrases list */}
      <div className="space-y-4">
        {filteredPhrases.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Žádné fráze nenalezeny</h3>
                <p className="text-muted-foreground">
                  Zkuste upravit vyhledávací kritéria nebo filtry
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPhrases.map(phrase => (
            <Card key={phrase.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{phrase.category}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playAudio(phrase)}
                    className="flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    Přehrát
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getDisplayLanguages(phrase).map((lang, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground min-w-[80px]">
                        {lang.flag} {lang.label}:
                      </span>
                      <span className="text-lg font-medium">{lang.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Language;
