import React, {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import socketClient, { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'

const SERVER = 'http://localhost:8080'
let socket: Socket<DefaultEventsMap, DefaultEventsMap>

const Chat: React.FC = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([''])
  const [chatName, setChatName] = useState<string | null>('Jan Kowalski')

  let name: string | null

  useEffect(() => {
    socket = socketClient(SERVER)
    name = prompt('Enter your name:')
    setChatName(name)
    socket.emit('newUser', name || 'Jan Kowalski')

    socket.on('connection', () => {
      console.log("I'm connected with the back-end")
    })
  }, [SERVER])

  useEffect(() => {
    socket.on('chatMessage', (data) => {
      setMessages((messages) => [
        ...messages,
        `${data.name}: ${data.message}`,
      ])
    })

    socket.on('newUserConnected', (name) => {
      setMessages((messages) => [
        ...messages,
        `${name} joined to the chat`,
      ])
    })

    socket.on('userDisconnected', (name) => {
      setMessages((messages) => [...messages, `${name} left the chat`])
    })
  }, [])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setMessage(e.target.value)
  }

  const onSend = (e: SyntheticEvent) => {
    e.preventDefault()
    setMessages((messages) => [...messages, `You: ${message}`])
    socket.emit('sendMessage', message, () => setMessage(''))
  }

  const messagesElements = messages.map((item, index) => (
    <div style={{ marginTop: '10px' }} key={index}>
      {item}
    </div>
  ))

  return (
    <div className="chat">
      <h3>Your name: {chatName || 'Jan Kowalski'}</h3>
      <div className="messages-container">
        <div>{messagesElements}</div>
      </div>
      <div className="form-container">
        <form className="message-form" onSubmit={onSend}>
          <input
            required
            className="message-input"
            onChange={onChange}
            value={message}
          />
          <button type="submit">SEND</button>
        </form>
      </div>
    </div>
  )
}

export default Chat
