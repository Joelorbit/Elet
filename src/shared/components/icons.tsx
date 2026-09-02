import React from "react";
import type { LucideProps } from "lucide-react-native";
import {
  Home as LucideHome,
  Calendar as LucideCalendar,
  Church as LucideChurch,
  BookOpen as LucideBookOpen,
  Utensils as LucideUtensils,
  FileText as LucideFileText,
  Sliders as LucideSliders,
  Heart as LucideHeart,
  Shield as LucideShield,
  ShieldCheck as LucideShieldCheck,
  Check as LucideCheck,
  CheckCircle2 as LucideCheckCircle2,
  X as LucideX,
  Plus as LucidePlus,
  Search as LucideSearch,
  ArrowRight as LucideArrowRight,
  ArrowLeft as LucideArrowLeft,
  ChevronRight as LucideChevronRight,
  ChevronLeft as LucideChevronLeft,
  ChevronDown as LucideChevronDown,
  ChevronUp as LucideChevronUp,
  Pin as LucidePin,
  Lock as LucideLock,
  LockOpen as LucideLockOpen,
  Sun as LucideSun,
  Moon as LucideMoon,
  Sparkles as LucideSparkles,
  Fingerprint as LucideFingerprint,
  Trash2 as LucideTrash2,
  Info as LucideInfo,
  Globe as LucideGlobe,
  Bell as LucideBell,
  Download as LucideDownload,
  Upload as LucideUpload,
  RefreshCw as LucideRefreshCw,
  Star as LucideStar,
  Smartphone as LucideSmartphone,
  Flame as LucideFlame,
} from "lucide-react-native";

export interface IconProps extends LucideProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: object;
}

export type IconName =
  | "home"
  | "calendar"
  | "calendar-days"
  | "event"
  | "today"
  | "church"
  | "prayer"
  | "self-improvement"
  | "book-open"
  | "readings"
  | "menu-book"
  | "auto-stories"
  | "utensils"
  | "fasting"
  | "restaurant"
  | "file-text"
  | "notes"
  | "edit-note"
  | "sliders"
  | "settings"
  | "tune"
  | "heart"
  | "intercessions"
  | "favorite"
  | "shield"
  | "shield-check"
  | "confession"
  | "verified-user"
  | "check"
  | "check-circle"
  | "x"
  | "close"
  | "plus"
  | "add"
  | "search"
  | "arrow-right"
  | "arrow-forward"
  | "arrow-left"
  | "arrow-back"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "chevron-up"
  | "pin"
  | "push-pin"
  | "lock"
  | "lock-open"
  | "sun"
  | "moon"
  | "sparkles"
  | "sparkle"
  | "auto-awesome"
  | "fingerprint"
  | "trash"
  | "delete"
  | "info"
  | "globe"
  | "translate"
  | "language"
  | "bell"
  | "notifications"
  | "notifications-none"
  | "download"
  | "upload"
  | "cloud-download"
  | "refresh"
  | "system-update"
  | "star"
  | "flame"
  | "smartphone"
  | "cross";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  home: LucideHome,
  calendar: LucideCalendar,
  "calendar-days": LucideCalendar,
  event: LucideCalendar,
  today: LucideCalendar,
  church: LucideChurch,
  prayer: LucideChurch,
  "self-improvement": LucideChurch,
  "book-open": LucideBookOpen,
  readings: LucideBookOpen,
  "menu-book": LucideBookOpen,
  "auto-stories": LucideBookOpen,
  utensils: LucideUtensils,
  fasting: LucideUtensils,
  restaurant: LucideUtensils,
  "file-text": LucideFileText,
  notes: LucideFileText,
  "edit-note": LucideFileText,
  sliders: LucideSliders,
  settings: LucideSliders,
  tune: LucideSliders,
  heart: LucideHeart,
  intercessions: LucideHeart,
  favorite: LucideHeart,
  shield: LucideShield,
  "shield-check": LucideShieldCheck,
  confession: LucideShieldCheck,
  "verified-user": LucideShieldCheck,
  check: LucideCheck,
  "check-circle": LucideCheckCircle2,
  x: LucideX,
  close: LucideX,
  plus: LucidePlus,
  add: LucidePlus,
  search: LucideSearch,
  "arrow-right": LucideArrowRight,
  "arrow-forward": LucideArrowRight,
  "arrow-left": LucideArrowLeft,
  "arrow-back": LucideArrowLeft,
  "chevron-right": LucideChevronRight,
  "chevron-left": LucideChevronLeft,
  "chevron-down": LucideChevronDown,
  "chevron-up": LucideChevronUp,
  pin: LucidePin,
  "push-pin": LucidePin,
  lock: LucideLock,
  "lock-open": LucideLockOpen,
  sun: LucideSun,
  moon: LucideMoon,
  sparkles: LucideSparkles,
  sparkle: LucideSparkles,
  "auto-awesome": LucideSparkles,
  fingerprint: LucideFingerprint,
  trash: LucideTrash2,
  delete: LucideTrash2,
  info: LucideInfo,
  globe: LucideGlobe,
  translate: LucideGlobe,
  language: LucideGlobe,
  bell: LucideBell,
  notifications: LucideBell,
  "notifications-none": LucideBell,
  download: LucideDownload,
  upload: LucideUpload,
  "cloud-download": LucideDownload,
  refresh: LucideRefreshCw,
  "system-update": LucideRefreshCw,
  star: LucideStar,
  flame: LucideFlame,
  smartphone: LucideSmartphone,
};

export function LucideIcon({
  name,
  size = 20,
  color = "#8E4424",
  strokeWidth = 2,
  style,
  ...props
}: IconProps & { name: IconName | string }) {
  const Component = ICON_MAP[name] || LucideChurch;
  return (
    <Component
      size={size}
      width={size}
      height={size}
      color={color}
      strokeWidth={strokeWidth}
      style={[{ width: size, height: size, flexShrink: 0 }, style]}
      {...props}
    />
  );
}

export const AppIcon = LucideIcon;

// Named direct exports
export const Home = (props: IconProps) => <LucideHome {...props} />;
export const Calendar = (props: IconProps) => <LucideCalendar {...props} />;
export const Church = (props: IconProps) => <LucideChurch {...props} />;
export const BookOpen = (props: IconProps) => <LucideBookOpen {...props} />;
export const Utensils = (props: IconProps) => <LucideUtensils {...props} />;
export const FileText = (props: IconProps) => <LucideFileText {...props} />;
export const Sliders = (props: IconProps) => <LucideSliders {...props} />;
export const Heart = (props: IconProps) => <LucideHeart {...props} />;
export const ShieldCheck = (props: IconProps) => <LucideShieldCheck {...props} />;
export const Check = (props: IconProps) => <LucideCheck {...props} />;
export const CheckCircle2 = (props: IconProps) => <LucideCheckCircle2 {...props} />;
export const Plus = (props: IconProps) => <LucidePlus {...props} />;
export const Search = (props: IconProps) => <LucideSearch {...props} />;
export const ArrowRight = (props: IconProps) => <LucideArrowRight {...props} />;
export const ArrowLeft = (props: IconProps) => <LucideArrowLeft {...props} />;
export const ChevronRight = (props: IconProps) => <LucideChevronRight {...props} />;
export const ChevronLeft = (props: IconProps) => <LucideChevronLeft {...props} />;
export const Pin = (props: IconProps) => <LucidePin {...props} />;
export const Lock = (props: IconProps) => <LucideLock {...props} />;
export const LockOpen = (props: IconProps) => <LucideLockOpen {...props} />;
export const Sun = (props: IconProps) => <LucideSun {...props} />;
export const Moon = (props: IconProps) => <LucideMoon {...props} />;
export const Sparkles = (props: IconProps) => <LucideSparkles {...props} />;
export const Fingerprint = (props: IconProps) => <LucideFingerprint {...props} />;
export const Trash2 = (props: IconProps) => <LucideTrash2 {...props} />;
export const Info = (props: IconProps) => <LucideInfo {...props} />;
export const Globe = (props: IconProps) => <LucideGlobe {...props} />;
export const Bell = (props: IconProps) => <LucideBell {...props} />;
export const Download = (props: IconProps) => <LucideDownload {...props} />;
export const RefreshCw = (props: IconProps) => <LucideRefreshCw {...props} />;
export const Star = (props: IconProps) => <LucideStar {...props} />;
