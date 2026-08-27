import React from 'react';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';

export type IconName =
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'shield'
  | 'shield-check'
  | 'stethoscope'
  | 'clock'
  | 'arrow-right'
  | 'arrow-left'
  | 'alert-circle'
  | 'phone'
  | 'message-circle'
  | 'sparkles'
  | 'log-out'
  | 'check-circle'
  | 'user'
  | 'building'
  | 'pulse'
  | 'calendar'
  | 'layout-dashboard'
  | 'map-pin'
  | 'users'
  | 'chevron-right'
  | 'award'
  | 'activity'
  | 'heart'
  | 'save'
  | 'refresh-cw';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const FeatherIcon = Feather as unknown as React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
}>;

const MaterialCommunityIcon = MaterialCommunityIcons as unknown as React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
}>;

const Ionicon = Ionicons as unknown as React.ComponentType<{
  name: string;
  size?: number;
  color?: string;
}>;

export function Icon({ name, size = 20, color = '#111827' }: IconProps) {
  switch (name) {
    case 'mail':
      return <FeatherIcon name="mail" size={size} color={color} />;
    case 'lock':
      return <FeatherIcon name="lock" size={size} color={color} />;
    case 'eye':
      return <FeatherIcon name="eye" size={size} color={color} />;
    case 'eye-off':
      return <FeatherIcon name="eye-off" size={size} color={color} />;
    case 'shield':
      return <FeatherIcon name="shield" size={size} color={color} />;
    case 'shield-check':
      return <MaterialCommunityIcon name="shield-check-outline" size={size} color={color} />;
    case 'stethoscope':
      return <MaterialCommunityIcon name="stethoscope" size={size} color={color} />;
    case 'clock':
      return <FeatherIcon name="clock" size={size} color={color} />;
    case 'arrow-right':
      return <FeatherIcon name="arrow-right" size={size} color={color} />;
    case 'arrow-left':
      return <FeatherIcon name="arrow-left" size={size} color={color} />;
    case 'alert-circle':
      return <FeatherIcon name="alert-circle" size={size} color={color} />;
    case 'phone':
      return <FeatherIcon name="phone" size={size} color={color} />;
    case 'message-circle':
      return <Ionicon name="chatbubble-ellipses-outline" size={size} color={color} />;
    case 'sparkles':
      return <MaterialCommunityIcon name="sparkles" size={size} color={color} />;
    case 'log-out':
      return <FeatherIcon name="log-out" size={size} color={color} />;
    case 'check-circle':
      return <FeatherIcon name="check-circle" size={size} color={color} />;
    case 'user':
      return <FeatherIcon name="user" size={size} color={color} />;
    case 'building':
      return <MaterialCommunityIcon name="hospital-building" size={size} color={color} />;
    case 'pulse':
      return <MaterialCommunityIcon name="heart-pulse" size={size} color={color} />;
    case 'calendar':
      return <FeatherIcon name="calendar" size={size} color={color} />;
    case 'layout-dashboard':
      return <MaterialCommunityIcon name="view-dashboard-outline" size={size} color={color} />;
    case 'map-pin':
      return <FeatherIcon name="map-pin" size={size} color={color} />;
    case 'users':
      return <FeatherIcon name="users" size={size} color={color} />;
    case 'chevron-right':
      return <FeatherIcon name="chevron-right" size={size} color={color} />;
    case 'award':
      return <FeatherIcon name="award" size={size} color={color} />;
    case 'activity':
      return <FeatherIcon name="activity" size={size} color={color} />;
    case 'heart':
      return <FeatherIcon name="heart" size={size} color={color} />;
    case 'save':
      return <FeatherIcon name="save" size={size} color={color} />;
    case 'refresh-cw':
      return <FeatherIcon name="refresh-cw" size={size} color={color} />;
    default:
      return <FeatherIcon name="help-circle" size={size} color={color} />;
  }
}
