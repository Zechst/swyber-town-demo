"use client"; // Add this line at the top
import { initializeFirebaseAuth } from "./app";

import Head from "next/head";
import Init from "./components/init";
import { useEffect } from "react";
import firebaseApp from "./config/firebase";

export default function Main() {
  useEffect(() => {
    console.log("Calling initializeFirebaseAuth...");
    initializeFirebaseAuth(); // Initialize Firebase authentication
  }, []);

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
