"use client";

// React imports
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// Component imports
import socket from "@/SocketConnect";
import Alert from "@/components/Alert";

// Library imports
import { Tooltip } from "react-tooltip";
import axios from "axios";

export default function CTAs() {
  // HOOKS
  const router = useRouter();

  // REFS
  const displayNameInputRef = useRef<HTMLInputElement>(null);
  const roomCodeInputRef = useRef<HTMLInputElement>(null);

  // STATES
  const [disabled, setDisabled] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    heading: string;
    message: string;
    color?: string | undefined;
  } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [prevSessData, setPrevSessData] = useState<{
    displayName: string | null;
    roomCode: string | null;
  } | null>(null);

  //   EFFECTS
  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL as string, { withCredentials: true })
      .then((res) => {
        const displayName = res.data.displayName;
        const roomCode = res.data.roomCode;
        setPrevSessData({ displayName: displayName, roomCode: roomCode });
      })
      .catch(() => {
        setPrevSessData({ displayName: null, roomCode: null });
        console.error("Error getting previous session data");
      });
  }, []);

  // Web socket events
  useEffect(() => {
    // Takes user to the room
    socket.on("room-created", (sixDigitRoomCode) => {
      router.push(`/room/${sixDigitRoomCode}`);
    });

    // Error while creating room
    socket.on("error-creating-room", () => {
      setDisabled(false);
      displayNameInputRef.current?.focus();
      setShowAlert({
        heading: "Error",
        message: "Unable to create room, please try again later.",
        color: "red",
      });
    });

    // Join invited room
    socket.on("room-joined", (displayName, roomCode) => {
      router.push(`/room/${roomCode}`);
    });

    // Error while joining room
    socket.on("error-joining-room", (error) => {
      setDisabled(false);
      setShowAlert({
        heading: "Error",
        message: "Unable to join room, please try again later.",
        color: "red",
      });
      roomCodeInputRef.current?.focus();
    });

    // Scrum master joins a previously created room
    socket.on("joined-prev-room", (displayName, roomCode) => {
      router.push(`/room/${roomCode}`);
    });

    // Clean up
    return () => {
      socket.off("room-created");
      socket.off("error-creating-room");
      socket.off("room-joined");
      socket.off("error-joining-room");
      socket.off("joined-prev-room");
    };
  }, [router]);

  const handleLinkCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1000);
  };

  const handleCodeCopy = (roomCode: string | null) => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1000);
  };

  // FUNCTIONS

  // Create Room
  const createRoom = (e: any) => {
    e.preventDefault();
    setDisabled(true);

    if (displayNameInputRef.current) {
      socket.emit("create-room", displayNameInputRef.current.value.trim());
    }
  };

  // Join room
  const joinRoom = (e: any) => {
    e.preventDefault();
    setDisabled(true);

    if (roomCodeInputRef.current) {
      socket.emit(
        "join-room",
        roomCodeInputRef.current.value.trim().toString()
      );
    }
  };

  if (prevSessData === null || prevSessData === undefined) {
    return (
      <div
        className="bg-gray-300 animate-pulse w-[430px] h-[520px] sm:w-[90%] rounded-md shadow-lg max-w-[430px]"
        style={{
          animationDuration: "0.25s",
        }}
      ></div>
    );
  } else
    return (
      <>
        {prevSessData && prevSessData.displayName && prevSessData.roomCode ? (
          // Show them the option to join their previous room
          <div className="flex flex-col justify-center bg-white w-[430px] h-[520px] sm:w-[90%] p-8 rounded-md space-y-6 shadow-lg max-w-[430px]">
            <h2 className="md:text-2xl">
              Welcome back{" "}
              <span className="capitalize break-words">
                {prevSessData.displayName.length > 25
                  ? prevSessData.displayName.substring(0, 25) + "..."
                  : prevSessData.displayName}
              </span>
              !
            </h2>
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col gap-y-3">
                <p className="text-xl font-semibold">
                  Room {prevSessData.roomCode}
                </p>
                <p className="text-xl">Join your previously created room.</p>
                <button
                  onClick={() =>
                    socket.emit(
                      "join-prev-room",
                      prevSessData.displayName,
                      prevSessData.roomCode
                    )
                  }
                  className="cgi-gradient text-white py-2 rounded-md font-bold "
                >
                  JOIN ROOM
                </button>
              </div>
              <div className="flex flex-col gap-y-3">
                <p className="text-xl font-semibold">Invite others</p>
                <p>
                  Share link:
                  <button
                    onClick={() =>
                      handleLinkCopy(
                        `${process.env.NEXT_PUBLIC_CLIENT_URL as string}/room/${
                          prevSessData.roomCode
                        }`
                      )
                    }
                    className="border-2 border-purple h-8 sm:text-xs  hover:bg-purple text-black hover:text-white hover:bg-blue-700 pl-2 flex items-center justify-center gap-x-3 rounded-lg sm:rounded-md shadow-md transition-colors duration-200 ease-in "
                  >
                    <span className="text-xs sm:hidden">🔗</span>
                    <span>{`${process.env.NEXT_PUBLIC_CLIENT_URL as string}/room/${prevSessData.roomCode}`}</span>
                    <div className="w-12 flex justify-center items-center">
                      <span
                        className={`text-xs text-white px-1 rounded-sm py-0.5  ${
                          linkCopied ? "bg-[#27C452]" : "bg-[#4D90FD]"
                        }`}
                      >
                        {linkCopied ? "Copied" : "Copy"}
                      </span>
                    </div>
                  </button>
                </p>
                <p>
                  Invite Code:{" "}
                  <button
                    onClick={() => handleCodeCopy(prevSessData.roomCode)}
                    className="border-2 border-purple h-8  hover:bg-purple text-black hover:text-white sm:text-sm hover:bg-blue-700 pl-2 flex items-center justify-center gap-x-3 rounded-lg sm:rounded-md shadow-md transition-colors duration-200 ease-in"
                  >
                    <span>{prevSessData.roomCode}</span>
                    <div className="w-12 flex justify-center items-center">
                      <span
                        className={`text-xs text-white px-1 rounded-sm py-0.5  ${
                          codeCopied ? "bg-[#27C452]" : "bg-[#4D90FD]"
                        }`}
                      >
                        {codeCopied ? "Copied" : "Copy"}
                      </span>
                    </div>
                  </button>
                </p>

                <Tooltip
                  place="right"
                  id="copy-roomcode"
                  style={{ background: "gray" }}
                />
                <Tooltip
                  place="right"
                  id="copy-link"
                  style={{ background: "gray" }}
                />
              </div>
            </div>
          </div>
        ) : (
          // Show them the option to create or join a room
          <div className="bg-white w-[430px] h-[520px] sm:w-[90%] p-8 rounded-md flex flex-col gap-4 shadow-lg max-w-[430px]">
            <h2 className="md:text-2xl">Create or join a room</h2>
            <p className="text-lg text-[#9C2770]">
              No need for an account. Get started instantly.
            </p>

            {/* Create Room CTA */}
            <div className="flex flex-col gap-y-2 border-t">
              <p className="text-xl">Create A Room</p>

              <form onSubmit={createRoom} className="flex flex-col gap-y-2">
                <p className="text-sm">
                  Enter your display name. Your team members will see this.
                  (e.g. &apos;Tab&apos;)
                </p>

                {/* Floating Label Input for Scrum Master&apos;s display name */}
                <div className="relative">
                  <input
                    disabled={disabled}
                    ref={displayNameInputRef}
                    type="text"
                    id="displayNameInput"
                    className="block cursor-text px-2.5 pb-2.5 pt-4 w-full text-sm rounded-lg border border-gray-300 appearance-none disabled:cursor-not-allowed focus:border-2 focus:border-purple focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                    minLength={2}
                    required
                    autoFocus
                  />
                  <label
                    htmlFor="displayNameInput"
                    className="absolute cursor-text text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Display Name
                  </label>
                </div>

                {/* Create Room Button */}
                <button
                  disabled={disabled}
                  className="cgi-gradient text-white px-4 py-2 disabled:cursor-not-allowed rounded-sm font-bold "
                  type="submit"
                >
                  CREATE ROOM
                </button>
              </form>
            </div>

            {/* Or */}
            <div className="flex items-center justify-center">
              <hr className="border w-full" />
              <span className="mx-2">OR</span>
              <hr className="border w-full" />
            </div>

            {/* Join Room CTA */}
            <div className="flex flex-col gap-y-2">
              <p className="text-xl">Join A Room</p>

              <form onSubmit={joinRoom} className="flex flex-col gap-y-2">
                <p className="text-sm">
                  Enter your room code without spaces. (e.g. 701212)
                </p>

                {/* Floating Label Input for member&apos;s room code */}
                <div className="relative">
                  <input
                    ref={roomCodeInputRef}
                    type="text"
                    id="roomCodeInput"
                    className="block px-2.5 py-2 cursor-text w-full text-sm rounded-sm border border-gray-300 appearance-none focus:border-2 focus:border-purple focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                    minLength={6}
                    maxLength={6}
                    required
                  />
                  <label
                    htmlFor="roomCodeInput"
                    className="absolute cursor-text text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Room Code
                  </label>
                </div>

                {/* Join Room Button */}
                <button
                  className="text-purple border-b border-purple font-semibold hover:font-bold w-fit mx-auto"
                  type="submit"
                >
                  JOIN ROOM
                </button>
              </form>
            </div>
          </div>
        )}

        {showAlert ? <Alert alert={showAlert} /> : null}
      </>
    );
}
