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

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

export default function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardWrapper}
    >
      <View style={styles.card}>
        {/* Gradient Overlay on Hover */}
        <LinearGradient
          colors={['rgba(143, 201, 93, 0.05)', 'rgba(127, 184, 77, 0.05)']}
          style={styles.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.cardContent}>
          {/* Course Header */}
          <View style={styles.courseHeader}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{course.name}</Text>
              <View style={styles.courseMeta}>
                <View style={styles.courseCode}>
                  <Text style={styles.courseCodeText}>{course.code}</Text>
                </View>
                <View style={styles.creditHours}>
                  <Text style={styles.creditHoursText}>
                    {course.credit_hour || 3} Credits
                  </Text>
                </View>
              </View>
            </View>

            {/* Arrow Icon */}
            <View style={styles.arrowContainer}>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
          </View>

          {/* Course Description */}
          {course.description && (
            <Text style={styles.courseDescription} numberOfLines={2}>
              {course.description}
            </Text>
          )}

          {/* Course Details */}
          <View style={styles.courseDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📚</Text>
              <Text style={styles.detailText}>Year {course.year}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.detailText}>Semester {course.semester}</Text>
            </View>
          </View>
        </View>

        {/* Click Indicator */}
        <View style={styles.clickIndicator} />
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
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
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
  courseCodeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
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
  arrowContainer: {
    marginLeft: 16,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  courseDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  clickIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
  },
});
