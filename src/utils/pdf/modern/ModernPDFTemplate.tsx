
import React from 'react';
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';

// Professional color palette according to specifications
export const MODERN_COLORS = {
  primary: '#0073e6',        // Blue for headings
  primaryLight: '#e6f3ff',   // Light blue for backgrounds
  secondary: '#64748b',      // Slate for secondary text
  neutral: {
    50: '#f8fafc',           // Light grey backgrounds
    100: '#f1f5f9',          // Section backgrounds
    200: '#e2e8f0',          // Borders
    300: '#cbd5e1',          // Light borders
    400: '#94a3b8',          // Medium grey
    500: '#64748b',          // Secondary text
    600: '#475569',          // Dark secondary
    700: '#334155',          // Main text color
    800: '#1e293b',          // Dark text
    900: '#0f172a'           // Darkest text
  },
  white: '#ffffff',
  black: '#000000',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
    backgroundColor: MODERN_COLORS.white,
    color: MODERN_COLORS.neutral[700],
    lineHeight: 1.5
  },
  header: {
    backgroundColor: MODERN_COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 30,
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
    fontWeight: 'bold',
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
    opacity: 0.9,
    marginBottom: 2
  },
  titleSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    textAlign: 'center'
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: MODERN_COLORS.primary,
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
    marginBottom: 25
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
    backgroundColor: MODERN_COLORS.neutral[100],
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
    color: MODERN_COLORS.neutral[600],
    fontWeight: 'bold'
  },
  signature: {
    marginTop: 30,
    padding: 15,
    backgroundColor: MODERN_COLORS.neutral[50],
    borderLeftWidth: 3,
    borderLeftColor: MODERN_COLORS.primary,
    borderRadius: 4
  },
  signatureText: {
    fontSize: 9,
    color: MODERN_COLORS.neutral[600],
    lineHeight: 1.4,
    textAlign: 'center'
  }
});

interface ModernPDFTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ModernPDFTemplate: React.FC<ModernPDFTemplateProps> = ({ 
  title, 
  subtitle, 
  children
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
        {/* Professional Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>PendlerApp</Text>
              <Text style={styles.brandSubtitle}>Profesionální řešení pro české pendlery</Text>
            </View>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.dateText}>{dateStr}</Text>
            <Text style={styles.dateText}>{timeStr}</Text>
          </View>
        </View>

        {/* Document Title */}
        <View style={styles.titleSection}>
          <Text style={styles.documentTitle}>{title}</Text>
          {subtitle && <Text style={styles.documentSubtitle}>{subtitle}</Text>}
        </View>

        {/* Blue Separator */}
        <View style={styles.separator} />

        {/* Content */}
        <View style={styles.content}>
          {children}
          
          {/* Signature Note */}
          <View style={styles.signature}>
            <Text style={styles.signatureText}>
              Tento dokument byl vygenerován systémem PendlerApp dne {dateStr}. {'\n'}
              Pro dotazy kontaktujte www.pendlerapp.cz
            </Text>
          </View>
        </View>

        {/* Professional Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              PendlerApp © 2025 | www.pendlerapp.cz | info@pendlerapp.cz
            </Text>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => 
              `Strana ${pageNumber} z ${totalPages}`
            } />
            <Text style={styles.footerText}>
              Vygenerováno: {currentDate.toLocaleDateString('cs-CZ')}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernPDFTemplate;
