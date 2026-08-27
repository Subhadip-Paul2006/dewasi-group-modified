import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '../theme';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Phase 0 Foundation</Text>
        </View>

        <Text style={styles.title}>Dewasi Group</Text>
        <Text style={styles.subtitle}>Smart Healthcare & Queue Ecosystem</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mobile Architecture Ready</Text>
          <Text style={styles.cardText}>
            React Native + Expo Router + TanStack Query + Secure Auth Foundation
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Test Auth Route</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(main)')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Test Main Route</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSoft,
  },
  content: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.light.secondaryLight,
    paddingHorizontal: Spacing.two + Spacing.half,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
    marginBottom: Spacing.three,
  },
  badgeText: {
    color: Colors.light.secondaryDark,
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
  },
  title: {
    fontSize: Typography.fontSizes['3xl'],
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.light.primaryDark,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.light.ink500,
    textAlign: 'center',
    marginBottom: Spacing.five,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.light.surfaceWhite,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.surface200,
    marginBottom: Spacing.five,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.light.ink900,
    marginBottom: Spacing.one,
  },
  cardText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.light.ink600,
    lineHeight: Typography.lineHeights.sm,
  },
  buttonGroup: {
    width: '100%',
    gap: Spacing.two,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.light.surfaceWhite,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
  },
  secondaryButton: {
    backgroundColor: Colors.light.surfaceWhite,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.light.ink700,
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
  },
});
