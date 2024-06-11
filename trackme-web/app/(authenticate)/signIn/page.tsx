"use client";

import { Button } from "@nextui-org/button";
// import { UserAuthForm } from "../../components/ui/user-auth-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserAuthForm } from "@/components/user-signin-form";
import Link from "next/link";

export default function AuthenticationPage() {
  const router = useRouter();
  return (
    <div className="mx-20">
      <div className="container relative max-lg:shadow-xl  h-[600px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full mb-4 flex-col bg-muted  text-white lg:flex ">
          <div className="absolute inset-0 rounded-xl  h-[600px]" />
          <Image
            height={520}
            width={520}
            alt="Image of a person working on a laptop"
            src="/signIn.jpg"
            className="z-20  h-[520px]"
          />
        </div>
        <div className="lg:p-8 ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Log into Your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to Log into your account
              </p>
            </div>
            <UserAuthForm />
            <p className=" pl-2 mb-3 text-sm text-gray-500 text-center">
              {`Don't have an account?`}{" "}
              <span className="text-blue-500">
                {" "}
                <Link href="/signUp">
                  <button className="">{` sign Up`}</button>{" "}
                </Link>{" "}
              </span>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
