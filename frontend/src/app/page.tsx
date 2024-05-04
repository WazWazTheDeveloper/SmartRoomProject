"use client"

import axios from "axios";

axios.defaults.withCredentials = true

type refreshType = {
  accessToken: string
}

export default function Home() {
  function test() {
    document.documentElement.classList.toggle("dark");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" onClick={test}>
      <div>
        test
      </div>
    </main>
  );
}
