import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Calendar, Users, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfWeek } from 'date-fns';
import { cs } from 'date-fns/locale';

interface SelectedGroup {
  id: string;
  name: string;
  employeeCount: number;
}

interface ShiftSettings {
  startTime: string;
  endTime: string;
  selectedDays: number[]; // 0 = Monday, 6 = Sunday
  dateRange: {
    start: string;
    end: string;
  };
}

const BulkShiftSetter = () => {
  const { t } = useTranslation(['dhl', 'common']);
  const [selectedGroups, setSelectedGroups] = useState<SelectedGroup[]>([]);
  const [shiftSettings, setShiftSettings] = useState<ShiftSettings>({
    startTime: '08:00',
    endTime: '16:00',
    selectedDays: [0, 1, 2, 3, 4], // Monday to Friday
    dateRange: {
      start: format(new Date(), 'yyyy-MM-dd'),
      end: format(addDays(new Date(), 30), 'yyyy-MM-dd')
    }
  });
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Mock groups for demonstration
  const availableGroups = [
    { id: '1', name: t('admin.groups.examples.earlyShift'), employeeCount: 12 },
    { id: '2', name: t('admin.groups.examples.lateShift'), employeeCount: 8 },
    { id: '3', name: t('admin.groups.examples.nightShift'), employeeCount: 6 },
    { id: '4', name: t('admin.groups.examples.weekendShift'), employeeCount: 4 }
  ];

  const dayNames = [
    t('admin.shifts.days.monday'),
    t('admin.shifts.days.tuesday'),
    t('admin.shifts.days.wednesday'),
    t('admin.shifts.days.thursday'),
    t('admin.shifts.days.friday'),
    t('admin.shifts.days.saturday'),
    t('admin.shifts.days.sunday')
  ];

  const handleGroupToggle = (group: SelectedGroup, checked: boolean) => {
    if (checked) {
      setSelectedGroups(prev => [...prev, group]);
    } else {
      setSelectedGroups(prev => prev.filter(g => g.id !== group.id));
    }
  };

  const handleDayToggle = (dayIndex: number, checked: boolean) => {
    if (checked) {
      setShiftSettings(prev => ({
        ...prev,
        selectedDays: [...prev.selectedDays, dayIndex].sort()
      }));
    } else {
      setShiftSettings(prev => ({
        ...prev,
        selectedDays: prev.selectedDays.filter(d => d !== dayIndex)
      }));
    }
  };

  const generatePreview = () => {
    if (selectedGroups.length === 0 || shiftSettings.selectedDays.length === 0) {
      setPreviewData([]);
      return;
    }

    const preview = [];
    const startDate = new Date(shiftSettings.dateRange.start);
    const endDate = new Date(shiftSettings.dateRange.end);

    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dayOfWeek = (currentDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      
      if (shiftSettings.selectedDays.includes(dayOfWeek)) {
        selectedGroups.forEach(group => {
          preview.push({
            date: format(currentDate, 'yyyy-MM-dd'),
            dateFormatted: format(currentDate, 'dd.MM.yyyy', { locale: cs }),
            dayName: dayNames[dayOfWeek],
            groupName: group.name,
            employeeCount: group.employeeCount,
            startTime: shiftSettings.startTime,
            endTime: shiftSettings.endTime,
            duration: calculateDuration(shiftSettings.startTime, shiftSettings.endTime)
          });
        });
      }
      
      currentDate = addDays(currentDate, 1);
    }

    setPreviewData(preview);
  };

  const calculateDuration = (start: string, end: string): string => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;
  };

  const handleBulkApply = async () => {
    if (selectedGroups.length === 0) {
      toast.error(t('admin.shifts.validation.selectGroups'));
      return;
    }

    if (shiftSettings.selectedDays.length === 0) {
      toast.error(t('admin.shifts.validation.selectDays'));
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(
        t('admin.shifts.success.applied', {
          count: previewData.length,
          groups: selectedGroups.length
        })
      );
      
      // Reset form
      setSelectedGroups([]);
      setShiftSettings({
        startTime: '08:00',
        endTime: '16:00',
        selectedDays: [0, 1, 2, 3, 4],
        dateRange: {
          start: format(new Date(), 'yyyy-MM-dd'),
          end: format(addDays(new Date(), 30), 'yyyy-MM-dd')
        }
      });
      setPreviewData([]);
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePreview();
  }, [selectedGroups, shiftSettings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{t('admin.shifts.title')}</h2>
        <p className="text-muted-foreground">
          {t('admin.shifts.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Group Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('admin.shifts.selectGroups')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableGroups.map((group) => (
                <div key={group.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Checkbox
                    id={group.id}
                    checked={selectedGroups.some(g => g.id === group.id)}
                    onCheckedChange={(checked) => handleGroupToggle(group, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor={group.id} className="font-medium cursor-pointer">
                      {group.name}
                    </label>
                    <div className="text-sm text-muted-foreground">
                      {group.employeeCount} {t('admin.groups.employees')}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {group.employeeCount}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Time Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('admin.shifts.timeSettings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('admin.shifts.startTime')}</Label>
                  <Input
                    type="time"
                    value={shiftSettings.startTime}
                    onChange={(e) => setShiftSettings(prev => ({
                      ...prev,
                      startTime: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label>{t('admin.shifts.endTime')}</Label>
                  <Input
                    type="time"
                    value={shiftSettings.endTime}
                    onChange={(e) => setShiftSettings(prev => ({
                      ...prev,
                      endTime: e.target.value
                    }))}
                  />
                </div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <span className="text-sm font-medium">
                  {t('admin.shifts.duration')}: {calculateDuration(shiftSettings.startTime, shiftSettings.endTime)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Day Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('admin.shifts.selectDays')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {dayNames.map((day, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${index}`}
                      checked={shiftSettings.selectedDays.includes(index)}
                      onCheckedChange={(checked) => handleDayToggle(index, checked as boolean)}
                    />
                    <label htmlFor={`day-${index}`} className="text-sm cursor-pointer">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.shifts.dateRange')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('admin.shifts.startDate')}</Label>
                  <Input
                    type="date"
                    value={shiftSettings.dateRange.start}
                    onChange={(e) => setShiftSettings(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label>{t('admin.shifts.endDate')}</Label>
                  <Input
                    type="date"
                    value={shiftSettings.dateRange.end}
                    onChange={(e) => setShiftSettings(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('admin.shifts.preview')}</span>
                <Badge variant="secondary">
                  {previewData.length} {t('admin.shifts.shiftsWillBeCreated')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 ? (
                <div className="space-y-4">
                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {previewData.slice(0, 10).map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{item.dateFormatted}</div>
                            <div className="text-sm text-muted-foreground">{item.dayName}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.duration}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{item.groupName}</div>
                          <div className="text-muted-foreground">
                            {item.startTime} - {item.endTime} • {item.employeeCount} {t('admin.groups.employees')}
                          </div>
                        </div>
                      </div>
                    ))}
                    {previewData.length > 10 && (
                      <div className="text-center py-2 text-sm text-muted-foreground">
                        {t('admin.shifts.andMore', { count: previewData.length - 10 })}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={handleBulkApply} 
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t('admin.shifts.applying')}
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t('admin.shifts.applyChanges')}
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedGroups([]);
                        setPreviewData([]);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t('common.reset')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('admin.shifts.noPreview')}</p>
                  <p className="text-sm mt-2">{t('admin.shifts.selectGroupsAndSettings')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BulkShiftSetter;