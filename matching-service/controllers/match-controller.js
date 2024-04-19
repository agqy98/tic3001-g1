import amqp from "amqplib/callback_api.js";

// const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost';
const AMQP_URL = 'amqp://host.docker.internal';


const topicQueue = []
const userQueue = []
const topicTimeouts = new Map(); // Map to store timeout IDs for each topic
const TIMEOUT = 30000; // 100 seconds in milliseconds

const successfulMatches = []; // Map to store successful matches by user

// Controller function to handle session requests and initiate matching process
export async function startReceivingLogs(req, res) {
  const { topic, msg } = req.body;

  var index = topicQueue.indexOf(topic)
  if (index != -1 && userQueue[index] != msg) { // Topic exists and not posted by user
    return emitLog(topic, msg);
  }

  amqp.connect(AMQP_URL, function (error0, connection) {
    if (error0) {
      console.log(error0.message)
      // return res.status(500).json({ error: error0.message });
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        console.log(error1.message)
        // return res.status(500).json({ error: error1.message });
      }
      const exchange = 'topic_logs';

      channel.assertExchange(exchange, 'topic', { durable: false });

      channel.assertQueue('', { exclusive: true }, function (error2, q) {
        if (error2) {
          console.log(error2.message)
          // return res.status(500).json({ error: error2.message });
        }
        console.log(` [*] ${msg} searching for '${topic}' match...`);

        channel.bindQueue(q.queue, exchange, topic);

        addTopic(topic, msg);

        channel.consume(
          q.queue,
          function (msg) {
            var topic = msg.fields.routingKey;
            var userInit = msg.content.toString()
            console.log(` [x] ${topic}:'${userInit}'`);
            // You can send the log message to frontend or process it as needed
            var indexOfTopic = topicQueue.indexOf(topic);
            var matchedUser = userQueue[indexOfTopic];
            handleSuccessfulMatch(topic, userInit, matchedUser);
          },
          { noAck: true }
        );
      });
    });
  });

  return res.status(200).json({ message: 'Receiving logs started successfully.' });
}

export async function stopReceivingLogs(req, res) {
  const { topic, msg } = req.body;

  // If the user is an existing producer with the stated topic:
  const index = userQueue.indexOf(msg);
  if (topicQueue[index] == topic) {
    removeTopic(topic);
  }
  // Assume it expired alr
  res.sendStatus(200);
}

function emitLog(topic, msg) {
  const message = msg || 'Hello World!';
  const exchange = 'topic_logs';

  amqp.connect(AMQP_URL, async function (error0, connection) {
    if (error0) {
      console.log(error0.message);
    }
    connection.createChannel(async function (error1, channel) {
      if (error1) {
        console.log(error1.message);
      }
      channel.assertExchange(exchange, 'topic', { durable: false });
      channel.publish(exchange, topic, Buffer.from(message));
      console.log(` [x] Sent ${topic}:'${msg}'`);

      channel.close(function () {
        connection.close();
      });
    });
  });
}


function addTopic(topic, user) {
  topicQueue.push(topic);
  userQueue.push(user);

  // Start a timeout to remove the topic from the queue after 100 seconds
  const timeoutId = setTimeout(() => {
    removeTopic(topic);
  }, TIMEOUT);

  // Store the timeout ID in the map
  topicTimeouts.set(topic, timeoutId);
}

// Function to remove topic from the queue and cancel the timeout
function removeTopic(topic) {
  const index = topicQueue.indexOf(topic);
  if (index !== -1) {
    var username = userQueue[index];
    topicQueue.splice(index, 1);
    userQueue.splice(index, 1);
    console.log(` [*] ${username} stopped searching for '${topic}' match...`);

  }

  // Cancel the timeout for the topic
  const timeoutId = topicTimeouts.get(topic);
  if (timeoutId) {
    clearTimeout(timeoutId);
    topicTimeouts.delete(topic);
  }
}
function handleSuccessfulMatch(topic, user1, user2) {
  // Implement your logic to handle the successful match here
  // For example, you can emit an event, update a global state, or invoke a callback function
  const index = successfulMatches.findIndex(match => match.msg === user1 && match.topic === topic);

  if (index == -1) {
    console.log(`${user1} and ${user2} are matched for topic '${topic}'`)
    successfulMatches.push(
      { topic: topic, msg: user1, username: user2 },
    )
    successfulMatches.push(
      { topic: topic, msg: user2, username: user1 },
    )
  }
}
export async function listen(req, res) {
  const { topic, msg } = req.body;

  // Find the index of the message in successfulMatches
  const index = successfulMatches.findIndex(match => match.msg === msg && match.topic === topic);

  if (index === -1) {
    res.status(404).json({ message: 'Match not found yet' });
  } else {
    // Get the matched username
    const matchedUser = successfulMatches[index].username;
    successfulMatches.splice(index, 1);
    removeTopic(topic)
    console.log(successfulMatches);
    res.status(200).json({ message: `You are matched with ${matchedUser}` });
  }
}