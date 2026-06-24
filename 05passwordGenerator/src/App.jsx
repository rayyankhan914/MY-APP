import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const passwordRef = useRef(null)

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
  }, [password])

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if (numberAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$%^&*()_+-={}[]~`"

    for (let i = 0; i < length; i++) {
      let charIndex = Math.floor(Math.random() * str.length)
      pass += str.charAt(charIndex)
    }

    setPassword(pass)
  }, [length, numberAllowed, charAllowed])

  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  return (
    <>
      <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 my-8 text-orange-500 bg-gray-800'>

        <h1 className='text-white text-center py-5 text-2xl'>
          Password Generator
        </h1>


        <div className='flex shadow rounded-lg overflow-hidden mb-4 relative'>

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            className='outline-none h-10 w-full py-1 px-3 pr-12 bg-green-50 text-black'
            placeholder='Password'
            readOnly
            ref={passwordRef}
          />

          {/* Eye Icon Button */}
          <button onClick={() => setShowPassword(!showPassword)}
            className='absolute right-24 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer'
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

          <button
            onClick={copyPasswordToClipboard}
            className='outline-none bg-blue-700 text-white px-5 py-0.5 shrink-0 h-10 rounded-l cursor-pointer hover:bg-blue-600'
          >
            Copy
          </button>

        </div>

        <div className='flex text-sm gap-x-4'>

          <div className='flex items-center gap-x-1'>
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className='cursor-pointer'
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <label>Length: {length}</label>
          </div>

          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id='numberInput'
              onChange={() => {
                setNumberAllowed((prev) => !prev)
              }}
            />
            <label htmlFor='numberInput'>Numbers</label>
          </div>

          <div className='flex items-center gap-x-1'>
            <input
              type="checkbox"
              defaultChecked={charAllowed}
              id='charInput'
              onChange={() => {
                setCharAllowed((prev) => !prev)
              }}
            />
            <label htmlFor='charInput'>Characters</label>
          </div>

        </div>
      </div>
    </>
  )
}

export default App