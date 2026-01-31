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
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

interface RegisterCardProps {
  onClose: () => void;
}

const { width } = Dimensions.get('window');

interface FormData {
  name: string;
  email: string;
  password: string;
  academicYear: number;
  telegramUsername: string;
  bio: string;
}

export default function RegisterCard({ onClose }: RegisterCardProps) {
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
      onClose();
      Alert.alert('Success', 'Account created successfully!');
    } else {
      Alert.alert('Registration Failed', error || 'Something went wrong');
    }
  };

  const handleLogin = () => {
    // This will be handled by the parent modal
    onClose();
  };

  const academicYears = [
    { label: '1st Year - Freshman', value: 1 },
    { label: '2nd Year - Sophomore', value: 2 },
    { label: '3rd Year - Junior', value: 3 },
    { label: '4th Year - Senior', value: 4 },
  ];

  const bioValue = formData.bio;
  const remainingChars = 70 - (bioValue?.length || 0);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* Top Gradient Bar */}
        <LinearGradient
          colors={['#8fc95d', '#8fc95d', '#7fb84d']}
          style={styles.topBar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        
        {/* Header */}
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>SC</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join StudyCrew today</Text>
        </View>
        
        {/* Form */}
        <ScrollView 
          style={styles.form}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>👤</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>
          </View>
          
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>📧</Text>
              </View>
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
          </View>
          
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>🔒</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor="#9ca3af"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
              />
            </View>
          </View>
          
          {/* Academic Year */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Academic Year</Text>
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
                  <View style={styles.yearButtonContent}>
                    <View style={[
                      styles.yearNumber,
                      formData.academicYear === year.value && styles.yearNumberActive
                    ]}>
                      <Text style={[
                        styles.yearNumberText,
                        formData.academicYear === year.value && styles.yearNumberTextActive
                      ]}>
                        {year.value}
                      </Text>
                    </View>
                    <Text style={[
                      styles.yearButtonText,
                      formData.academicYear === year.value && styles.yearButtonTextActive,
                    ]}>
                      {year.label}
                    </Text>
                  </View>
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
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>✈️</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="@yourusername"
                placeholderTextColor="#9ca3af"
                value={formData.telegramUsername}
                onChangeText={(value) => updateFormData('telegramUsername', value)}
              />
            </View>
          </View>
          
          {/* Bio */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Bio (Optional)</Text>
            <View style={styles.inputWrapper}>
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
            </View>
            <Text style={[
              styles.charCount,
              remainingChars < 20 && styles.charCountWarning
            ]}>
              {remainingChars} characters remaining
            </Text>
          </View>
          
          {/* Submit Button */}
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
              {loading ? (
                <Text style={styles.registerButtonText}>Creating Account...</Text>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.registerButtonText}>Sign Up</Text>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  topBar: {
    height: 6,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
  },
  formContent: {
    paddingBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  iconText: {
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingLeft: 44,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
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
    paddingLeft: 16,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  charCountWarning: {
    color: '#f59e0b',
  },
  
  // Year Selection
  yearButtons: {
    gap: 8,
  },
  yearButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  yearButtonActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#8fc95d',
  },
  yearButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  yearNumber: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearNumberActive: {
    backgroundColor: '#8fc95d',
  },
  yearNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  yearNumberTextActive: {
    color: '#ffffff',
  },
  yearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  yearButtonTextActive: {
    color: '#166534',
  },
  
  // Info Box
  infoBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBoxText: {
    fontSize: 12,
    color: '#166534',
    flex: 1,
  },

  registerButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
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
  registerButtonDisabled: {
    opacity: 0.5,
  },
  registerButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#fafafa',
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
