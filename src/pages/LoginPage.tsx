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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <form>
            <FieldSet>
              <EmailInput
                value={usernameLoginValue}
                onChange={setUsernameLoginValue}
              />
              <PasswordInput
                value={passwordLoginValue}
                onChange={setPasswordLoginValue}
              />
            </FieldSet>
            <Button variant="outline" type="button" onClick={handleLogin}>
              Login
            </Button>
          </form>
          <div>
            {loginResponseType === "error" && (
              <p className="text-red-500 font-bold">{loginResponse}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginPage;
