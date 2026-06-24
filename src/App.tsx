import "./App.css";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import { Link, Route, Routes, useNavigate } from "react-router";
import Restricted from "./guards/restricted";
import RoomList from "./pages/RoomList";
import Login from "./pages/LoginPage.tsx";
import RoomPage from "./pages/RoomPage";
import { useAuthContext } from "./context/AuthContext";
import LogoutPage from "./pages/LogoutPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./components/ui/button.tsx";
import type { UserContext } from "./types/UserContext.ts";

interface ShowMenuProps {
  isAuthenticated: boolean;
  user: UserContext;
}
function ShowMenu(props: ShowMenuProps) {
  const navigate = useNavigate();
  if (props.isAuthenticated) {
    return (
      <>
        {/* 1. Navigation Link: Upgraded to look like an organic lounge nav option */}
        <Link
          to="/rooms"
          className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors px-1 py-2"
        >
          Rooms
        </Link>

        {/* 2. User Action Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Trigger Button: Soft cream outline with charcoal text and smooth curves */}
            <Button
              variant="outline"
              className="border-orange-100/70 bg-white hover:bg-[#FAF8F5] text-stone-700 font-bold rounded-xl shadow-2xs transition-all gap-2"
            >
              {/* Added a cozy little user dot indicator */}
              <span className="h-2 w-2 rounded-full bg-amber-600 shadow-2xs" />
              {props.user.username}
            </Button>
          </DropdownMenuTrigger>

          {/* Dropdown Frame: Softened to rounded-xl over our oatmeal background palette */}
          <DropdownMenuContent className="w-48 p-1.5 rounded-xl border border-orange-100/60 bg-[#FAF8F5] shadow-md text-stone-700">
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer focus:bg-[#F4EFEA]/60 focus:text-stone-900 transition-colors">
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {/* Warm menu separator line */}
            <DropdownMenuSeparator className="my-1 border-t border-orange-100/40" />

            <DropdownMenuGroup>
              {/* Logout action updated inside the dropdown menu using our warm destructive soft-rose hover */}
              <DropdownMenuItem
                onClick={() => navigate("/logout")} // Clean way to handle the action directly
                className="flex items-center px-3 py-2 text-sm font-bold text-rose-600 rounded-lg cursor-pointer focus:bg-rose-50 focus:text-rose-700 transition-colors"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
  const { loading, user, isAuthenticated } = useAuthContext();
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
            <ShowMenu isAuthenticated={isAuthenticated} user={user} />
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
