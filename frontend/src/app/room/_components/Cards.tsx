//
import Image from "next/image";
import { useEffect, useState } from "react";
import socket from "@/SocketConnect";
import coffeeIcon from "@/assets/coffeeIcon.svg";
import { Tooltip } from "react-tooltip";

// Define the types for the properties the component expects
interface ICardsProps {
  scrumMaster: boolean;
  roomSettings: {
    playAsScrumMaster: boolean;
    showTimer: boolean;
  };
  endTime: number | null;
  roomCode: string | undefined;
  isPaused: boolean;
  //   scoreRevealed: boolean;
}

// Define the array of card values
const CardsValues = [
  "?",
  "Coffee",
  "0",
  "0.5",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "20",
  "40",
  "100",
];


// Define the Cards component
function Cards({
  scrumMaster,
  roomSettings,
  endTime,
  roomCode,
  isPaused,
}: ICardsProps) {

  // Function to render the card buttons
  const [selectedScore, setSelectedScore] = useState<string>("");

  // Function to emit the selected score to the server
  const emitScore = (score: string) => {
    socket.emit("score", score, roomCode);
    setSelectedScore(score);
  };

  // Function to check if the current button should be disabled
  const isDisabled = () =>
    (scrumMaster && !roomSettings.playAsScrumMaster) ||
    (roomSettings.showTimer && (endTime === null || endTime < Date.now())) ||
    isPaused;

  // Function to render the content of the button. If the value is 'Coffee', it shows an image. Otherwise, it shows the value.
  const renderButtonContent = (value: string) => {
    if (value === "Coffee") {
      return (
        <Image
          className="w-[35px] sm:w-[25px]"
          src={coffeeIcon}
          alt="coffee-icon"
        />
      );
    }
    return value;
  };

  // Clear the selected score when scores revealed
  useEffect(() => {
    socket.on("players-scores-list", () => setSelectedScore(""));
    socket.on("player-score-revealed", () => setSelectedScore(""));
    socket.on("scores-cleared", () => setSelectedScore(""));

    return () => {
      socket.off("players-scores-list");
      socket.off("player-score-revealed");
      socket.off("scores-cleared");
    };
  }, []);

  const cardClass = (value: string) => {
    let className = "bg-white hover:scale-110 hover:bg-gray-100";

    if (isDisabled()) {
      className = "cursor-not-allowed bg-gray-300";
    } else if (value === selectedScore) {
      className =
        "bg-gray-300 scale-125 transition duration-500 ease-in-out cursor-not-allowed";
    }

    return `${className} h-[120px] w-[86px] border-2 border-purple md:w-[90px] sm:h-[60px] sm:w-[42px] text-purple rounded-2xl md:rounded-xl sm:rounded-lg font-bold  shadow-md flex items-center justify-center text-2xl md:text-xl sm:text-lg`;
  };

  // Render the component. It's a collection of buttons, each representing a card.
  return (
    <div className="flex flex-wrap gap-x-24 gap-y-14 md:gap-x-7 md:gap-y-11 sm:gap-x-12 sm:gap-y-7 justify-center">
      {CardsValues.map((value, index) => (
        <div
          key={index}
          data-tooltip-id={index.toString()}
          data-tooltip-content={
            isDisabled() || value === selectedScore
              ? ""
              : value === "Coffee"
              ? "Need a break? Play this card."
              : value === "?"
              ? "Unable to estimate? Play this card."
              : "Submit estimate!"
          }
        >
          <button
            onClick={() => emitScore(value)}
            className={cardClass(value)}
            disabled={value === selectedScore || isDisabled()}
          >
            {renderButtonContent(value)}
          </button>
          <Tooltip
            place="top"
            id={index.toString()}
            style={{ background: "gray" }}
          />
        </div>
      ))}
    </div>
  );
}

export default Cards;
