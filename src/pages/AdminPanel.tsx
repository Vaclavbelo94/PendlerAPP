
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const AdminPanel = () => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <div className="container py-6 md:py-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Administrace</h1>
          <p className="text-muted-foreground">
            Správa aplikace a uživatelských účtů
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Administrační funkce budou implementovány v budoucí verzi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
