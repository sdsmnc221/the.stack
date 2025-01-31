import React from "react";

import ParentSize from "@visx/responsive/lib/components/ParentSize";

import RadarStacksDisplay from "./RadarStacksDisplay";

export default function App() {
  return (
    <ParentSize>
      {({ width, height }) => (
        <RadarStacksDisplay width={width} height={height} />
      )}
    </ParentSize>
  );
}
