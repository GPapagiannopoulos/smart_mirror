import './App.css'
import Weather from "./components/Weather.tsx";
import Clock from "./components/Clock.tsx";

function App() {

  return (
      <div className="bg-black w-auto h-screen flex flex-col p-12 gap-8">
          <Clock />
          <Weather />
      </div>


  )
}

export default App
