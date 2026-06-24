import { useState } from "react";
import "../App.css";
import Api from "../services/auth";
import axios from "axios";
import {
  EmailInput,
  PasswordInput,
} from "../components/InputFields/InputHelper";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { useNavigate } from "react-router";
function RegistrationPage() {
  const navigate = useNavigate();
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
    <Card className="border flex h-fit w-fit min-h-0 flex-col rounded justify-center items-center m-auto mt-20">
      <CardHeader className="flex flex-col items-center">
        <CardTitle className="text-2xl font-bold mb-4">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <FieldSet>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
            <EmailInput value={mailValue} onChange={setMailValue} />
            <PasswordInput value={passwordValue} onChange={setPasswordValue} />
            <PasswordInput
              label="Confirm Password"
              value={confirmPasswordValue}
              onChange={setConfirmPasswordValue}
            />
          </FieldSet>
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
      <CardFooter>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Button
            variant="link"
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Login here
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

export default RegistrationPage;
