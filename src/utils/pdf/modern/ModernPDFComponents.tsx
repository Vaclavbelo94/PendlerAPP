
import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { MODERN_COLORS } from './ModernPDFTemplate';

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    pageBreakInside: false
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MODERN_COLORS.primary,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: MODERN_COLORS.neutral[200]
  },
  table: {
    marginBottom: 12
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: MODERN_COLORS.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: MODERN_COLORS.neutral[300],
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: MODERN_COLORS.neutral[700]
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: MODERN_COLORS.neutral[200],
    paddingVertical: 6,
    paddingHorizontal: 10,
    minHeight: 24
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: MODERN_COLORS.neutral[700],
    paddingRight: 8
  },
  tableCellBold: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: MODERN_COLORS.neutral[800],
    paddingRight: 8
  },
  infoBox: {
    backgroundColor: MODERN_COLORS.neutral[50],
    borderLeftWidth: 4,
    borderLeftColor: MODERN_COLORS.primary,
    padding: 12,
    marginVertical: 8,
    borderRadius: 4
  },
  infoBoxSuccess: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: MODERN_COLORS.success
  },
  infoBoxWarning: {
    backgroundColor: '#fffbeb',
    borderLeftColor: MODERN_COLORS.warning
  },
  infoBoxText: {
    fontSize: 10,
    color: MODERN_COLORS.neutral[700],
    lineHeight: 1.4
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    gap: 8
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: MODERN_COLORS.white,
    borderWidth: 1,
    borderColor: MODERN_COLORS.neutral[200],
    padding: 12,
    borderRadius: 4,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface ModernTableProps {
  headers: string[];
  data: (string | number)[][];
  columnWidths?: string[];
}

export const ModernTable: React.FC<ModernTableProps> = ({ headers, data, columnWidths }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      {headers.map((header, index) => (
        <Text 
          key={index} 
          style={[
            styles.tableHeaderCell,
            columnWidths && { width: columnWidths[index] }
          ]}
        >
          {header}
        </Text>
      ))}
    </View>
    {data.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.tableRow}>
        {row.map((cell, cellIndex) => (
          <Text 
            key={cellIndex} 
            style={[
              rowIndex === data.length - 1 && cell.toString().includes('CELKEM') ? styles.tableCellBold : styles.tableCell,
              columnWidths && { width: columnWidths[cellIndex] }
            ]}
          >
            {cell?.toString() || ''}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

interface ModernInfoBoxProps {
  children: React.ReactNode;
  type?: 'default' | 'success' | 'warning';
}

export const ModernInfoBox: React.FC<ModernInfoBoxProps> = ({ children, type = 'default' }) => {
  const boxStyle = [
    styles.infoBox,
    type === 'success' && styles.infoBoxSuccess,
    type === 'warning' && styles.infoBoxWarning
  ].filter(Boolean);

  return (
    <View style={boxStyle}>
      <Text style={styles.infoBoxText}>{children}</Text>
    </View>
  );
};

interface StatItem {
  label: string;
  value: string;
}

interface ModernStatsGridProps {
  stats: StatItem[];
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
