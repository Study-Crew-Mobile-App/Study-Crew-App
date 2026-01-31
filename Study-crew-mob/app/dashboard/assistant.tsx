import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../components/context/AuthContext';
import { coursesApi, assistantApi } from '../../services/api';
import AssistantCourseCard from '../../components/courses/AssistantCourseCard';
import YearSelector from '../../components/courses/YearSelector';
import TabNavigator from '../../components/navigation/TabNavigator';

const { width } = Dimensions.get('window');

const YEARS = [
  { label: 'Freshman', value: 1 },
  { label: 'Sophomore', value: 2 },
  { label: 'Junior', value: 3 },
  { label: 'Senior', value: 4 },
];
const SEMESTERS = ['Semester 1', 'Semester 2'];

interface Course {
  code: string;
  name: string;
  description?: string;
  credit_hour?: number;
  year: string;
  semester: number;
}

export default function AssistantDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const academicYear = user?.academic_year ?? 1;

  // Early return for 1st year students
  if (academicYear === 1) {
    return (
      <View style={styles.accessDeniedContainer}>
        <View style={styles.accessDeniedCard}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedMessage}>
            1st year students are not eligible to become teaching assistants.
            You must be at least in your 2nd year to assist courses.
          </Text>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const eligibleYears = YEARS.filter((y) => y.value < academicYear);
  const [openYear, setOpenYear] = useState<number | null>(
    eligibleYears.length > 0 ? eligibleYears[0].value : null
  );
  const [openSemester, setOpenSemester] = useState<string>(SEMESTERS[0]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<Set<string>>(new Set());
  const [specialCourses, setSpecialCourses] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!openYear || !openSemester) return;

    setLoading(true);
    setError(null);

    const loadCourses = async () => {
      try {
        const response = await coursesApi.getCourses(openYear, openSemester);
        
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setCourses(response.data);
        }
      } catch (error: any) {
        setError(error.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [openYear, openSemester]);

  // Fetch assigned courses for the current user
  useEffect(() => {
    if (!user?.id) return;

    const loadAssignedCourses = async () => {
      try {
        const response = await assistantApi.getAssignedCourses(user!.id);
        
        if (response.error) {
          console.error('Failed to load assigned courses:', response.error);
        } else if (response.data) {
          const assignedCourseCodes = response.data.map((course: any) => course.code);
          const specialCourseCodes = response.data
            .filter((course: any) => course.is_special)
            .map((course: any) => course.code);
          
          setAssignedCourses(new Set(assignedCourseCodes));
          setSelectedCourses(new Set(assignedCourseCodes));
          setSpecialCourses(new Set(specialCourseCodes));
        }
      } catch (error: any) {
        console.error('Error loading assigned courses:', error);
      }
    };

    loadAssignedCourses();
  }, [user?.id]);

  const toggleCourse = (code: string) => {
    setSelectedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      setHasChanges(true);
      return next;
    });
  };

  const toggleSpecial = (code: string) => {
    setSpecialCourses((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      setHasChanges(true);
      return next;
    });
  };

  const handleUpdateCourses = async () => {
    try {
      if (!user?.id) {
        throw new Error('User not found');
      }

      const courseCodes = Array.from(selectedCourses);
      const specialCourseCodes = Array.from(specialCourses);

      const response = await assistantApi.updateCourses({
        assistant_id: user.id,
        course_ids: courseCodes,
        special_course_codes: specialCourseCodes,
        availability_updates: [], // TODO: Implement availability updates if needed
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const addedCount = selectedCourses.size - assignedCourses.size;
      const removedCount = Math.max(0, assignedCourses.size - selectedCourses.size);
      const specialAddedCount = specialCourses.size - Array.from(assignedCourses).filter(code => specialCourses.has(code)).length;
      const specialRemovedCount = 0; // Calculate if needed

      let message = `Courses updated successfully! Added ${addedCount} courses, removed ${removedCount} courses.`;

      if (specialAddedCount > 0) {
        message += ` Added ${specialAddedCount} special course${specialAddedCount !== 1 ? 's' : ''}.`;
      }
      if (specialRemovedCount > 0) {
        message += ` Removed ${specialRemovedCount} special course${specialRemovedCount !== 1 ? 's' : ''}.`;
      }

      setSuccessMessage(message);
      setShowSuccessModal(true);
      setHasChanges(false);
      setAssignedCourses(new Set(selectedCourses));

      // Auto-hide after 5 seconds
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error: any) {
      Alert.alert('Error', `An error occurred while updating courses: ${error.message}`);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.year === YEARS.find((y) => y.value === openYear)?.label &&
      course.semester === SEMESTERS.indexOf(openSemester) + 1
  );

  const selectedCoursesForYear = filteredCourses.filter((course) =>
    selectedCourses.has(course.code)
  );
  const availableCoursesForYear = filteredCourses.filter((course) =>
    !selectedCourses.has(course.code)
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background decoration */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
        <View style={[styles.blob, styles.blob4]} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Greeting */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>
                Welcome back, {user?.name || user?.email}!
              </Text>
              <Text style={styles.subtitleText}>Assistant Dashboard</Text>
            </View>
          </View>
          
          <View style={styles.yearBadge}>
            <Text style={styles.yearBadgeText}>Year {academicYear}</Text>
          </View>
        </View>

        {/* Year and Semester Selector */}
        <YearSelector
          eligibleYears={eligibleYears}
          openYear={openYear}
          setOpenYear={setOpenYear}
          openSemester={openSemester}
          setOpenSemester={setOpenSemester}
        />

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {YEARS.find((y) => y.value === openYear)?.label} - {openSemester}
          </Text>
          <Text style={styles.sectionSubtitle}>
            Select courses you want to assist. Click the star (⭐) to mark as special.
          </Text>
        </View>

        {/* Success Notification */}
        {showSuccessModal && (
          <View style={styles.successNotification}>
            <View style={styles.successContent}>
              <Text style={styles.successIcon}>✓</Text>
              <View style={styles.successTextContainer}>
                <Text style={styles.successTitle}>Success!</Text>
                <Text style={styles.successMessage}>{successMessage}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.successCloseButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successCloseButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8fc95d" />
            <Text style={styles.loadingText}>Loading courses...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading courses</Text>
            <Text style={styles.errorDetail}>{error}</Text>
          </View>
        )}

        {/* Course Lists */}
        {!loading && !error && (
          <View style={styles.courseLists}>
            {/* Selected Courses Section */}
            {selectedCoursesForYear.length > 0 && (
              <View style={styles.courseSection}>
                <Text style={styles.courseSectionTitle}>
                  ✓ Selected Courses ({selectedCoursesForYear.length})
                </Text>
                <View style={styles.courseGrid}>
                  {selectedCoursesForYear.map((course) => (
                    <AssistantCourseCard
                      key={course.code}
                      course={course}
                      isSelected={true}
                      isSpecial={specialCourses.has(course.code)}
                      onPress={() => toggleCourse(course.code)}
                      onToggleSpecial={() => toggleSpecial(course.code)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Available Courses Section */}
            {availableCoursesForYear.length > 0 && (
              <View style={styles.courseSection}>
                <Text style={styles.courseSectionTitle}>
                  📚 Available Courses ({availableCoursesForYear.length})
                </Text>
                <View style={styles.courseGrid}>
                  {availableCoursesForYear.map((course) => (
                    <AssistantCourseCard
                      key={course.code}
                      course={course}
                      isSelected={false}
                      isSpecial={specialCourses.has(course.code)}
                      onPress={() => toggleCourse(course.code)}
                      onToggleSpecial={() => toggleSpecial(course.code)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Text style={styles.emptyIconText}>📚</Text>
                </View>
                <Text style={styles.emptyTitle}>No courses found</Text>
                <Text style={styles.emptySubtitle}>
                  No courses available for {YEARS.find((y) => y.value === openYear)?.label} - {openSemester}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Button */}
        {hasChanges && (
          <View style={styles.actionButtonContainer}>
            <View style={styles.selectedInfo}>
              <View style={styles.selectedInfoContent}>
                <Text style={styles.selectedInfoIcon}>📋</Text>
                <Text style={styles.selectedInfoText}>
                  {selectedCourses.size} course{selectedCourses.size !== 1 ? 's' : ''} selected
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateCourses}
            >
              <LinearGradient
                colors={['#8fc95d', '#7fb84d']}
                style={styles.updateButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.updateButtonText}>Update Courses</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Tab Navigator */}
      <TabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  
  // Background decoration
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
  },
  blob1: {
    width: 288,
    height: 288,
    backgroundColor: '#bbf7d0',
    top: 80,
    left: 40,
  },
  blob2: {
    width: 288,
    height: 288,
    backgroundColor: '#86efac',
    top: 160,
    right: 40,
  },
  blob3: {
    width: 288,
    height: 288,
    backgroundColor: '#dcfce7',
    bottom: 160,
    left: width / 3,
  },
  blob4: {
    width: 256,
    height: 256,
    backgroundColor: '#bbf7d0',
    top: '50%',
    right: width / 4,
  },

  // Access Denied
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  accessDeniedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    alignItems: 'center',
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
  warningIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  accessDeniedMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  goBackButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8fc95d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 14,
    color: '#6b7280',
  },
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  yearBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Success Notification
  successNotification: {
    backgroundColor: '#22c55e',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  successContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  successIcon: {
    fontSize: 20,
    color: '#ffffff',
    marginRight: 12,
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  successMessage: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  successCloseButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCloseButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },

  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  errorDetail: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },

  // Course Lists
  courseLists: {
    paddingHorizontal: 16,
    gap: 24,
  },
  courseSection: {
    gap: 16,
  },
  courseSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  courseGrid: {
    gap: 16,
  },

  // Empty State
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    padding: 48,
    alignItems: 'center',
    marginHorizontal: 16,
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
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Action Button
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(240, 253, 244, 0.8)',
    borderTopWidth: 1,
    borderTopColor: '#dcfce7',
    marginTop: 24,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#bbf7d0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  selectedInfoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  updateButton: {
    borderRadius: 8,
    overflow: 'hidden',
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
  updateButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
