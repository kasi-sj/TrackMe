import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Slider,
  Switch,
  Input,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import { useUserStore } from "@/store";

export default function Model() {
  const queryClient = useQueryClient();
  const userId = useUserStore((state: any) => state.userId);
  const token = useUserStore((state: any) => state.token);
  const backendurl = useUserStore((state: any) => state.backendUrl);
  const axiosUrl =
    backendurl+"/restricted_websites/";
  const [url, setUrl] = useState("");
  const [isRestricted, setIsRestricted] = useState(false);
  const [hours, setHours] = useState(0.4);
  const [isOpen, setIsOpen] = useState<boolean>();
  const { data, mutateAsync } = useMutation({
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
        const restricted_website = await axios.post(
          axiosUrl,
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
        alert(restricted_website.data.data);
        setIsOpen(false);
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
      <Button className="mt-1" onClick={() => setIsOpen((prev) => !prev)}>
        Limit Website Usage
      </Button>
      <Modal isOpen={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    mutateAsync();
                  }}
                  onPress={onClose}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
