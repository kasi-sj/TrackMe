"use client";
import { title } from "@/components/primitives";
import { BarChart } from "@mui/x-charts/BarChart";

import { useQuery } from "@tanstack/react-query";
import { VscGraph } from "react-icons/vsc";

import axios from "axios";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  Button,
  DropdownItem,
  Skeleton,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";

import { CircularProgress } from "@mui/material";
import { ThemeSwitch } from "./theme-switch";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store";
import DomainModel from "./domain-model";
import { LineChart } from "@mui/x-charts";

const DropDown = ({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">{value}</Button>
      </DropdownTrigger>
      <DropdownMenu
        defaultSelectedKeys={"All"}
        aria-label="Static Actions"
        onAction={(event: any) => {
          setValue(event);
        }}
      >
        <DropdownItem key="All">All</DropdownItem>
        <DropdownItem key="Today">Today</DropdownItem>
        <DropdownItem key="This Week">This Week</DropdownItem>
        <DropdownItem key="This Month" color="danger">
          This Month
        </DropdownItem>
        <DropdownItem key="This Year" color="danger">
          This Year
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
function extractDomain(url: string) {
  let domain = url.replace(/^https?:\/\/(www\.)?/, "");
  domain = domain.split("/")[0];
  return domain.replace(".com", "").replace(":", "").substring(0, 6);
}

function getUrl(url:string , userId: string) {
  return  url+`/tracked_websites/user/${userId}/sum_active_time_by_date`;
}
export default function AllTimeGraph() {
  const [activeUrl, setActiveUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const url = useUserStore((state: any) => state.backendUrl);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryFn: async () => {
      if (!userId) {
        return {
          key: [],
          value: [],
        };
      }
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const data = (await axios.get(getUrl(url , userId), config)).data;
      const key: Date[] = [];
      const value: number[] = [];
      console.log(data);
      data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      data.forEach((element: any) => {
        key.push(new Date(element.date));
        value.push(element.total_live_time);
      });
      return {
        key: key,
        value: value,
      };
    },
    queryKey: ["allwebsitedata"],
  });
  const refetchAll = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refetch();
  };

  useEffect(() => {
    refetchAll();
  }, [userId, token]);

  if (isLoading || isFetching)
    return (
      <Card
        className=" lg:min-h-[346px] flex flex-col items-center "
        radius="lg"
      >
        <div className="flex flex-row justify-around w-full my-5">
          <Skeleton className="rounded-full h-10 w-40" />
          <Skeleton className="rounded-full h-10 w-28 " />
        </div>
        <Skeleton className="h-60 w-11/12 rounded-lg " />
      </Card>
    );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Card
        className={` mb-2  ${
          theme == "light"
            ? "bg-white text-black"
            : "bg-[rgb(24,24,27)] text-white"
        }`}
      >
        <div className=" flex flex-col  justify-center items-center ">
          <div className="flex w-full flex-row justify-around items-center">
            <div className="flex flex-row justify-center items-center">
              <VscGraph size={20} />
              <h1 className="text-lg font-semibold p-5">Screen Time</h1>
            </div>
          </div>
          <div
            className={`w-3/4 flex flex-row justify-center items-center  ${
              theme == "light"
                ? "bg-white text-black"
                : "bg-[rgb(24,24,27)] text-white"
            }`}
          >
            {!isLoading && data && (
              <LineChart
                className="col-span-1"
                xAxis={[
                  {
                    label: "date",
                    labelStyle: {
                      fill: theme == "light" ? "black" : "white",
                    },
                    //   dataKey: "utc",
                    scaleType: "utc",
                    data: data?.key,
                    valueFormatter: (date) =>
                      new Date(date).toLocaleDateString(),
                    tickLabelStyle: {
                      fill: theme == "light" ? "black" : "white",
                      width: 100,
                    },
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: {
                      fill: theme == "light" ? "black" : "white",
                      width: 100,
                    },
                  },
                ]}
                series={[
                  {
                    data: data?.value.map((value) => Math.round(value / 60)),
                  },
                ]}
                // width={500}
                height={278}
              />
            )}
          </div>
        </div>
        <DomainModel
          open={isOpen}
          onClose={() => setIsOpen((prev) => !prev)}
          domain={activeUrl}
        />
      </Card>
    </div>
  );
}
