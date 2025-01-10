import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const Footer = () => {
  const [taps, setTaps] = useState(1);
  const colors = ['pink', '#ff69b4', '#ff1493', '#ff00ff', '#9370db', '#8a2be2'];
  
  const easteregg = () => {
    console.log('taps: ' + taps);
    setTaps((prev) => (prev >= colors.length ? 1 : prev + 1));
  }

  return (
    <View style={styles.footer}>
      <Pressable onPress={easteregg}>
        <Text style={[styles.footerText, { color: colors[taps - 1] }]}>
          Made with 🫧 by Kookie~
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Footer;