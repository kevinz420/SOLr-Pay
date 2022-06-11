import React from "react";

interface InputProps {
  placeholder: string;
  children?: React.ReactNode;
}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <div className="relative">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        {props.children}
      </div>
      <input
        className={`block h-10 ${props.children ? "pl-10" : "pl-3"} w-full text-sm rounded-md border-none bg-gray-700 placeholder-gray-400 text-white outline-0 shadow-inner focus:shadow-gray-500`}
        placeholder={props.placeholder}
      />
    </div>
  );
};
