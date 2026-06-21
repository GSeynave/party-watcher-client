import { useState } from "react";
import "../App.css";
import Api from "../services/auth";
import axios from "axios";
import {
  EmailInput,
  PasswordInput,
} from "../components/InputFields/InputHelper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [mailValue, setMailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const [registerResponse, setRegisterResponse] = useState("");
  const [registerResponseType, setRegisterResponseType] = useState("");

  type UserContext = {
    userId: string;
    mail: string;
    token: string;
  };

  async function handleRegister() {
    try {
      setRegisterResponse("");
      setRegisterResponseType("");
      // FIXME : I could turn the input field as a composable and pass the validation method as a prop.
      if (!mailValue || !passwordValue) {
        setRegisterResponseType("error");
        setRegisterResponse("Please fill in all fields.");
        return;
      }
      if (passwordValue.length < 6) {
        setRegisterResponseType("error");
        setRegisterResponse("Password must be at least 6 characters long.");
        return;
      }

      if (passwordValue !== confirmPasswordValue) {
        setRegisterResponseType("error");
        setRegisterResponse("Passwords do not match.");
        return;
      }
      const response: UserContext = await Api.postRegister({
        username: username,
        mail: mailValue,
        password: passwordValue,
      });
      setRegisterResponseType("success");
      setRegisterResponse("success, here's user context : " + response);
      console.log("User context:", response);
    } catch (error) {
      console.log("error:", error);
      if (axios.isAxiosError(error)) {
        console.log("error:", error);
        setRegisterResponseType("error");
        setRegisterResponse(
          error.response?.status + ":" + error.response?.data,
        );
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <Label>
            Username:
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Label>
          <Label>
            Mail:
            <EmailInput value={mailValue} onChange={setMailValue} />
          </Label>
          <Label>
            Password:
            <PasswordInput value={passwordValue} onChange={setPasswordValue} />
          </Label>
          <Label>
            Confirm Password:
            <PasswordInput
              value={confirmPasswordValue}
              onChange={setConfirmPasswordValue}
            />
          </Label>
          <Button
            variant="outline"
            type="button"
            onClick={handleRegister}
            className="mt-4"
          >
            Register
          </Button>
        </form>
        <div>
          {registerResponseType === "error" && (
            <p className="text-red-500 font-bold">{registerResponse}</p>
          )}
          {registerResponseType === "success" && (
            <p className="text-green-500 font-bold">{registerResponse}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RegistrationPage;
