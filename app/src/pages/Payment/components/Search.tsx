import React from "react";
import { Input } from "../../../components/Input";
import { SparklesIcon } from "@heroicons/react/outline";

interface SearchProps {}

export const Search: React.FC<SearchProps> = ({}) => {
  return (
    <div className="rounded-xl p-8 my-20 flex justify-start items-center bg-gray-800 w-4/12 h-fit flex-col">
      <div className="w-11/12">
        <Input placeholder="Find a friend to pay...">
            <SparklesIcon className="h-6 w-6 text-gray-400"/>
        </Input>

        <div className="my-64">
          <h1 className="text-xl text-gray-400 text-center font-semibold">
            We couldn't find any matches
          </h1>
          <p className="text-ned text-gray-400 text-center">
            We couldn't find any matching profiles. Try using a username or
            wallet address.
          </p>
        </div>
      </div>
    </div>
  );
};
