// @ts-nocheck

import { useState, useEffect } from "react";
import RadarStack from "./RadarStack";
import axiosInstance from "./axiosInstance";

export type StackSkill = {
  category: string;
  name: string;
  progress: number;
  total: number;
};

export type Stack = {
  [key: string]: StackSkill;
};

export const fetchStacks = async () => {
  // // Initializing a client
  // const notion = new Client({
  //   auth: import.meta.env.VITE_NOTION_API_KEY,
  // });

  // notion.databases.query({
  //   database_id: import.meta.env.VITE_NOTION_DATABASE_STACK,
  // });

  const { data } = await axiosInstance.post(
    import.meta.env.DEV
      ? `v1/databases/${import.meta.env.VITE_NOTION_DATABASE_STACK}/query`
      : "api/notion"
  );

  const { results: pages } = data;

  if (pages.length) {
    // console.log(pages);

    const stacksCategories: string[] = pages.reduce(
      (acc: string[], page: any) => {
        if (page?.properties?.Domaine?.rich_text?.length) {
          const { plain_text } = page.properties.Domaine.rich_text[0];
          if (!acc.includes(plain_text)) {
            acc.push(plain_text);
          }
        }

        return acc;
      },
      []
    );

    const stacksSkills: StackSkill[] = pages.reduce(
      (acc: StackSkill[], page: any) => {
        const currentSkill = {};

        if (page?.properties["Is Legacy Skill"].checkbox) {
          return acc;
        }

        if (page?.properties?.Domaine?.rich_text?.length) {
          const { plain_text: category } = page.properties.Domaine.rich_text[0];
          currentSkill.category = category;
        }

        if (page?.properties?.Progress?.number) {
          const { number: progress } = page.properties.Progress;
          currentSkill.progress = progress;
        }

        if (page?.properties?.Total?.number) {
          const { number: total } = page.properties.Total;
          currentSkill.total = total;
        }

        if (
          page?.properties["Compétence"] &&
          page.properties["Compétence"].title?.length
        ) {
          const { plain_text: name } = page.properties["Compétence"].title[0];
          currentSkill.name = name;
        }

        if (
          acc.findIndex(
            (skill: StackSkill) =>
              skill.name == currentSkill.name &&
              skill.progress == currentSkill.progress
          ) === -1
        ) {
          acc.push(currentSkill);
        }

        return acc;
      },
      []
    );

    const allCategories = stacksCategories.reduce((acc, category) => {
      // Filter skills that match this category
      const categorySkills = stacksSkills.filter(
        (skill) => skill.category === category
      );

      // Only add the category if it has skills
      if (categorySkills.length > 0) {
        acc[category] = categorySkills;
      }

      return acc;
    }, {});

    return {
      stacksCategories: stacksCategories,
      allCategories,
      skills: stacksSkills,
    };
  }
};

// Component to display all radar charts
export default function RadarStacksDisplay({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const [currentStack, setCurrentStack] = useState<string>();
  const [stacksCategories, setStacksCategories] = useState<string[]>();
  const [stacksByCategory, setStacksByCategory] = useState<Stack[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStacks = async () => {
      try {
        setLoading(true);
        const stacks = await fetchStacks();

        if (stacks) {
          setStacksByCategory(stacks.allCategories);
          setStacksCategories(stacks.stacksCategories);
          setCurrentStack(stacks.stacksCategories[0]);
        }
      } catch (error) {
        console.error("Error fetching stacks:", error);
      } finally {
        setLoading(false);
      }
    };

    getStacks();
  }, []);

  if (loading || !stacksByCategory) {
    return <div>Loading...</div>;
  }

  // console.log(stacksByCategory[currentStack]);

  return (
    <>
      <div className="flex justify-center items-center">
        {stacksCategories?.map((category) => (
          <h3
            key={category}
            className="text-lg font-bold mb-2"
            onClick={() => setCurrentStack(category)}
          >
            {category}
          </h3>
        ))}
      </div>

      <div className="flex justify-center items-center">
        {currentStack?.length && (
          <div key={currentStack}>
            <RadarStack
              width={width}
              height={height}
              data={stacksByCategory[currentStack].map((skill) => ({
                name: skill.name,
                value: (skill.progress / skill.total) * 100,
              }))}
            />
          </div>
        )}
      </div>
    </>
  );
}
