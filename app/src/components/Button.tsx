import React from "react";
import { Link } from "react-router-dom";

export const Button: React.FC = ({children}) => {
  return (
    <Link
      to="/"
      className="focus:outline-none text-white bg-gray-900 hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 flex gap-2"
    >
      {children}
    </Link>
  );
};
