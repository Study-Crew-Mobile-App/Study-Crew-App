import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../context/AuthContext';

interface TabNavigatorProps {
  currentScreen?: string;
}

export default function TabNavigator({ currentScreen }: TabNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const tabs = [
    {
      id: 'home',
      name: 'Home',
      icon: '🏠',
      route: '/home',
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      route: user?.role === 'assistant' ? '/dashboard/assistant' : '/dashboard/user',
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: '👤',
      route: '/profile',
    },
  ];

  const handleTabPress = (route: string) => {
    if (pathname !== route) {
      router.push(route as any);
    }
  };

  const isActiveTab = (route: string) => {
    return pathname === route || (route.includes('/dashboard') && pathname.includes('/dashboard'));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.95)']}
        style={styles.gradient}
      />
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = isActiveTab(tab.route);
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isActive && styles.activeTab,
              ]}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.tabIcon,
                isActive && styles.activeTabIcon,
              ]}>
                <Text style={[
                  styles.iconText,
                  isActive && styles.activeIconText,
                ]}>
                  {tab.icon}
                </Text>
              </View>
              <Text style={[
                styles.tabText,
                isActive && styles.activeTabText,
              ]}>
                {tab.name}
              </Text>
              {isActive && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: 'transparent',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(143, 201, 93, 0.1)',
  },
  tabIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: '#f3f4f6',
  },
  activeTabIcon: {
    backgroundColor: '#8fc95d',
  },
  iconText: {
    fontSize: 16,
    lineHeight: 16,
  },
  activeIconText: {
    // Icon color stays the same, just background changes
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#166534',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -12 }],
    width: 24,
    height: 3,
    backgroundColor: '#8fc95d',
    borderRadius: 2,
  },
});
