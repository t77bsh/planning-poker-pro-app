"use client";

import Image from "next/image";

import PlanningPokerProLogo from "../../../../public/pppLogo.svg";

// Socket import
import socket from "@/SocketConnect";
import { useParams } from "next/navigation";
// // Modal import
import Modal from "react-modal";
import { useEffect, useState } from "react";

interface Props {
  displayName?: string | undefined;
  scrumMaster?: boolean | undefined;
}

function UserNavbar(props: Props) {
  const { roomCode } = useParams();
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);

  // Handle disconnection
  useEffect(() => {
    socket.on("disconnect", () => setIsDisconnected(true));

    return () => {
      socket.off("disconnect");
    };
  }, []);

  return (
    <>
      {isDisconnected ? (
        <div className="w-full bg-red text-white text-center py-2">
          You were disconnected,{" "}
          <a href={window.location.href} className="underline">
            refresh
          </a>{" "}
          to reconnect.
        </div>
      ) : null}

      <header className="border-b-2 px-4 border-[#d2d2d2]">
        <nav className="flex max-w-[1300px] h-20 mx-auto justify-between">
          {/* Logo */}
          <Image
            className="w-48 md:w-36 sm:w-28"
            src={PlanningPokerProLogo}
            alt="Planning Poker Logo"
            priority
          />

          {/* Nav links */}
          <div className="flex items-center gap-x-5">
            {props.scrumMaster === undefined ? null : props.scrumMaster ===
              true ? (
              <button
                onClick={() => {
                  setIsEndModalOpen(true);
                }}
                className="bg-red text-white px-2 py-1 rounded-md"
              >
                End Room
              </button>
            ) : (
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="bg-red text-white px-2 py-1 rounded-md"
              >
                Leave
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* End Room Modal */}
      <Modal
        isOpen={isEndModalOpen}
        onRequestClose={() => setIsEndModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          content: {
            width: "300px",
            height: "fit-content",
            margin: "auto",
            borderRadius: "10px",
          },
        }}
        ariaHideApp={false}
      >
        <div className="flex flex-col gap-y-3">
          <p className="text-xl sm:text-lg font-semibold">
            Are you sure you want to end the room?
          </p>
          <p className="text-gray-600 text-sm">
            This will remove all players and delete all related data. Action
            cannot be undone.
          </p>
          <div className="flex gap-x-2 justify-evenly">
            <button
              onClick={() => {
                socket.emit("end-room", roomCode);
                setIsEndModalOpen(false);
              }}
              className="bg-red px-7 py-0.5 border-2 border-red shadow-2xl font-semibold text-white rounded-md "
            >
              Yes
            </button>
            <button
              onClick={() => setIsEndModalOpen(false)}
              className="border-2 px-7 shadow-2xl border-customRed bg-slate-50 py-0.5 font-semibold rounded-md "
            >
              No
            </button>
          </div>
        </div>
      </Modal>

      {/* Leave Room Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onRequestClose={() => setIsLeaveModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          content: {
            width: "300px",
            height: "fit-content",
            margin: "auto",
            borderRadius: "10px",
          },
        }}
        ariaHideApp={false}
      >
        <div className="flex flex-col gap-y-3">
          <p className="text-xl sm:text-lg font-semibold">
            Are you sure you want to leave the room?
          </p>
          <div className="flex gap-x-2 justify-evenly">
            <a
              href="/"
              onClick={() => {
                setIsLeaveModalOpen(false);
              }}
              className="bg-red px-7 py-0.5 border-2 border-red shadow-2xl font-semibold text-white rounded-md "
            >
              Yes
            </a>
            <button
              onClick={() => setIsLeaveModalOpen(false)}
              className="border-2 px-7 shadow-2xl border-customRed bg-slate-50 py-0.5 font-semibold rounded-md "
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UserNavbar;
