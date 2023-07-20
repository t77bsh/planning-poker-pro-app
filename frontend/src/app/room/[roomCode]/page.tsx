"use client";
// React related imports
import { useEffect, useState, useMemo, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Component imports
import RoomSkeletonLoader from "../_components/RoomSkeletonLoader";
import UserNavbar from "../_components/UserNavbar";
import Insights from "../_components/Insights";
import SetTimerUI4SM from "../_components/SetTimerUI";
import Countdown from "../_components/Countdown";
import Cards from "../_components/Cards";
import Invites from "../_components/Invites";
import Scorecard from "../_components/Scorecard";
import SettingsModal from "../_components/SettingsModal";
import DisplayNamePromptModal from "../_components/DisplayNamePromptModal";
import Alert from "@/components/Alert";

// Library imports
import socket from "@/SocketConnect";

// Assets import
import settingsGearIcon from "@/assets/settingsGearIcon.svg";

function MasterRoom({ params }: { params: { roomCode: string } }) {
  // PARAMS
  let roomCode = params.roomCode;

  // HOOKS
  const router = useRouter();

  // STATES
  const [roomExists, setRoomExists] = useState<boolean | undefined>(undefined);
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [isPromptDisplayNameModalOpen, setIsPromptDisplayNameModalOpen] =
    useState(false);
  const [players, setPlayers] = useState<{ [key: string]: string }>({});
  const [scores, setScores] = useState<{ [key: string]: string }>({});
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [clearScores, setClearScores] = useState(false);
  const [meanScore, setMeanScore] = useState<number | undefined>(undefined);
  const [medianScore, setMedianScore] = useState<number | undefined>(undefined);
  const [lowestScore, setLowestScore] = useState<number | undefined>(undefined);
  const [highestScore, setHighestScore] = useState<number | undefined>(
    undefined
  );
  const [roomSettings, setRoomSettings] = useState({
    showMean: true,
    showMedian: true,
    showLowest: true,
    showHighest: true,
    allowRevealScoresIndividually: true,
    showTimer: false,
    playAsScrumMaster: false,
  });
  const [usingTimer, setUsingTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerHasBeenSet, setTimerHasBeenSet] = useState(false);
  // To keep track of which players have selected a score, but not yet revealed
  const [selectedScores, setSelectedScores] = useState<{
    [key: string]: boolean | undefined;
  }>({});
  // Scrum Master Identity
  const [scrumMaster, setScrumMaster] = useState(false);
  const [scrumMasterId, setScrumMasterId] = useState<string>("");

  const [isRotating, setIsRotating] = useState(false); // for the settings gear icon
  const [paused, setPaused] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [revealInsights, setRevealInsights] = useState(false);
  const [playerScore, setPlayerScore] = useState<string>("");
  // Alert component
  const [showAlert, setShowAlert] = useState<{
    heading: string;
    message: string;
    color?: string | undefined;
  } | null>(null);
  // Disable reveal insights only button
  const [insightsButtonDisabled, setInsightsButtonDisabled] = useState(false);

  // EFFECTS //
  // Existence of rooms logic
  useEffect(() => {
    const handleRoomExists = (
      userDisplayName: string,
      players: { [s: string]: string },
      YourId: string,
      scores: { [x: string]: string },
      master: boolean,
      masterId: string,
      roomSettings: any,
      timerState: {
        timerSet: boolean;
        timerStarted: boolean;
        timerEndTime: number;
        timeRemainingInMins: number;
      }
    ) => {
      setScrumMaster(master);
      setScrumMasterId(masterId);
      setRoomSettings(roomSettings);
      setTimeout(() => setRoomExists(true), 500);
      setPlayers(players);
      if (roomSettings.showTimer) {
        setUsingTimer(true);
        if (timerState.timerSet && !timerState.timerStarted) {
          setTimer(timerState.timeRemainingInMins);
          setTimerHasBeenSet(true);
          setPaused(true);
        }

        if (timerState.timerSet && timerState.timerStarted) {
          if (timerState.timerEndTime > Date.now()) {
            setPaused(false);
            setTimerHasBeenSet(true);
            let endTime = timerState.timerEndTime;
            let currentTime = Date.now();
            let timeLeftInMins = (endTime - currentTime) / 60000;
            setTimer(timeLeftInMins);
            setEndTime(timerState.timerEndTime);
          } else {
            setPaused(true);
            setTimerHasBeenSet(false);
          }
        }

        if (!timerState.timerSet) {
          setTimerHasBeenSet(false);
        }
      }

      for (let player in players) {
        if (scores[player] && JSON.parse(scores[player]).revealed === false) {
          setSelectedScores((prevSelectedScores) => ({
            ...prevSelectedScores,
            [player]: true,
          }));
        } else if (
          scores[player] &&
          JSON.parse(scores[player]).revealed === true
        ) {
          setScores((prevScores) => {
            const updatedScores = { ...prevScores };
            for (const [playerId, playerScore] of Object.entries(scores) as [
              string,
              string
            ][]) {
              updatedScores[playerId] = JSON.parse(playerScore).score;
              if (playerId === YourId) {
                setPlayerScore(JSON.parse(playerScore).score);
              }
            }
            return updatedScores;
          });

          setSelectedScores((prevSelectedScores) => ({
            ...prevSelectedScores,
            [player]: false,
          }));
        } else {
          setSelectedScores((prevSelectedScores) => ({
            ...prevSelectedScores,
            [player]: false,
          }));
        }
      }
      if (!userDisplayName) {
        setIsPromptDisplayNameModalOpen(true);
      } else {
        setDisplayName(userDisplayName);
      }
    };

    socket.emit("check-room-exists", roomCode);
    socket.on("room-exists", handleRoomExists);
    socket.on("room-not-exist", () => {
      setTimeout(() => setRoomExists(false), 500);
    });
    socket.on("error", (message) => {
      setShowAlert({
        heading: "Error",
        message: message,
        color: "red",
      });
      setTimeout(() => {
        setShowAlert(null);
      }, 2000);
    });

    return () => {
      socket.off("room-exists");
      socket.off("room-not-exist");
      socket.off("error");
    };
  }, [roomCode]);

  useEffect(() => {
    if (roomExists === false) setTimeout(() => router.push("/"), 5000);
  }, [roomExists, router]);

  // Players joining or leaving
  useEffect(() => {
    const handlePlayerDisconnected = (id: string | number, player: any) => {
      setPlayers((prevPlayers) => {
        delete prevPlayers[id];
        return { ...prevPlayers };
      });

      setScores((prevScores) => {
        delete prevScores[id];
        return { ...prevScores };
      });

      setSelectedScores((prevSelectedScores) => {
        delete prevSelectedScores[id];
        return { ...prevSelectedScores };
      });
    };

    socket.on("new-player", (id, player) =>
      setPlayers((prevPlayers) => ({ ...prevPlayers, [id]: player }))
    );
    socket.on("player-disconnected", handlePlayerDisconnected);

    return () => {
      socket.off("new-player");
      socket.off("player-disconnected");
    };
  }, []);

  // Scores and reveal logic
  useEffect(() => {
    const handlePlayerScoreRevealed = (
      playerId: string | number,
      playerScore: string
    ) => {
      setScores((prevScores) => {
        const updatedScores = { ...prevScores };
        updatedScores[playerId] = JSON.parse(playerScore).score;
        return updatedScores;
      });

      setSelectedScores((prevSelectedScores) => {
        const updatedSelectedScores = { ...prevSelectedScores };
        updatedSelectedScores[playerId] = false;
        return updatedSelectedScores;
      });
    };

    const handlePlayersScoresList = (
      id: any,
      playersScores: { [s: string]: string } | ArrayLike<string>,
      roomSettings: {
        showTimer: boolean | ((prevState: boolean) => boolean);
        showMean: any;
        showMedian: any;
        showLowest: any;
        showHighest: any;
      }
    ) => {
      updateScores(playersScores);
      calculateAnalyticsInsights(Object.values(playersScores), roomSettings);
      setUsingTimer(roomSettings.showTimer);
      resetSelectedScores(playersScores);
      setRevealInsights(
        roomSettings.showMean ||
          roomSettings.showMedian ||
          roomSettings.showLowest ||
          roomSettings.showHighest
      );
      setInsightsButtonDisabled(false);
    };

    const handleScoreSelected = (playerId: any) => {
      setSelectedScores((prevSelectedScores) => ({
        ...prevSelectedScores,
        [playerId]: true,
      }));
    };

    const handleScoresCleared = () => {
      setScores({});
      setSelectedScores({});
      setMeanScore(undefined);
      setMedianScore(undefined);
      setLowestScore(undefined);
      setHighestScore(undefined);
      setRevealInsights(false);
    };

    socket.on("players-scores-list", handlePlayersScoresList);
    socket.on("player-score-revealed", handlePlayerScoreRevealed);
    socket.on("score-selected", handleScoreSelected);
    socket.on("scores-cleared", handleScoresCleared);

    return () => {
      socket.off("players-scores-list");
      socket.off("player-score-revealed");
      socket.off("score-selected");
      socket.off("scores-cleared");
    };
  }, []);

  useEffect(() => {
    if (
      Object.values(selectedScores).every((score) => score === false) &&
      Object.values(scores).length > 0
    ) {
      setClearScores(true);
    } else setClearScores(false);
  }, [scores, selectedScores]);

  useEffect(() => {
    const handleInsightsRevealed = (
      playersScores: { [s: string]: string } | ArrayLike<string>
    ) => {
      let scores = Object.values(playersScores) as string[];
      calculateAnalyticsInsights(scores, roomSettings);
      setRevealInsights(
        roomSettings.showMean ||
          roomSettings.showMedian ||
          roomSettings.showLowest ||
          roomSettings.showHighest
      );
    };

    socket.on("insights-revealed", handleInsightsRevealed);
    return () => {
      socket.off("insights-revealed");
    };
  }, [roomSettings]);

  // Timer logic
  useEffect(() => {
    const handleTimerSet = (mins: SetStateAction<number>) => {
      setPaused(true);
      setRoomSettings((prevRoomSettings) => ({
        ...prevRoomSettings,
        showTimer: true,
      }));
      setUsingTimer(true);
      setTimer(mins);

      setTimerHasBeenSet(true);
    };

    const handleTimerReset = () => {
      setTimerHasBeenSet(false);
      setEndTime(null);
    };

    socket.on("timer-set", handleTimerSet);
    socket.on("timer-reset", handleTimerReset);

    return () => {
      socket.off("timer-set");
      socket.off("timer-reset");
    };
  }, []);

  useEffect(() => {
    setUsingTimer(roomSettings.showTimer);

    if (!roomSettings.showTimer) {
      setPaused(false);
    }
  }, [roomSettings.showTimer]);

  // Room settings logic
  useEffect(() => {
    socket.on("room-settings-updated", setRoomSettings);
    socket.on("room-ended", () => {
      if (!scrumMaster) {
        setShowAlert({
          heading: "Room Ended",
          message:
            "Sorry! Room has been ended by the Scrum Master. Redirecting back to home page...",
        });
        // Redirect back to home page after 4 seconds so that the user can read the alert
        setTimeout(() => {
          router.push("/");
        }, 4000);
        return;
      }
      router.push("/");
    });

    return () => {
      socket.off("room-settings-updated");
      socket.off("room-ended");
      setShowAlert(null);
    };
  }, [scrumMaster, router]);

  // FUNCTIONS
  // Reveal scores and show on each user's UI
  const revealScores = () => {
    socket.emit("show-scores", roomCode, roomSettings);
    // setClearScores(true);
  };

  // Reset scores from all users' UI
  const resetScores = () => {
    socket.emit("clear-scores", roomCode);
  };

  // Checks whether all players have selected a score
  const allScoresSelected = useMemo(() => {
    const playersList = Object.keys(players);
    const values = Object.values(selectedScores);

    if (values.length <= 0) return false;

    for (const player of playersList) {
      if (!selectedScores[player]) {
        return false;
      }
    }
    return true;
  }, [selectedScores, players]);

  // Checks whether at least one player has selected a score
  const isAtleastOneScoreSelected = useMemo(() => {
    const values = Object.values(selectedScores);
    return values.length > 0 && values.some((value) => value === true);
  }, [selectedScores]);

  // Function to calculate analytics insights
  const calculateAnalyticsInsights = (scores: string[], roomSettings: any) => {
    // Filter out non-numeric scores and "?" and "Coffee"
    const numericScores = scores.filter((score) => {
      const parsedScore = JSON.parse(score).score;
      return (
        !isNaN(Number(parsedScore)) &&
        parsedScore !== "?" &&
        parsedScore !== "Coffee"
      );
    });

    // Convert numericScores into an array of numbers
    const numericScoresArray = numericScores.map((score: string) =>
      Number(JSON.parse(score).score)
    );

    // Calculate mean score
    if (roomSettings.showMean) {
      const meanScore =
        numericScoresArray.length > 0
          ? numericScoresArray.reduce(
              (acc: number, curr: number) => acc + curr,
              0
            ) / numericScoresArray.length
          : 0;

      setMeanScore(meanScore);
    } else {
      setMeanScore(undefined);
    }

    // Calculate median score
    if (roomSettings.showMedian) {
      const mid = Math.floor(numericScoresArray.length / 2),
        nums = [...numericScoresArray].sort((a, b) => a - b);
      const median =
        numericScoresArray.length % 2 !== 0
          ? nums[mid]
          : (nums[mid - 1] + nums[mid]) / 2;

      setMedianScore(median);
    } else {
      setMedianScore(undefined);
    }

    // Calculate lowest score
    if (roomSettings.showLowest) {
      setLowestScore(
        numericScoresArray.length > 0 ? Math.min(...numericScoresArray) : 0
      );
    } else {
      setLowestScore(undefined);
    }

    // Calculate highest score
    if (roomSettings.showHighest) {
      setHighestScore(
        numericScoresArray.length > 0 ? Math.max(...numericScoresArray) : 0
      );
    } else {
      setHighestScore(undefined);
    }
  };

  // Function to update the scores
  const updateScores = (playersScores: any) => {
    setScores((prevScores) => {
      // Create a new object with the previous scores
      const updatedScores = { ...prevScores };

      // Update the new scores
      for (const [playerId, playerScore] of Object.entries(playersScores) as [
        string,
        string
      ][]) {
        updatedScores[playerId] = JSON.parse(playerScore).score;
      }

      // Return the updated scores object
      return updatedScores;
    });
  };

  const resetSelectedScores = (playersScores: any) => {
    setSelectedScores((prevSelectedScores) => {
      const updatedSelectedScores = { ...prevSelectedScores };

      for (const playerId of Object.keys(playersScores)) {
        updatedSelectedScores[playerId] = false;
      }

      return updatedSelectedScores;
    });
  };

  // TAILWIND CLASS NAMES
  const sectionsClass = "px-4";
  const disableRevealButtonsClass =
    "bg-gray-500 cursor-not-allowed text-white p-1 sm:text-sm rounded-sm duration-250 shadow-4xl";
  const enableRevealButtonsClass =
    "bg-purple text-white p-1 sm:text-sm rounded-sm duration-250 shadow-4xl";

  // RENDER
  // Checking room exists
  if (roomExists === undefined) {
    return <RoomSkeletonLoader />;

    // Room does not exist
  } else if (roomExists === false) {
    return (
      <>
        <Alert
          alert={{
            heading: "Room not found",
            message:
              "Sorry, this room doesn't exist. Redirecting to the home page...",
          }}
        />
        <RoomSkeletonLoader />
      </>
    );

    // Check complete, room exists
  }

  // Room exists
  else
    return (
      <div className="h-full min-h-screen bg-slate-50">
        <UserNavbar displayName={displayName} scrumMaster={scrumMaster} />

        {/* Game */}
        <section className={`bg-[#ece9f6] ${sectionsClass}`}>
          <div className="max-w-[1300px] mx-auto flex flex-col">
            <div className="flex flex-col py-5 m-auto px-[4%]">
              <main className="flex flex-col gap-y-6">
                <div className="flex items-center justify-end h-12 space-x-4">
                  {/* Countdown UI */}
                  <div>
                    {usingTimer &&
                      (timerHasBeenSet ? (
                        <Countdown
                          scrumMaster={scrumMaster}
                          initialCount={timer}
                          isPaused={paused}
                          endingAt={endTime}
                          updateEndTime={setEndTime}
                          updatePause={setPaused}
                        />
                      ) : (
                        scrumMaster && <SetTimerUI4SM />
                      ))}
                  </div>

                  {/* Settings */}
                  {scrumMaster && (
                    <div>
                      <button
                        onClick={() => {
                          setIsSettingsModalOpen(true);
                          setIsRotating((prevIsRotating) => !prevIsRotating);
                        }}
                        onAnimationEnd={() => setIsRotating(false)}
                      >
                        <Image
                          className={`w-[25px] ${isRotating ? "spin" : ""}`}
                          src={settingsGearIcon}
                          alt="Settings icon"
                        />
                      </button>
                    </div>
                  )}
                  <SettingsModal
                    isSettingsModalOpen={isSettingsModalOpen}
                    setIsSettingsModalOpen={setIsSettingsModalOpen}
                    roomSettings={roomSettings}
                    roomCode={roomCode!}
                    setUsingTimer={setUsingTimer}
                  />
                </div>

                {/* Game */}
                <Cards
                  scrumMaster={scrumMaster}
                  roomSettings={roomSettings}
                  endTime={endTime}
                  roomCode={roomCode}
                  // playerScore={playerScore}
                  isPaused={paused}
                />

                {/* Share invites UI */}
                <Invites />
              </main>
            </div>
          </div>
        </section>

        {/* Players */}
        <section className={sectionsClass}>
          <div className="max-w-[1300px] mx-auto flex flex-col gap-y-4  py-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-y-4">
                <h3 className="sm:text-lg">Results</h3>

                <div className="flex gap-x-4 items-center">
                  {/* Show/Clear scores */}
                  {scrumMaster && (
                    <div className="flex flex-wrap space-x-2">
                      {!clearScores ? (
                        <button
                          disabled={!isAtleastOneScoreSelected}
                          onClick={revealScores}
                          className={
                            !isAtleastOneScoreSelected
                              ? disableRevealButtonsClass
                              : enableRevealButtonsClass
                          }
                        >
                          Reveal Scores
                        </button>
                      ) : (
                        <button onClick={resetScores}>Clear</button>
                      )}

                      {/* Show insights button if any of the insights settings are on */}
                      {roomSettings.showHighest ||
                      roomSettings.showLowest ||
                      roomSettings.showMedian ||
                      roomSettings.showMean ? (
                        <button
                          disabled={
                            !allScoresSelected || insightsButtonDisabled
                          }
                          onClick={() => {
                            socket.emit("reveal-insights", roomCode);
                            setInsightsButtonDisabled(true);
                          }}
                          className={
                            !allScoresSelected || insightsButtonDisabled
                              ? disableRevealButtonsClass
                              : enableRevealButtonsClass
                          }
                        >
                          Reveal Insights Only
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              {/* Insights */}
              {revealInsights && (
                <Insights
                  average={meanScore}
                  median={medianScore}
                  lowest={lowestScore}
                  highest={highestScore}
                />
              )}
            </div>

            {/* Scorecard */}
            <Scorecard
              players={players}
              scrumMasterId={scrumMasterId}
              roomSettings={roomSettings}
              selectedScores={selectedScores}
              scores={scores}
              scrumMaster={scrumMaster}
              roomCode={roomCode!}
            />
          </div>
        </section>

        {/* Prompt user to create display name modal */}
        <DisplayNamePromptModal
          isPromptDisplayNameModalOpen={isPromptDisplayNameModalOpen}
          setDisplayName={setDisplayName}
          setIsPromptDisplayNameModalOpen={setIsPromptDisplayNameModalOpen}
          roomCode={roomCode!}
        />

        {/* Alerts */}
        {showAlert !== null ? <Alert alert={showAlert} /> : null}
      </div>
    );
}

export default MasterRoom;
