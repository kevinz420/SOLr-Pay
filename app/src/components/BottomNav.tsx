import React from "react";
import {
  CreditCardIcon,
  CogIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";
import {
  CreditCardIcon as OutlineCC,
  CogIcon as OutlineCog,
  HomeIcon as OutlineHome,
  UserCircleIcon as OutlineUser,
} from "@heroicons/react/outline";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/app/hooks";

interface BottomNavProps {}

export const BottomNav: React.FC<BottomNavProps> = ({}) => {
  const location = useLocation();
  const user = useAppSelector((state) => state.user);

  return (
    <div className="sticky bottom-0 items-start h-16 w-full bg-gray-900 pt-3 flex justify-around md:hidden">
      <Link to="/">
        {location.pathname === "/" ? (
          <HomeIcon className="w-8 text-gray-300" />
        ) : (
          <OutlineHome className="w-8 text-gray-300" />
        )}
      </Link>
      <Link to="/payment">
        {location.pathname === "/payment" ? (
          <CreditCardIcon className="w-8 text-gray-300" />
        ) : (
          <OutlineCC className="w-8 text-gray-300" />
        )}
      </Link>
      <Link to={`/users/${user.username}`}>
        {location.pathname.startsWith("/users") ? (
          <UserCircleIcon className="w-8 text-gray-300" />
        ) : (
          <OutlineUser className="w-8 text-gray-300" />
        )}
      </Link>
      <Link to="/settings">
        {location.pathname === "/settings" ? (
          <CogIcon className="w-8 text-gray-300" />
        ) : (
          <OutlineCog className="w-8 text-gray-300" />
        )}
      </Link>
    </div>
  );
};
