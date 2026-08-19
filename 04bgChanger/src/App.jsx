import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [color, setColor] = useState('blue')

  return (
    <>
      <div className='w-full h-screen duration-200'
        style={{ backgroundColor: color }}
      >
        <div className='fixed flex flex-wrap justify-center
         bottom-12 inset-x-0 px-2'>
          <div className='flex flex-wrap justify-center
           shadow-lg gap-3 bg-white px-3 py-2 rounded-3xl'>
            
            <button
            onClick={() => setColor("red")}
            className='outline-none px-4 py-1 rounded-full text-white shadow-lg'
            style={{backgroundColor: "red"}}
            >red</button>

             <button
            onClick={() => setColor("green")}
            className='outline-none px-4 py-1 rounded-full text-white shadow-lg'
            style={{backgroundColor: "green"}}
            >Green</button> 

            <button
            onClick={() => setColor("blue")}
            className='outline-none px-4 py-1 rounded-full text-white shadow-lg'
            style={{backgroundColor: "blue"}}
            >blue</button>
          </div>
        </div>
      </div>
    </>
  )

}

export default App
