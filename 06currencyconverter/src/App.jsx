import { useState } from 'react'
import { InputBox } from './components'
import useCurrencyInfo from './hooks/useCurrencyInfo'
import './App.css'

function App() {
  const [amount, setAmount] = useState(0)
  const [from, setFrom] = useState('usd')
  const [to, setTo] = useState('inr')
  const [convertedAmount, setConvertedAmount] = useState(0)
  const currencyInfo = useCurrencyInfo(from)

  const options = Object.keys(currencyInfo)
  const swap = () => {
    setFrom(to)
    setTo(from)
    setConvertedAmount(amount)
    setAmount(convertedAmount)
  }

  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to])

  }

  return (
    <div
      className='w-full h-screen flex flex-wrap
       justify-center items-center bg-cover 
    bg-no-repeat '
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg')`
      }}
    >
      <div className='w-full'>
        <div className='w-full max-w-md mx-auto border border-gray-60 rounded-lg 
      p-5 backdrop-blur-sm bg-white/30'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className='w-full mb-1'>
              <InputBox
                label="from"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => {
                  setAmount(amount)
                  selectCurrency = { from }
                }}
              />
            </div>
            <div className='relative w-full h-0.5 '>
              <button
                type='button'
                className='absolute left-1/2 translate-x-1/2 translate-y-1/2 border-2  '
              >
              </button>
            </div>
          </form>

        </div>
      </div>

    </div>
  )
}

export default App
