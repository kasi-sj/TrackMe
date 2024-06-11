"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from "@nextui-org/react";
import { MdOutlineDomain } from "react-icons/md";
import { TbClockBolt } from "react-icons/tb";
import { BsGraphUpArrow } from "react-icons/bs";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";

import { CircularProgress } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";
import { useTheme } from "next-themes";
import { MdChecklistRtl } from "react-icons/md";

import { useUserStore } from "@/store";

function extractDomain(url: string) {
  if (url == null) return "cannot";
  let domain = url.replace(/^https?:\/\/(www\.)?/, "");
  domain = domain.split("/")[0];
  return domain.replace(".com", "");
}

function getAllUrl(url:string , userId: string) {
  return  url+`/tracked_websites/user/${userId}/all`;
}

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
        defaultSelectedKeys={value}
        aria-label="Static Actions"
        onAction={(event: any) => {
          setValue(event);
        }}
      >
        <DropdownItem key="line">Line</DropdownItem>
        <DropdownItem key="bar">Bar</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const WebLine = () => {
  const [state, setState] = useState("bar");

  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const backendUrl = useUserStore((state: any)=> state.backendUrl);
  const {
    data: lineChartData,
    isLoading,
    isFetching,
    error,
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
      const filteredData = data.filter(
        (data: any) => data.websiteurl.trim() != ""
      );
      return filteredData;
    },
    queryKey: ["lineChart"],
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
      <Card className=" py-10 " radius="lg">
        <div className="flex flex-row justify-around mb-10">
          <Skeleton className="rounded-full h-10 w-40" />
          <div className="flex flex-row gap-10">
            <Skeleton className="rounded-full h-10 w-28 " />
            <Skeleton className="rounded-full h-10 w-28 " />
          </div>
        </div>
        <div className="space-y-3 w-full flex flex-col justify-center items-center ">
          <Skeleton className="h-10 w-11/12 rounded-lg" />
          <Skeleton className="h-[600px] w-11/12 rounded-lg" />
        </div>
      </Card>
    );

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <Card>
      <div className="flex flex-row justify-center items-center mx-2 ">
        <Table
          BaseComponent={({ children }) => {
            return (
              <div>
                <div className="flex flex-row justify-between px-10 items-center my-3">
                  <div className="flex flex-row items-center gap-2">
                    <MdChecklistRtl size={30} />

                    <h3 className="text-lg font-semibold">All Activity</h3>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <DropDown value={state} setValue={setState} />
                    <h2 className=""> show more </h2>
                  </div>
                </div>
                {children}
              </div>
            );
          }}
          bgcolor="transparent"
          aria-label="Example static collection table"
          className="w-full"
        >
          <TableHeader>
            <TableColumn>
              <div className="flex flex-row gap-2 justify-start items-center">
                <MdOutlineDomain size={20} />
                WebSite
              </div>
            </TableColumn>
            <TableColumn>
              <div className="flex flex-row gap-2 justify-start items-center">
                <TbClockBolt size={20} />
                Total active time
              </div>
            </TableColumn>
            <TableColumn>
              <div className="flex flex-row gap-2 justify-start items-center">
                <BsGraphUpArrow size={20} />
                Graph
              </div>
            </TableColumn>
          </TableHeader>
          <TableBody>
            {lineChartData.map((data: any) => {
              return (
                <TableRow key={data.websiteurl}>
                  <TableCell className="w-1/4">
                    <p className="w-[210px] truncate">{data.websiteurl}</p>
                  </TableCell>
                  <TableCell className="w-1/4">
                    {Math.round(
                      data.total_live_times.reduce(
                        (sum: number, entry: any) => sum + entry,
                        0
                      ) / 60
                    ) + " min"}
                  </TableCell>
                  <TableCell className="w-1/6">
                    <SparkLineChart
                      colors={["#FFC542"]}
                      plotType={state == "line" ? "line" : "bar"}
                      data={[1, ...data.total_live_times]}
                      height={50}
                      width={100}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default WebLine;
