import React from 'react';
import { Modal, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useAuthModal } from '../context/AuthModalContext';
import LoginCard from './LoginCard';
import RegisterCard from './RegisterCard';

const { width, height } = Dimensions.get('window');

export function AuthModalRoot() {
  const { open, type, closeModal } = useAuthModal();

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={closeModal}
        />
        <View style={styles.modalContainer}>
          {type === 'login' && <LoginCard onClose={closeModal} />}
          {type === 'register' && <RegisterCard onClose={closeModal} />}
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
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.85,
    backgroundColor: 'transparent',
  },
});
