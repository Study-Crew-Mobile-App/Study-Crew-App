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
import { useRouter } from 'expo-router';

interface LoginCardProps {
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function LoginCard({ onClose }: LoginCardProps) {
  const { login, loading, error, clearError } = useAuth();
  const { switchModal, intent } = useAuthModal();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    clearError();
    const success = await login(email, password);
    
    if (success) {
      onClose();
      // Navigate based on role
      if (intent === 'assistant' || email.includes('assistant')) {
        router.replace('/dashboard/assistant');
      } else {
        router.replace('/dashboard/user');
      }
    } else {
      Alert.alert('Login Failed', error || 'Invalid credentials');
    }
  };

  const handleRegister = () => {
    // Switch to registration modal
    switchModal('register');
  };

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
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>
        
        {/* Form */}
        <View style={styles.form}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
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
                value={email}
                onChangeText={setEmail}
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
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={['#8fc95d', '#7fb84d']}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <Text style={styles.loginButtonText}>Signing in...</Text>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  loginButton: {
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
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
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
