import { View, Text, StyleSheet } from 'react-native';

export default function TransferScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>File Transfer</Text>
      <Text style={styles.subtitle}>Send files between devices</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
