"use client";
import { PieChart } from "@mui/x-charts/PieChart";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, Skeleton } from "@nextui-org/react";
import { GrAnalytics } from "react-icons/gr";

import { CircularProgress } from "@mui/material";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store";
import { useEffect } from "react";

function extractDomain(url: string) {
  let domain = url.replace(/^https?:\/\/(www\.)?/, "");
  domain = domain.split("/")[0];
  return domain.replace(".com", "").replace(":", "").substring(0, 6);
}

function getAllUrl(url : string , userId: string) {
  return url+`/tracked_websites/user/${userId}`;
}

export default function WholeWebsite() {
  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const backendUrl = useUserStore((state: any) => state.backendUrl);
  const router = useRouter();
  const { theme } = useTheme();

  const {
    data: pieChartData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const data = (await axios.get(getAllUrl(backendUrl , userId), config)).data;
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
      const result: any = [];
      map.forEach((value, key) => {
        result.push({ id: key, value: value, label: key });
      });
      result.sort((a: any, b: any) => b.value - a.value);
      const top4 = result.slice(0, 4);
      const others = result.slice(4);
      const sumOfOthers = others.reduce(
        (sum: number, entry: any) => sum + entry.value,
        0
      );
      const othersEntry = { id: "Others", value: sumOfOthers, label: "Others" };
      const finalResult = [...top4, othersEntry];
      return finalResult.map((result) => {
        return {
          id: result.id,
          value: Math.round(result.value / 60),
          label: result.label,
        };
      });
    },
    queryKey: ["pieChartData"],
  });
  const refetchAll = async () => {
    // sleep for a second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    refetch();
  };

  useEffect(() => {
    refetchAll();
  }, [userId, token]);

  if (isLoading || isFetching)
    return (
      <Card className=" h-[245px] flex flex-col gap-5 " radius="lg">
        <div className="flex flex-row justify-around mt-5">
          <Skeleton className="rounded-full h-8 w-8" />
          <Skeleton className="rounded-full h-10 w-28 " />
        </div>
        <div className="flex flex-row justify-around items-center ">
          <Skeleton className="h-36 w-36 rounded-full " />
          <div className="flex flex-col gap-5">
            <Skeleton className="rounded-full h-4 w-32" />
            <Skeleton className="rounded-full h-4 w-32" />
            <Skeleton className="rounded-full h-4 w-32" />
            <Skeleton className="rounded-full h-4 w-32" />
          </div>
        </div>
      </Card>
    );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <Card className={`w-full   rounded-lg `}>
        <div className="w-full flex flex-col justify-center items-center ">
          <div className="flex flex-row justify-center items-center gap-2 mt-4">
            <GrAnalytics size={20} color="#C71585" />
            <h1 className="text-lg   font-semibold">Overall Website Usage</h1>
          </div>
          <div className={` w-full `}>
            <PieChart
              title="overall website usage"
              slotProps={{
                legend: {
                  labelStyle: {
                    fill: theme == "light" ? "black" : "white",
                  },
                  itemMarkHeight: 10,
                  itemMarkWidth: 10,
                  itemGap: 10,
                  markGap: 10,
                },
              }}
              colors={["#FFC0CB", "#FF69B4", "#FF1493", "#DB7093", "#C71585"]}
              series={[
                {
                  highlightScope: { faded: "global", highlighted: "item" },
                  data: pieChartData == undefined ? [] : pieChartData,
                  innerRadius: 20,
                  outerRadius: 70,
                },
              ]}
              height={200}
              onItemClick={(event, data) => {
                if (pieChartData)
                  router.push(
                    `/dashboard/${pieChartData[data.dataIndex].label}`
                  );
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
