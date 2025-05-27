
import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Registrace fontů pro lepší podporu češtiny
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 }
  ]
});

// Moderní color palette
export const MODERN_COLORS = {
  primary: '#2563eb',      // Blue-600
  secondary: '#64748b',    // Slate-500  
  accent: '#f59e0b',       // Amber-500
  success: '#10b981',      // Emerald-500
  warning: '#f59e0b',      // Amber-500
  error: '#ef4444',        // Red-500
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  white: '#ffffff',
  black: '#000000'
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 11,
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 0,
    backgroundColor: MODERN_COLORS.white,
    color: MODERN_COLORS.neutral[800]
  },
  header: {
    backgroundColor: MODERN_COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 30
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12
  },
  brandText: {
    color: MODERN_COLORS.white
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 2
  },
  brandSubtitle: {
    fontSize: 10,
    opacity: 0.9
  },
  headerInfo: {
    color: MODERN_COLORS.white,
    textAlign: 'right'
  },
  dateText: {
    fontSize: 9,
    opacity: 0.8,
    marginBottom: 2
  },
  timeText: {
    fontSize: 9,
    opacity: 0.8
  },
  titleSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    textAlign: 'center'
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: MODERN_COLORS.neutral[900],
    marginBottom: 8
  },
  documentSubtitle: {
    fontSize: 12,
    color: MODERN_COLORS.neutral[600]
  },
  separator: {
    height: 2,
    backgroundColor: MODERN_COLORS.primary,
    marginHorizontal: 30,
    marginBottom: 25,
    borderRadius: 1
  },
  content: {
    paddingHorizontal: 30,
    flex: 1
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: MODERN_COLORS.neutral[50],
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderTopWidth: 1,
    borderTopColor: MODERN_COLORS.neutral[200]
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 8,
    color: MODERN_COLORS.neutral[500]
  },
  pageNumber: {
    fontSize: 8,
    color: MODERN_COLORS.neutral[600]
  }
});

interface ModernPDFTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showLogo?: boolean;
}

export const ModernPDFTemplate: React.FC<ModernPDFTemplateProps> = ({ 
  title, 
  subtitle, 
  children,
  showLogo = true 
}) => {
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = currentDate.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoSection}>
              {showLogo && (
                <Image 
                  src="/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png"
                  style={styles.logo}
                />
              )}
              <View style={styles.brandText}>
                <Text style={styles.brandTitle}>PendlerApp</Text>
                <Text style={styles.brandSubtitle}>Profesionální řešení pro české pendlery</Text>
              </View>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.dateText}>{dateStr}</Text>
              <Text style={styles.timeText}>{timeStr}</Text>
            </View>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.documentTitle}>{title}</Text>
          {subtitle && <Text style={styles.documentSubtitle}>{subtitle}</Text>}
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              PendlerApp © {currentDate.getFullYear()} | www.pendlerapp.cz
            </Text>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => 
              `Strana ${pageNumber} z ${totalPages}`
            } />
            <Text style={styles.footerText}>
              Vygenerováno: {currentDate.toLocaleString('cs-CZ')}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernPDFTemplate;
