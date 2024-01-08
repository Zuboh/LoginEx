import { AxiosError } from "axios";
import { useState, FormEvent } from "react";
import { useMutation } from "react-query";
import axiosInstance from "../api/axios";
import Spinner from "./Spinner";
import { LoginResponse } from "../types/login.type";

export default function Form() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [required, setRequired] = useState<boolean>(false);
  const [logged, setLogged] = useState<boolean>(false);

  const loginMutation = useMutation<LoginResponse, AxiosError>(
    async () => {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setEmail("");
        setPassword("");
        setLogged(true);
        setError(false);
        const token = data.token ?? "";
        sessionStorage.setItem("token", token);
      },
      onError: () => {
        setErrorText("Incorrect credentials");
        setError(true);
        setLogged(false);
      },
    }
  );

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      setRequired(true);
      return;
    } else {
      setRequired(false);
    }
    loginMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center">
      <form
        className="py-8 px-6 flex flex-col gap-10 bg-white md:w-[600px] sm:w-[500px] shadow-xl rounded-xl"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl">Login</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-500 mb-1">
              Email
              <span className="text-red-500">
                {required && email.length === 0 ? "*" : ""}
              </span>
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`appearance-none border-2 border-gray-100 rounded-lg px-4 py-2 ${
                required && email.length === 0 ? "border-red-500" : ""
              }`}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="pass" className="text-gray-500 mb-1">
              Password
              <span className="text-red-500">
                {required && password.length === 0 ? "*" : ""}
              </span>
            </label>
            <input
              type="password"
              id="pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`appearance-none border-2 border-gray-100 rounded-lg px-4 py-2 ${
                required && password.length === 0 ? "border-red-500" : ""
              }`}
            />
          </div>
        </div>

        <button className="w-full py-4 rounded-lg" type="submit">
          {loginMutation.isLoading ? <Spinner /> : "LOGIN"}
        </button>
      </form>
      <span className="mt-5">{logged && !error ? "logged in ✅" : ""}</span>
      <span className="mt-5 text-red-500">
        {!logged && error ? errorText : ""}
      </span>
    </div>
  );
}
