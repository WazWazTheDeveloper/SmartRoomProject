"use client"

import Image from "next/image";
import axios from "axios";
import { QueryClient, useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import useSidebarState from "@/hooks/useSidebarState";

axios.defaults.withCredentials = true

type refreshType = {
  accessToken: string
}

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarState()
    function test() {
    document.documentElement.classList.toggle("dark");
    // setIsSidebarOpen(!isSidebarOpen);
    console.log("asd")
  }
  return (
    <main className="bg-neutral-100 dark:bg-darkNeutral-100 flex min-h-screen flex-col items-center justify-between p-24" onClick={test}>
      <div>
        test
      </div>
    </main>
  );
}
