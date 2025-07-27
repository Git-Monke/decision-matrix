import {
  BarChart3,
  Car,
  Home,
  Briefcase,
  GraduationCap,
  MapPin,
  Building,
  Plane,
  ShoppingCart,
  Heart,
  Coffee,
  type LucideIcon,
} from "lucide-react";

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  Car,
  Home,
  Briefcase,
  GraduationCap,
  MapPin,
  Building,
  Plane,
  ShoppingCart,
  Heart,
  Coffee,
};

// Get icon component by name, with fallback to BarChart3
export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || BarChart3;
}

// Get all available icon names for UI selection
export function getAvailableIcons(): string[] {
  return Object.keys(iconMap);
}

// Type for valid icon names
export type IconName = keyof typeof iconMap;