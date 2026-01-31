import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Platform } from 'react-native';

interface Year {
  label: string;
  value: number;
}

interface YearSelectorProps {
  eligibleYears: Year[];
  openYear: number | null;
  setOpenYear: (year: number | null) => void;
  openSemester: string;
  setOpenSemester: (semester: string) => void;
}

const SEMESTERS = ['Semester 1', 'Semester 2'];

export default function YearSelector({
  eligibleYears,
  openYear,
  setOpenYear,
  openSemester,
  setOpenSemester,
}: YearSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={styles.title}>Filter by Year</Text>

        {eligibleYears.length === 0 ? (
          <View style={styles.noYearsContainer}>
            <Text style={styles.noYearsText}>No years available</Text>
          </View>
        ) : (
          <ScrollView style={styles.yearList} showsVerticalScrollIndicator={false}>
            {eligibleYears.map((year) => (
              <View key={year.value} style={styles.yearSection}>
                <TouchableOpacity
                  style={[
                    styles.yearButton,
                    openYear === year.value && styles.yearButtonActive,
                  ]}
                  onPress={() => setOpenYear(year.value)}
                >
                  <View style={styles.yearButtonContent}>
                    <Text style={styles.yearLabel}>{year.label}</Text>
                    {openYear === year.value && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                {openYear === year.value && (
                  <View style={styles.semesterList}>
                    {SEMESTERS.map((sem) => (
                      <TouchableOpacity
                        key={sem}
                        style={[
                          styles.semesterButton,
                          openSemester === sem && styles.semesterButtonActive,
                        ]}
                        onPress={() => setOpenSemester(sem)}
                      >
                        <Text style={[
                          styles.semesterButtonText,
                          openSemester === sem && styles.semesterButtonTextActive,
                        ]}>
                          {sem}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sidebar: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#dcfce7',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noYearsContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  noYearsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  yearList: {
    maxHeight: 200,
  },
  yearSection: {
    marginBottom: 8,
  },
  yearButton: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  yearButtonActive: {
    backgroundColor: '#8fc95d',
    transform: [{ scale: 1.02 }],
    ...Platform.select({
      ios: {
        shadowColor: '#8fc95d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  yearButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8fc95d',
  },
  semesterList: {
    marginLeft: 16,
    marginTop: 8,
    gap: 4,
  },
  semesterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  semesterButtonActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#8fc95d',
  },
  semesterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  semesterButtonTextActive: {
    color: '#166534',
    fontWeight: '600',
  },
});
