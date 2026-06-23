import "./App.css";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import { Link, Route, Routes } from "react-router";
import Restricted from "./guards/restricted";
import RoomList from "./pages/RoomList";
import Login from "./pages/LoginPage.tsx";
import RoomPage from "./pages/RoomPage";
import { useAuthContext } from "./context/AuthContext";
import LogoutPage from "./pages/LogoutPage.tsx";

interface ShowMenuProps {
  isAuthenticated: boolean;
}
function ShowMenu({ isAuthenticated }: ShowMenuProps) {
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
      <div className="flex flex-col w-screen h-screen">
        <nav className="flex flex-row gap-4 p-4 bg-yellow-100 border-b border-gray-300">
          <Link to="/" className="">
            Home
          </Link>

          <ShowMenu isAuthenticated={isAuthenticated} />
        </nav>
        <div className="flex-1 min-h-0 overflow-hidden p-4">
          <Routes>
            <Route
              path="/rooms"
              element={
                <Restricted loading={loading} isAuthenticated={isAuthenticated}>
                  <RoomList />
                </Restricted>
              }
            />
            <Route
              path="/room/:roomId"
              element={
                <Restricted loading={loading} isAuthenticated={isAuthenticated}>
                  <div className="h-full min-h-0">
                    <RoomPage />
                  </div>
                </Restricted>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/*" element={<Login />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
