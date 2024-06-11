"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useUserStore } from "@/store";
import {getBackEndUrl} from "@/actions/user";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const setUserId = useUserStore((state: any) => state.setUserId);
  const setToken = useUserStore((state: any) => state.setToken);
  const setExtensionKey = useUserStore((state: any) => state.setExtensionKey);
  const setBackendUrl = useUserStore((state: any) => state.setBackendUrl);
  React.useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setToken(localStorage.getItem("token"));
    setExtensionKey(localStorage.getItem("extensionKey"));
    (async () => {
      const backendUrl = await getBackEndUrl();
      setBackendUrl(backendUrl);
    })();
  }, []);

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </NextUIProvider>
  );
}
