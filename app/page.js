"use client"; // Add this line at the top

import Head from "next/head";
import Init from "./components/init";
import { useEffect } from "react";

export default function Main() {
  return (
    <>
      <Head>
        <title>Swyber Town Demo</title>
      </Head>
      <div className="w-full h-screen bg-gray-700 flex justify-center items-center">
        <div
          id="game-container"
          className="game-container w-[1000px] h-[500px] relative "
        >
          <canvas id="game-canvas" className="w-full h-full"></canvas>
        </div>
      </div>

      <Init />
      {/* Ensure Init is called here */}
    </>
  );
}
