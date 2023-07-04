"use client"


import { useState } from "react";
import { useParams } from "next/navigation";
import { Tooltip } from "react-tooltip";

function Invites() {
  const { roomCode } = useParams();

  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleLinkCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1000);
  };

  const handleCodeCopy = () => {
    navigator.clipboard.writeText(roomCode!);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1000);
  };

  return (
    <div className="flex gap-x-4 mt-10 items-baseline">
      <p className="font-semibold text-lg">Invite:</p>
      <div className="flex flex-wrap gap-x-2 gap-y-2 sm:justify-around">
        <button
          onClick={handleLinkCopy}
          className="border-2 border-purple h-8  hover:bg-purple text-black hover:text-white text-sm hover:bg-blue-700 pl-2 sm:text-base flex items-center justify-center gap-x-3 rounded-lg sm:rounded-md shadow-md transition-colors duration-200 ease-in"
          data-tooltip-id="copy-link"
          data-tooltip-content="Click to copy!"
        >
          <span className="text-xs">🔗</span>
          <span>{window.location.href.replace(/(^\w+:|^)\/\//, "")}</span>
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
        <button
          onClick={handleCodeCopy}
          className="border-2 border-purple h-8 text-sm text-black  hover:text-white hover:bg-purple flex items-center justify-center gap-x-3 pl-2 rounded-lg sm:rounded-md shadow-md transition-colors duration-200 ease-in"
          data-tooltip-id="copy-roomcode"
          data-tooltip-content="Click to copy!"
        >
          <span>{roomCode}</span>
          <div className="w-12 flex justify-center items-center">
            <span
              className={`text-xs text-white px-1 rounded-sm py-0.5 ${
                codeCopied ? "bg-[#27C452]" : "bg-[#4D90FD]"
              }`}
            >
              {codeCopied ? "Copied" : "Copy"}
            </span>
          </div>
        </button>
        <Tooltip
          place="top"
          id="copy-roomcode"
          style={{ background: "gray" }}
        />
        <Tooltip place="top" id="copy-link" style={{ background: "gray" }} />
      </div>
    </div>
  );
}

export default Invites;
