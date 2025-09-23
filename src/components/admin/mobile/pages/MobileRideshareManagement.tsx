import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Eye, Power, Trash2, Calendar, Users, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRideshareAdminLogic } from '@/hooks/useRideshareAdminLogic';
import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const MobileRideshareManagement: React.FC = () => {
  const {
    filteredOffers,
    filteredContacts,
    statistics,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    routeFilter,
    setRouteFilter,
    handleToggleOfferStatus,
    handleDeleteOffer,
    handleUpdateContactStatus,
    refreshData
  } = useRideshareAdminLogic();

  const [viewMode, setViewMode] = useState<'offers' | 'contacts'>('offers');

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Aktivní' : 'Neaktivní'}
    </Badge>
  );

  const getContactStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      accepted: 'default',
      rejected: 'destructive'
    } as const;

    const labels = {
      pending: 'Čekající',
      accepted: 'Přijato',
      rejected: 'Odmítnuto'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-20 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Správa nabídek spolujízd</h1>
            <p className="text-sm text-muted-foreground">
              Spravujte nabídky a kontakty spolujízd
            </p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{statistics?.totalOffers || 0}</p>
                <p className="text-xs text-muted-foreground">Celkem nabídek</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{statistics?.activeOffers || 0}</p>
                <p className="text-xs text-muted-foreground">Aktivní nabídky</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'offers' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('offers')}
          className="flex-1"
        >
          Nabídky ({filteredOffers.length})
        </Button>
        <Button
          variant={viewMode === 'contacts' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('contacts')}
          className="flex-1"
        >
          Kontakty ({filteredContacts.length})
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <Input
          placeholder="Hledat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {viewMode === 'offers' && (
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny</SelectItem>
                <SelectItem value="active">Aktivní</SelectItem>
                <SelectItem value="inactive">Neaktivní</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Trasa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny trasy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Content */}
      {viewMode === 'offers' ? (
        <div className="space-y-3">
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {offer.origin_address} → {offer.destination_address}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(offer.departure_time).toLocaleDateString('cs-CZ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(offer.departure_time).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{offer.seats_available} míst</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(offer.is_active)}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {offer.driver?.username || 'Neznámý uživatel'}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleOfferStatus(offer.id, offer.is_active)}
                      >
                        <Power className="h-3 w-3" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Smazat nabídku?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tato akce nelze vrátit zpět. Nabídka bude trvale smazána.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Zrušit</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteOffer(offer.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Smazat
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {contact.rideshare_offers?.origin_address} → {contact.rideshare_offers?.destination_address}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Kontakt od: {contact.requester_email || 'Neznámý uživatel'}
                      </div>
                    </div>
                    {getContactStatusBadge(contact.status)}
                  </div>

                  {contact.message && (
                    <>
                      <Separator className="my-3" />
                      <div className="text-sm">
                        <span className="font-medium">Zpráva:</span>
                        <p className="text-muted-foreground mt-1">{contact.message}</p>
                      </div>
                    </>
                  )}

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(contact.created_at), { 
                        addSuffix: true, 
                        locale: cs 
                      })}
                    </div>
                    
                    {contact.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateContactStatus(contact.id, 'accepted')}
                        >
                          Přijmout
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateContactStatus(contact.id, 'rejected')}
                        >
                          Odmítnout
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((viewMode === 'offers' && filteredOffers.length === 0) || 
        (viewMode === 'contacts' && filteredContacts.length === 0)) && (
        <div className="text-center py-8">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {viewMode === 'offers' ? 'Žádné nabídky' : 'Žádné kontakty'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {viewMode === 'offers' 
              ? 'Zatím nejsou k dispozici žádné nabídky spolujízd.'
              : 'Zatím nejsou k dispozici žádné kontakty.'
            }
          </p>
        </div>
      )}
    </div>
  );
};