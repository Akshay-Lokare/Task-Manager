import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

const Toast = ({ message, visible, onHide }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <BlurView intensity={50} style={styles.blur}>
        <Text style={styles.text}>{message}</Text>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 25,
    overflow: 'hidden',
    zIndex: 999,
  },
  blur: {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    padding: 16,
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
  },
  text: {
    color: '#008B8B',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Toast; 