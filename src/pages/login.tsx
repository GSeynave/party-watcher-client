import { useState } from "react";
import "../App.css";
import Api from "../services/auth";
import axios from "axios";
import {
  EmailInput,
  PasswordInput,
} from "../components/InputFields/InputHelper";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
function Login() {
  const navigate = useNavigate();
  const [usernameLoginValue, setUsernameLoginValue] = useState("");
  const [passwordLoginValue, setPasswordLoginValue] = useState("");
  const [loginResponse, setLoginResponse] = useState("");
  const [loginResponseType, setLoginResponseType] = useState("");
  const { user, isAuthenticated, refetch } = useAuthContext();

  type UserContext = {
    userId: string;
    mail: string;
    token: string;
  };

  async function handleLogin() {
    try {
      setLoginResponse("");
      setLoginResponseType("");
      const response: UserContext = await Api.postLogin({
        username: usernameLoginValue,
        password: passwordLoginValue,
      });
      setLoginResponseType("success");
      setLoginResponse("success, You are correctly login : " + response);
      await refetch();
      navigate("/rooms");
    } catch (error) {
      console.log("error:", error);
      if (axios.isAxiosError(error)) {
        console.log("error:", error);
        setLoginResponseType("error");
        setLoginResponse(error.response?.status + ":" + error.response?.data);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Login</CardTitle>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
          <p className="text-green-500 font-bold">
            You are authenticated as {user?.mail}
          </p>
        ) : (
          <div>
            <p className="text-red-500 font-bold">You are not authenticated</p>
            <span>Login:</span>
            <form>
              <EmailInput
                value={usernameLoginValue}
                onChange={setUsernameLoginValue}
              />
              <PasswordInput
                value={passwordLoginValue}
                onChange={setPasswordLoginValue}
              />
              <Button type="button" onClick={handleLogin}>
                Login
              </Button>
            </form>
            <div>
              <span>loginResponse: </span>
              {loginResponseType === "error" && (
                <p className="text-red-500 font-bold">{loginResponse}</p>
              )}
              {loginResponseType === "success" && (
                <p className="text-green-500 font-bold">{loginResponse}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Login;
