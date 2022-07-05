import React, { useState } from "react";
import { Search } from "./components/Search";
import { Detail } from "./components/Detail";
import { useLocation } from "react-router-dom";

export const Payment: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState({
    username: location.state ? (location.state as any).user.username : "",
    pfpURL: location.state ? (location.state as any).user.pfpURL : "",
  });

  return (
    <div className="min-h-screen flex justify-center gap-5">
      <Search user={user} setUser={setUser} />
      <Detail user={user} setUser={setUser} />
    </div>
  );
};
