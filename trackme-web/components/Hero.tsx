"use client";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import React from "react";
import NextLink from "next/link";
import { link as linkStyles } from "@nextui-org/theme";
import { clsx } from "clsx";
import { useUserStore } from "@/store";

const Hero = () => {
  const userId = useUserStore((state: any) => state.userId);
  return (
    <div className="flex flex-row ml-4 gap-20 mt-8  items-center ">
      <div>
        <div>
          <div className="flex flex-row items-center gap-4">
            {/* <Separator className="h-0.5 w-32 max-sm:w-24 bg-green-300" /> */}
            <h1 className="text-md font-[500] text-green-400">
              Reveal Insights
            </h1>
          </div>
          <h2 className="text-6xl mt-4  max-sm:text-4xl w-96 max-sm:w-fit font-[600]   text-gray-800">
            Lets Start{" "}
          </h2>
          <h1 className=" text-6xl w-fit lg:mt-4 lg:px-4 max-lg:w-fit  max-lg:text-green-500 font-[600] max-sm:text-5xl text-gray-800 border-dashed lg:py-2 lg:border-4 border-orange-500 ">
            Visualize
          </h1>{" "}
          <h1 className="text-6xl lg:mt-4 w-96 font-[600] max-sm:text-4xl max-sm:w-fit text-gray-800">
            Insights
          </h1>
        </div>
        <p className="mt-8 max-sm:w-fit   w-[420px] max-lg:w-full text-sm leading-relaxed font-semibold text-gray-500 ">
          {`From Movements to Milestones, From Activity to Achievement. With Trackify, redefine the way you monitor your progress. Unleash potential, identify patterns, and transform everyday actions into extraordinary insights with our intuitive activity tracker application.`}
        </p>
        <div>
          <NextLink
            className={clsx(
              linkStyles({ color: "foreground" }),
              " rounded-full "
            )}
            color="foreground"
            href={userId ? "/dashboard" : "/signIn"}
          >
            <Button className="mt-2">{userId ? "Dashboard" : "login"}</Button>
          </NextLink>
        </div>
      </div>
      <div className="max-lg:hidden">
        <img src="/project1-hero.svg" className="" />
      </div>
    </div>
  );
};

export default Hero;
