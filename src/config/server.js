const express = require('express')
const kafka = require('kafka-node')
require('dotenv').config();
const properties = require('./properties')
const app = express()
const router = require('./routes')
const cors = require('cors')
const server = require('http').Server(app)
const Producer = kafka.Producer
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient({kafkaHost: `${process.env.DOCKER_IP}:9092`, autoConnect: true})
const producer = new Producer(client)
const consumer = new Consumer(client,
  [{ topic: 'topic37', offset: 0}],
  {
      autoCommit: false
  }
);

const io = require('socket.io')(server)

/**
 * Middlewares
 */

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

/**
 * Kafka Connection
 */

producer.on('ready', function () {
  console.log('Producer is ready')
});

producer.on('error', function (err) {
  console.log('Producer is in error state')
  console.log(err)
})

producer.on('uncaughtException', function (err) {
  console.log(err);
}); 

consumer.on('message', function (message) {
  console.log(message);
});

consumer.on('error', function (err) {
  console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (err) {
  console.log('offsetOutOfRange:',err);
})

app.use((req, res, next) => {
  req.kafkaClient = client
  req.producer = producer
  req.io = io
  
  return next()
})


app.use('/kafka', router)

server.listen(properties.PORT, (req, res) => {
  console.log(`Server is running on ${properties.PORT} port.`)
})
