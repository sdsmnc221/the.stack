// @ts-nocheck
import { useState, useEffect } from "react";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";

import { fetchStacks } from "../RadarStacksDisplay";

interface WordCloudProps {
  width: number;
  height: number;
}

export interface WordData {
  text: string;
  value: number;
}

const colors = ["#D4AF37", "#B7791F", "#F0E68C"];

function wordFreq(text: string): WordData[] {
  const words: string[] = text.replace(/\./g, "").split(";");
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap).map((word) => ({
    text: word,
    value: freqMap[word],
  }));
}

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const fixedValueGenerator = () => 0.5;

type SpiralType = "archimedean" | "rectangular";

export default function WordCloud({ width, height }: WordCloudProps) {
  const spiralType = "rectangular";
  const withRotation = false;

  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]);

  const fontScale = (value: number) => {
    if (words.length === 0) return 0; // Handle empty array case

    const scale = scaleLog({
      domain: [
        Math.max(1, Math.min(...words.map((w: any) => w.value))),
        Math.max(...words.map((w: any) => w.value)),
      ],
      range: [10, 72],
    });

    return width < height ? scale(value) / 2 : scale(value);
  };

  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  useEffect(() => {
    const getStacks = async () => {
      try {
        setLoading(true);
        const stacks = await fetchStacks();

        if (stacks) {
          let skillsToWords = "";

          stacks.skills.forEach((skill) => {
            if (!skill.progress) {
              skill.progress = 10;
            }

            if (skill.category === "Langue") {
              skill.progress = (skill.progress / skill.total) * 100;
            }

            const name = skill.name.trim();

            if (name.length) {
              for (let i = 0; i < skill.progress / 2; i++) {
                skillsToWords += ";" + name;
              }
            }
          });

          const wordsF = wordFreq(skillsToWords);
          setWords(wordsF);
        }
      } catch (error) {
        console.error("Error fetching stacks:", error);
      } finally {
        setLoading(false);
      }
    };

    getStacks();
  }, []);

  return (
    <div className="wordcloud">
      {!loading && (
        <Wordcloud
          words={words}
          width={width < height ? width * 2 : width}
          height={height}
          fontSize={fontSizeSetter}
          font={"Varela Round"}
          padding={2}
          spiral={spiralType}
          rotate={withRotation ? getRotationDegree : 0}
          random={fixedValueGenerator}
        >
          {(cloudWords) =>
            cloudWords.map((w, i) => (
              <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={"middle"}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
              >
                {w.text}
              </Text>
            ))
          }
        </Wordcloud>
      )}
    </div>
  );
}
