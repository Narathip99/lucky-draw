import React from "react";
import { Prize } from "@/types/prize.interface";

type Props = {
  prizes: Prize[];
  rotation: number;
};

const Wheel: React.FC<Props> = ({ prizes, rotation }) => {
  const totalRotation = 360;
  const centerX = 200;
  const centerY = 200;
  const radius = 180;

  const calculatePrizeRotation = (
    percentage: number,
    currentRotation: number
  ) => {
    const rotation = (percentage / 100) * totalRotation;
    return {
      start: currentRotation,
      end: currentRotation + rotation,
    };
  };

  const getColor = (index: number) => {
    const colors = [
      "#ff4136",
      "#0074d9",
      "#2ecc40",
      "#ff851b",
      "#b10dc9",
      "#39cccc",
      "#01ff70",
    ];
    return colors[index % colors.length];
  };

  const createSectors = () => {
    let currentRotation = 0;
    return prizes.map((prize, index) => {
      const { start, end } = calculatePrizeRotation(
        prize.percentage,
        currentRotation
      );
      const midAngle = (start + end) / 2;
      const largeArcFlag = prize.percentage > 50 ? 1 : 0;

      const x1 = centerX + radius * Math.cos((Math.PI * start) / 180);
      const y1 = centerY + radius * Math.sin((Math.PI * start) / 180);
      const x2 = centerX + radius * Math.cos((Math.PI * end) / 180);
      const y2 = centerY + radius * Math.sin((Math.PI * end) / 180);

      const textX =
        centerX + radius * 0.7 * Math.cos((Math.PI * midAngle) / 180);
      const textY =
        centerY + radius * 0.7 * Math.sin((Math.PI * midAngle) / 180);

      currentRotation += (prize.percentage / 100) * totalRotation;

      return (
        <g key={prize.name}>
          <path
            d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
            fill={getColor(index)}
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            fill="white"
            fontSize="16px"
            fontWeight="bold"
            transform={`rotate(${midAngle}, ${textX}, ${textY})`}
          >
            {prize.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative">
      <svg width="400" height="400" viewBox="0 0 400 400">
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="white"
          stroke="white"
          strokeWidth="10"
        />
        <g transform={`rotate(${rotation}, ${centerX}, ${centerY})`}>
          {createSectors()}
        </g>
        <path
          d={`M ${centerX} ${centerY - 30}
              C ${centerX - 30} ${centerY - 30}, 
              ${centerX - 30} ${centerY + 5}, ${centerX} ${centerY + 30}
              C ${centerX + 30} ${centerY + 5}, ${centerX + 30} 
              ${centerY - 30}, ${centerX} ${centerY - 30}Z
              `}
          fill="white"
        />
      </svg>
    </div>
  );
};

export default Wheel;
