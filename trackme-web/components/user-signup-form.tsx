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
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const backendUrl = useUserStore((state: any) => state.backendUrl);
  const url = backendUrl+"/users";
  const router = useRouter();
  const setUserId = useUserStore((state: any) => state.setUserId);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!email || !password || !name) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(url, {
        user: {
          name: name,
          email: email,
          password: password,
        },
      });
      const user = response.data.user;
      if (user) {
        alert(
          "Email verification link has been send to your account please verify it and login again"
        );
      } else {
        alert("Error signing up , please try again later");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={`grid gap-6 `}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              placeholder="Enter name"
              type="text"
              autoCapitalize="none"
              autoComplete="textOnly"
              autoCorrect="off"
              disabled={isLoading}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              id="password"
              placeholder="Enter Your Password"
              type="password"
              autoCapitalize="none"
              disabled={isLoading}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <CircularProgress size="sm" />}
            Sign Up with Email
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
