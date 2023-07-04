import React, { Dispatch, SetStateAction, useRef } from "react";
import Modal from "react-modal";
import socket from "@/SocketConnect";

type DisplayNameModalProps = {
  isPromptDisplayNameModalOpen: boolean;
  setDisplayName: Dispatch<SetStateAction<string | undefined>>;
  roomCode: string;
  setIsPromptDisplayNameModalOpen: (value: SetStateAction<boolean>) => void;
};

function DisplayNamePromptModal({
  isPromptDisplayNameModalOpen,
  setDisplayName,
  roomCode,
  setIsPromptDisplayNameModalOpen,
}: DisplayNameModalProps) {
  // REFs
  const userDisplayNameRef = useRef<HTMLInputElement>(null);

  // Function to handle the form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const displayName = userDisplayNameRef.current!.value.trim();
    setDisplayName(displayName);

    // If new user, set display name
    socket.emit("set-display-name", displayName, roomCode);
    setIsPromptDisplayNameModalOpen(false);
  };

  const modalStyles = {
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

  return (
    <Modal
      isOpen={isPromptDisplayNameModalOpen}
      contentLabel="Prompt user create display name modal"
      style={modalStyles}
      ariaHideApp={false}
    >
      <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
        <h3 className="sm:text-xl">Enter your display name</h3>
        <p className="text-gray-500 text-sm">
          Your team members will see this (e.g. &apos;Tab&apos;).
        </p>

        {/* Floating Label Input for Scrum Master's display name */}
        <div className="relative">
          <input
            ref={userDisplayNameRef}
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
        <button
          className="bg-purple text-white font-semibold  rounded-md py-1"
          type="submit"
        >
          Join
        </button>
      </form>
    </Modal>
  );
}

export default DisplayNamePromptModal;
