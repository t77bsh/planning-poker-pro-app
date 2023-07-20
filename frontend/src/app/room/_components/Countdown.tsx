"use client"

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import socket from "@/SocketConnect";
import playIcon from "@/assets/playIcon.svg";
import pauseIcon from "@/assets/pauseIcon.svg";

// Helper function to format time
const formatTime = (seconds: number) => {
  // Timer ended
  if (seconds == 9999) return "00:00";

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  const integerSec = Math.trunc(sec); // Get the integer part of seconds
  return `${min.toString().padStart(2, "0")}:${integerSec
    .toString()
    .padStart(2, "0")}`;
};

interface ICountdownProps {
  initialCount?: number;
  scrumMaster: boolean;
  isPaused: boolean;
  endingAt: number | null;
  updateEndTime: Dispatch<SetStateAction<number | null>>;
  updatePause: Dispatch<SetStateAction<boolean>>;
}

function Countdown({
  initialCount = 1,
  scrumMaster = false,
  isPaused = true,
  endingAt = null,
  updateEndTime,
  updatePause,
}: ICountdownProps) {
  const [seconds, setSeconds] = useState<number>(initialCount * 60);

  const { roomCode } = useParams();

  const interval = useRef<NodeJS.Timer | undefined>();

  useEffect(() => {
    updatePause(isPaused);
    updateEndTime(endingAt);
  }, [isPaused, endingAt, updateEndTime, updatePause]);

  useEffect(() => {
    socket.on("timer-started", (endTime: number) => {
      if (isPaused) {
        updatePause(false);
      }
      updateEndTime(endTime);
    });

    socket.on("timer-paused", (newEndTime) => {
      updateEndTime(newEndTime);

      if (!isPaused) {
        updatePause(true);
      }

      if (interval.current) {
        clearInterval(interval.current);
      }
    });

    return () => {
      socket.off("timer-started");
      socket.off("timer-paused");
    };
  }, [isPaused, updateEndTime, updatePause]);

  useEffect(() => {
    // Start countdown
    if (!isPaused && endingAt !== null && endingAt > Date.now()) {
      interval.current = setInterval(() => {
        let currentSeconds = (endingAt - Date.now() + 25) / 1000;

        if (currentSeconds <= 0) {
          if (interval.current) {
            clearInterval(interval.current);
          }
          updatePause(true);
          setSeconds(9999);
          updateEndTime(null);
        } else {
          setSeconds(currentSeconds);
        }
      }, 1000);
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [isPaused, endingAt, updateEndTime, updatePause]);

  const startCountdown = () => {
    socket.emit("start-timer", roomCode, seconds);
  };

  const pauseCountdown = () => {
    socket.emit("pause-timer", roomCode);
  };

  const resetCountdown = () => {
    updatePause(true);
    setSeconds(initialCount * 60); // convert minutes to seconds
    socket.emit("reset-timer", roomCode);
  };

  return (
    <div className="flex flex-col space-y-1">
      {/* seconds == 0 means that the countdown had not ended */}
      {seconds == 0 && isPaused ? (
        <div
          className="animate-pulse bg-[#77797e54] h-[28px] w-[63px] rounded-md"
          style={{ animationDuration: "0.375s" }}
        ></div>
      ) : (
        <p
          className={`font-mono text-lg font-bold ${
            (seconds <= 6 || seconds == 9999) && "text-red"
          } text-center tracking-widest cursor-default`}
        >
          {formatTime(seconds)}
        </p>
      )}

      {scrumMaster && (
        <div className="flex gap-x-1 items-center justify-center">
          {/* Display play/pause buttons only if the timer hasn't ended (seconds = 9999) */}
          {seconds !== 9999 && (
            <div className="w-4 flex items-center justify-center">
              {seconds !== 0 && (
                <>
                  {isPaused ? (
                    <button onClick={startCountdown}>
                      <Image src={playIcon} alt="Start timer icon" />
                    </button>
                  ) : (
                    <button
                      disabled={seconds === 0}
                      className={seconds === 0 ? "cursor-not-allowed" : ""}
                      onClick={pauseCountdown}
                    >
                      <Image src={pauseIcon} alt="Pause timer icon" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          <button
            disabled={seconds == 0}
            className={`${
              seconds == 0 && "cursor-not-allowed"
            } text-sm bg-red px-1 text-white rounded-sm `}
            onClick={resetCountdown}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default Countdown;
