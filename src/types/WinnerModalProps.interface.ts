export type WinnerModalProps = {
  isVisible: boolean;
  onClose: () => void;
  winner: {
    name: string;
    image: string;
  };
  isWon: boolean;
};
