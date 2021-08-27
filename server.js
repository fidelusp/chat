const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const router = require('./router')
const PORT = 8080
const users = {}

io.on('connection', (socket) => {
  console.log('new user connected')
  socket.emit('connection', null)

  socket.on('disconnect', () => {
    socket.broadcast.emit('userDisconnected', users[socket.id])
    delete users[socket.id]
    console.log('user disconnected')
  })

  socket.on('newUser', (name) => {
    users[socket.id] = name
    socket.broadcast.emit('newUserConnected', name)
  })

  socket.on('sendMessage', (message, callback) => {
    socket.broadcast.emit('chatMessage', {
      message: message,
      name: users[socket.id],
    })
    callback()
  })
})

app.use(router)

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})
