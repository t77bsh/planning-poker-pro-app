"use client";

import Image from "next/image";
import cardsIcon from "../../../../public/cardsIcon.svg";
import coffeeIcon from "../../../../public/coffeeIcon.svg";
import socket from "@/SocketConnect";

type RoomSettingsType = {
  playAsScrumMaster: boolean;
  allowRevealScoresIndividually: boolean;
};

interface ScorecardProps {
  players: { [key: string]: string };
  scrumMasterId: string;
  roomSettings: RoomSettingsType;
  selectedScores: {
    [key: string]: boolean | undefined;
  };
  scores: { [key: string]: string };
  scrumMaster: boolean;
  roomCode: string;
}

function Scorecard({
  players,
  scrumMasterId,
  roomSettings,
  selectedScores,
  scores,
  scrumMaster,
  roomCode,
}: ScorecardProps) {
  return (
    <div className="flex flex-col bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="w-full overflow-auto">
          <table className="min-w-full divide-y border-y text-center divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Story Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(players)
                .sort(([idA], [idB]) => {
                  if (idA === scrumMasterId) {
                    return -1;
                  } else if (idB === scrumMasterId) {
                    return 1;
                  } else {
                    return 0;
                  }
                })
                .map(([id, player]) => {
                  if (!roomSettings.playAsScrumMaster && id === scrumMasterId) {
                    return null;
                  }
                  return (
                    <tr
                      key={id}
                      className={
                        selectedScores[id]
                          ? "bg-green-300 border-b border-b-gray-400"
                          : ""
                      }
                    >
                      <td className="px-6 py-6 whitespace-nowrap ">
                        <div
                          className={`text-sm text-gray-900 font-semibold relative`}
                        >
                          <span className="capitalize break-words">
                            {" "}
                            {player}
                          </span>
                          {id === scrumMasterId && (
                            <span className="bg-red cursor-default absolute sm:hidden left-0 rounded-sm scale-95 p-0.5 text-xs text-white">
                              Master
                            </span>
                          )}{" "}
                        </div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {selectedScores[id] ? (
                            <div className="relative">
                              <div className="w-10 bg-white transition border-2 border-purple duration-500 h-14 m-auto rounded-md shadow-2xl flex p-1">
                                <Image src={cardsIcon} alt="cgi-card" />
                              </div>
                              {roomSettings.allowRevealScoresIndividually &&
                                scrumMaster && (
                                  <button
                                    onClick={() =>
                                      socket.emit(
                                        "show-individual-score",
                                        id,
                                        roomCode
                                      )
                                    }
                                    className="top-1/4 sm:text-xs rounded-sm right-0 bg-purple absolute  font-semibold text-white  px-2 py-1"
                                  >
                                    Reveal
                                  </button>
                                )}
                            </div>
                          ) : scores[id] === "Coffee" ? (
                            <div className="w-10 bg-white transition duration-500 h-14 m-auto rounded-md shadow-2xl flex items-center justify-center border-2 border-purple p-1">
                              <Image
                                className="w-6 m-auto"
                                src={coffeeIcon}
                                alt="coffee"
                              />{" "}
                            </div>
                          ) : (
                            <div className="w-10 transition text-purple font-semibold duration-500 bg-white h-14 m-auto rounded-md shadow-2xl  flex items-center justify-center border-2 border-purple p-1">
                              {scores[id] || "—"}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Scorecard;
