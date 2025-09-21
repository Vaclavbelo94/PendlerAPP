import { useState, useEffect, useMemo } from 'react';
import { rideshareService, RideshareOfferWithDriver } from '@/services/rideshareService';
import { toast } from 'sonner';

interface RideshareContact {
  id: string;
  offer_id: string;
  requester_user_id: string;
  requester_email: string;
  message: string;
  status: string;
  created_at: string;
  rideshare_offers: {
    origin_address: string;
    destination_address: string;
    departure_date: string;
    departure_time: string;
    seats_available: number;
    price_per_person: number;
    currency: string;
    user_id: string;
  };
  profiles?: {
    username: string;
  } | null;
}

interface RideshareStatistics {
  totalOffers: number;
  activeOffers: number;
  totalContacts: number;
  pendingContacts: number;
}

export const useRideshareAdminLogic = () => {
  const [offers, setOffers] = useState<RideshareOfferWithDriver[]>([]);
  const [contacts, setContacts] = useState<RideshareContact[]>([]);
  const [statistics, setStatistics] = useState<RideshareStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<RideshareOfferWithDriver | null>(null);

  // Load data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [offersData, contactsData, statsData] = await Promise.all([
        rideshareService.getAllRideshareOffers(),
        rideshareService.getAllRideshareContacts(),
        rideshareService.getRideshareStatistics()
      ]);

      setOffers(offersData);
      setContacts(contactsData as any);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error loading rideshare admin data:', error);
      toast.error('Chyba při načítání dat');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesSearch = searchTerm === '' || 
        offer.driver.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.origin_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.destination_address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && offer.is_active) ||
        (statusFilter === 'inactive' && !offer.is_active);

      const matchesRoute = routeFilter === '' ||
        offer.origin_address.toLowerCase().includes(routeFilter.toLowerCase()) ||
        offer.destination_address.toLowerCase().includes(routeFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesRoute;
    });
  }, [offers, searchTerm, statusFilter, routeFilter]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = searchTerm === '' || 
        contact.profiles?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.rideshare_offers?.origin_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.rideshare_offers?.destination_address.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [contacts, searchTerm]);

  // Handle offer status toggle
  const handleToggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      await rideshareService.adminUpdateOfferStatus(offerId, !currentStatus);
      await loadData(); // Reload data
      toast.success(currentStatus ? 'Nabídka deaktivována' : 'Nabídka aktivována');
    } catch (error) {
      console.error('Error toggling offer status:', error);
      toast.error('Chyba při změně stavu nabídky');
    }
  };

  // Handle offer deletion
  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Opravdu chcete smazat tuto nabídku?')) {
      return;
    }

    try {
      await rideshareService.adminDeleteOffer(offerId);
      await loadData(); // Reload data
      toast.success('Nabídka byla smazána');
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('Chyba při mazání nabídky');
    }
  };

  // Handle contact status update
  const handleUpdateContactStatus = async (contactId: string, status: string) => {
    try {
      await rideshareService.adminUpdateContactStatus(contactId, status);
      await loadData(); // Reload data
      toast.success('Stav kontaktu byl změněn');
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Chyba při změně stavu kontaktu');
    }
  };

  return {
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
    setSelectedOffer,
    refreshData: loadData
  };
};