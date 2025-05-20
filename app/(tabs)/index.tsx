import * as Pedometer from 'expo-sensors/build/Pedometer';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PedometerResult {
  steps: number;
}

export default function HomeScreen() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking...');
  const [stepsToday, setStepsToday] = useState(0);

  useEffect(() => {
    // Check if pedometer is available
    Pedometer.isAvailableAsync().then(
      (result: boolean) => setIsPedometerAvailable(result ? 'Yes' : 'No'),
      (error: Error) => setIsPedometerAvailable('Error: ' + error)
    );

    // Get step count for today
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0); // midnight today

    Pedometer.getStepCountAsync(start, end).then(
      (result: PedometerResult) => setStepsToday(result.steps),
      (error: Error) => console.error(error)
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Walk the Map</Text>
      <Text>Pedometer Available: {isPedometerAvailable}</Text>
      <Text>Steps Today: {stepsToday}</Text>
      <Text>Total Steps: coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
