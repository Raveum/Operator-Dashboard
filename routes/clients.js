const express = require("express");
const router = express.Router();
const Client = require('../models/client-model');

router.post('/register', async (req, res) => {

  const { email } = req.body;

  const brokerCode = req.user.brokerCode;

  console.log(brokerCode)

  try {
    const existingClient = await Client.findOne({ email: email });
    if (existingClient) {
      return res.status(400).json({ message: 'A client with this email already exists.' });
    }

    const client = new Client({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age || null,
      phoneNumber: req.body.phoneNumber || null,
      email: req.body.email,
      potentialBudget: req.body.potentialBudget,
      timelineToInvest: req.body.timelineToInvest,
      brokerCode: brokerCode,
    });

    await client.save();

    res.status(201).json({ message: 'Success: Client Registered' });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering new client');
  }
});

router.get('/getClients', async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
  }
  const brokerCode = req.user.brokerCode;
  try {
      const clients = await Client.find({ brokerCode: brokerCode });
      res.json(clients);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching clients.' });
  }
});

module.exports = router;
