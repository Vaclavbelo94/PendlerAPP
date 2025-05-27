
import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

// Moderní color palette - vylepšená paleta
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
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 0,
    paddingBottom: 30,
    paddingHorizontal: 0,
    backgroundColor: MODERN_COLORS.white,
    color: MODERN_COLORS.neutral[800],
    lineHeight: 1.4
  },
  header: {
    backgroundColor: MODERN_COLORS.primary,
    paddingVertical: 25,
    paddingHorizontal: 40,
    marginBottom: 35
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandSection: {
    flexDirection: 'column'
  },
  brandText: {
    color: MODERN_COLORS.white
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: '0.5px'
  },
  brandSubtitle: {
    fontSize: 11,
    opacity: 0.9,
    fontStyle: 'italic'
  },
  headerInfo: {
    color: MODERN_COLORS.white,
    textAlign: 'right'
  },
  dateText: {
    fontSize: 10,
    opacity: 0.85,
    marginBottom: 3
  },
  timeText: {
    fontSize: 10,
    opacity: 0.85
  },
  titleSection: {
    paddingHorizontal: 40,
    marginBottom: 30,
    textAlign: 'center'
  },
  documentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MODERN_COLORS.neutral[900],
    marginBottom: 10,
    letterSpacing: '0.3px'
  },
  documentSubtitle: {
    fontSize: 13,
    color: MODERN_COLORS.neutral[600],
    fontStyle: 'italic'
  },
  separator: {
    height: 3,
    backgroundColor: MODERN_COLORS.primary,
    marginHorizontal: 40,
    marginBottom: 30,
    borderRadius: 2,
    // Gradient effect simulation
    boxShadow: `0 2px 4px ${MODERN_COLORS.primary}40`
  },
  content: {
    paddingHorizontal: 40,
    flex: 1
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: MODERN_COLORS.neutral[50],
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderTopWidth: 2,
    borderTopColor: MODERN_COLORS.neutral[200]
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 9,
    color: MODERN_COLORS.neutral[500]
  },
  pageNumber: {
    fontSize: 9,
    color: MODERN_COLORS.neutral[600],
    fontWeight: 'bold'
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    color: MODERN_COLORS.neutral[100],
    opacity: 0.1,
    zIndex: -1
  }
});

interface ModernPDFTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showWatermark?: boolean;
}

export const ModernPDFTemplate: React.FC<ModernPDFTemplateProps> = ({ 
  title, 
  subtitle, 
  children,
  showWatermark = false
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
        {/* Optional Watermark */}
        {showWatermark && (
          <Text style={styles.watermark}>PendlerApp</Text>
        )}

        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.brandSection}>
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

        {/* Modern Separator */}
        <View style={styles.separator} />

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>

        {/* Enhanced Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              PendlerApp © {currentDate.getFullYear()} | www.pendlerapp.cz | info@pendlerapp.cz
            </Text>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => 
              `Strana ${pageNumber} z ${totalPages}`
            } />
            <Text style={styles.footerText}>
              Vygenerováno: {currentDate.toLocaleDateString('cs-CZ')} {currentDate.toLocaleTimeString('cs-CZ')}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernPDFTemplate;
