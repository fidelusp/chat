import React, {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import './App.css'
import socketClient from 'socket.io-client'
const SERVER = 'http://localhost:8080'

function App(): JSX.Element {
  useEffect(() => {
    const socket = socketClient(SERVER)

    socket.on('connection', () => {
      console.log("I'm connected with the back-end")
    })
  }, [])

  const [value, setValue] = useState('')

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setValue(e.target.value)
  }
  const onSend = (e: SyntheticEvent) => {
    e.preventDefault()

    // send to server with e.g. `window.fetch`
  }

  return (
    <div className="chat">
      <div className="messages-container">Messages</div>
      <form className="message-input" onSubmit={onSend}>
        <input onChange={onChange} value={value} />
        <button type="submit">SEND</button>
      </form>
    </div>
  )
}

export default App
