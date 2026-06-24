import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Card from './components/Card'

function App() {
  const [count, setCount] = useState(0)
  let myObj = {
    username: "rayyam",
    age: 20
  }
  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-900 text-white'>
        <h1 className='bg-green-300 text-black rounded-xl p-4'>Welcome to Vite + React</h1>
      <Card username = "Rayyan" btnText="Click me"  />
      <Card username="Rayyan khan" btnText="Visit me"/>
      </div>

    </>
  )
}

export default App
