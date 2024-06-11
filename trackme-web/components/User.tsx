"use client";
import { useUserStore } from "@/store";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { Chip } from "@nextui-org/chip";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@nextui-org/react";
import { error } from "console";

const User = () => {

  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const extensionKey = useUserStore((state: any) => state.extensionKey);
  const setUserId = useUserStore((state: any) => state.setUserId);
  const backendUrl = useUserStore((state: any) => state.backendUrl);
  
  const {data : user , isFetching , isLoading , refetch , error} = useQuery({
    
    queryFn: async () => {
      if (!userId) return;
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const user = await axios.get(backendUrl+"/users" + `/${userId}`, config);
      console.log(user, "user")
      return user;
    },
    queryKey : ["getting user"]
  })
  if(error){
    refetch();
  }
  if(isFetching || isLoading) return (<div className="flex flex-row gap-2 items-center">
  {user ? <Avatar name={(user as any).name} /> : null}
  {user ? (
    <CircularProgress />
  ) : (
    <Link href="/signIn">
      <Chip className="bg-gray-300 text-sm px-1 rounded-lg h-8">
        Sign In
      </Chip>
    </Link>
  )}
</div>)


  const signOut = () => {
    setUserId(undefined);
    localStorage.removeItem("userId");
    try {
      //@ts-ignore
      chrome.runtime.sendMessage(
        extensionKey,
        {
          name: "AUTHORIZE_EXTENSION",
          userId: null,
        },
        function (response: any) {
          alert("You have been signed out from the extension also");
          console.log(response, "response received");
        }
      );
    } catch (e) {
      console.log(e);
    }
    alert("You have been signed out");
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      {user ? <Avatar name={(user as any).name} /> : null}
      {user ? (
        <Chip
          onClick={signOut}
          className="bg-gray-300 text-sm px-1 rounded-lg h-8"
        >
          Sign out
        </Chip>
      ) : (
        <Link href="/signIn">
          <Chip className="bg-gray-300 text-sm px-1 rounded-lg h-8">
            Sign In
          </Chip>
        </Link>
      )}
    </div>
  );
};

export default User;
