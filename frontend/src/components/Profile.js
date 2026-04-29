import { useNavigate } from "react-router-dom";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("JOikbbonfe");
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      setUser(null);
      navigate("/login");

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-200 p-6 max-w-sm w-80">
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl shadow-lg">
          {user.avatar}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500">
            Member since {user.joined}
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t-2 border-gray-100">
        <div className="flex items-center gap-3 text-gray-700">
          <span className="text-lg">📧</span>
          <span className="text-sm">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <span className="text-lg">📍</span>
          <span className="text-sm">{user.location}</span>
        </div>
      </div>

      <button 
        type="button"
        onClick={handleLogout}
        className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-400/50 transition-all duration-300 hover:scale-105 text-sm"
      >
        Logout
      </button>
    </div>
  );
}
