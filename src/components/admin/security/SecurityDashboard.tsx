import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Users, Clock, Ban, Eye } from "lucide-react";
import { secureAuthManager } from '@/utils/secureAuthManager';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SecurityDashboard = () => {
  const [securityStats, setSecurityStats] = React.useState<any>(null);
  const [securityLogs, setSecurityLogs] = React.useState<any[]>([]);
  const [errorReports, setErrorReports] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Load security data
    const stats = secureAuthManager.getSecurityStats();
    setSecurityStats(stats);

    const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
    setSecurityLogs(logs.slice(0, 20)); // Last 20 events

    const errors = JSON.parse(localStorage.getItem('errorReports') || '[]');
    setErrorReports(errors.slice(0, 10)); // Last 10 errors

  }, []);

  const clearSecurityLogs = () => {
    localStorage.removeItem('securityLogs');
    localStorage.removeItem('errorReports');
    localStorage.removeItem('securityIncidents');
    setSecurityLogs([]);
    setErrorReports([]);
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'FAILED_LOGIN': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'SUCCESSFUL_LOGIN': return <Shield className="h-4 w-4 text-green-500" />;
      case 'BLOCKED_LOGIN_ATTEMPT': return <Ban className="h-4 w-4 text-red-600" />;
      case 'RATE_LIMITED': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'LOGOUT': return <Users className="h-4 w-4 text-blue-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventSeverity = (event: string) => {
    if (['BLOCKED_LOGIN_ATTEMPT', 'FAILED_LOGIN'].includes(event)) return 'destructive';
    if (['RATE_LIMITED'].includes(event)) return 'secondary';
    return 'outline';
  };

  if (!securityStats) {
    return <div>Loading security dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        <Button onClick={clearSecurityLogs} variant="outline">
          Clear Security Logs
        </Button>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24h</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats.last24h}</div>
            <p className="text-xs text-muted-foreground">Recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityStats.failedLogins}</div>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{securityStats.blockedAttempts}</div>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest authentication and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs.length === 0 ? (
              <p className="text-muted-foreground">No security events recorded</p>
            ) : (
              securityLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(log.event)}
                    <div>
                      <p className="text-sm font-medium">{log.event.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.details?.email || 'System event'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getEventSeverity(log.event)}>
                      {log.event}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Error Reports</CardTitle>
          <CardDescription>
            Application errors and potential security issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errorReports.length === 0 ? (
              <p className="text-muted-foreground">No error reports</p>
            ) : (
              errorReports.map((error, index) => (
                <div key={index} className="border border-red-200 rounded p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-700">{error.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        URL: {error.url}
                      </p>
                      {error.stack && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer">Stack trace</summary>
                          <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                            {error.stack.substring(0, 500)}...
                          </pre>
                        </details>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground ml-4">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;