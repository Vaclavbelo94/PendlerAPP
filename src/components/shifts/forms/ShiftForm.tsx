
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Shift, ShiftFormData } from '@/types/shifts';
import { useTranslation } from 'react-i18next';
import { LoaderCircle } from 'lucide-react';

const shiftFormSchema = z.object({
  type: z.enum(['morning', 'afternoon', 'night', 'custom']),
  start_time: z.string().min(1, 'Čas začátku je povinný'),
  end_time: z.string().min(1, 'Čas konce je povinný'),
  notes: z.string().optional(),
});

type ShiftFormDataInternal = z.infer<typeof shiftFormSchema>;

interface ShiftFormProps {
  shift?: Shift | null;
  onSubmit: (data: ShiftFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialDate?: Date | null;
}

const ShiftForm: React.FC<ShiftFormProps> = ({
  shift,
  onSubmit,
  onCancel,
  isLoading = false,
  initialDate
}) => {
  const { t } = useTranslation('shifts');

  console.log('ShiftForm render:', {
    shift: !!shift,
    initialDate,
    isLoading,
    translations: {
      addingShiftFor: t('addingShiftFor'),
      optional: t('optional'),
      addNotesPlaceholder: t('addNotesPlaceholder'),
      startTime: t('startTime'),
      endTime: t('endTime'),
      customShift: t('customShift')
    }
  });

  const getDefaultTimes = (type: string) => {
    switch (type) {
      case 'morning': return { start: '06:00', end: '14:00' };
      case 'afternoon': return { start: '14:00', end: '22:00' };
      case 'night': return { start: '22:00', end: '06:00' };
      default: return { start: '08:00', end: '16:00' };
    }
  };

  const form = useForm<ShiftFormDataInternal>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      type: shift?.type || 'morning',
      start_time: shift?.start_time || getDefaultTimes(shift?.type || 'morning').start,
      end_time: shift?.end_time || getDefaultTimes(shift?.type || 'morning').end,
      notes: shift?.notes || '',
    },
  });

  const watchedType = form.watch('type');

  // Update times when shift type changes
  React.useEffect(() => {
    if (!shift) { // Only auto-update for new shifts
      const defaultTimes = getDefaultTimes(watchedType);
      form.setValue('start_time', defaultTimes.start);
      form.setValue('end_time', defaultTimes.end);
    }
  }, [watchedType, form, shift]);

  const handleSubmit = async (data: ShiftFormDataInternal) => {
    console.log('ShiftForm handleSubmit called with:', data);
    console.log('ShiftForm current form state:', {
      type: data.type,
      start_time: data.start_time,
      end_time: data.end_time,
      notes: data.notes,
      initialDate
    });
    
    // Validate required fields
    if (!data.type || !data.start_time || !data.end_time) {
      console.error('ShiftForm: Missing required fields', {
        type: data.type,
        start_time: data.start_time,
        end_time: data.end_time
      });
      return;
    }
    
    // Ensure all required fields are present
    const formData: ShiftFormData = {
      type: data.type,
      start_time: data.start_time,
      end_time: data.end_time,
      notes: data.notes || undefined,
    };
    
    console.log('ShiftForm: Submitting form data:', formData);
    
    try {
      await onSubmit(formData);
      console.log('ShiftForm: Successfully submitted');
    } catch (error) {
      console.error('ShiftForm submission error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {initialDate && (
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t('addingShiftFor')}
          </p>
          <p className="font-medium">
            {format(initialDate, 'EEEE d. MMMM yyyy', { locale: cs })}
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Shift Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('shiftType')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectShiftType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="morning">
                      <div className="flex items-center gap-2">
                        <span>🌅</span>
                        <span>{t('morningShift')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="afternoon">
                      <div className="flex items-center gap-2">
                        <span>☀️</span>
                        <span>{t('afternoonShift')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="night">
                      <div className="flex items-center gap-2">
                        <span>🌙</span>
                        <span>{t('nightShift')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <span>👷‍♂️</span>
                        <span>{t('customShift')}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('startTime')}</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('endTime')}</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('notes')} ({t('optional')})</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('addNotesPlaceholder')}
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={isLoading}
            >
              {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {shift ? t('updateShift') : t('addShift')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShiftForm;
