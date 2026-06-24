import { useState } from "react";
import "../App.css";
import Api from "../services/auth";
import axios from "axios";
import {
  EmailInput,
  PasswordInput,
  UsernameInput,
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
    <Card className="flex h-fit w-full max-w-[420px] min-h-0 flex-col rounded-2xl border border-orange-100/60 bg-[#FAF8F5] shadow-md m-auto mt-20 p-2 overflow-hidden">
      <CardHeader className="flex flex-col items-center pt-6 pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight text-stone-800">
          Create an Account
        </CardTitle>
        <p className="text-xs text-stone-400 mt-1">
          Join the lounge and start watching together
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
            <FieldSet className="space-y-3">
              <UsernameInput value={username} onChange={setUsername} />

              {/* Ensure these custom sub-components match our theme's input styling */}
              <EmailInput value={mailValue} onChange={setMailValue} />
              <PasswordInput
                value={passwordValue}
                onChange={setPasswordValue}
              />
              <PasswordInput
                label="Confirm Password"
                value={confirmPasswordValue}
                onChange={setConfirmPasswordValue}
              />
            </FieldSet>

            {/* Primary action utilizing tactile charcoal/amber primitives */}
            <Button
              type="button"
              onClick={handleRegister}
              className="mt-6 w-full bg-stone-800 hover:bg-stone-700 text-amber-50 font-semibold rounded-xl shadow-xs transition-colors py-5"
            >
              Register
            </Button>
          </form>

          {/* Styled feedback logs into clean alert cards */}
          <div>
            {registerResponseType === "error" && (
              <div className="mt-2 rounded-xl bg-rose-50 border border-rose-100 p-3 text-center">
                <p className="text-sm font-semibold text-rose-700">
                  {registerResponse}
                </p>
              </div>
            )}
            {registerResponseType === "success" && (
              <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                <p className="text-sm font-semibold text-emerald-700">
                  {registerResponse}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer layout updated with matching warm typography weights */}
      <CardFooter className="flex flex-col items-center pb-6 pt-3 border-t border-orange-100/30 bg-[#F4EFEA]/30">
        <p className="text-sm text-stone-500 flex items-center gap-1">
          Already have an account?{" "}
          <Button
            variant="link"
            onClick={() => navigate("/login")}
            className="p-0 h-auto font-bold text-amber-700 hover:text-amber-800 transition-colors hover:no-underline"
          >
            Login here
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

export default RegistrationPage;
