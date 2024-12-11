"use client"; // Add this line at the top

import Head from "next/head";
import Init from "./components/init";
import { useEffect } from "react";

export default function Main() {
  useEffect(() => {
    //console.log("Main component mounted"); // Debug log
  }, []);

  return (
    <>
      <Head>
        <title>Swyber Town Demo</title>
      </Head>
      <div className="w-full h-screen bg-gray-700 flex justify-center items-center">
        <div
          id="game-container"
          className="game-container w-[352px] h-[198px] relative border-2 rounded-md scale-150 translate-y-1/4"
        >
          <canvas id="game-canvas" className="w-full h-full"></canvas>
        </div>
      </div>

      <Init />
      {/* Ensure Init is called here */}
    </>
  );
}
