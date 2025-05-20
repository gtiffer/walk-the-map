import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, Path, Rect, Text as SvgText } from 'react-native-svg';
import { IconSymbol } from './ui/IconSymbol';

// SVG path from us-outline.svg
const US_PATH =
  'M50,500 L100,400 L200,420 L250,350 L300,370 L350,320 L400,340 L450,300 L500,320 L550,280 L600,300 L650,250 L700,270 L750,220 L800,240 L850,200 L900,220 L910,300 L900,400 L850,420 L800,500 L700,520 L600,540 L500,530 L400,520 L300,510 L200,500 L100,520 Z';

const SVG_WIDTH = 960;
const SVG_HEIGHT = 600;

interface USProgressBarProps {
  totalMiles: number;
  totalRouteMiles?: number;
}

export function USProgressBar({ totalMiles, totalRouteMiles = 2800 }: USProgressBarProps) {
  const colorScheme = useColorScheme();
  const progress = Math.min(totalMiles / totalRouteMiles, 1);

  // Calculate the x position for the walking icon (keep it inside the shape)
  const iconX = 50 + (860 * progress); // 50 is leftmost, 910-50=860 is the width of the path
  const iconY = 420 - 100 * Math.abs(0.5 - progress); // Vary Y a bit for visual interest

  // Colors
  const outlineColor = '#D1D5DB'; // Tailwind gray-300
  const fillColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}> 
        <Defs>
          <ClipPath id="usClip">
            <Path d={US_PATH} />
          </ClipPath>
        </Defs>
        {/* Subtle US outline */}
        <Path d={US_PATH} fill="#F3F4F6" stroke={outlineColor} strokeWidth={8} />
        {/* Bold progress fill, clipped to US shape */}
        <Rect
          x="0"
          y="0"
          width={SVG_WIDTH * progress}
          height={SVG_HEIGHT}
          fill={fillColor}
          clipPath="url(#usClip)"
          opacity={0.85}
        />
        {/* Walking icon at progress point, always inside shape */}
        <Svg x={iconX - 16} y={iconY - 32} width={32} height={32}>
          <IconSymbol name="figure.walk" size={32} color={fillColor} />
        </Svg>
        {/* Progress label inside the shape */}
        <SvgText
          x={SVG_WIDTH / 2}
          y={SVG_HEIGHT / 2 + 30}
          fontSize="48"
          fontWeight="bold"
          fill={fillColor}
          opacity="0.8"
          textAnchor="middle"
        >
          {(progress * 100).toFixed(1)}%
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 960 / 600,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
}); 