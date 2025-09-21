import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Car, 
  Users, 
  MessageSquare, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  ToggleLeft,
  ToggleRight,
  Calendar,
  MapPin,
  Euro,
  Phone,
  Star
} from 'lucide-react';
import { useRideshareAdminLogic } from '@/hooks/useRideshareAdminLogic';

export const RideshareAdminPanel: React.FC = () => {
  const {
    offers,
    contacts,
    statistics,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    routeFilter,
    setRouteFilter,
    filteredOffers,
    filteredContacts,
    handleToggleOfferStatus,
    handleDeleteOffer,
    handleUpdateContactStatus,
    selectedOffer,
    setSelectedOffer
  } = useRideshareAdminLogic();

  const [activeTab, setActiveTab] = useState('statistics');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Správa spolujízd</h1>
        <p className="text-muted-foreground">
          Spravujte všechny rideshare nabídky a kontaktní žádosti
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="statistics">Přehled</TabsTrigger>
          <TabsTrigger value="offers">Nabídky ({statistics?.totalOffers || 0})</TabsTrigger>
          <TabsTrigger value="contacts">Kontakty ({statistics?.totalContacts || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="statistics" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Celkem nabídek</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalOffers || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktivní nabídky</CardTitle>
                <ToggleRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{statistics?.activeOffers || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Celkem kontaktů</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalContacts || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Čekající kontakty</CardTitle>
                <Users className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{statistics?.pendingContacts || 0}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vyhledávání</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Hledat podle trasy nebo řidiče..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stav</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Všechny stavy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Všechny stavy</SelectItem>
                      <SelectItem value="active">Aktivní</SelectItem>
                      <SelectItem value="inactive">Neaktivní</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trasa</label>
                  <Input
                    placeholder="Filtrovat podle trasy..."
                    value={routeFilter}
                    onChange={(e) => setRouteFilter(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Rideshare nabídky</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Řidič</TableHead>
                    <TableHead>Trasa</TableHead>
                    <TableHead>Datum & Čas</TableHead>
                    <TableHead>Místa</TableHead>
                    <TableHead>Cena</TableHead>
                    <TableHead>Stav</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Akce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{offer.driver.username}</div>
                          {offer.driver.phone_number && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {offer.driver.phone_number}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {offer.origin_address}
                          </div>
                          <div className="text-xs text-muted-foreground">→ {offer.destination_address}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {offer.departure_date}
                          </div>
                          <div className="text-sm text-muted-foreground">{offer.departure_time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{offer.seats_available} míst</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Euro className="h-3 w-3" />
                          {offer.price_per_person} {offer.currency}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={offer.is_active ? "default" : "secondary"}>
                          {offer.is_active ? "Aktivní" : "Neaktivní"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{offer.rating || 0}</span>
                          <span className="text-xs text-muted-foreground">({offer.completed_rides || 0})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedOffer(offer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detail nabídky</DialogTitle>
                              </DialogHeader>
                              {selectedOffer && (
                                <div className="space-y-4">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                      <h4 className="font-medium mb-2">Informace o řidiči</h4>
                                      <div className="space-y-1 text-sm">
                                        <div>{selectedOffer.driver.username}</div>
                                        {selectedOffer.driver.phone_number && (
                                          <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {selectedOffer.driver.phone_number}
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                          {selectedOffer.rating || 0} ({selectedOffer.completed_rides || 0} jízd)
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">Detaily cesty</h4>
                                      <div className="space-y-1 text-sm">
                                        <div><strong>Odkud:</strong> {selectedOffer.origin_address}</div>
                                        <div><strong>Kam:</strong> {selectedOffer.destination_address}</div>
                                        <div><strong>Datum:</strong> {selectedOffer.departure_date}</div>
                                        <div><strong>Čas:</strong> {selectedOffer.departure_time}</div>
                                        <div><strong>Cena:</strong> {selectedOffer.price_per_person} {selectedOffer.currency}</div>
                                      </div>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          {/* Contacts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Kontaktní žádosti</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Žadatel</TableHead>
                    <TableHead>Trasa</TableHead>
                    <TableHead>Zpráva</TableHead>
                    <TableHead>Stav</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Akce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{contact.profiles?.username || 'Neznámý'}</div>
                          <div className="text-xs text-muted-foreground">{contact.requester_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{contact.rideshare_offers?.origin_address}</div>
                          <div className="text-xs text-muted-foreground">→ {contact.rideshare_offers?.destination_address}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{contact.message}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          contact.status === 'accepted' ? 'default' :
                          contact.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {contact.status === 'accepted' ? 'Schváleno' :
                           contact.status === 'rejected' ? 'Zamítnuto' :
                           'Čekající'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(contact.created_at).toLocaleDateString('cs-CZ')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={contact.status}
                            onValueChange={(value) => handleUpdateContactStatus(contact.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Čekající</SelectItem>
                              <SelectItem value="accepted">Schváleno</SelectItem>
                              <SelectItem value="rejected">Zamítnuto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};