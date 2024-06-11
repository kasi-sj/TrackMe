import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      userId: null,
      token: null,
      extensionKey: null,
      backendUrl : null,
      setUserId: (value: any) => set(() => ({ userId: value })),
      setToken: (value: any) => set(() => ({ token: value })),
      setExtensionKey: (value: any) => set(() => ({ extensionKey: value })),
      setBackendUrl: (value: any) => set(() => ({ backendUrl: value })),
    }),
    {
      name: "counter-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage instead of localStorage
    }
  )
);
