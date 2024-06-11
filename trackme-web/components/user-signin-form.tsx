"use client";

import * as React from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { CircularProgress } from "@nextui-org/react";
import { useUserStore } from "@/store";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [extensionKey, setExtensionKey] = React.useState<string>("");
  const router = useRouter();

  const setUserId = useUserStore((state: any) => state.setUserId);
  const setToken = useUserStore((state: any) => state.setToken);
  const backendUrl = useUserStore((state: any) => state.backendUrl);
  const globleSetExtensionKey = useUserStore(
    (state: any) => state.setExtensionKey
  );
  const token = useUserStore((state: any) => state.token);
  const url = backendUrl+"/signIn";
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (extensionKey == "") {
      alert(
        "please provide the extension key so we can track your activity , \n=>go to Extensions (top right) \n=>choose manage Extension \n=>Track me (there is a id showing copy it and paste in the text field)"
      );
      return;
    }
    setIsLoading(true);
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      console.log(url, {
        email: email,
        password: password,
      });
      try {
        const config = {
          headers: {
            Authorization: `${token}`,
          },
        };
        const response = await axios.post(
          url,
          {
            email: email,
            password: password,
          },
          config
        );
        const user = response.data.user;
        if (user) {
          setUserId(user.id);
          localStorage.setItem("userId", user.id);
          setToken(user.token);
          localStorage.setItem("token", user.token);
          globleSetExtensionKey(extensionKey);
          localStorage.setItem("extensionKey", extensionKey);
          try {
            //@ts-ignore
            chrome.runtime.sendMessage(
              extensionKey,
              {
                name: "AUTHORIZE_EXTENSION",
                userId: user.id,
              },
              function (response: any) {
                alert("you have been authorized in extension also");
                console.log(response, "response received");
              }
            );
          } catch (e) {
            console.log(e);
          }
        } else {
          alert("Error signing up , please try again later");
          return;
        }
      } catch (error) {
        alert("Error signing up, please try again later");
        return;
      }
      alert("Sign up successful");
      setIsLoading(false);
      router.push("/");
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  return (
    <div className={`grid gap-6 `}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <Input
              id="extensionkey"
              placeholder="Extension Key"
              type="text"
              value={extensionKey}
              onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setExtensionKey(event.target.value)}
            />
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setEmail(event.target.value)}
            />
            <Input
              id="password"
              placeholder="Enter Your Password"
              type="password"
              autoCapitalize="none"
              disabled={isLoading}
              value={password}
              onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <CircularProgress size="sm" />}
            Log In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
    </div>
  );
}
