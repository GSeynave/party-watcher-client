import "./App.css";
import Register from "./pages/register";
import { Link, Route, Routes } from "react-router";
import Restricted from "./guards/restricted";
import RoomList from "./pages/RoomList";
import Login from "./pages/login";
import RoomPage from "./pages/RoomPage";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { user, loading, isAuthenticated } = useAuthContext();
  console.log("App component - user:", user);
  return (
    <>
      <div>
        <div className="flex flex-row h-screen">
          <nav className="flex flex-col gap-4 p-4 bg-gray-200">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/rooms">Rooms</Link>
          </nav>
          <div className="flex-1 p-4">
            <Routes>
              <Route
                path="/rooms"
                element={
                  <Restricted
                    loading={loading}
                    isAuthenticated={isAuthenticated}
                  >
                    <RoomList user={user} />
                  </Restricted>
                }
              />
              <Route
                path="/room/:roomId"
                element={
                  <Restricted
                    loading={loading}
                    isAuthenticated={isAuthenticated}
                  >
                    <RoomPage />
                  </Restricted>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={<Login />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
