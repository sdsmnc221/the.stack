import React, { useState, useEffect } from "react";
import RadarStack from "./RadarStack";
import axiosInstance from "./axiosInstance";

type StackSkill = {
  category: string;
  name: string;
  progress: number;
  total: number;
};

type Stack = {
  [key: string]: StackSkill;
};

const fetchStacks = async () => {
  // // Initializing a client
  // const notion = new Client({
  //   auth: import.meta.env.VITE_NOTION_API_KEY,
  // });

  // notion.databases.query({
  //   database_id: import.meta.env.VITE_NOTION_DATABASE_STACK,
  // });

  const { data } = await axiosInstance.post(
    `${import.meta.env.DEV ? "" : "?query="}v1/databases/${
      import.meta.env.VITE_NOTION_DATABASE_STACK
    }/query`
  );

  const { results: pages } = data;

  if (pages.length) {
    console.log(pages);

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
        let currentSkill: any = {};

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

    return allCategories;
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
  const [stacksByCategory, setStacksByCategory] = useState<Stack[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStacks = async () => {
      try {
        setLoading(true);
        const stacks = await fetchStacks();

        setStacksByCategory(stacks);
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

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(stacksByCategory).map(([category, skills]) => (
        <div key={category} className="flex flex-col items-center">
          <h3 className="text-lg font-bold mb-2">{category}</h3>
          <RadarStack
            width={width}
            height={height}
            data={skills.map((skill) => ({
              name: skill.name,
              value: (skill.progress / skill.total) * 100,
            }))}
          />
        </div>
      ))}
    </div>
  );
}
