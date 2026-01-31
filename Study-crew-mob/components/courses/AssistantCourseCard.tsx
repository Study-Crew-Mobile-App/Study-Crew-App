import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Course {
  code: string;
  name: string;
  description?: string;
  credit_hour?: number;
  year: string;
  semester: number;
}

interface AssistantCourseCardProps {
  course: Course;
  isSelected: boolean;
  isSpecial: boolean;
  onPress: () => void;
  onToggleSpecial: (event: any) => void;
}

export default function AssistantCourseCard({
  course,
  isSelected,
  isSpecial,
  onPress,
  onToggleSpecial,
}: AssistantCourseCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardWrapper}
    >
      <View style={[
        styles.card,
        isSelected && styles.selectedCard,
      ]}>
        {/* Gradient Overlay */}
        <LinearGradient
          colors={[
            isSelected ? 'rgba(143, 201, 93, 0.1)' : 'rgba(143, 201, 93, 0.05)',
            isSelected ? 'rgba(127, 184, 77, 0.05)' : 'rgba(127, 184, 77, 0.05)',
          ]}
          style={styles.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.cardContent}>
          {/* Course Header */}
          <View style={styles.courseHeader}>
            <View style={styles.courseInfo}>
              <View style={styles.courseTitleRow}>
                <Text style={[
                  styles.courseName,
                  isSelected && styles.courseNameSelected,
                ]}>
                  {course.name}
                </Text>
                <TouchableOpacity
                  style={styles.starButton}
                  onPress={onToggleSpecial}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.starText}>
                    {isSpecial ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.courseMeta}>
                <View style={[
                  styles.courseCode,
                  isSelected && styles.courseCodeSelected,
                ]}>
                  <Text style={[
                    styles.courseCodeText,
                    isSelected && styles.courseCodeTextSelected,
                  ]}>
                    {course.code}
                  </Text>
                </View>
                <View style={styles.creditHours}>
                  <Text style={styles.creditHoursText}>
                    {course.credit_hour || 3} Credits
                  </Text>
                </View>
                <View style={styles.yearBadge}>
                  <Text style={styles.yearBadgeText}>
                    Year {course.year}
                  </Text>
                </View>
              </View>
            </View>

            {/* Selection Status */}
            {isSelected && (
              <View style={styles.selectionStatus}>
                <Text style={styles.selectionText}>Selected</Text>
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              </View>
            )}
          </View>

          {/* Course Description */}
          {course.description && (
            <Text style={styles.courseDescription} numberOfLines={2}>
              {course.description}
            </Text>
          )}
        </View>

        {/* Click Indicator */}
        <View style={[
          styles.clickIndicator,
          isSelected && styles.clickIndicatorSelected,
        ]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(143, 201, 93, 0.2)',
    overflow: 'hidden',
    position: 'relative',
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
  selectedCard: {
    borderColor: '#8fc95d',
    backgroundColor: 'rgba(240, 253, 244, 0.5)',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  cardContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    lineHeight: 24,
    flex: 1,
    marginRight: 8,
  },
  courseNameSelected: {
    color: '#166534',
  },
  starButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.2 }],
  },
  starText: {
    fontSize: 20,
    lineHeight: 20,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  courseCode: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  courseCodeSelected: {
    backgroundColor: '#8fc95d',
  },
  courseCodeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditHours: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  creditHoursText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  yearBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yearBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  selectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 16,
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8fc95d',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8fc95d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  courseDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  clickIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
  },
  clickIndicatorSelected: {
    backgroundColor: 'linear-gradient(to right, #8fc95d, #7fb84d)',
  },
});
