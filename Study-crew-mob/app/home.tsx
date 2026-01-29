import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim1 = useRef(new Animated.Value(0.9)).current;
  const scaleAnim2 = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim1, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim2, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNeedHelp = () => {
    console.log('Need Help - Opening login modal for user');
    // TODO: Navigate to login screen with user role
    // router.push('/auth/login?role=user');
  };

  const handleBecomeAssistant = () => {
    console.log('Become Assistant - Opening login modal for assistant');
    // TODO: Navigate to login screen with assistant role
    // router.push('/auth/login?role=assistant');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Decorative Background Blobs */}
          <View style={styles.blobContainer}>
            <View style={[styles.blob, styles.blob1]} />
            <View style={[styles.blob, styles.blob2]} />
            <View style={[styles.blob, styles.blob3]} />
          </View>

          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BITS ACADEMIC EXCELLENCE</Text>
            </View>

            {/* Main Heading */}
            <Text style={styles.mainHeading}>
              Your study support,{'\n'}powered by{' '}
              <Text style={styles.brandText}>StudyCrew</Text>
            </Text>

            {/* Subheading */}
            <Text style={styles.subHeading}>
              Connect with expert study assistants or become one.
            </Text>
            <Text style={styles.subHeadingBold}>
              Get the help you need or share your knowledge to assist others.
            </Text>

            {/* Feature Tags */}
            <View style={styles.featureTags}>
              <View style={styles.featureTag}>
                <Text style={styles.featureTagText}>✓ Expert Assistants</Text>
              </View>
              <View style={styles.featureTag}>
                <Text style={styles.featureTagText}>✓ 24/7 Support</Text>
              </View>
              <View style={styles.featureTag}>
                <Text style={styles.featureTagText}>✓ Verified Tutors</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsSection}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose Your Path</Text>
            <Text style={styles.sectionSubtitle}>
              Whether you need help or want to help others, we've got you covered
            </Text>
          </View>

          {/* Card 1 - Need Help */}
          <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleNeedHelp}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fdf5']}
                style={styles.card}
              >
                {/* Icon Container */}
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>📚</Text>
                  </View>
                  <View style={styles.iconPulse} />
                </View>

                {/* Card Content */}
                <Text style={styles.cardTitle}>I need an assistant</Text>
                <Text style={styles.cardDescription}>
                  Connect with verified study assistants ready to help you excel in your academics
                </Text>

                {/* CTA Button */}
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Get Help Now</Text>
                  <Text style={styles.ctaArrow}>→</Text>
                </View>

                {/* Features List */}
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.featureText}>
                      Instant matching with available assistants
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.featureText}>
                      Track your learning progress
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.featureText}>
                      Secure and verified platform
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Card 2 - Become Assistant */}
          <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleBecomeAssistant}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fdf5']}
                style={styles.card}
              >
                {/* Icon Container */}
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>👥</Text>
                  </View>
                  <View style={styles.iconPulse} />
                </View>

                {/* Card Content */}
                <Text style={styles.cardTitle}>I'm here to assist</Text>
                <Text style={styles.cardDescription}>
                  Share your knowledge and earn while helping fellow students achieve their goals
                </Text>

                {/* CTA Button */}
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Become an Assistant</Text>
                  <Text style={styles.ctaArrow}>→</Text>
                </View>

                {/* Features List */}
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.featureText}>
                      Flexible scheduling options
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.featureText}>
                      Build your teaching portfolio
                    </Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.featureText}>
                      Earn knowledge while you help
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  
  // Hero Section
  heroSection: {
    position: 'relative',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  blobContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  blob1: {
    width: 280,
    height: 280,
    backgroundColor: '#8fc95d',
    top: -80,
    left: -60,
  },
  blob2: {
    width: 320,
    height: 320,
    backgroundColor: '#8fc95d',
    top: 40,
    right: -100,
  },
  blob3: {
    width: 300,
    height: 300,
    backgroundColor: '#8fc95d',
    bottom: -80,
    left: width / 3,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(143, 201, 93, 0.3)',
    marginBottom: 20,
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
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 1.2,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  brandText: {
    color: '#8fc95d',
  },
  subHeading: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  subHeadingBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  featureTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  featureTag: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(143, 201, 93, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  featureTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },

  // Cards Section
  cardsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(143, 201, 93, 0.2)',
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#8fc95d',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#8fc95d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconText: {
    fontSize: 40,
  },
  iconPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#8fc95d',
    opacity: 0.2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#8fc95d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
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
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 8,
  },
  ctaArrow: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: '#8fc95d',
    fontWeight: '700',
    marginRight: 10,
    width: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
});
