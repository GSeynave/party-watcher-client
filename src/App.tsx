import "./App.css";
import Register from "./pages/register";
import { Link, Route, Routes } from "react-router";
import Restricted from "./guards/restricted";
import RoomList from "./pages/RoomList";
import Login from "./pages/login";
import RoomPage from "./pages/RoomPage";
import { useAuthContext } from "./context/AuthContext";
import Logout from "./pages/logout";
import { roomsLoader } from "./loader/RoomsLoader";

interface ShowMenuProps {
  isAuthenticated: boolean;
}
function ShowMenu(isAuthenticated: ShowMenuProps) {
  if (isAuthenticated) {
    return (
      <>
        <Link to="/rooms" className="flex-1">
          Rooms
        </Link>
        <Link to="/logout" className="flex">
          Disconnect
        </Link>
      </>
    );
  }
  return (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  );
}

function App() {
  const { loading, isAuthenticated } = useAuthContext();
  return (
    <>
      <div>
        <div className="flex flex-col w-screen h-screen">
          <nav className="flex flex-row gap-4 p-4 bg-gray-200">
            <Link to="/" className="">
              Home
            </Link>

            <ShowMenu isAuthenticated={isAuthenticated} />
          </nav>
          <div className="flex-1 p-4">
            <Routes>
              <Route
                path="/rooms"
                loader={roomsLoader}
                element={
                  <Restricted
                    loading={loading}
                    isAuthenticated={isAuthenticated}
                  >
                    <RoomList />
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
              <Route path="/logout" element={<Logout />} />
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
