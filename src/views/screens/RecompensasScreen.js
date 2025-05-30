// RecompensasScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecompensasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla Recompensas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
