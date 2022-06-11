import React from "react";
import { Input } from "../../../components/Input";
import { SparklesIcon } from "@heroicons/react/outline";

interface SearchProps {}

export const Search: React.FC<SearchProps> = ({}) => {
  return (
    <div className="rounded-xl p-8 mt-20 flex justify-start items-center gap-5 bg-gray-800 w-4/12 h-3/4 flex-col">
      <div className="w-11/12">
        <Input placeholder="Find a friend to pay...">
            <SparklesIcon className="h-6 w-6 text-gray-400"/>
        </Input>

        <div className="my-48">
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
