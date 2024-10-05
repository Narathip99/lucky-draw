import { useState } from "react";
import { Prize } from "@/types/Prize.interface";
import WheelComponent from "./components/WheelComponent";
import WinnerModal from "./components/WinnerModal";

// img
import appleWatchIMG from "./assets/apple-watch.png";
import vacuumCleanerIMG from "./assets/vacuum-cleaner.png";
import moneyIMG from "./assets/money.png";

function App() {
  // initial prizes
  const initialPrizes: Prize[] = [
    { name: "Apple Watch", count: 1, image: appleWatchIMG, color: "#EE4040" },
    {
      name: "Vacuum Cleaner",
      count: 2,
      image: vacuumCleanerIMG,
      color: "#F0CF50",
    },
    { name: "Cash Prize", count: Infinity, image: moneyIMG, color: "#815CD1" },
    { name: "Thank you 😊", count: Infinity, image: null, color: "#3DA5E0" },
    { name: "Thank you 🙏", count: Infinity, image: null, color: "#34A24F" },
    { name: "Thank you 😱", count: Infinity, image: null, color: "#F9AA1F" },
    { name: "Thank you 😂", count: Infinity, image: null, color: "#ACFF56" },
  ];

  const [prizes, setPrizes] = useState(initialPrizes);
  const [isModalVisible, setModalVisible] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);

  // segments and segColors get the prizes to display in the wheel
  const segments: string[] = prizes
    .filter((prize) => prize.count > 0)
    .map((prize) => prize.name);

  const segColors: string[] = prizes
    .filter((prize) => prize.count > 0)
    .map((prize) => prize.color);

  // get the prize object from the wheel to display in the winner modal
  const onFinished = (winnerName: string) => {
    //console.log("Winner Name:", winnerName);
    const winnerPrize = prizes.find((prize) => prize.name === winnerName);

    if (!winnerPrize) {
      console.error("Error: Undefined Winner");
      return;
    }

    console.log("Winner Prize:", winnerPrize);
    setWinner(winnerPrize);
    setModalVisible(true);

    // Decrease prize count if not unlimited
    setPrizes((prevPrizes) =>
      prevPrizes.map((prize) =>
        prize.name === winnerName && prize.count !== Infinity
          ? { ...prize, count: prize.count - 1 }
          : prize
      )
    );
  };

  // log quantity of each prize
  console.log(
    prizes.map((prize) => `${prize.name}: ${prize.count}`).join("\n")
  );

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Which reward will you get?</h1>
      {/* wheel */}
      <WheelComponent
        segments={segments}
        segColors={segColors}
        onFinished={(winnerName) => onFinished(winnerName)}
        isOnlyOnce={false}
        size={180}
        upDuration={100}
        downDuration={300}
      />

      {/* Modal to show the winner */}
      <WinnerModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        winner={winner}
      />
    </div>
  );
}

export default App;
