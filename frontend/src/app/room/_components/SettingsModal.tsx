"use client"

import Image from "next/image";

import { useRef } from "react";
import Modal from "react-modal";
import crossIcon from "@/assets/crossIcon.svg";
import socket from "@/SocketConnect";



interface RoomSettings {
  showMean: boolean;
  showMedian: boolean;
  showLowest: boolean;
  showHighest: boolean;
  allowRevealScoresIndividually: boolean;
  showTimer: boolean;
  playAsScrumMaster: boolean;
}

interface SettingsModalProps {
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  roomSettings: RoomSettings;
  roomCode: string;
  setUsingTimer: (timer: boolean) => void;
}

function SettingsModal({
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  roomSettings,
  roomCode,
  setUsingTimer,
}: SettingsModalProps) {

  const showAverageInputRef = useRef<HTMLInputElement>(null);
  const showMedianInputRef = useRef<HTMLInputElement>(null);
  const showLowestScoreInputRef = useRef<HTMLInputElement>(null);
  const showHighestScoreInputRef = useRef<HTMLInputElement>(null);
  const AllowRevealScoresIndividuallyInputRef = useRef<HTMLInputElement>(null);
  const setTimerInputRef = useRef<HTMLInputElement>(null);
  const playAsScrumMasterInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    let updatedRoomSettings = {
      showMean: showAverageInputRef.current?.checked,
      showMedian: showMedianInputRef.current?.checked,
      showLowest: showLowestScoreInputRef.current?.checked,
      showHighest: showHighestScoreInputRef.current?.checked,
      allowRevealScoresIndividually:
        AllowRevealScoresIndividuallyInputRef.current?.checked,
      showTimer: setTimerInputRef.current?.checked,
      playAsScrumMaster: playAsScrumMasterInputRef.current?.checked,
    };

    socket.emit("update-room-settings", updatedRoomSettings, roomCode);
    setIsSettingsModalOpen(false);

    // Toggle timer
    setUsingTimer(setTimerInputRef.current?.checked!);
  };

  // React Modal Styles
  const settingsModalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
      borderRadius: "10px",
      boxShadow:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
  };

  //   Tailwind CSS classes
  const checkboxStyling =
    "w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#5236ab]";

  const labelsClass = "relative inline-flex items-center cursor-pointer";

  return (
    <Modal
      isOpen={isSettingsModalOpen}
      style={settingsModalStyles}
      ariaHideApp={false}
    >
      <div className="flex items-baseline justify-between sm:w-[300px]">
        <h3 className="mb-5 sm:text-xl">Settings</h3>
        <button onClick={() => setIsSettingsModalOpen(false)}>
          <Image className="w-[14px]" src={crossIcon} alt="Close button" />
        </button>
      </div>
      <div className="flex flex-col gap-y-4 mx-auto sm:w-[300px] w-[450px]">
        <div className="flex justify-between">
          <p>Show average</p>
          <div className="flex gap-x-2">
            <span>No</span>
            <label className={labelsClass}>
              <input
                ref={showAverageInputRef}
                type="checkbox"
                className="sr-only peer"
                defaultChecked={roomSettings.showMean}
              />
              <div className={checkboxStyling}></div>{" "}
            </label>
            <span>Yes</span>
          </div>
        </div>

        <div className="flex justify-between">
          <p>Show median</p>
          <div className="flex gap-x-2">
            <span>No</span>
            <label className={labelsClass}>
              <input
                ref={showMedianInputRef}
                type="checkbox"
                className="sr-only peer"
                defaultChecked={roomSettings.showMedian}
              />
              <div className={checkboxStyling}></div>{" "}
            </label>
            <span>Yes</span>
          </div>
        </div>

        <div className="flex justify-between">
          <p>Show lowest score</p>
          <div className="flex gap-x-2">
            <span>No</span>
            <label className={labelsClass}>
              <input
                ref={showLowestScoreInputRef}
                type="checkbox"
                className="sr-only peer"
                defaultChecked={roomSettings.showLowest}
              />
              <div className={checkboxStyling}></div>{" "}
            </label>
            <span>Yes</span>
          </div>
        </div>

        <div className="flex justify-between">
          <p>Show highest score</p>
          <div className="flex gap-x-2">
            <span>No</span>
            <label className={labelsClass}>
              <input
                ref={showHighestScoreInputRef}
                type="checkbox"
                className="sr-only peer"
                defaultChecked={roomSettings.showHighest}
              />
              <div className={checkboxStyling}></div>{" "}
            </label>
            <span>Yes</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p>Allow revealing scores one by one</p>
          <div className="flex ml-1 gap-x-2">
            <span>No</span>
            <label className={labelsClass}>
              <input
                ref={AllowRevealScoresIndividuallyInputRef}
                type="checkbox"
                className="sr-only peer"
                defaultChecked={roomSettings.allowRevealScoresIndividually}
              />
              <div className={checkboxStyling}></div>{" "}
            </label>
            <span>Yes</span>
          </div>
        </div>

        <div className="flex justify-between">
          <p>Set timer</p>
          <div className="flex gap-x-2">
            <span>No</span>
            <label className={labelsClass}>
              <input
                ref={setTimerInputRef}
                type="checkbox"
                className="sr-only peer"
                defaultChecked={roomSettings.showTimer}
              />
              <div className={checkboxStyling}></div>{" "}
            </label>
            <span>Yes</span>
          </div>
        </div>

        <div className="flex justify-between">
          <p>Play as scrum master</p>
          <div className="flex gap-x-2">
            <span>No</span>
            <label className={labelsClass}>
              <input
                ref={playAsScrumMasterInputRef}
                type="checkbox"
                className="sr-only peer"
                defaultChecked={roomSettings.playAsScrumMaster}
              />
              <div className={checkboxStyling}></div>{" "}
            </label>
            <span>Yes</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-purple text-white rounded-md shadow-lg py-1 "
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export default SettingsModal;
