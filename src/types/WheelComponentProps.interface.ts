import { Prize } from "@/types/Prize.interface";

export interface WheelComponentProps {
  segments: Prize[];
  segColors: string[];
  winningSegment: string;
  onFinished: (segment: string) => void;
  primaryColor?: string;
  contrastColor?: string;
  buttonText?: string;
  isOnlyOnce?: boolean;
  size?: number;
  upDuration?: number;
  downDuration?: number;
  fontFamily?: string;
  fontSize?: string;
  outlineWidth?: number;
}
