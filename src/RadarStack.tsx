// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Client } from "@notionhq/client";

import { Group } from "@visx/group";
import { Line, LineRadial } from "@visx/shape";
import { Point } from "@visx/point";
import { scaleLinear } from "@visx/scale";

const orange = "#ff9933";
export const pumpkin = "#f5810c";
const silver = "#d9d9d9";
export const background = "#FAF7E9";

const degrees = 360;

const defaultMargin = { top: 40, left: 80, right: 80, bottom: 80 };

export type RadarProps = {
  width: number;
  height: number;
  levels?: number;
  margin?: typeof defaultMargin;
  data: Array<{ name: string; value: number }>;
};

export default function RadarStack({
  width,
  height,
  levels = 5,
  margin = defaultMargin,
  data,
}: RadarProps) {
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  if (!data?.length) return null;

  const validData = data.map((d) => ({
    ...d,
    value: Number(d.value) || 0,
  }));

  // Start from top (π/2 for top) and divide circle evenly
  const angleStep = (Math.PI * 2) / validData.length;
  const startAngle = -Math.PI / 2; // Start from top
  const angles = validData.map((_, i) => startAngle + i * angleStep);

  const radiusScale = scaleLinear<number>({
    range: [0, radius],
    domain: [0, 100],
  });

  // Generate web points with correct orientation
  const webPoints = angles.map((angle) => ({
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }));

  // Generate data points with correct orientation
  const dataPoints = validData.map((d, i) => {
    const r = radiusScale(d.value);
    return {
      x: Math.cos(angles[i]) * r,
      y: Math.sin(angles[i]) * r,
    };
  });

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect fill={background} width={width} height={height} rx={14} />
      <Group top={height / 2} left={width / 2}>
        {/* Draw web levels */}
        {Array.from({ length: levels }).map((_, i) => {
          const levelRadius = ((i + 1) * radius) / levels;
          const completeAngles = [...angles, angles[0]];

          // Generate points for polygon
          const levelPoints = completeAngles.map((angle) => ({
            x: Math.cos(angle) * levelRadius,
            y: Math.sin(angle) * levelRadius,
          }));

          // Create polygon path
          return (
            <polygon
              key={`web-${i}`}
              points={levelPoints.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={silver}
              strokeWidth={1}
              strokeOpacity={0.3}
            />
          );
        })}

        {/* Draw spokes */}
        {angles.map((angle, i) => (
          <Line
            key={`spoke-${i}`}
            from={new Point({ x: 0, y: 0 })}
            to={new Point(webPoints[i])}
            stroke={silver}
            strokeWidth={1}
            strokeOpacity={0.3}
          />
        ))}

        {/* Draw data polygon */}
        <polygon
          points={[...dataPoints, dataPoints[0]]
            .map((p) => `${p.x},${p.y}`)
            .join(" ")}
          fill={orange}
          fillOpacity={0.3}
          stroke={orange}
          strokeWidth={2}
        />

        {/* Draw data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={pumpkin}
          />
        ))}

        {/* Draw labels */}
        {validData.map((d, i) => {
          const angle = angles[i];
          const labelRadius = radius + 30;
          const x = Math.cos(angle) * labelRadius;
          const y = Math.sin(angle) * labelRadius;
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={silver}
              fontSize={12}
              transform={`rotate(${(angle * 180) / Math.PI + 90}, ${x}, ${y})`}
            >
              {d.name}
            </text>
          );
        })}
      </Group>
    </svg>
  );
}
