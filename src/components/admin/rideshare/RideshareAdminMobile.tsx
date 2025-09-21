import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Car, 
  Users, 
  MessageSquare, 
  Search, 
  Trash2, 
  Eye, 
  Calendar,
  MapPin,
  Euro,
  Phone,
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useRideshareAdminLogic } from '@/hooks/useRideshareAdminLogic';

export const RideshareAdminMobile: React.FC = () => {
  const {
    offers,
    contacts,
    statistics,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOffers,
    filteredContacts,
    handleToggleOfferStatus,
    handleDeleteOffer,
    handleUpdateContactStatus,
    selectedOffer,
    setSelectedOffer
  } = useRideshareAdminLogic();

  const [activeTab, setActiveTab] = useState('statistics');
  const [showFilters, setShowFilters] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-2/3 mb-4"></div>
          <div className="grid gap-4 grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Správa spolujízd</h1>
        <p className="text-sm text-muted-foreground">
          Spravujte rideshare nabídky
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="statistics" className="text-xs">Přehled</TabsTrigger>
          <TabsTrigger value="offers" className="text-xs">Nabídky</TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs">Kontakty</TabsTrigger>
        </TabsList>

        <TabsContent value="statistics" className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid gap-4 grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Nabídky
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{statistics?.totalOffers || 0}</div>
                <div className="text-xs text-green-600">{statistics?.activeOffers || 0} aktivních</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Kontakty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{statistics?.totalContacts || 0}</div>
                <div className="text-xs text-yellow-600">{statistics?.pendingContacts || 0} čekajících</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat nabídky..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {showFilters && (
              <div className="space-y-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Stav" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všechny</SelectItem>
                    <SelectItem value="active">Aktivní</SelectItem>
                    <SelectItem value="inactive">Neaktivní</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Offers List */}
          <div className="space-y-3">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{offer.driver.username}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {offer.rating || 0} ({offer.completed_rides || 0})
                      </div>
                    </div>
                    <Badge variant={offer.is_active ? "default" : "secondary"} className="text-xs">
                      {offer.is_active ? "Aktivní" : "Neaktivní"}
                    </Badge>
                  </div>

                  {/* Route */}
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate">{offer.origin_address}</div>
                        <div className="text-xs text-muted-foreground truncate">→ {offer.destination_address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {offer.departure_date} {offer.departure_time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      {offer.price_per_person} {offer.currency}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedOffer(offer)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="mx-4">
                        <DialogHeader>
                          <DialogTitle>Detail nabídky</DialogTitle>
                        </DialogHeader>
                        {selectedOffer && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Řidič</h4>
                              <div className="space-y-1 text-sm">
                                <div>{selectedOffer.driver.username}</div>
                                {selectedOffer.driver.phone_number && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {selectedOffer.driver.phone_number}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Trasa</h4>
                              <div className="space-y-1 text-sm">
                                <div><strong>Z:</strong> {selectedOffer.origin_address}</div>
                                <div><strong>Do:</strong> {selectedOffer.destination_address}</div>
                                <div><strong>Kdy:</strong> {selectedOffer.departure_date} v {selectedOffer.departure_time}</div>
                                <div><strong>Cena:</strong> {selectedOffer.price_per_person} {selectedOffer.currency}</div>
                              </div>
                            </div>
                            {selectedOffer.notes && (
                              <div>
                                <h4 className="font-medium mb-2">Poznámky</h4>
                                <p className="text-sm text-muted-foreground">{selectedOffer.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={offer.is_active}
                        onCheckedChange={() => handleToggleOfferStatus(offer.id, offer.is_active)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Hledat kontakty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Contacts List */}
          <div className="space-y-3">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{contact.profiles?.username || 'Neznámý'}</div>
                      <div className="text-xs text-muted-foreground truncate">{contact.requester_email}</div>
                    </div>
                    <Badge variant={
                      contact.status === 'accepted' ? 'default' :
                      contact.status === 'rejected' ? 'destructive' :
                      'secondary'
                    } className="text-xs">
                      {contact.status === 'accepted' ? 'Schváleno' :
                       contact.status === 'rejected' ? 'Zamítnuto' :
                       'Čekající'}
                    </Badge>
                  </div>

                  {/* Route */}
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate">{contact.rideshare_offers?.origin_address}</div>
                        <div className="text-xs text-muted-foreground truncate">→ {contact.rideshare_offers?.destination_address}</div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="text-xs text-muted-foreground">
                    <div className="truncate">{contact.message}</div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t">
                    <Select
                      value={contact.status}
                      onValueChange={(value) => handleUpdateContactStatus(contact.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Čekající</SelectItem>
                        <SelectItem value="accepted">Schváleno</SelectItem>
                        <SelectItem value="rejected">Zamítnuto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};