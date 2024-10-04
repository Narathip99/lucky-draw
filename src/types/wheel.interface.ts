import { Prize } from "@/types/prize.interface";

export interface Wheel {
  segments: Prize[]; // array of prize objects
  segColors: string[];
  winningSegment: string;
  onFinished: (segment: Prize) => void; // Changed to return a Prize object
  isOnlyOnce?: boolean;
  size?: number;
  upDuration?: number;
  downDuration?: number;
  fontSize?: string;
}
