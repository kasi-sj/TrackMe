"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Skeleton,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Slider,
} from "@nextui-org/react";
import { useUserStore } from "@/store";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { FaBan } from "react-icons/fa";

import { CircularProgress } from "@mui/material";
import { EyeIcon } from "./EyeIcon";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";

const ViewModel = ({
  data,
  isOpen,
  onClose,
}: {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody>
              <Input
                disabled={true}
                type="url"
                label="URL"
                className="mb-3"
                value={data && data.websiteurl}
              />
              <Switch
                defaultSelected
                size="md"
                className="mb-2"
                isSelected={data && data.isblocked}
                disabled={true}
              >
                Restrict URL
              </Switch>
              <Slider
                value={data && data.limitedtime}
                isDisabled={true}
                label="Hours"
                showTooltip={true}
                formatOptions={{ style: "decimal" }}
                tooltipValueFormatOptions={{
                  style: "decimal",
                }}
                step={0.01}
                maxValue={24}
                minValue={0}
                defaultValue={0.4}
                className="max-w-md "
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClose();
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const EditModel = ({
  data,
  isOpen,
  onClose,
}: {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const backendurl = useUserStore((state:any)=> state.backendUrl);
  const axiosUrl = backendurl+`/restricted_websites/`;
  const [url, setUrl] = useState<string>();
  const [isRestricted, setIsRestricted] = useState<boolean>();
  const [hours, setHours] = useState();
  useEffect(() => {
    if (!data) return;
    setUrl(data.websiteurl);
    setIsRestricted(data.isblocked);
    setHours(data.limitedtime);
  }, [data]);

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      if (!userId) {
        return null;
      }
      if (!url) {
        alert("Please enter a URL");
        return;
      }
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      try {
        const restricted_website = await axios.put(
          axiosUrl + data.id,
          {
            restricted_website: {
              user_id: userId,
              websiteurl: url,
              limitedtime: isRestricted ? 0 : hours,
              isblocked: isRestricted,
            },
          },
          config
        );
        alert("updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["resticted_urls"],
        });
        return restricted_website.data;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    mutationKey: ["Restrict URL"],
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose()}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <Input
                  type="url"
                  label="URL"
                  className="mb-3"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
                <Switch
                  defaultSelected
                  size="md"
                  className="mb-2"
                  isSelected={isRestricted}
                  onChange={() => setIsRestricted((prev) => !prev)}
                >
                  Restrict URL
                </Switch>
                <Slider
                  value={hours}
                  onChange={(value: any) => {
                    console.log(value);
                    setHours(value);
                  }}
                  isDisabled={isRestricted}
                  label="Hours"
                  showTooltip={true}
                  formatOptions={{ style: "decimal" }}
                  tooltipValueFormatOptions={{
                    style: "decimal",
                  }}
                  step={0.01}
                  maxValue={24}
                  minValue={0}
                  defaultValue={0.4}
                  className="max-w-md "
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={async () => {
                    await mutateAsync();
                    onClose();
                  }}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const DeleteModel = ({
  data,
  isOpen,
  onClose,
}: {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const token = useUserStore((state: any) => state.token);
  const backendurl = useUserStore((state:any)=> state.backendUrl);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete_resticted_url"],
    mutationFn: async () => {
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const response = await axios.delete(
        backendurl+`/restricted_websites/${data.id}`,
        config
      );
      return response.data;
    },
  });

  return (
    <Modal size={"lg"} isOpen={isOpen} onClose={() => onClose()}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Resticted WebSite
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete this web site
                {" " + data.websiteurl}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="warning"
                variant="light"
                onPress={() => {
                  onClose();
                }}
              >
                Close
              </Button>
              <Button
                color="danger"
                variant="light"
                onPress={async () => {
                  await mutateAsync();
                  queryClient.invalidateQueries({
                    queryKey: ["resticted_urls"],
                  });
                  onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

function extractDomain(url: string) {
  if (url == null) return "cannot";
  let domain = url.replace(/^https?:\/\/(www\.)?/, "");
  domain = domain.split("/")[0];
  return domain.replace(".com", "");
}

export default function App() {
  const [activeResticted, setActiveResticted] = useState();
  
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const backendurl = useUserStore((state:any)=> state.backendUrl);
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      const data = (
        await axios.get(
          backendurl+`/restricted_websites/user/${userId}`,
          config
        )
      ).data;
      return data;
    },
    queryKey: ["resticted_urls"],
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
          <Skeleton className="rounded-full h-10 w-28 " />
        </div>
        <div className="space-y-3 w-full flex flex-col justify-center items-center ">
          <Skeleton className="h-10 w-11/12 rounded-lg" />
          <Skeleton className="h-[300px] w-11/12 rounded-lg" />
        </div>
      </Card>
    );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className="py-3">
      <Table
        aria-label="Example static collection table"
        BaseComponent={({ children }) => {
          return (
            <div className="px-2 ">
              <div className="flex flex-row justify-between px-10 items-center my-3">
                <div className="flex flex-row items-center gap-2">
                  <FaBan size={20} />
                  <h3 className="text-lg font-semibold">Resticted website</h3>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <h2 className="">
                    {" "}
                    {data && data.length > 11 && "show all"}{" "}
                  </h2>
                </div>
              </div>
              {data && data.length > 0 ? (
                children
              ) : (
                <div className="w-full flex flex-row items-center justify-center">
                  No Record Available
                </div>
              )}
            </div>
          );
        }}
      >
        <TableHeader>
          <TableColumn>URL</TableColumn>
          <TableColumn>Limitedtime</TableColumn>
          <TableColumn>ACTION</TableColumn>
        </TableHeader>
        <TableBody>
          {data &&
            data.slice(0, 11).map((data: any) => {
              return (
                <TableRow key={data.id} className="">
                  <TableCell className="">
                    <p className=" w-[150px] truncate">{data.websiteurl}</p>
                  </TableCell>
                  <TableCell>
                    {data.isblocked ? (
                      <div>blocked</div>
                    ) : (
                      <div>{data.limitedtime + " hr limit"}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="Details">
                        <span
                          className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          onClick={() => {
                            setActiveResticted(data);
                            setViewOpen(true);
                          }}
                        >
                          <EyeIcon />
                        </span>
                      </Tooltip>
                      <Tooltip content="Edit URL">
                        <span
                          className="text-lg text-default-400 cursor-pointer active:opacity-50"
                          onClick={() => {
                            setActiveResticted(data);
                            setEditOpen(true);
                          }}
                        >
                          <EditIcon />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content="Delete URL">
                        <span
                          className="text-lg text-danger cursor-pointer active:opacity-50"
                          onClick={() => {
                            setActiveResticted(data);
                            setDeleteOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <ViewModel
        data={activeResticted}
        isOpen={viewOpen}
        onClose={() => {
          setViewOpen((prev) => !prev);
        }}
      />
      <EditModel
        data={activeResticted}
        isOpen={editOpen}
        onClose={() => {
          setEditOpen((prev) => {
            return !prev;
          });
        }}
      />
      <DeleteModel
        data={activeResticted}
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen((prev) => !prev);
        }}
      />
    </Card>
  );
}
