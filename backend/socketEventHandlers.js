const { redisClient } = require("./redisDb");

const roomHandlers = (io, socket, userId, req) => {
  socket.on("get-prev-sess-data", () => {
    let displayName = req.session.displayName;
    let roomCode = req.session.roomCode;
    socket.emit("prev-sess-data", displayName, roomCode);
  });

  // Scrum master creates a room
  socket.on("create-room", (displayName) => {
    // Generate room code
    const sixDigitRoomCode = Math.floor(
      Math.random() * (999999 - 100000 + 1) + 100000
    )
      .toString()
      .padStart(6, "0");

    // Make displayName URL friendly
    displayName = displayName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    try {
      //Join created room
      if (!socket.rooms.has(sixDigitRoomCode)) {
        console.log("not already in room, joining room now");
        socket.join(sixDigitRoomCode);
      }
      // Save session data
      req.session.displayName = displayName;
      req.session.roomCode = sixDigitRoomCode;
      req.session.master = true;
      req.session.masterId = userId;
      req.session.count++;
      req.session.save();

      // Save the room data to Redis
      redisClient.set(
        sixDigitRoomCode,
        JSON.stringify({
          master: userId,
          masterName: displayName,
          roomCode: sixDigitRoomCode,
          roomSettings: {
            showMean: true,
            showMedian: true,
            showLowest: true,
            showHighest: true,
            allowRevealScoresIndividually: true,
            showTimer: false,
            playAsScrumMaster: true,
          },
          timerState: {
            timerSet: false,
            timerStarted: false,
            timerEndTime: null,
            timerPausedAt: null,
          },
        }),
        (err) => {
          if (err) {
            console.error("Error while saving room data to Redis:", err);
            return;
          }
        }
      );

      // Send room URL details to client
      socket.emit("room-created", sixDigitRoomCode, displayName);
    } catch (err) {
      console.error(err);
      socket.emit(
        "error-creating-room",
        "Error while creating room. Please try again."
      );
    }
  });

  // User joins a room
  socket.on("join-room", async (roomCode) => {
    try {
      // Get requested room from database
      // const room = await redisClient.get(roomCode);
      let roomDataObject = await getRoomDataObject(roomCode);
      if (!roomDataObject) {
        socket.emit(
          "error-joining-room",
          `Sorry, room ${roomCode} does not exist.`
        );
        return;
      }

      // If user used the app previously, get the same user name
      let userDisplayName = req.session.displayName || null;

      //If room exists, join requested room
      if (!socket.rooms.has(roomCode)) {
        console.log("not already in room, joining room now");
        socket.join(roomCode);

        // Add new player to UI
        if (userDisplayName) {
          io.in(roomCode).emit("new-player", userId, userDisplayName);
        }
      }
      // Send room details to guest via UI
      socket.emit(
        "room-joined",
        roomDataObject.masterName,
        roomDataObject.roomCode
      );
    } catch (err) {
      console.error(err);
      socket.emit(
        "error-joining-room",
        "Error while joining room. Please try again."
      );
    }
  });

  // Scrum master joins a previously created room
  socket.on("join-prev-room", (displayName, roomCode) => {
    // If not already in room, join room
    if (!socket.rooms.has(roomCode)) {
      console.log("not already in room, joining room now");
      socket.join(roomCode);

      // If user used the app previously, get the same user name
      let userDisplayName = req.session.displayName || null;

      // Add new player to UI
      if (userDisplayName) {
        io.in(roomCode).emit("new-player", userId, userDisplayName);
      }
    }
    socket.emit("joined-prev-room", displayName, roomCode);
  });

  // Check room exists when redirected to room route
  socket.on("check-room-exists", async (roomCode) => {
    console.log("Checking if room exists");
    try {
      // Get requested room from database
      let roomDataObject = await getRoomDataObject(roomCode);
      console.log(roomDataObject);
      if (!roomDataObject) {
        console.log("Room does not exist");
        socket.emit("room-not-exist", "Sorry, this room doesn't exist.");
        return;
      }

      // If user used the app previously, get the same user name
      let userDisplayName = req.session.displayName || null;

      // If the user is not already in the room, add them to it
      if (!socket.rooms.has(roomCode)) {
        socket.join(roomCode);

        // Add new player to UI
        if (userDisplayName) {
          io.in(roomCode).emit("new-player", userId, userDisplayName);
        }
      }

      // Get list of players in the room
      let players = {};
      const sockets = await io.in(roomCode).fetchSockets();
      for (const socket of sockets) {
        players[socket.request.session.id] = socket.request.session.displayName;
      }

      // Get each player's respective score
      const scores = await redisClient.hGetAll(`${roomCode}-scorecard`);

      // Send room details to client
      socket.emit(
        "room-exists",
        userDisplayName,
        players,
        userId,
        scores,
        req.session.master,
        roomDataObject.master,
        roomDataObject.roomSettings,
        roomDataObject.timerState
      );
    } catch (error) {
      console.error(error);
      socket.emit("room-not-exist", "Sorry, this room doesn't exist.");
    } finally {
      console.log("Finished checking if room exists");
    }
  });

  // Scrum master updates room settings
  socket.on("update-room-settings", async (roomSettings, roomCode) => {
    try {
      let roomDataObject = await getRoomDataObject(roomCode);
      if (!roomDataObject) {
        console.error("Error while retrieving room data from Redis");
        return;
      }

      roomDataObject.roomSettings = roomSettings;

      // Save the updated room data back to Redis
      redisClient.set(roomCode, JSON.stringify(roomDataObject), (err) => {
        if (err) {
          console.error("Error while saving room data to Redis:", err);
        } else {
          console.log("Room data saved to Redis");
        }
      });

      // Send the updated room settings to all players in the room
      io.to(roomCode).emit("room-settings-updated", roomSettings);
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while updating room settings. Please try again later."
      );
    }
  });

  // If new user, set display name
  socket.on("set-display-name", (userDisplayName, roomCode) => {
    req.session.displayName = userDisplayName;
    req.session.count++;
    req.session.save();

    if (!socket.rooms.has(roomCode)) {
      console.log("not already in room, joining room now");
      socket.join(roomCode);
    }
    io.in(roomCode).emit("new-player", userId, userDisplayName);
  });

  let rooms = socket.rooms;
  // On disconnect, remove player from UI
  socket.on("disconnect", () => {
    rooms = rooms.values();
    rooms.next();
    for (const room of rooms) {
      // If player leaves or disconnects, remove from UI
      io.in(room).emit("player-disconnected", userId, req.session.displayName);
      // Remove player and score from Redis db
      redisClient.hDel(`${room}-scorecard`, userId);
    }
  });

  socket.on("end-room", async (roomCode) => {
    try {
      await redisClient.del(roomCode);
      await redisClient.del(`${roomCode}-scorecard`);
      delete req.session.roomCode;
      delete req.session.master;
      delete req.session.masterId;
      req.session.count++;
      req.session.save();
      io.to(roomCode).emit("room-ended");
    } catch (error) {
      console.error(error);
      socket.emit("error", "Error while ending room. Please try again later.");
    }
  });
};

const scoresHandlers = (io, socket, userId) => {
  // Scores db
  let userScore = { [userId]: null };
  // User submits score
  socket.on("score", async (score, room) => {
    try {
      // Save score to Redis hash
      redisClient.hSet(
        `${room}-scorecard`,
        userId,
        JSON.stringify({ score: score, revealed: false }),
        (err) => {
          if (err) {
            console.error("Error while saving score to Redis:", err);
          }
        }
      );

      // Save score to local db
      userScore[userId] = score;

      io.to(room).emit("score-selected", userId);
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while submitting score. Please try again later."
      );
    }
  });

  // Scrum master reveals insights only to everyone
  socket.on("reveal-insights", async (roomCode) => {
    // Retrieve the scores from the Redis hash
    try {
      const scores = await redisClient.hGetAll(`${roomCode}-scorecard`);
      io.to(roomCode).emit("insights-revealed", scores);
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while revealing insights. Please try again later."
      );
    }
  });

  // Scrum master reveals scores
  socket.on("show-scores", async (room, roomSettings) => {
    // Retrieve the scores from the Redis hash
    try {
      const scores = await redisClient.hGetAll(`${room}-scorecard`);

      // After reveal, set revealed property to true
      // Iterate over each score, parse it, update "revealed" to true, and store it back in Redis
      for (let key in scores) {
        let parsedScore = JSON.parse(scores[key]);
        parsedScore.revealed = true;
        scores[key] = JSON.stringify(parsedScore);

        // Update the value in Redis
        await redisClient.hSet(`${room}-scorecard`, key, scores[key]);
      }

      io.to(room).emit("players-scores-list", userId, scores, roomSettings);
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while revealing scores. Please try again later."
      );
    }
  });

  // Scrum master reveals an individual's score
  socket.on("show-individual-score", async (playerId, roomCode) => {
    // Retrieve the specific player's score from the Redis hash
    try {
      let score = await redisClient.hGet(`${roomCode}-scorecard`, playerId);

      // Parse the score, update "revealed" to true, and store it back in Redis
      let parsedScore = JSON.parse(score);
      parsedScore.revealed = true;
      score = JSON.stringify(parsedScore);

      // Update the value in Redis
      await redisClient.hSet(`${roomCode}-scorecard`, playerId, score);

      // Emit only the updated score
      io.to(roomCode).emit("player-score-revealed", playerId, score);
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while revealing score. Please try again later."
      );
    }
  });

  // Scrum master resets scores
  socket.on("clear-scores", async (roomCode) => {
    try {
      // Clear scores from Redis
      redisClient.del(`${roomCode}-scorecard`);
      io.to(roomCode).emit("scores-cleared");
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while clearing scores. Please try again later."
      );
    }
  });
};

const timerHandlers = (io, socket) => {
  // Scrum master sets timer
  socket.on("set-timer", async (mins, roomCode) => {
    io.to(roomCode).emit("timer-set", mins);

    try {
      let roomDataObject = await getRoomDataObject(roomCode);

      if (!roomDataObject) return;

      // Update the timer state if timer is being used
      if (roomDataObject.roomSettings.showTimer) {
        roomDataObject.timerState = {
          timerSet: true,
          timerStarted: false,
          timerEndTime: null,
          timerPausedAt: null,
          timeRemainingInMins: mins,
        };
      }

      // Save the updated room data back to Redis
      await saveRoomDataObject(roomCode, roomDataObject);
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while setting timer. Please try again later."
      );
    }
  });

  // Scrum master starts the timer
  socket.on("start-timer", async (roomCode, seconds) => {
    // Send to all clients in the room the end time of the timer.
    let endTime = Date.now() + seconds * 1000;

    try {
      let roomDataObject = await getRoomDataObject(roomCode);
      if (!roomDataObject) return;

      if (roomDataObject.roomSettings.showTimer) {
        roomDataObject.timerState = {
          timerSet: true,
          timerStarted: true,
          timerEndTime: endTime,
          timerPausedAt: null, // Reset the paused at timer since it's started now.
        };
      }
      await saveRoomDataObject(roomCode, roomDataObject);
      io.to(roomCode).emit("timer-started", endTime);
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while starting timer. Please try again later."
      );
    }
  });

  // Scrum master pauses the timer
  socket.on("pause-timer", async (roomCode) => {
    try {
      let roomDataObject = await getRoomDataObject(roomCode);
      if (!roomDataObject) return;

      // Get the time the timer was paused at.
      let timePausedAt = Date.now();

      // Calculate the remaining time in minutes.
      const timeRemainingInMins =
        (roomDataObject.timerState.timerEndTime - timePausedAt) / 60000;

      let newEndTime = timePausedAt + timeRemainingInMins * 60000;

      // Update the timer state in the room data object.
      roomDataObject.timerState.timerStarted = false;
      roomDataObject.timerState.timerPausedAt = timePausedAt; // Store the paused at time.
      roomDataObject.timerState.timerEndTime = newEndTime;
      roomDataObject.timerState.timeRemainingInMins = timeRemainingInMins;

      // Save the room data object to Redis.
      await saveRoomDataObject(roomCode, roomDataObject);

      // Send to all clients in the room the remaining time in minutes.
      io.to(roomCode).emit("timer-paused", newEndTime);
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while pausing timer. Please try again later."
      );
    }
  });

  // Scrum master resumes the timer
  socket.on("reset-timer", async (roomCode) => {
    try {
      let roomDataObject = await getRoomDataObject(roomCode);
      if (!roomDataObject) return;
      if (roomDataObject.roomSettings.showTimer) {
        roomDataObject.timerState = {
          timerSet: false,
          timerStarted: false,
          timerEndTime: null,
          timerPausedAt: null, // reset this field
          timeRemainingInMins: null,
        };
      }
      await saveRoomDataObject(roomCode, roomDataObject);
      io.to(roomCode).emit("timer-reset");
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "Error while resetting timer. Please try again later."
      );
    }
  });
};

//HELPER FUNCTIONS
//Get room data
async function getRoomDataObject(roomCode) {
  console.log("Fetching room data for room code:", roomCode);

  let roomDataString = null;
  try {
    roomDataString = await redisClient.get(roomCode);
  } catch (error) {
    console.error(error);
    console.log("Error while getting room data from Redis.");
  }
  return JSON.parse(roomDataString);
}

// Save room data
async function saveRoomDataObject(roomCode, roomDataObject) {
  try {
    await redisClient.set(roomCode, JSON.stringify(roomDataObject));
  } catch (error) {
    console.error(error);
  }
}

module.exports = { roomHandlers, scoresHandlers, timerHandlers };
