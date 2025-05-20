import { ProgressBar } from '@/components/ProgressBar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useStepTracking } from '@/hooks/useStepTracking';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { stepsToday, totalSteps, isPedometerAvailable, error } = useStepTracking();

  // Calculate approximate distance (assuming average step length of 2.5 feet)
  const stepsToMiles = (steps: number) => (steps * 2.5) / 5280;
  const todayMiles = stepsToMiles(stepsToday).toFixed(1);
  const totalMiles = stepsToMiles(totalSteps);
  const US_MILES = 2800;
  const progress = Math.min(totalMiles / US_MILES, 1);

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.errorTitle}>
          Oops!
        </ThemedText>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!isPedometerAvailable) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.errorTitle}>
          Step Counting Not Available
        </ThemedText>
        <ThemedText style={styles.errorText}>
          Your device doesn't support step counting. Try using a different device.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Walk the Map
      </ThemedText>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardLabel}>
            Today's Steps
          </ThemedText>
          <ThemedText type="title" style={styles.cardValue}>
            {stepsToday.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.cardSubtext}>
            {todayMiles} miles
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="defaultSemiBold" style={styles.cardLabel}>
            Total Steps
          </ThemedText>
          <ThemedText type="title" style={styles.cardValue}>
            {totalSteps.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.cardSubtext}>
            {totalMiles.toFixed(1)} miles
          </ThemedText>
        </View>
      </View>

      <View style={styles.progressSection}>
        <ThemedText type="defaultSemiBold" style={styles.progressLabel}>
          Progress Across the U.S.
        </ThemedText>
        <ProgressBar progress={progress} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  cardValue: {
    fontSize: 28,
    marginBottom: 4,
    fontWeight: '700',
    color: '#222',
  },
  cardSubtext: {
    fontSize: 14,
    opacity: 0.7,
    color: '#222',
  },
  progressSection: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 18,
    marginBottom: 8,
    color: '#222',
    fontWeight: '600',
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
