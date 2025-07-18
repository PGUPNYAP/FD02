import React from 'react';
import { View, Text } from 'react-native';
import {
  WifiIcon,
  BoltIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  LockClosedIcon,
  PrinterIcon,
} from 'react-native-heroicons/outline';

interface FacilityIconProps {
  facility: string;
  size?: number;
}

const facilityIcons: { [key: string]: any } = {
  'WiFi': WifiIcon,
  'AC': BoltIcon,
  'Air Conditioning': BoltIcon,
  'Power Backup': BoltIcon,
  'CCTV': VideoCameraIcon,
  'Security': ShieldCheckIcon,
  'Parking': TruckIcon,
  'Cafeteria': BuildingStorefrontIcon,
  'Lockers': LockClosedIcon,
  'Printing': PrinterIcon,
  'Study Material': PrinterIcon,
  'Drinking Water': BoltIcon,
};

const facilityColors: { [key: string]: string } = {
  'WiFi': '#3b82f6',
  'AC': '#10b981',
  'Air Conditioning': '#10b981',
  'Power Backup': '#f59e0b',
  'CCTV': '#8b5cf6',
  'Security': '#ef4444',
  'Parking': '#6b7280',
  'Cafeteria': '#f97316',
  'Lockers': '#06b6d4',
  'Printing': '#84cc16',
  'Study Material': '#84cc16',
  'Drinking Water': '#0ea5e9',
};

export default function FacilityIcon({ facility, size = 20 }: FacilityIconProps) {
  const IconComponent = facilityIcons[facility] || BoltIcon;
  const color = facilityColors[facility] || '#6b7280';

  return (
    <View className="flex-row items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 mr-2 mb-2">
      <IconComponent size={size} color={color} />
      <Text className="ml-2 text-sm font-medium text-gray-700">{facility}</Text>
    </View>
  );
}