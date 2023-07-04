"use client"


import { useRef, useState } from "react";
import { useParams } from "next/navigation";
// Socket import
import socket from "@/SocketConnect";


// Set Timer UI For Scrum Master
const SetTimerUI4SM = () => {
    const [seconds, setSeconds] = useState<number>(60); // convert minutes to seconds
    const timerRef = useRef<HTMLInputElement>(null);
  
    const { roomCode } = useParams();
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let val = parseInt(event.target.value);
      if (isNaN(val)) {
        // handle NaN case when the input is cleared
        val = 0;
      } else if (val < 0) {
        // handle case when value is less than 0
        val = 0;
      } else if (val > 60) {
        // handle case when value is greater than 60
        val = 60;
      }
  
      // Convert minutes to seconds
      setSeconds(val * 60);
    };
  
    const setCountdown = () => {
      socket.emit("set-timer", timerRef.current!.value, roomCode);
    };
  
    return (
      <div className="flex flex-col gap-y-1">
        <div className="relative">
          <input
            className="w-20 pl-1 border rounded-md shadow-lg"
            ref={timerRef}
            type="number"
            value={seconds / 60}
            onChange={handleInputChange}
            min="1"
            max="60"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
          <span className="absolute right-5 cursor-default">mins</span>
        </div>
        <button
          onClick={setCountdown}
          className="rounded-sm text-white text-md bg-purple hover:bg-indigo-500 "
        >
          Set Timer
        </button>
      </div>
    );
  };

  export default SetTimerUI4SM