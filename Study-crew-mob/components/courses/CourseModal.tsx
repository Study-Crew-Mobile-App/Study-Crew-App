import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

interface CourseModalProps {
  courseCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Assistant {
  id: number;
  name: string;
  email: string;
  rating?: number;
  bio?: string;
  courses: string[];
}

export default function CourseModal({ courseCode, isOpen, onClose }: CourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && courseCode) {
      loadAssistants();
    }
  }, [isOpen, courseCode]);

  const loadAssistants = async () => {
    setLoading(true);
    setError(null);

    // TODO: Replace with actual API call
    // For now, use mock data
    setTimeout(() => {
      const mockAssistants: Assistant[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@bits.edu',
          rating: 4.8,
          bio: 'Computer Science major with 3 years of tutoring experience',
          courses: [courseCode || ''],
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@bits.edu',
          rating: 4.9,
          bio: 'Mathematics enthusiast, love helping students understand complex concepts',
          courses: [courseCode || ''],
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@bits.edu',
          rating: 4.7,
          bio: 'Physics graduate student, passionate about teaching',
          courses: [courseCode || ''],
        },
      ];

      setAssistants(mockAssistants);
      setLoading(false);
    }, 1000);
  };

  const handleAssistantPress = (assistant: Assistant) => {
    Alert.alert(
      'Contact Assistant',
      `Would you like to book a session with ${assistant.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Session', onPress: () => console.log('Book session with:', assistant.id) },
      ]
    );
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Text key={i} style={styles.star}>⭐</Text>);
    }
    if (hasHalfStar) {
      stars.push(<Text key="half" style={styles.star}>⭐</Text>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Text key={`empty-${i}`} style={styles.emptyStar}>⭐</Text>);
    }

    return (
      <View style={styles.ratingContainer}>
        {stars}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.courseCode}>{courseCode}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Available Assistants</Text>
              <Text style={styles.subtitle}>
                Choose an assistant to help you with this course
              </Text>

              {/* Loading State */}
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#8fc95d" />
                  <Text style={styles.loadingText}>Loading assistants...</Text>
                </View>
              )}

              {/* Error State */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>Error loading assistants</Text>
                  <Text style={styles.errorDetail}>{error}</Text>
                </View>
              )}

              {/* Assistants List */}
              {!loading && !error && (
                <View style={styles.assistantsList}>
                  {assistants.length > 0 ? (
                    assistants.map((assistant) => (
                      <TouchableOpacity
                        key={assistant.id}
                        style={styles.assistantCard}
                        onPress={() => handleAssistantPress(assistant)}
                      >
                        <View style={styles.assistantHeader}>
                          <View style={styles.assistantInfo}>
                            <Text style={styles.assistantName}>{assistant.name}</Text>
                            <Text style={styles.assistantEmail}>{assistant.email}</Text>
                            {assistant.rating && renderStars(assistant.rating)}
                          </View>
                          <View style={styles.bookButton}>
                            <Text style={styles.bookButtonText}>Book</Text>
                          </View>
                        </View>
                        {assistant.bio && (
                          <Text style={styles.assistantBio}>{assistant.bio}</Text>
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>
                        No assistants available for this course yet.
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.95,
    maxWidth: 500,
    maxHeight: height * 0.8,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#f9fafb',
  },
  courseCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  content: {
    maxHeight: height * 0.6,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
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
  assistantsList: {
    gap: 16,
  },
  assistantCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
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
  assistantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assistantInfo: {
    flex: 1,
  },
  assistantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  assistantEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 14,
  },
  emptyStar: {
    fontSize: 14,
    opacity: 0.3,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#8fc95d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  assistantBio: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
