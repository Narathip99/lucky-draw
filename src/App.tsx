import { useState } from "react";
import { Prize } from "@/types/prize.interface";
import WheelComponent from "./components/WheelComponent";

// initial prizes
const initialPrizes: Prize[] = [
  { name: "Apple Watch", count: 1 },
  { name: "Vacuum Cleaner", count: 2 },
  { name: "Cash Prize", count: Infinity },
  { name: "Thank you 😊", count: Infinity },
  { name: "Thank you 🙏", count: Infinity },
  { name: "Thank you 😱", count: Infinity },
  { name: "Thank you 😂", count: Infinity },
];

function App() {
  const [prizes, setPrizes] = useState(initialPrizes);
  const [winner, setWinner] = useState("");

  const segments = prizes
    .filter((prize) => prize.count > 0) // Filter out depleted prizes
    .map((prize) => prize.name);

  // segment colors
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
    "#F9AA1F",
  ];

  const updatePrizes = (winningSegment: string) => {
    const updatedPrizes = prizes.map((prize) => {
      if (prize.name === winningSegment && prize.count > 0) {
        return { ...prize, count: prize.count - 1 };
      }
      return prize;
    });
    setPrizes(updatedPrizes);
  };

  const onFinished = (winningSegment: string) => {
    const prize = prizes.find((prize) => prize.name === winningSegment);
    if (prize && prize.count > 0) {
      updatePrizes(winningSegment); // Update prize counts
      setWinner(winningSegment); // Update winner state
      console.log(`You won: ${winningSegment}`);
    } else {
      console.log("No more prizes left for this segment.");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold">Which reward will you get?</h1>
      {/* wheel */}
      <WheelComponent
        segments={segments}
        segColors={segColors}
        winningSegment={winner}
        onFinished={onFinished}
        isOnlyOnce={false}
        size={200}
        upDuration={300}
        downDuration={300}
      />
      <ul className="my-4">
        {prizes.slice(0, 3).map((prize) => (
          <li key={prize.name}>
            {prize.name}: {prize.count === Infinity ? "Unlimited" : prize.count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
