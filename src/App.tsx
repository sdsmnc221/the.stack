import Lottie from "lottie-react";

import "./App.scss";

import ParentSize from "@visx/responsive/lib/components/ParentSize";
// import RadarStacksDisplay from "./RadarStacksDisplay";

import SunflowerLottie from "../public/wired-outline-1832-sunflower-hover-pinch.json";
import WordCloud from "./components/WordCloud";

export default function App() {
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
          <WordCloud
            width={height > width ? width * 2 : width}
            height={height}
          />
        </>
      )}
    </ParentSize>
  );
}
