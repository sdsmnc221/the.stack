import { useEffect } from "react";
import Lottie from "lottie-react";

import axios from "axios";

import "./App.scss";

import ParentSize from "@visx/responsive/lib/components/ParentSize";
// import RadarStacksDisplay from "./RadarStacksDisplay";

import SunflowerLottie from "../public/wired-outline-1832-sunflower-hover-pinch.json";
import WordCloud from "./components/WordCloud";

import axiosInstance from "./axiosInstance";

export default function App() {
  useEffect(() => {
    async function hello() {
      const test = await axios.get("/api/hello");
      console.log(test);
    }

    hello();
  }, []);

  return (
    <ParentSize className="app">
      {({ width, height }) => (
        <>
          <Lottie
            animationData={SunflowerLottie}
            width={width / 10}
            height={height / 10}
            className="flower"
          ></Lottie>
          <WordCloud width={width} height={height} />
        </>
      )}
    </ParentSize>
  );
}
