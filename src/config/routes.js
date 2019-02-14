const express = require('express')

const routes = express.Router()

const ProducerController = require('../producers/Producer')

routes.get('/', (req, res) => {
  console.log(req.producer);
  return res.send('<h1>Kafka Up!</h1>')
});

routes.post('/producer/sendMsg', ProducerController.send)

module.exports = routes
