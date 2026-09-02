import { View, Text, StyleSheet } from 'react-native';

export default function AIGenerateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Document Generator</Text>
      <Text style={styles.subtitle}>Create documents from text prompts</Text>
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
