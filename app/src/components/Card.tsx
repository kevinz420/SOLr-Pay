import React, { useState } from "react";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

interface CardProps {
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = (props) => {
  const [hover, setHover] = useState(false);

  return (
    <>
      <div
        className="bg-gray-900 p-2 mb-2 text-white rounded-xl flex flex-col gap-3 relative h-28 pl-16 pr-5 w-3/4"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="absolute w-5 h-3/4 left-0 bg-gray-700 rounded-r-lg top-3"></div>
        <div className={classNames("absolute w-2 h-1/2 left-1.5  top-6 rounded-lg", hover ? "bg-gradient-to-t from-neutral-400 to-white" : "bg-gray-500")}></div>
        {props.children}
      </div>
    </>
  );
};
