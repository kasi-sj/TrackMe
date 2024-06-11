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

function getUrl(url : string , type: string, userId: string) {
  url = url+`/tracked_websites/user/${userId}`;
  switch (type) {
    case "Today":
      return url + "/today";
    case "This Week":
      return url + "/week";
    case "This Month":
      return url + "/month";
    case "This Year":
      return url + "/year";
  }
  return url;
}
export default function AllWebSite() {
  const [activeUrl, setActiveUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const url = useUserStore((state: any) => state.backendUrl);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [type, setType] = useState<string>("Today");

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

      const data = (await axios.get(getUrl(url , type, userId), config)).data;
      const map = new Map();
      data
        .filter((entry: any) => {
          if (
            (!entry.websiteurl && entry.websiteurl === null) ||
            entry.websiteurl === "null"
          )
            return false;
          return true;
        })
        .map((entry: any) => {
          if (map.has(extractDomain(entry.websiteurl))) {
            map.set(
              extractDomain(entry.websiteurl),
              map.get(extractDomain(entry.websiteurl)) + entry.total_live_time
            );
          } else {
            map.set(extractDomain(entry.websiteurl), entry.total_live_time);
          }
        });
      var sortedData: { key: string; value: number }[] = [];
      map.forEach((value, key) => {
        sortedData.push({ key, value });
      });
      sortedData.sort((a, b) => b.value - a.value);
      const result = {
        key: sortedData.map((entry) => {
          return entry.key;
        }),
        value: sortedData.map((entry) => {
          return entry.value;
        }),
      };
      // i need top 4 and others
      const top4 = result.key.slice(0, 4);
      const other = result.key.slice(4);
      const sumOfOthers = result.value.slice(4).reduce((a, b) => a + b, 0);
      const finalResult = [...top4, "others"];
      const finalValue = [...result.value.slice(0, 4), sumOfOthers];
      return {
        key: finalResult,
        value: finalValue,
      };
    },
    queryKey: ["websiteData"],
  });
  const refetchAll = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refetch();
  };

  useEffect(() => {
    refetchAll();
  }, [userId, token]);

  useEffect(() => {
    refetch();
  }, [type]);
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
              <h1 className="text-lg font-semibold p-5">Most Active sites</h1>
            </div>
            <DropDown value={type || ""} setValue={setType} />
          </div>
          <div
            className={`w-3/4 flex flex-row justify-center items-center  ${
              theme == "light"
                ? "bg-white text-black"
                : "bg-[rgb(24,24,27)] text-white"
            }`}
          >
            <BarChart
              grid={{
                vertical: true,
              }}
              layout="horizontal"
              margin={{
                right: 50,
              }}
              axisHighlight={{
                x: "line",
                y: "band",
              }}
              yAxis={[
                {
                  tickLabelStyle: {
                    fill: theme == "light" ? "black" : "white",
                    width: 100,
                  },
                  id: "barCategories",
                  data: data?.key || [],
                  scaleType: "band",
                  dataKey: "website",
                  position: "left",
                },
              ]}
              xAxis={[
                {
                  label: "min",
                  labelStyle: {
                    fill: theme == "light" ? "black" : "white",
                  },
                  colorMap: {
                    type: "piecewise",

                    thresholds: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
                    colors: [
                      "#FF0000",
                      "#FF4500",
                      "#FF8C00",
                      "#FFD700",
                      "#ADFF2F",
                      "#32CD32",
                      "#008000",
                      "#006400",
                      "#000000",
                    ].reverse(),
                  },

                  tickLabelStyle: {
                    fill: theme == "light" ? "black" : "white",
                    width: 100,
                  },
                },
              ]}
              series={[
                {
                  data: data?.value.map((val) => Math.round(val / 60)) || [],
                },
              ]}
              onItemClick={(event, value) => {
                if (data?.key[value.dataIndex] !== "others") {
                  setActiveUrl(data?.key[value.dataIndex] + "");
                  setIsOpen(true);
                }
              }}
              height={278}
            />
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
