import React from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  color: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`justify-center focus:outline-none text-white ${props.color === "primary" ? "bg-gray-900 hover:bg-gray-700" : "bg-green-700 hover:bg-green-600"} font-medium rounded-lg text-sm px-5 py-2.5 flex gap-2`}
    >
      {props.children}
    </button>
  );
};