import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  console.log("app rendered");
  
  const [value, setValue] = useState({
    value: 0,
  });
  // const [multipliedValue, setMultipliedValue] = useState(1)
  // let multipliedValue = value * 5

  // const multiplybyfive = () => {
  //   // setMultipliedValue(value * 5)
  //   setValue(value + 1)
  // }

  const clickMe = () => {
    setValue({ value: 0 });
  };
  return (
    <>
      <h1>Main value: {value.value} </h1>
      <button onClick={clickMe}>Click me multiply by 5</button>
      {/* <h2>Multiplied value: {multipliedValue}</h2> */}
    </>
  );
}

export default App;
