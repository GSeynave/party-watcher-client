import "./App.css";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import { Link, Route, Routes } from "react-router";
import Restricted from "./guards/restricted";
import RoomList from "./pages/RoomList";
import Login from "./pages/LoginPage.tsx";
import RoomPage from "./pages/RoomPage";
import { useAuthContext } from "./context/AuthContext";
import LogoutPage from "./pages/LogoutPage.tsx";
import HomePage from "./pages/HomePage.tsx";

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
      <Link to="/login">Login</Link> <Link to="/register">Register</Link>
    </>
  );
}

function App() {
  const { loading, isAuthenticated } = useAuthContext();
  return (
    <>
      <div className="flex flex-col w-screen h-screen bg-[#F4EFEA]/40 text-stone-800 font-sans antialiased">
        {/* Global Top Navbar: Swapped harsh pure white/gray for cozy lounge tones */}
        <nav className="flex flex-row items-center justify-between gap-6 px-6 py-4 bg-[#FAF8F5] border-b border-orange-100/40 shadow-xs shrink-0">
          <div className="flex flex-row items-center gap-6">
            {/* Brand Logo Anchor: Swapped electric blue for an organic, deep warm amber */}
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-amber-700 hover:text-amber-800 transition-colors"
            >
              party-watcher
            </Link>

            {/* Warm layout divider line */}
            <div className="hidden sm:block h-4 w-px bg-orange-100/60" />

            <Link
              to="/"
              className="text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors"
            >
              Home
            </Link>
          </div>

          {/* Auth Menu Layout wrapper */}
          <div className="flex items-center gap-4 text-sm font-semibold text-stone-600">
            <ShowMenu isAuthenticated={isAuthenticated} />
          </div>
        </nav>

        {/* Route Screen Content Wrapper: Soft background tint to make internal dashboard workspace panels stand out */}
        <div className="flex-1 min-h-0 overflow-hidden bg-[#F4EFEA]/30">
          <Routes>
            <Route
              path="/rooms"
              element={
                <Restricted loading={loading} isAuthenticated={isAuthenticated}>
                  {/* Kept padding here for the list view but matched cozy spacing sizing */}
                  <div className="h-full min-h-0 p-6">
                    <RoomList />
                  </div>
                </Restricted>
              }
            />
            <Route
              path="/room/:roomId"
              element={
                <Restricted loading={loading} isAuthenticated={isAuthenticated}>
                  {/* Stream room dashboard expands edge-to-edge seamlessly */}
                  <div className="h-full min-h-0">
                    <RoomPage />
                  </div>
                </Restricted>
              }
            />

            {/* Standard utility pages wrapped in unified lounge layout pads */}
            <Route
              path="/login"
              element={
                <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
                  <Login />
                </div>
              }
            />
            <Route
              path="/logout"
              element={
                <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
                  <LogoutPage />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
                  <RegistrationPage />
                </div>
              }
            />
            <Route
              path="/*"
              element={
                <div className="h-full overflow-y-auto p-6">
                  <HomePage />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
