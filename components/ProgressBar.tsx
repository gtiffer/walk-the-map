import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const percent = Math.round(progress * 100);
  const milestones = [0.25, 0.5, 0.75];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{percent}% complete</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
        {/* Milestone markers */}
        {milestones.map((m, i) => (
          <View
            key={i}
            style={[styles.marker, { left: `${m * 100}%` }]}
          >
            <View style={styles.tick} />
            <Text style={styles.markerLabel}>{Math.round(m * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const BAR_HEIGHT = 24;
const BAR_RADIUS = 12;
const BAR_COLOR = '#3B82F6'; // Tailwind blue-500
const BAR_BG = '#E5E7EB'; // Tailwind gray-200
const MARKER_COLOR = '#2563EB'; // Tailwind blue-600

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  barBackground: {
    width: '100%',
    height: BAR_HEIGHT,
    backgroundColor: BAR_BG,
    borderRadius: BAR_RADIUS,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: BAR_COLOR,
    borderRadius: BAR_RADIUS,
  },
  marker: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    width: 40,
    marginLeft: -20,
  },
  tick: {
    width: 2,
    height: BAR_HEIGHT,
    backgroundColor: MARKER_COLOR,
    borderRadius: 1,
    marginBottom: 2,
  },
  markerLabel: {
    fontSize: 12,
    color: MARKER_COLOR,
    fontWeight: '500',
    marginTop: 2,
  },
}); 