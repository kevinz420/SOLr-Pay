import React from "react";
import {
  SwitchHorizontalIcon,
  CogIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/app/hooks";

interface BottomNavProps {}

export const BottomNav: React.FC<BottomNavProps> = ({}) => {
    const user = useAppSelector((state) => state.user);

    return (
    <div className="sticky bottom-0 items-start h-16 w-full bg-gray-900 pt-3 flex justify-around md:hidden">
      <Link to="/">
        <HomeIcon className="w-8 text-gray-300" />
      </Link>
      <Link to="/payment">
        <SwitchHorizontalIcon className="w-8 text-gray-300" />
      </Link>
      <Link to={`/users/${user.username}`}>
        <UserCircleIcon className="w-8 text-gray-300" />
      </Link>
      <Link to="/settings">
        <CogIcon className="w-8 text-gray-300" />
      </Link>
    </div>
  );
};
