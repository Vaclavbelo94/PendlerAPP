
import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { MODERN_COLORS } from './ModernPDFTemplate';

const styles = StyleSheet.create({
  section: {
    marginBottom: 20
  },
  sectionHeader: {
    backgroundColor: MODERN_COLORS.neutral[100],
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: MODERN_COLORS.primary
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: MODERN_COLORS.neutral[800]
  },
  table: {
    marginBottom: 15
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: MODERN_COLORS.neutral[200],
    paddingVertical: 8
  },
  tableHeader: {
    backgroundColor: MODERN_COLORS.primary,
    paddingVertical: 10
  },
  tableHeaderText: {
    color: MODERN_COLORS.white,
    fontWeight: 600,
    fontSize: 10
  },
  tableCellText: {
    fontSize: 10,
    color: MODERN_COLORS.neutral[700],
    paddingHorizontal: 8
  },
  infoBox: {
    backgroundColor: MODERN_COLORS.neutral[50],
    borderWidth: 1,
    borderColor: MODERN_COLORS.neutral[200],
    borderRadius: 6,
    padding: 12,
    marginVertical: 10
  },
  infoBoxSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: MODERN_COLORS.success
  },
  infoBoxWarning: {
    backgroundColor: '#fffbeb',
    borderColor: MODERN_COLORS.warning
  },
  infoBoxError: {
    backgroundColor: '#fef2f2',
    borderColor: MODERN_COLORS.error
  },
  infoText: {
    fontSize: 10,
    lineHeight: 1.5
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    gap: 10
  },
  statCard: {
    backgroundColor: MODERN_COLORS.white,
    borderWidth: 1,
    borderColor: MODERN_COLORS.neutral[200],
    borderRadius: 6,
    padding: 12,
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 16,
    fontWeight: 700,
    color: MODERN_COLORS.primary,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 9,
    color: MODERN_COLORS.neutral[600],
    textAlign: 'center'
  }
});

interface ModernSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ModernSection: React.FC<ModernSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

interface ModernTableProps {
  headers: string[];
  data: string[][];
  columnWidths?: string[];
}

export const ModernTable: React.FC<ModernTableProps> = ({ headers, data, columnWidths }) => {
  const defaultWidth = `${100 / headers.length}%`;
  
  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        {headers.map((header, index) => (
          <View key={index} style={{ width: columnWidths?.[index] || defaultWidth }}>
            <Text style={styles.tableHeaderText}>{header}</Text>
          </View>
        ))}
      </View>
      
      {/* Data rows */}
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {row.map((cell, cellIndex) => (
            <View key={cellIndex} style={{ width: columnWidths?.[cellIndex] || defaultWidth }}>
              <Text style={styles.tableCellText}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

interface ModernInfoBoxProps {
  children: React.ReactNode;
  type?: 'default' | 'success' | 'warning' | 'error';
}

export const ModernInfoBox: React.FC<ModernInfoBoxProps> = ({ children, type = 'default' }) => {
  const getBoxStyle = () => {
    switch (type) {
      case 'success': return [styles.infoBox, styles.infoBoxSuccess];
      case 'warning': return [styles.infoBox, styles.infoBoxWarning];
      case 'error': return [styles.infoBox, styles.infoBoxError];
      default: return styles.infoBox;
    }
  };

  return (
    <View style={getBoxStyle()}>
      <Text style={styles.infoText}>{children}</Text>
    </View>
  );
};

interface StatCardData {
  label: string;
  value: string;
}

interface ModernStatsGridProps {
  stats: StatCardData[];
}

export const ModernStatsGrid: React.FC<ModernStatsGridProps> = ({ stats }) => (
  <View style={styles.statsGrid}>
    {stats.map((stat, index) => (
      <View key={index} style={styles.statCard}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    ))}
  </View>
);
