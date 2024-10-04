import React, { useState, useEffect, useMemo } from "react";
import { WinnerModalProps } from "@/types/WinnerModalProps.interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WinnerModal: React.FC<WinnerModalProps> = ({
  isVisible = false,
  onClose,
  winner = { name: "", image: "" },
}) => {
  if (!isVisible) return null;

  if (!winner || !winner.name) {
    console.error("Error: Undefined Winner");
    return null;
  }

  const [hasUserWonPrize, setHasUserWonPrize] = useState(false);
  const randomCashPrizeAmount = useMemo(
    () => Math.floor(Math.random() * 1501),
    []
  );

  useEffect(() => {
    const wonPrizes = ["Apple Watch", "Vacuum Cleaner", "Cash Prize"];
    setHasUserWonPrize(wonPrizes.includes(winner.name));
  }, [winner.name]);

  const isCashPrize = winner.name === "Cash Prize";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50">
      <Card className="py-8 px-12 bg-red-800 flex flex-col items-center justify-center gap-4">
        {hasUserWonPrize ? (
          <div>
            <img
              src={winner.image}
              alt={winner.name}
              width="200"
              height="200"
            />
            <p className="text-center text-white text-xl font-semibold">
              Congratulation! <br />
              You Got{" "}
              {isCashPrize ? `${randomCashPrizeAmount} Baht` : winner.name}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-center text-white text-xl font-semibold">
              {winner.name}
            </p>
          </div>
        )}

        <Button
          variant="secondary"
          size="lg"
          className="bg-black text-white"
          onClick={onClose}
        >
          Close
        </Button>
      </Card>
    </div>
  );
};

export default WinnerModal;
