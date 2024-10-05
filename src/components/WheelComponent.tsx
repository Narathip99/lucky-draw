import React, { useEffect, useState, useRef, useCallback } from "react";
import { WheelComponentProps } from "@/types/WheelComponentProps.interface";
import { Button } from "@/components/ui/button";

const WheelComponent: React.FC<WheelComponentProps> = ({
  segments,
  segColors,
  onFinished,
  isOnlyOnce = false,
  size = window.innerWidth,
  upDuration = 100,
  downDuration = 1000,
}: WheelComponentProps) => {
  const canvasId = useRef(`canvas-${Math.random().toString(36).substr(2, 9)}`);
  const wheelId = useRef(`wheel-${Math.random().toString(36).substr(2, 9)}`);

  const dimension = (size + 20) * 2;
  const centerX = size + 20;
  const centerY = size + 20;

  const angleCurrent = useRef(0);
  const angleDelta = useRef(0);

  const isStarted = useRef(false);
  const [isFinished, setFinished] = useState(false);
  const [isSpinning, setSpinning] = useState(false);
  const spinStartTimeRef = useRef(0);

  const timerHandle = useRef<number | null>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);
  const currentSegment = useRef("");

  const timerDelay = segments.length;
  const maxSpeed = useRef(Math.PI / segments.length);
  const upTime = useRef(segments.length * upDuration);
  const downTime = useRef(segments.length * downDuration);
  const frames = useRef(0);

  const getSegmentIndex = useCallback(
    (change: number): number => {
      let i =
        segments.length -
        Math.floor((change / (Math.PI * 2)) * segments.length) -
        1;
      return ((i % segments.length) + segments.length) % segments.length;
    },
    [segments]
  );

  const updateCurrentSegment = useCallback(
    (index: number) => {
      if (segments[index] !== undefined) {
        currentSegment.current = segments[index];
      } else {
        console.error("Invalid segment index:", index);
      }
    },
    [segments]
  );

  useEffect(() => {
    if (segments.length === 0) {
      console.error("Segments array is empty");
      return;
    }
    wheelInit();
    setTimeout(() => window.scrollTo(0, 1), 0);

    return () => {
      if (timerHandle.current) clearInterval(timerHandle.current);
    };
  }, [segments]);

  useEffect(() => {
    console.log("Current segment:", currentSegment.current);
  }, [currentSegment.current]);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    const canvas = document.getElementById(
      canvasId.current
    ) as HTMLCanvasElement;
    canvasContext.current = canvas?.getContext("2d");
  };

  const spin = () => {
    if (isFinished && isOnlyOnce) return;

    setSpinning(true);
    isStarted.current = true;
    spinStartTimeRef.current = new Date().getTime();
    maxSpeed.current = Math.PI / segments.length;
    frames.current = 0;
    timerHandle.current = window.setInterval(onTimerTick, timerDelay);
  };

  const onTimerTick = () => {
    frames.current++;
    draw();
    const duration = new Date().getTime() - spinStartTimeRef.current;
    let progress = 0;
    let finished = false;

    if (duration < upTime.current) {
      progress = duration / upTime.current;
      angleDelta.current =
        maxSpeed.current * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / downTime.current;
      angleDelta.current =
        maxSpeed.current * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      if (progress >= 1) finished = true;
    }

    angleCurrent.current += angleDelta.current;
    while (angleCurrent.current >= Math.PI * 2)
      angleCurrent.current -= Math.PI * 2;

    const change = angleCurrent.current - Math.PI / 2;
    const index = getSegmentIndex(change);
    updateCurrentSegment(index);

    if (finished) {
      setFinished(true);
      setSpinning(false);

      onFinished(currentSegment.current);

      if (timerHandle.current) clearInterval(timerHandle.current);
      angleDelta.current = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = (key: number, lastAngle: number, angle: number) => {
    if (!canvasContext.current) return;

    const ctx = canvasContext.current;
    const value = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.closePath();

    ctx.fillStyle = segColors[key % segColors.length];
    ctx.fill();
    ctx.stroke();

    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = "white";
    ctx.fillText(value.substring(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };

  const drawWheel = () => {
    if (!canvasContext.current) return;

    const ctx = canvasContext.current;
    let lastAngle = angleCurrent.current;
    const PI2 = Math.PI * 2;

    ctx.lineWidth = 1;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "1em proxima-nova";

    for (let i = 1; i <= segments.length; i++) {
      const angle = PI2 * (i / segments.length) + angleCurrent.current;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "white";
    ctx.stroke();
  };

  const drawNeedle = () => {
    if (!canvasContext.current) return;

    const ctx = canvasContext.current;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 50);
    ctx.lineTo(centerX + 26, centerY + 15);
    ctx.lineTo(centerX - 26, centerY + 15);
    ctx.closePath();
    ctx.fill();

    const change = angleCurrent.current - Math.PI / 2;
    const index = getSegmentIndex(change);
    updateCurrentSegment(index);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.font = "bold 1.5em";
  };

  const clear = () => {
    if (!canvasContext.current) return;
    canvasContext.current.clearRect(0, 0, dimension, dimension);
  };

  return (
    <div
      id={wheelId.current}
      className="w-full flex flex-col justify-center items-center gap-8"
    >
      <canvas
        id={canvasId.current}
        width={dimension}
        height={dimension}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto",
        }}
      />
      <Button
        onClick={spin}
        variant="default"
        size="lg"
        disabled={isSpinning}
        className="text-xl font-bold"
      >
        {isSpinning ? "Spinning..." : "Spinnn!"}
      </Button>
    </div>
  );
};

export default WheelComponent;
