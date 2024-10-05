export interface WheelComponentProps {
  segments: string[];
  segColors: string[];
  onFinished: (segment: string) => void;
  isOnlyOnce?: boolean;
  size?: number;
  upDuration?: number;
  downDuration?: number;
}
