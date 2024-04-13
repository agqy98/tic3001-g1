const rabbitmqService = require('../services/rabbitmqService');

// Controller function to handle session requests and initiate matching process
const matchUsers = async (req, res) => {
  try {
    // Extract user session conditions from the request body
    const { userId, conditions } = req.body;

    // Publish the session request to RabbitMQ
    await rabbitmqService.publishSessionRequest(userId, conditions);

    // Respond with success status
    res.status(200).json({ message: 'Session request published successfully.' });
  } catch (error) {
    // Handle errors
    console.error('Error matching users:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
const checkMatchStatus = async (req, res) => {
    try {
      // Check match status for the user (this logic can be implemented in a service function)
      const isMatched = await matchService.checkMatchStatus(req.userId);
  
      // Respond with match status
      res.status(200).json({ matched: isMatched });
    } catch (error) {
      // Handle errors
      console.error('Error checking match status:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  

module.exports = {
  matchUsers,
  checkMatchStatus
};
