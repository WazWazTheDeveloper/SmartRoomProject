"use client"

import axios from "axios";

axios.defaults.withCredentials = true

type refreshType = {
  accessToken: string
}

export default function Home() {
  function test() {
    document.documentElement.classList.toggle("dark");
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
