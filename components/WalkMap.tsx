import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

// Approximate route across the U.S. (simplified for MVP)
const US_ROUTE = [
  { latitude: 32.7157, longitude: -117.1611 }, // San Diego, CA
  { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles, CA
  { latitude: 36.7783, longitude: -119.4179 }, // Fresno, CA
  { latitude: 39.7392, longitude: -104.9903 }, // Denver, CO
  { latitude: 41.8781, longitude: -87.6298 }, // Chicago, IL
  { latitude: 40.7128, longitude: -74.0060 }, // New York, NY
];

// Total distance of the route in miles (approximate)
const TOTAL_ROUTE_DISTANCE = 2800;

interface WalkMapProps {
  totalMiles: number;
}

export function WalkMap({ totalMiles }: WalkMapProps) {
  const mapRef = useRef<MapView>(null);
  const colorScheme = useColorScheme();
  const [currentPosition, setCurrentPosition] = useState(US_ROUTE[0]);

  // Calculate progress along the route
  useEffect(() => {
    const progress = Math.min(totalMiles / TOTAL_ROUTE_DISTANCE, 1);
    const segmentIndex = Math.floor(progress * (US_ROUTE.length - 1));
    const segmentProgress = (progress * (US_ROUTE.length - 1)) % 1;

    if (segmentIndex < US_ROUTE.length - 1) {
      const start = US_ROUTE[segmentIndex];
      const end = US_ROUTE[segmentIndex + 1];
      
      setCurrentPosition({
        latitude: start.latitude + (end.latitude - start.latitude) * segmentProgress,
        longitude: start.longitude + (end.longitude - start.longitude) * segmentProgress,
      });
    } else {
      setCurrentPosition(US_ROUTE[US_ROUTE.length - 1]);
    }

    // Center map on current position
    mapRef.current?.animateToRegion({
      ...currentPosition,
      latitudeDelta: 10,
      longitudeDelta: 10,
    }, 1000);
  }, [totalMiles]);

  return (
    <ThemedView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 39.8283,
          longitude: -98.5795,
          latitudeDelta: 50,
          longitudeDelta: 50,
        }}
        mapType="standard"
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsTraffic={false}
        showsBuildings={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
      >
        {/* Route line */}
        <Polyline
          coordinates={US_ROUTE}
          strokeColor={Colors[colorScheme ?? 'light'].tint}
          strokeWidth={3}
        />

        {/* Start marker */}
        <Marker coordinate={US_ROUTE[0]}>
          <IconSymbol
            name="flag.fill"
            size={24}
            color={Colors[colorScheme ?? 'light'].tint}
          />
        </Marker>

        {/* Current position marker */}
        <Marker coordinate={currentPosition}>
          <IconSymbol
            name="figure.walk"
            size={24}
            color={Colors[colorScheme ?? 'light'].tint}
          />
        </Marker>

        {/* End marker */}
        <Marker coordinate={US_ROUTE[US_ROUTE.length - 1]}>
          <IconSymbol
            name="flag.checkered"
            size={24}
            color={Colors[colorScheme ?? 'light'].tint}
          />
        </Marker>
      </MapView>

      <ThemedView style={styles.progressContainer}>
        <ThemedText style={styles.progressText}>
          {totalMiles.toFixed(1)} / {TOTAL_ROUTE_DISTANCE} miles
        </ThemedText>
        <ThemedText style={styles.progressSubtext}>
          {((totalMiles / TOTAL_ROUTE_DISTANCE) * 100).toFixed(1)}% of the way across the U.S.!
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width - 40, // Account for container padding
    height: '100%',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 