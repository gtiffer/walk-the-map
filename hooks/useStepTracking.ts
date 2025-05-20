import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Pedometer from 'expo-sensors/build/Pedometer';
import { useEffect, useState } from 'react';

const STORAGE_KEY = '@walk-the-map/total-steps';

interface StepData {
  stepsToday: number;
  totalSteps: number;
  isPedometerAvailable: boolean;
  error: string | null;
}

export function useStepTracking() {
  const [stepData, setStepData] = useState<StepData>({
    stepsToday: 0,
    totalSteps: 0,
    isPedometerAvailable: false,
    error: null,
  });

  // Load total steps from storage
  useEffect(() => {
    const loadTotalSteps = async () => {
      try {
        const storedTotal = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTotal) {
          setStepData(prev => ({ ...prev, totalSteps: parseInt(storedTotal, 10) }));
        }
      } catch (error) {
        console.error('Error loading total steps:', error);
        setStepData(prev => ({ ...prev, error: 'Failed to load step history' }));
      }
    };
    loadTotalSteps();
  }, []);

  // Check pedometer availability and start tracking
  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;

    const setupPedometer = async () => {
      try {
        // Check if pedometer is available
        const isAvailable = await Pedometer.isAvailableAsync();
        setStepData(prev => ({ ...prev, isPedometerAvailable: isAvailable }));

        if (!isAvailable) {
          setStepData(prev => ({ ...prev, error: 'Step counting is not available on this device' }));
          return;
        }

        // Get initial step count for today
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0); // midnight today

        const { steps } = await Pedometer.getStepCountAsync(start, end);
        setStepData(prev => ({ ...prev, stepsToday: steps }));

        // Subscribe to step updates
        subscription = Pedometer.watchStepCount(result => {
          setStepData(prev => {
            const newStepsToday = prev.stepsToday + result.steps;
            const newTotalSteps = prev.totalSteps + result.steps;
            
            // Save new total to storage
            AsyncStorage.setItem(STORAGE_KEY, newTotalSteps.toString()).catch(error => {
              console.error('Error saving total steps:', error);
            });

            return {
              ...prev,
              stepsToday: newStepsToday,
              totalSteps: newTotalSteps,
            };
          });
        });
      } catch (error) {
        console.error('Error setting up pedometer:', error);
        setStepData(prev => ({ ...prev, error: 'Failed to start step tracking' }));
      }
    };

    setupPedometer();

    // Cleanup subscription
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return stepData;
} 