"use client";
import AllWebSite from "@/components/AllWebSite";
import Profile from "@/components/Profile";
import WebLine from "@/components/WebLine";
import WholeWebsite from "@/components/WholeWebsite";
import AllTimeGraph from "@/components/active-time-graph";
import RestictedWebsiteTable from "@/components/resticted-website-table";
// import
import { Card } from "@nextui-org/react";
import React from "react";

const page = () => {
  return (
    <div className=" h-full mx-3">
      <div className="grid grid-cols-12 w-screen lg:w-[1200px] items-start gap-2 gap-y-1 ">
        <div className=" col-span-12 lg:col-span-3 sm:col-span-6 ">
          <Profile />
        </div>
        <div className=" col-span-12 lg:col-span-5 sm:col-span-6">
          <AllTimeGraph />
        </div>
        <div className=" col-span-12 lg:col-span-4">
          <AllWebSite />
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
          <WholeWebsite />
          <RestictedWebsiteTable />
        </div>
        <div className="col-span-12 lg:col-span-8">
          <WebLine />
        </div>
      </div>
    </div>
  );
};

export default page;
