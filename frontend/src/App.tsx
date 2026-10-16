import './App.css'
import Weather from "./components/Weather.tsx";
import Clock from "./components/Clock.tsx";

function App() {

  return (
      <div  className="bg-black w-screen h-screen">
        <Clock />
        <Weather  />
      </div>


  )
}

export default App
