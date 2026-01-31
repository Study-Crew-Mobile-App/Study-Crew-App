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
import { coursesApi } from '../../services/api';
import CourseCard from '../../components/courses/CourseCard';
import CourseModal from '../../components/courses/CourseModal';
import YearSelector from '../../components/courses/YearSelector';

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

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const academicYear = user?.academic_year ?? 1;
  const userEligibleYears = YEARS.filter((y) => y.value <= academicYear);

  const [openYear, setOpenYear] = useState<number | null>(
    userEligibleYears.length > 0 ? userEligibleYears[0].value : null
  );
  const [openSemester, setOpenSemester] = useState<string>(SEMESTERS[0]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);

  const handleCourseClick = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourseCode(null);
  };

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

  const filteredCourses = courses.filter(
    (course) =>
      course.year === YEARS.find((y) => y.value === openYear)?.label &&
      course.semester === SEMESTERS.indexOf(openSemester) + 1
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
              <Text style={styles.subtitleText}>Student Dashboard</Text>
            </View>
          </View>
          
          <View style={styles.yearBadge}>
            <Text style={styles.yearBadgeText}>Year {academicYear}</Text>
          </View>
        </View>

        {/* Year and Semester Selector */}
        <YearSelector
          eligibleYears={userEligibleYears}
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
            Click on any course to view available assistants
          </Text>
        </View>

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

        {/* Course Grid */}
        {!loading && !error && (
          <View style={styles.courseGrid}>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard
                  key={course.code}
                  course={course}
                  onPress={() => handleCourseClick(course.code)}
                />
              ))
            ) : (
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
      </ScrollView>

      {/* Course Details Modal */}
      <CourseModal
        courseCode={selectedCourseCode}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
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

  // Course Grid
  courseGrid: {
    paddingHorizontal: 16,
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
});
