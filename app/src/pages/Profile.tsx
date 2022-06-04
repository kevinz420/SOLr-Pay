import React from "react";
import { useAppSelector } from "../redux/app/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import planet from "../assets/planet.png";
import { useParams, useNavigate } from 'react-router-dom'
import { UserAddIcon } from "@heroicons/react/solid";

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  const user = useAppSelector((state) => state.user);
  const wallet = useWallet();
  const { handle } = useParams()
  const navigate = useNavigate()

  return (
    <div className="h-screen">
      <div className="rounded-xl p-8 py-16 mt-20 flex justify-start items-center gap-5 bg-gray-800 w-3/4 m-auto flex-col">
        <div className="flex gap-12 mb-14">
          <img src={user.pfpURL} className="rounded-full w-36 h-36 outline outline-white" />
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-4xl text-white">
                {user.username}
              </h1>
              <h2 className="text-white font-semibold bg-slate-700 p-1 rounded-xl w-28 h-8 text-center">
                0 Friends
              </h2>
            </div>

            <p className="mt-2 mb-8 text-gray-400">{wallet.publicKey?.toString()}</p>
            <div className="grid grid-cols-2 gap-5">
              {handle === user.username ? <Button color="primary" onClick={() => {navigate('/settings')}}>Edit Profile</Button> : 
              <>
                <Button color="secondary" onClick={() => {}} >Add Friend <UserAddIcon className="h-5 text-gray-200"/></Button>
                <Button color="primary" onClick={() => {}}>Pay or Request</Button>
              </>
              }
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 my-20">
          <img src={planet} className="h-52" />

          <h1 className="text-2xl text-gray-400">
            Looks like there are no signs of life detected 😔
          </h1>
        </div>
      </div>
    </div>
  );
};
