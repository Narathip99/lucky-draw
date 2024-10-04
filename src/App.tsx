import React, { useState } from "react";
// interface
import { Prize } from "@/types/prize.interface";
// components
import Wheel from "@/components/Wheel";
import { Button } from "@/components/ui/button";

// prize
const initialPrizes: Prize[] = [
  { name: "Apple Watch", percentage: 5, count: 1 },
  { name: "Vacuum Cleaner", percentage: 10, count: 2 },
  { name: "Cash Prize", percentage: 20, count: Infinity },
  { name: "Thank you 😊", percentage: 20, count: Infinity },
  { name: "Thank you 🙏", percentage: 20, count: Infinity },
  { name: "Thank you 😱", percentage: 15, count: Infinity },
  { name: "Thank you 😂", percentage: 10, count: Infinity },
];

function App() {
  const [prizes, setPrizes] = useState(initialPrizes);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  //
  console.log(`${prizes.map((prize) => prize.count)} \n ${spinning}`);

  //
  const spinWheel = () => {
    if (spinning) return; // already spinning!!!

    // start spinning
    setSpinning(true);

    // generate a random rotation (between 360 and 3600 degrees)
    const randomRotation = Math.floor(Math.random() * 3600) + 360;

    // set the new rotation
    setRotation((prev) => prev + randomRotation);

    // set timeout to stop spinning
    setTimeout(() => {
      setSpinning(false);
    }, 5000);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold">Which reward will you get?</h1>
      <Wheel prizes={prizes} rotation={rotation} />
      <Button
        onClick={spinWheel}
        variant="default"
        size="lg"
        className="text-xl"
      >
        Spin!
      </Button>
      <ul className="my-4">
        {prizes.slice(0, 3).map((prize) => (
          <li key={prize.name}>
            {prize.name}: {prize.count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
