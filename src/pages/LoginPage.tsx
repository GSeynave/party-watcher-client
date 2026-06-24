import { useEffect, useState } from "react";
import "../App.css";
import Api from "../services/auth";
import axios from "axios";
import {
  EmailInput,
  PasswordInput,
} from "../components/InputFields/InputHelper";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { FieldSet } from "@/components/ui/field";
function LoginPage() {
  const navigate = useNavigate();
  const [usernameLoginValue, setUsernameLoginValue] = useState("");
  const [passwordLoginValue, setPasswordLoginValue] = useState("");
  const [loginResponse, setLoginResponse] = useState("");
  const [loginResponseType, setLoginResponseType] = useState("");
  const { isAuthenticated, refetch } = useAuthContext();

  async function handleLogin() {
    try {
      setLoginResponse("");
      setLoginResponseType("");
      await Api.postLogin({
        username: usernameLoginValue,
        password: passwordLoginValue,
      });
      await refetch();
      navigate("/rooms");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoginResponseType("error");
        setLoginResponse(
          error.response?.status + ":" + error.response?.data.error,
        );
      }
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/rooms");
    }
  });

  return (
    <Card className="flex h-fit w-full max-w-[400px] min-h-0 flex-col rounded-2xl border border-orange-100/60 bg-[#FAF8F5] shadow-md m-auto mt-20 p-2 overflow-hidden">
      <CardHeader className="flex flex-col items-center pt-6 pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight text-stone-800">
          Welcome Back
        </CardTitle>
        <p className="text-xs text-stone-400 mt-1">
          Grab a drink and step into the lounge
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
            {/* 
          NOTE: Make sure your internal <EmailInput /> and <PasswordInput /> components
          pass down classes like `rounded-xl`, `bg-white`, and `border-orange-100/70` 
          to match the input fields to the theme!
        */}
            <FieldSet className="space-y-3">
              <EmailInput
                value={usernameLoginValue}
                onChange={setUsernameLoginValue}
              />
              <PasswordInput
                value={passwordLoginValue}
                onChange={setPasswordLoginValue}
              />
            </FieldSet>

            {/* Main Action Button using the deep tactile charcoal/amber palette */}
            <Button
              type="button"
              onClick={handleLogin}
              className="mt-6 w-full bg-stone-800 hover:bg-stone-700 text-amber-50 font-semibold rounded-xl shadow-xs transition-colors py-5"
            >
              Login
            </Button>
          </form>

          {/* Error handling alert window formatted beautifully */}
          {loginResponseType === "error" && (
            <div className="mt-2 rounded-xl bg-rose-50 border border-rose-100 p-3 text-center">
              <p className="text-sm font-semibold text-rose-700">
                {loginResponse}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer layout tuned with warm typography links */}
      <CardFooter className="flex flex-col items-center pb-6 pt-2 border-t border-orange-100/30 bg-[#F4EFEA]/30">
        <p className="text-sm text-stone-500 flex items-center gap-1">
          Don't have an account?{" "}
          <Button
            variant="link"
            onClick={() => navigate("/register")}
            className="p-0 h-auto font-bold text-amber-700 hover:text-amber-800 transition-colors hover:no-underline"
          >
            Register here
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

export default LoginPage;
