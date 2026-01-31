import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../components/context/AuthContext';

const { width } = Dimensions.get('window');

interface FormData {
  name: string;
  email: string;
  password: string;
  academicYear: number;
  telegramUsername: string;
  bio: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    academicYear: 1,
    telegramUsername: '',
    bio: '',
  });

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    clearError();
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      academic_year: formData.academicYear,
      telegram_username: formData.telegramUsername || undefined,
      bio: formData.bio || undefined,
    });
    
    if (success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/home') }
      ]);
    } else {
      Alert.alert('Registration Failed', error || 'Something went wrong');
    }
  };

  const handleLogin = () => {
    // TODO: Navigate to login when created
    console.log('Navigate to login');
  };

  const handleBack = () => {
    router.back();
  };

  const academicYears = [
    { label: '1st Year - Freshman', value: 1 },
    { label: '2nd Year - Sophomore', value: 2 },
    { label: '3rd Year - Junior', value: 3 },
    { label: '4th Year - Senior', value: 4 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Background decoration */}
          <View style={styles.backgroundDecoration}>
            <View style={[styles.blob, styles.blob1]} />
            <View style={[styles.blob, styles.blob2]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>SC</Text>
              </View>
            </View>
            
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join StudyCrew today</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="you@email.com"
                placeholderTextColor="#9ca3af"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor="#9ca3af"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
              />
            </View>

            {/* Academic Year */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Academic Year *</Text>
              <View style={styles.yearButtons}>
                {academicYears.map((year) => (
                  <TouchableOpacity
                    key={year.value}
                    style={[
                      styles.yearButton,
                      formData.academicYear === year.value && styles.yearButtonActive,
                    ]}
                    onPress={() => updateFormData('academicYear', year.value)}
                  >
                    <Text style={[
                      styles.yearButtonText,
                      formData.academicYear === year.value && styles.yearButtonTextActive,
                    ]}>
                      {year.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {formData.academicYear >= 2 && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxText}>
                    🎉 You'll be able to help other students as an Assistant!
                  </Text>
                </View>
              )}
              
              {formData.academicYear === 1 && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxText}>
                    📚 As a 1st year student, you can find assistants to help you.
                  </Text>
                </View>
              )}
            </View>

            {/* Telegram Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telegram Username (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="@yourusername"
                placeholderTextColor="#9ca3af"
                value={formData.telegramUsername}
                onChangeText={(value) => updateFormData('telegramUsername', value)}
              />
            </View>

            {/* Bio */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9ca3af"
                value={formData.bio}
                onChangeText={(value) => updateFormData('bio', value)}
                multiline
                numberOfLines={3}
                maxLength={70}
              />
              <Text style={styles.charCount}>
                {70 - (formData.bio?.length || 0)} characters remaining
              </Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={['#8fc95d', '#7fb84d']}
                style={styles.registerButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
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
    height: 300,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
  },
  blob1: {
    width: 200,
    height: 200,
    backgroundColor: '#8fc95d',
    top: -50,
    right: -50,
  },
  blob2: {
    width: 150,
    height: 150,
    backgroundColor: '#8fc95d',
    top: 50,
    left: -30,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 60 : 40,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
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
        elevation: 4,
      },
    }),
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Form
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  
  // Year Selection
  yearButtons: {
    gap: 8,
  },
  yearButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  yearButtonActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#8fc95d',
  },
  yearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  yearButtonTextActive: {
    color: '#166534',
  },
  
  // Info Box
  infoBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoBoxText: {
    fontSize: 12,
    color: '#166534',
    textAlign: 'center',
  },

  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8fc95d',
  },
});
