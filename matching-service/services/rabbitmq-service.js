const amqp = require('amqplib');

async function subscribeToMatches() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'session_requests';
    const queueName = 'match_queue';
    const routingKey = 'session.conditions';

    await channel.assertExchange(exchangeName, 'topic', { durable: false });
    const { queue } = await channel.assertQueue(queueName, { exclusive: true });

    await channel.bindQueue(queue, exchangeName, routingKey);

    console.log('Waiting for session requests...');

    channel.consume(queue, (msg) => {
        const sessionRequest = JSON.parse(msg.content.toString());
        console.log('Received session request:', sessionRequest);

        // Check if there are existing session requests with matching conditions
        // If a match is found, perform the appropriate actions
        // For simplicity, we're just logging the matched users here
        console.log('Match found! Users matched:', sessionRequest.userId);
    }, { noAck: true });
}
const checkMatchStatus = async (userId) => {
    // Logic to check match status for the user
    // This could involve querying a database, checking a cache, or interacting with other services

    // For demonstration purposes, let's assume we have a simple in-memory store of matched users
    const matchedUsers = ['user1', 'user2', 'user3']; // Example of matched users

    // Check if the userId exists in the list of matched users
    return matchedUsers.includes(userId);
};

module.exports = {
    subscribeToMatches,
    checkMatchStatus
};
