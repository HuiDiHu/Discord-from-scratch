import logo from "assets/Dlogo.png"
import { Link } from "react-router-dom"

const LoadingScreen = () => {
  return (
    <div className="h-screen w-screen bg-[#1e1e1e] flex flex-col items-center justify-center">
        <img
            className="w-28 h-28 animate-bounce mb-3"
            src={logo}
        />
        <p className="font-medium text-lg">
            Loading...
        </p>
        <span className="text-neutral-500 text-xs mb-3">This could take up to 50 seconds</span>
        <span className="text-neutral-400 text-xs w-44 text-center">
            In the mean time, check out my previous{" "}
            <Link to={"http://statswr.vercel.app"} target="_blank" rel="noopener noreferrer" className="text-sky-500">project</Link>
            {" :)"}
        </span>
    </div>
  )
}

export default LoadingScreen