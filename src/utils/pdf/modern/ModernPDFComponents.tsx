
import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { MODERN_COLORS } from './ModernPDFTemplate';

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: MODERN_COLORS.neutral[50],
    padding: 15,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: MODERN_COLORS.neutral[200]
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: MODERN_COLORS.primary,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: MODERN_COLORS.primary
  },
  table: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: MODERN_COLORS.neutral[200],
    borderRadius: 4
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: MODERN_COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: MODERN_COLORS.white,
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: MODERN_COLORS.neutral[200],
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 28
  },
  tableRowEven: {
    backgroundColor: MODERN_COLORS.neutral[50]
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: MODERN_COLORS.neutral[700],
    paddingRight: 8,
    textAlign: 'center'
  },
  tableCellBold: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: MODERN_COLORS.neutral[800],
    paddingRight: 8,
    textAlign: 'center'
  },
  infoBox: {
    backgroundColor: MODERN_COLORS.primaryLight,
    borderLeftWidth: 4,
    borderLeftColor: MODERN_COLORS.primary,
    padding: 12,
    marginVertical: 10,
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
    marginVertical: 15,
    gap: 10
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: MODERN_COLORS.white,
    borderWidth: 1,
    borderColor: MODERN_COLORS.neutral[200],
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: MODERN_COLORS.neutral[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MODERN_COLORS.primary,
    marginBottom: 6
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
      <View 
        key={rowIndex} 
        style={[
          styles.tableRow,
          rowIndex % 2 === 1 && styles.tableRowEven
        ]}
      >
        {row.map((cell, cellIndex) => (
          <Text 
            key={cellIndex} 
            style={[
              cell.toString().includes('CELKEM') ? styles.tableCellBold : styles.tableCell,
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
