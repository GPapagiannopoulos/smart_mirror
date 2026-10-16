import './App.css'
import Weather from "./components/Weather.tsx";
import Clock from "./components/Clock.tsx";

function App() {

  return (
      <div className="bg-black w-screen h-screen p-8">
          <div className="flex justify-start">
            <Clock />
          </div>
          <div>
            <Weather  />
          </div>
      </div>


  )
}

export default App
