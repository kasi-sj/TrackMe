import { useUserStore } from "@/store";
import { LineChart } from "@mui/x-charts";
import { Button } from "@nextui-org/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Slider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const DomainModel = ({
  open,
  onClose,
  domain,
}: {
  open: boolean;
  onClose: () => void;
  domain: string;
}) => {
  const { theme, setTheme } = useTheme();
  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const backendUrl = useUserStore((state: any) => state.backendUrl);
  const {
    data: allurl,
    isLoading: allurlLoading,
    refetch: allRefetch,
  } = useQuery({
    queryKey: ["domainByAll"],
    queryFn: async () => {
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const url = backendUrl+`/tracked_websites/user/${userId}/domain/`;
      const data = await axios.post(
        url,
        {
          domain: domain,
        },
        config
      );
      return data.data;
    },
  });

  const {
    data: allByData,
    isLoading: allByDateLoading,
    refetch: dateRefetch,
  } = useQuery({
    queryKey: ["domainByDate"],
    queryFn: async () => {
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const url = backendUrl+`/tracked_websites/user/${userId}/sum_by_date`;
      const data = await axios.post(
        url,
        {
          domain: domain,
        },
        config
      );
      const key: Date[] = [];
      const value: number[] = [];
      data.data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      data.data.forEach((element: any) => {
        key.push(new Date(element.date));
        value.push(element.total_live_time);
      });
      return {
        key: key,
        value: value,
      };
    },
  });

  const refetch = () => {
    dateRefetch();
    allRefetch();
  };

  useEffect(() => {
    refetch();
  }, [domain, open]);
  return (
    <>
      <Modal isOpen={open} onOpenChange={onClose} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Domain Analytics
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 mx-10">
                  {!allByDateLoading && allByData && (
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
                          data: allByData?.key,
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
                          data: allByData?.value.map((value) =>
                            Math.round(value / 60)
                          ),
                        },
                      ]}
                      // width={500}
                      height={300}
                    />
                  )}

                  {/* <p className="col-span-1">{JSON.stringify(allurl)}</p>
                   */}
                  <Table
                    hideHeader
                    isStriped
                    classNames={{
                      base: "max-h-[300px] overflow-scroll",
                      table: "min-h-[300px]",
                    }}
                  >
                    <TableHeader>
                      <TableColumn key="name">URL</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {allurl &&
                        allurl?.map((url: any) => {
                          return (
                            <TableRow key={url.id}>
                              <TableCell className="flex flex-row justify-around items-center m-2">
                                <p className=" h-10  w-60 overflow-hidden">
                                  {url[0]}
                                </p>
                                <p>{Math.round(url[1] / 60) + " min"}</p>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DomainModel;
