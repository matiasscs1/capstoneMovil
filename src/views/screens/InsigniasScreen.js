// InsigniasScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InsigniasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla Insignias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
