import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import { useEffect } from 'react';

interface DHLSetupData {
  personalNumber: string;
  depot: string;
  route: string;
  shift: string;
}

const DHLSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    personalNumber: '',
    depot: '',
    route: '',
    shift: ''
  });

  useEffect(() => {
    if (!user || !isDHLEmployee(user)) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const setupData = {
      personalNumber: formData.personalNumber,
      depot: formData.depot,
      route: formData.route,
      shift: formData.shift
    };

    // Here you would typically send the setupData to your backend
    // For now, let's just log it
    console.log('DHL Setup Data:', setupData);
    // After successful submission, you might want to redirect the user
    navigate('/dashboard');
  };

  if (!user || !isDHLEmployee(user)) {
    return null; // Or a redirect, or an error message
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <Card className="w-full max-w-md bg-card shadow-md rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">DHL Setup</CardTitle>
          <CardDescription>Please provide your DHL details</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="personalNumber">Personal Number</Label>
              <Input
                type="text"
                id="personalNumber"
                name="personalNumber"
                value={formData.personalNumber}
                onChange={handleChange}
                placeholder="Enter your personal number"
                required
              />
            </div>
            <div>
              <Label htmlFor="depot">Depot</Label>
              <Input
                type="text"
                id="depot"
                name="depot"
                value={formData.depot}
                onChange={handleChange}
                placeholder="Enter your depot"
                required
              />
            </div>
            <div>
              <Label htmlFor="route">Route</Label>
              <Input
                type="text"
                id="route"
                name="route"
                value={formData.route}
                onChange={handleChange}
                placeholder="Enter your route"
                required
              />
            </div>
            <div>
              <Label htmlFor="shift">Shift</Label>
              <Select
                onValueChange={(value) =>
                  handleChange({ target: { name: 'shift', value } } as any)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLSetup;
