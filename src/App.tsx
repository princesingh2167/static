
import './App.css'
import MeetingRequest from './components/MeetingRequest'
import Navbar from './components/Navbar'

function App() {

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Navbar/>
      <MeetingRequest/>
  </div>
  )
}

export default App
