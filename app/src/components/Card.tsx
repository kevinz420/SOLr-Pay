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
        className="bg-gray-800 p-0 text-white rounded-none relative gap-0 self-end flex flex-col h-28 w-11/12 mb-0 md:pl-10 md:pr-5 md:bg-gray-900 md:mb-2 md:p-2 md:rounded-xl md:gap-3 md:w-3/4"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="hidden absolute w-5 h-3/4 left-0 bg-gray-700 rounded-r-lg top-3 md:block"></div>
        <div
          className={classNames(
            "hidden md:block absolute w-2 h-1/2 left-1.5 top-6 rounded-lg",
            hover ? "bg-gradient-to-t from-neutral-400 to-white" : "bg-gray-500"
          )}
        ></div>
        {props.children}
      </div>

      <div className="block h-px self-end w-11/12 bg-gray-500 md:hidden"></div>
    </>
  );
};
