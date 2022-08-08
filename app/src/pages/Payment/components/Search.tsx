import React from "react";
import { Input } from "../../../components/Input";
import { SparklesIcon } from "@heroicons/react/outline";
import { ProfileType } from "../../../interfaces/types";

interface SearchProps {
  user: ProfileType;
  setUser: React.Dispatch<React.SetStateAction<ProfileType>>;
}

export const Search: React.FC<SearchProps> = (props) => {
  return (
    <div className="rounded-xl p-8 mt-8 mb-0 flex justify-start items-center bg-gray-800 w-11/12 h-fit flex-col self-center md:my-20 md:w-4/12 md:h-fit md:self-auto">
      <div className="w-11/12 relative">
        <Input
          placeholder="Find a friend to pay..."
          onSelect={(user) => props.setUser(user)}
          isPayment={true}
        >
          <SparklesIcon className="h-6 w-6 text-gray-400" />
        </Input>

        <div className="my-36 md:my-64">
          <h1 className="text-xl text-gray-400 text-center font-semibold">
            Start your search for profiles
          </h1>
          <div className="text-ned text-gray-400 text-center">
            Matching profiles will appear here. Try using a username or wallet
            address.
          </div>
        </div>
      </div>
    </div>
  );
};
