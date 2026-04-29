import { Link,useNavigate } from "react-router-dom";
import { useState} from "react";
import Profile from "./Profile"; // Make sure to import your Profile component

export default function Navbar({user,setUser}) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  function handleClick(){
    if (!user) {
      navigate("/login");
      return;
    }
    setShowProfile(prev => !prev);
  }
  return (
    <>
      <nav className="
        fixed top-0 left-0 w-full z-50
        px-10 py-5 
        bg-gradient-to-r from-emerald-900 via-teal-800 to-green-900 
        text-white shadow-lg
      ">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Glowing ring effect */}
              <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
              {/* Earth icon */}
              <div className="relative text-4xl transform group-hover:scale-110 transition-transform duration-300">
                🌍
              </div>
              {/* Leaf accent */}
              <div className="absolute -top-1 -right-1 text-lg transform rotate-12 group-hover:rotate-45 transition-transform duration-300">
                🍃
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200 bg-clip-text text-transparent group-hover:from-green-200 group-hover:via-emerald-100 group-hover:to-teal-100 transition-all duration-300">
              Carbon Cast
            </h2>
          </Link>

          {/* Center Navigation Links */}
          <div className="flex gap-8">
            <Link 
              className="relative px-4 py-2 font-medium transition-all duration-300 hover:text-green-300 group" 
              to="/"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link 
              className="relative px-4 py-2 font-medium transition-all duration-300 hover:text-green-300 group" 
              to="/predict"
            >
              Predict
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link 
              className="relative px-4 py-2 font-medium transition-all duration-300 hover:text-green-300 group" 
              to="/history"
            >
              History
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link 
              className="relative px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/50 font-semibold" 
              to="/how-it-works"
            >
              How It Works
            </Link>
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button 
              onClick={handleClick}
              className="relative group"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-green-400/50">
                {/* Profile icon with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    👤
                  </div>
                </div>
                <span className="text-sm font-medium hidden sm:block group-hover:text-green-300 transition-colors">
                  {(user && user.name) || 'Profile' }
                </span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Dropdown - Outside navbar to avoid overflow clipping */}
      {showProfile && user && (
        <div         
          className="fixed top-20 right-10 z-[60] animate-fadeIn"
        >
          <Profile 
            user={{
              name: user.name,
              email: user.email,
              location: "India , Asia",
              joined: "January 2024",
              avatar: "👤"
            }}
            setUser={setUser}
            onClose={() => setShowProfile(!showProfile)}
          />
        </div>
      )}
    </>
  );
}