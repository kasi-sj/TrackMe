"use client";
import { useUserStore } from "@/store";
import { Button, Card, Skeleton } from "@nextui-org/react";

import { Avatar } from "@nextui-org/avatar";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { IoTodayOutline } from "react-icons/io5";
import { PiClockClockwiseBold } from "react-icons/pi";
import Model from "./add-website-model";

const getTotalUrl = (url:string , userId: string) => {
  return url+`/tracked_websites/user/${userId}/total_live_time`;
};

const getTodayUrl = (url:string  ,userId: string) => {
  return url+`/tracked_websites/user/${userId}/today_active_time`;
};

const Profile = () => {
  const url = useUserStore((state: any) => state.backendUrl);
  const queryClient = new QueryClient();
  const userId = useUserStore((state: any) => state.userId);
  const setUserId = useUserStore((state: any) => state.setUserId);
  const token = useUserStore((state: any) => state.token);
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    isFetching: userFetching,
    refetch,
  } = useQuery({
    gcTime: 0,
    refetchOnMount: true,
    queryFn: async () => {
      console.log("refetch received user");
      if (!userId) {
        return null;
      }
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const user = await axios.get(url+"/users" + `/${userId}`, config);
      console.log(user.data);
      return user.data;
    },

    refetchOnReconnect: true,
    queryKey: ["user"],
  });
  const {
    data: total,
    isLoading: totalLoading,
    error: totalError,
    isFetching: totalFetching,
    refetch: totalRefetch,
  } = useQuery({
    queryFn: async () => {
      console.log("refetch received total");
      if (!userId) {
        return 0;
      }
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const totalData = await axios.get(getTodayUrl(url,userId), config);
      return totalData.data.total_live_time;
    },
    queryKey: ["total_active_count"],
  });

  const {
    data: todayTotal,
    isLoading: todayTotalLoading,
    error: todayTotalError,
    isFetching: todayTotalFetching,
    refetch: todayTotalRefetch,
  } = useQuery({
    queryFn: async () => {
      console.log("refetch received today");
      if (!userId) {
        return 0;
      }
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const todayData = await axios.get(getTotalUrl(url,userId), config);
      return todayData.data.total_live_time;
    },
    queryKey: ["today_active_count"],
  });

  const refetchAll = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refetch();
    totalRefetch();
    todayTotalRefetch();
  };

  useEffect(() => {
    console.log("refetch send", userId);
    refetchAll();
  }, [userId, token]);

  if (todayTotalLoading || totalLoading || userLoading)
    return (
      <Card
        className=" lg:min-h-[346px] flex flex-row lg:flex-col gap-8 items-center justify-center "
        radius="lg"
      >
        <Skeleton className="rounded-full h-40 w-40" />
        <div className="space-y-3 w-40 flex flex-col justify-center items-center ">
          <Skeleton className="h-3 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-5/6 rounded-lg" />
          <Skeleton className="h-3 w-5/6 rounded-lg" />
          <Skeleton className="h-6 w-4/6 rounded-lg" />
        </div>
      </Card>
    );

  if (todayTotalError || totalError || userError) return (
    <p>
      {
        todayTotalError ? " today " :
        totalError ? " total " :
        userError ? " user " : ""
      }
    </p>
  );
  return (
    <Card className={`lg:min-h-[346px] `}>
      <div className="flex flex-row lg:flex-col gap-2 items-center justify-center mt-3 ">
        {
          <Avatar
            name={(user as any)?.name || ""}
            size="lg"
            className="w-40 h-40 text-lg mb-2"
          />
        }
        <div className={`flex flex-col justify-center items-center `}>
          <div className="flex flex-row gap-2 justify-center items-center">
            <CiMail size={20} />
            {user && <p>{(user as any).email}</p>}
          </div>
          <div className="text-small justify-between items-center m-3 flex flex-col gap-2 ">
            <div className="flex flex-row gap-10 items-center">
              <div className="flex flex-row gap-2 justify-center items-center">
                <IoTodayOutline size={20} />
                <p>Today screen time</p>
              </div>
              <p className="text-default-600">
                {(totalLoading || todayTotalFetching
                  ? "..."
                  : Math.round(total / 60)) + " min"}
              </p>
            </div>
            <div className="flex flex-row gap-11">
              <div className="flex flex-row gap-3 justify-center items-center">
                <PiClockClockwiseBold size={20} />
                <p>Total screen time</p>
              </div>
              <p className="text-default-500">
                {(todayTotalLoading || todayTotalFetching
                  ? "..."
                  : Math.round(todayTotal / 60)) + " min"}
              </p>
            </div>
            <Model />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Profile;
