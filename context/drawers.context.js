import React, { createContext, useState, useEffect } from "react";

export const DrawerContext = createContext();

export default function DrawersContextProvider({ children }) {
  const [isChatOpen, setChatOpen] = useState(false);
  const [isSidebarOpen, setSibebarOpen] = useState(false);
  const breakpoint = 768;

  const setDrawerStatus = (operation, target) => {
    const operations = {
      OPEN: { status: true },
      CLOSE: { status: false },
    };

    const targets = {
      SIDEBAR: { value: isSidebarOpen, set: setSibebarOpen },
      CHATBAR: { value: isChatOpen, set: setChatOpen },
    };

    const operationTest = operations[operation];

    if (!operationTest) return;

    const targetTest = targets[target];
    if (!targetTest) return;

    const width = window.innerWidth;

    if (width < breakpoint && operationTest.status) {
      Object.keys(targets).map((key) => {
        const drawer = targets[key];
        key === target ? drawer.set(operationTest.status) : drawer.set(false);
      });
      return;
    }

    targetTest.set(operationTest.status);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < breakpoint) {
        setChatOpen(false);

        return;
      }
      setChatOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < breakpoint) {
        setSibebarOpen(false);
        return;
      }

      setSibebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.innerWidth > breakpoint) {
      setChatOpen(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.innerWidth > breakpoint) {
      setSibebarOpen(true);
    }
  }, []);

  return (
    <DrawerContext.Provider
      value={{ isChatOpen, isSidebarOpen, setDrawerStatus }}
    >
      {children}
    </DrawerContext.Provider>
  );
}
