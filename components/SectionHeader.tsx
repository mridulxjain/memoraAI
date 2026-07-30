import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Colors, Layout } from '@/constants/Theme';

interface SectionHeaderProps {
  title: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: any;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionTitle, onAction, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={Typography.h2}>{title}</Text>
      {actionTitle && (
        <Text onPress={onAction} style={styles.action}>
          {actionTitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.padding,
    paddingHorizontal: Layout.padding,
  },
  action: {
    ...Typography.body,
    color: Colors.accent,
    fontWeight: '500',
  },
});
