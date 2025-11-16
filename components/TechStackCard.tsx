import React from "react";
import TechStack from "@/components/TechStack";
import { backend, currentLearning, dbServices, frontend } from "@/constants/contants";
import { Card } from "./ui/card";

const TechStackCard = () => {
  return (
    <Card className="w-full h-full font-NHassDisplay p-0">
      <div className="flex flex-col h-full overflow-hidden justify-start w-full group pb-2.5 border rounded-lg">
        <div className="h-max">
          <div className="flex pt-2.5 font-SpaceGrotesk">
            <p className="text-4xl px-2.5 font-bold">{"{"}</p>
            <p className="text-4xl group-hover:px-2 transition-all duration-200 font-bold">{"}"}</p>
          </div>
          <h1 className="text-5xl font-medium font-SpaceGrotesk py-2 px-2.5 relative w-full">
            TECH <br /> STACK
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-foreground rounded-r-full transition-all duration-500 group-hover:w-[80%] group-hover:mx-auto"></span>
          </h1>
        </div>

        {/* ✅ Filtered arrays to remove undefined values */}
        <div className="relative mt-2 w-full grid grid-cols-1 overflow-y-auto hide-scrollbar p-2 gap-5">
          <TechStack title="Frontend:" items={frontend.filter(Boolean) as string[]} />
          <TechStack title="Backend:" items={backend.filter(Boolean) as string[]} />
          <TechStack title="Db & Services:" items={dbServices.filter(Boolean) as string[]} />
          <TechStack title="Currently Learning:" items={currentLearning.filter(Boolean) as string[]} />
        </div>
      </div>
    </Card>
  );
};

export default TechStackCard;
