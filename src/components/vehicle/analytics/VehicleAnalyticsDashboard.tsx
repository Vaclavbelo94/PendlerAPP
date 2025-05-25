
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Car, Fuel, DollarSign, Wrench, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVehicleData } from '@/hooks/vehicle/useVehicleData';
import { fetchFuelRecords, fetchServiceRecords, calculateConsumption } from '@/services/vehicleService';
import { VehicleData, FuelRecord, ServiceRecord } from '@/types/vehicle';
import VehicleSelector from '../VehicleSelector';

interface VehicleStats {
  totalFuelCost: number;
  totalServiceCost: number;
  avgConsumption: number;
  totalDistance: number;
  serviceCount: number;
  lastService: string;
  nextInspection: string;
}

const VehicleAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { vehicles, selectedVehicleId, vehicleData, handleVehicleSelect, isLoading } = useVehicleData(user);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [stats, setStats] = useState<VehicleStats>({
    totalFuelCost: 0,
    totalServiceCost: 0,
    avgConsumption: 0,
    totalDistance: 0,
    serviceCount: 0,
    lastService: '',
    nextInspection: ''
  });

  useEffect(() => {
    if (selectedVehicleId) {
      loadVehicleAnalytics(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  const loadVehicleAnalytics = async (vehicleId: string) => {
    try {
      const [fuelData, serviceData] = await Promise.all([
        fetchFuelRecords(vehicleId),
        fetchServiceRecords(vehicleId)
      ]);

      setFuelRecords(fuelData);
      setServiceRecords(serviceData);

      // Vypočítat statistiky
      const fuelStats = calculateConsumption(fuelData);
      const totalServiceCost = serviceData.reduce((sum, record) => 
        sum + parseFloat(record.cost || '0'), 0
      );

      setStats({
        totalFuelCost: fuelStats.totalCost,
        totalServiceCost,
        avgConsumption: fuelStats.averageConsumption,
        totalDistance: fuelStats.totalDistance,
        serviceCount: serviceData.length,
        lastService: serviceData[0]?.service_date || 'Žádný záznam',
        nextInspection: vehicleData?.next_inspection || 'Nenastaveno'
      });
    } catch (error) {
      console.error('Error loading vehicle analytics:', error);
    }
  };

  // Příprava dat pro grafy
  const monthlyFuelData = fuelRecords.reduce((acc, record) => {
    const month = new Date(record.date).toLocaleDateString('cs-CZ', { month: 'short', year: '2-digit' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.cost += record.total_cost;
      existing.liters += record.amount_liters;
    } else {
      acc.push({
        month,
        cost: record.total_cost,
        liters: record.amount_liters
      });
    }
    return acc;
  }, [] as Array<{ month: string; cost: number; liters: number }>);

  const serviceTypeData = serviceRecords.reduce((acc, record) => {
    const existing = acc.find(item => item.type === record.service_type);
    if (existing) {
      existing.count += 1;
      existing.cost += parseFloat(record.cost || '0');
    } else {
      acc.push({
        type: record.service_type,
        count: 1,
        cost: parseFloat(record.cost || '0')
      });
    }
    return acc;
  }, [] as Array<{ type: string; count: number; cost: number }>);

  const StatCard = ({ title, value, icon: Icon, subtitle, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="flex flex-col items-end">
            <Icon className="h-8 w-8 text-muted-foreground" />
            {trend && (
              <div className="flex items-center text-xs mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Car className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Načítám data vozidla...</p>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Car className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Nemáte žádná vozidla. Přidejte si první vozidlo pro zobrazení analytics.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selektor vozidla */}
      {vehicles.length > 1 && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Vyberte vozidlo:</label>
          <VehicleSelector
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelect={handleVehicleSelect}
          />
        </div>
      )}

      {vehicleData && (
        <>
          {/* Základní informace o vozidle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                {vehicleData.brand} {vehicleData.model} ({vehicleData.license_plate})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rok výroby</p>
                  <p className="font-medium">{vehicleData.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Palivo</p>
                  <p className="font-medium">{vehicleData.fuel_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Najeto</p>
                  <p className="font-medium">{vehicleData.mileage} km</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiky */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Náklady na palivo"
              value={`${stats.totalFuelCost.toLocaleString()} Kč`}
              icon={Fuel}
              subtitle="za posledních 12 měsíců"
            />
            <StatCard
              title="Náklady na servis"
              value={`${stats.totalServiceCost.toLocaleString()} Kč`}
              icon={Wrench}
              subtitle={`${stats.serviceCount} záznamů`}
            />
            <StatCard
              title="Průměrná spotřeba"
              value={`${stats.avgConsumption.toFixed(1)} l/100km`}
              icon={TrendingUp}
              subtitle={`na ${stats.totalDistance.toFixed(0)} km`}
            />
            <StatCard
              title="Další STK"
              value={stats.nextInspection}
              icon={Calendar}
              subtitle="kontrola platnosti"
            />
          </div>

          {/* Detailní analytics */}
          <Tabs defaultValue="fuel" className="space-y-4">
            <TabsList>
              <TabsTrigger value="fuel">Palivo</TabsTrigger>
              <TabsTrigger value="service">Servis</TabsTrigger>
              <TabsTrigger value="costs">Náklady</TabsTrigger>
              <TabsTrigger value="maintenance">Údržba</TabsTrigger>
            </TabsList>

            <TabsContent value="fuel" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Měsíční náklady na palivo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyFuelData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cost" fill="#8884d8" name="Náklady (Kč)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vývoj spotřeby paliva</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyFuelData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="liters" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                          name="Litry"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="service" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Typy servisních zákroků</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={serviceTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, count }) => `${type} (${count}x)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {serviceTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Náklady na servis podle typu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={serviceTypeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cost" fill="#ffc658" name="Náklady (Kč)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="costs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Celkové náklady na vozidlo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Fuel className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                      <p className="text-2xl font-bold">{stats.totalFuelCost.toLocaleString()} Kč</p>
                      <p className="text-sm text-muted-foreground">Palivo</p>
                    </div>
                    <div className="text-center">
                      <Wrench className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <p className="text-2xl font-bold">{stats.totalServiceCost.toLocaleString()} Kč</p>
                      <p className="text-sm text-muted-foreground">Servis</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                      <p className="text-2xl font-bold">
                        {(stats.totalFuelCost + stats.totalServiceCost).toLocaleString()} Kč
                      </p>
                      <p className="text-sm text-muted-foreground">Celkem</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Plánovaná údržba
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Státní technická kontrola</p>
                          <p className="text-sm text-muted-foreground">{stats.nextInspection}</p>
                        </div>
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Poslední servis</p>
                          <p className="text-sm text-muted-foreground">{stats.lastService}</p>
                        </div>
                        <Wrench className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Doporučená údržba</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="font-medium text-yellow-800">Výměna oleje</p>
                        <p className="text-sm text-yellow-600">Doporučeno každých 15 000 km</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-medium text-blue-800">Kontrola brzd</p>
                        <p className="text-sm text-blue-600">Doporučeno každých 20 000 km</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-800">Výměna pneumatik</p>
                        <p className="text-sm text-green-600">Podle opotřebení</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default VehicleAnalyticsDashboard;
