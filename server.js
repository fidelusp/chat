const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
const PORT = 8080
http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`)
})

io.on('connection', (socket) => {
  console.log('new user connected')
  socket.emit('connection', null)

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
