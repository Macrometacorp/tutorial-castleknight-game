"use strict";

window.syncOtherPlayerFrameDelay = 0; //30 frames allows for 500ms of network jitter, to prevent late frames
window.currentChannelName; // Global variable for the current channel that your player character is on
window.currentFireChannelName; // Global variable that checks the current stage you are on window.globalCurrentLevel = 0; // Global variable for the current level (index starts at 0)
window.UniqueID = generateName();
window.globalLevelState = null; // Sets the globalLevelState to null if you aren't connected to the network. Once connected, the level will generate to the info that was on the block.
window.globalWasHeroMoving = true;
window.text1 = "Level 1 Occupancy: 0"; // Global text objects for occupancy count
window.text2 = "Level 2 Occupancy: 0";
window.text3 = "Level 3 Occupancy: 0";
let textResponse1;
let textResponse2;
let textResponse3;
let myCurrentLevel = 0;
let allOccupancyObj = [0, 0, 0];
window.updateOccupancyCounter = false; // Occupancy Counter variable to check if the timer has already been called in that scene
window.keyMessages = [];

window.macrometaStream = null;
window.macrometaConsumer = null;

window.PRESENCE_ACTION_JOIN = "join";
window.PRESENCE_ACTION_LEAVE = "leave";
window.PRESENCE_ACTION_TIMEOUT = "timeout";

const TYPE_MESSAGE = 1;
const TYPE_PRESENCE = 2;

const DB_NAME = (window.DB_NAME = fabric_name);
const BASE_URL = (window.BASE_URL = cluster);

window.CHAT_STREAM_NAME = "stream-chat";

let topic;

var fabric = new window.jsC8(`https://${BASE_URL}`);
async function collection() {
  const res = await fabric.login(email, password);
  window.fabric = fabric;
  window.TENANT = res.tenant;
  fabric.useFabric(fabric_name);
  const collection = fabric.collection("occupancy");
  const result = await collection.exists();
  if (result === false) {
    await collection.create();
    console.log("Collection Creation");
    const data = { _key: "123", one: 0, two: 0, three: 0 };
    const info = await collection.save(data);
  }

  // create chat stream
  const chatStream = fabric.stream(CHAT_STREAM_NAME, false);
  try {
    await chatStream.createStream();
  } catch {
    console.log(`stream ${CHAT_STREAM_NAME} already exist`);
  }
  window.chatStream = chatStream;
}

async function init(currentLevel = 0) {
  await collection();
  console.log("attempt init v232 level", currentLevel);
  myCurrentLevel = currentLevel;
  window.globalCurrentLevel = currentLevel; // Get the current level and set it to the global level
  window.currentFireChannelName = "realtimephaserFire2";
  window.currentChannelName = `realtimephaser${currentLevel}`; // Create the channel name + the current level. This way each level is on its own channel.

  // create streams
  const streamName = `stream-level-${currentLevel}`;
  const stream = fabric.stream(streamName, false);
  try {
    await stream.createStream();
  } catch {
    console.log(`stream ${streamName} already exist`);
  }
  topic = stream.topic;

  const prodMsg = JSON.stringify({
    payload: "realData",
    properties: {
      channel: "realtimephaserFire2",
      level: currentLevel,
      macrometaType: TYPE_MESSAGE,
      int: true,
      sendToRightPlayer: window.UniqueID,
      timeToken: Date.now(),
    },
  });
  window.macrometaStream = stream;

  const consumerWs = await fabric.createStreamReader(
    streamName,
    window.UniqueID,
    false
  );

  // Streams
  var consumer = (window.macrometaConsumer = consumerWs);
  consumer.on("open", () => {
    console.log("WebSocket consumer is open");
    stream.publishMessage(prodMsg);
  });

  consumer.on("error", () => {
    console.log("Failed to establish WS connection for level");
  });

  consumer.on("close", (event) => {
    console.log("Closing WS connection for level");
  });

  consumer.on("message", (message) => {
    message = JSON.parse(message);

    const data = JSON.parse(atob(message.payload));
    message = { ...message, ...data };

    const ackMsg = { messageId: message.messageId };
    consumer.send(JSON.stringify(ackMsg));

    message.properties.position = {
      x: message.properties.x,
      y: message.properties.y,
    };
    var messageEvent = {
      message: message.properties,
      sendByPost: false, // true to send via posts
      timeToken: message.properties.timeToken || 0,
    };
    if (message.payload !== "noop") {
      if (messageEvent.message.macrometaType == TYPE_MESSAGE) {
        if (messageEvent.message.uuid === window.UniqueID) {
          return; // this blocks drawing a new character set by the server for ourselve, to lower latency
        }
        window.globalLastTime = messageEvent.timetoken; // Set the timestamp for when you send fire messages to the block
        if (
          messageEvent.message.int == true &&
          messageEvent.message.sendToRightPlayer === window.UniqueID
        ) {
          // If you get a message and it matches with your UUID
          window.globalLevelState = getLevelState(
            messageEvent.message.currentLevel
          );
          window.StartLoading(); // Call the game state start function in onLoad
        }
        if (window.globalOtherHeros) {
          // If player exists
          if (
            !window.globalOtherHeros.has(messageEvent.message.uuid) &&
            messageEvent.message.uuid
          ) {
            // If the message isn't equal to your uuid
            window.globalGameState._addOtherCharacter(
              messageEvent.message.uuid
            ); // Add another player to the game that is not yourself

            let numOthers = window.globalOtherHeros
              ? window.globalOtherHeros.size
              : 0;

            window.sendKeyMessage({}); // Send publish to all clients about user information
            const otherplayer = window.globalOtherHeros.get(
              messageEvent.message.uuid
            );
            otherplayer.position.set(
              parseInt(messageEvent.message.x),
              parseInt(messageEvent.message.y)
            );
            otherplayer.initialRemoteFrame = parseInt(
              messageEvent.message.frameCounter
            );
            otherplayer.initialLocalFrame = window.frameCounter;
            otherplayer.totalRecvedFrameDelay = 0;
            otherplayer.totalRecvedFrames = 0;
            console.log("added other player to (main.js)", otherplayer);
          }
          if (
            messageEvent.message.x &&
            window.globalOtherHeros.has(messageEvent.message.uuid)
          ) {
            // If the message contains the position of the player and the player has a uuid that matches with one in the level
            console.dir("receiving another position", messageEvent);
            window.keyMessages.push(messageEvent);
          }
        }
      } // --- end message
      else if (messageEvent.message.macrometaType == TYPE_PRESENCE) {
        console.log("got a presence event");

        if (messageEvent.message.action === window.PRESENCE_ACTION_JOIN) {
          // If we recieve a presence event that says a player joined the channel
          if (messageEvent.uuid !== window.UniqueID) {
            window.sendKeyMessage({}); // Send message of players location on screen
          }
        } else if (
          messageEvent.message.action === window.PRESENCE_ACTION_LEAVE ||
          messageEvent.message.action === window.PRESENCE_ACTION_TIMEOUT
        ) {
          try {
            window.globalGameState._removeOtherCharacter(
              messageEvent.message.uuid
            ); // Remove character on leave events if the individual exists
            console.log("removed other character");
          } catch (err) {
            console.log(err);
          }
        }
      } // --- end presence
    }
  });
}

/// Start for initialization only called once
async function start() {
  //publish gibberish data every 5000ms to whatever producer is the current one
  setInterval(() => {
    if (window.macrometaStream)
      window.macrometaStream.publishMessage(
        JSON.stringify({ payload: "noop" })
      );
  }, 30000);

  setInterval(() => {
    makeOccupancyQuery(QUERY_READ);
  }, 1000);

  window.globalUnsubscribe = function () {
    makeOccupancyQuery(QUERY_UPDATE, false);
    var obj = {
      uuid: window.UniqueID,
      action: window.PRESENCE_ACTION_LEAVE,
      macrometaType: TYPE_PRESENCE,
    };
    var jsonString = JSON.stringify({
      payload: "realDataPresence",
      properties: obj,
    });
    window.macrometaStream.publishMessage(jsonString);
    console.log("I unsubscribed and sent something");
    window.macrometaConsumer.terminate();
  };

  // If person leaves or refreshes the window, run the unsubscribe function
  window.addEventListener("beforeunload", (event) => {
    console.log("interfere with close tab");
    window.globalUnsubscribe();

    return null;
  });
}

const QUERY_READ = "FOR doc IN occupancy RETURN doc";
const QUERY_UPDATE = "UPDATE";
//`FOR doc IN occupancy REPLACE doc WITH ${JSON.stringify(allOccupancyObj)} IN occupancy`;
async function makeOccupancyQuery(queryToMake, shouldAdd = true) {
  if (queryToMake === QUERY_UPDATE) {
    let levelWord = "one";

    switch (myCurrentLevel) {
      case 0:
        levelWord = "one";
        break;
      case 1:
        levelWord = "two";
        break;
      case 2:
        levelWord = "three";
        break;
    }

    if (shouldAdd)
      queryToMake =
        "FOR " +
        `doc IN occupancy UPDATE doc WITH {${levelWord}: doc.${levelWord} + 1} IN occupancy RETURN doc`;
    else {
      queryToMake =
        "FOR " +
        `doc IN occupancy UPDATE doc WITH {${levelWord}: MAX([ doc.${levelWord} - 1 , 0 ])} IN occupancy RETURN doc`;
    }
  }

  const cursor = await fabric.query(queryToMake);
  const obj = await cursor.next();
  allOccupancyObj[0] = obj.one;
  allOccupancyObj[1] = obj.two;
  allOccupancyObj[2] = obj.three;
  updateOccupancyText();
  return queryToMake;
}

function updateOccupancyText() {
  window.text1 = `Level 1 Occupancy: ${allOccupancyObj[0]}`;
  window.text2 = `Level 2 Occupancy: ${allOccupancyObj[1]}`;
  window.text3 = `Level 3 Occupancy: ${allOccupancyObj[2]}`;
  window.textObject1.setText(window.text1);
  window.textObject2.setText(window.text2);
  window.textObject3.setText(window.text3);
}

function getLevelState(currentLevel) {
  return game.cache.getJSON(`level:${currentLevel}`);
}

window.createMyConnection = function (currentLevel) {
  init(currentLevel);
};

window.sendKeyMessage = (keyMessage) => {
  try {
    if (window.globalMyHero) {
      keyMessage.uuid = window.UniqueID;
      keyMessage.macrometaType = TYPE_MESSAGE;
      keyMessage.x = Math.floor(window.globalMyHero.body.position.x);
      keyMessage.y = Math.floor(window.globalMyHero.body.position.y);
      keyMessage.frameCounter = window.frameCounter;
      keyMessage.timeToken = Date.now();

      window.macrometaStream.publishMessage(
        JSON.stringify({
          payload: "rD",
          properties: keyMessage,
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};

window.fireCoins = () => {};

// Load External Javascript files
const loadHeroScript = document.createElement("script");
loadHeroScript.src = "./js/heroScript.js";
document.head.appendChild(loadHeroScript);

const loadLoadingState = document.createElement("script");
loadLoadingState.src = "./js/loadingState.js";
document.head.appendChild(loadLoadingState);

const loadPlaystate = document.createElement("script");
loadPlaystate.src = "./js/playState.js";
document.head.appendChild(loadPlaystate);

// =============================================================================
// Load the various phaser states and start game
// =============================================================================
var game;
window.addEventListener("load", async () => {
  game = new window.Phaser.Game(960, 600, window.Phaser.AUTO, "game");
  game.state.disableVisibilityChange = true; // This allows two windows to be open at the same time and allow both windows to run the update function
  game.state.add("play", window.PlayState);
  game.state.add("loading", window.LoadingState);

  window.StartLoading = function () {
    var obj = {
      uuid: window.UniqueID,
      action: window.PRESENCE_ACTION_JOIN,
      macrometaType: TYPE_PRESENCE,
    };
    var jsonString = JSON.stringify({
      payload: "realDataPresence",
      properties: obj,
    });
    console.log("attempt start loading");
    window.macrometaStream.publishMessage(jsonString);
    game.state.start("loading"); // Run the loading function once you successfully connect to the network
    window.initChatEngine();
  };

  await init();
  await start();
});
