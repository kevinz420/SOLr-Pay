import React, { useState, useRef } from "react";
import { UserIcon, PlusCircleIcon } from "@heroicons/react/solid";
import { Button } from "./Button";
import { Card } from "./Card";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { update } from "../redux/features/user-slice";
import { Toast } from "../components/Toast";

import initialize from "../utils/initialize";
import getWallet from "../utils/get-wallet";
import getFriends from "../utils/get-friends";
import getUser from "../utils/get-user";
import editProfile from "../utils/edit-profile";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from 'axios'
import FormData from 'form-data'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface FormProps {
  submitText: string; // submit button text
  initialize: boolean; // T/F depending on whether the form is being used to initialize or to modify profile
}

export const Form: React.FC<FormProps> = (props) => {
  const user = useAppSelector((state) => state.user);
  const [image, setImage] = useState(user.pfpURL);
  const [validate, setValidate] = useState(false);
  const username = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState({
    visible: false,
    isSuccess: true,
    text: "",
  });

  const wallet = useWallet();
  const { connection } = useConnection();
  const dispatch = useAppDispatch();

  // sets preview image with uploaded file
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    var file = e.target.files[0];
    var img = URL.createObjectURL(file);

    setImage(img);
  };

  const handleSubmit = async () => {
    // ensure both image and username fields are filled
    if (image === "" || username.current!.value === "") {
      setValidate(true);
      return;
    }

    // ensure username not taken
    if (username.current!.value !== user.username) {
      try {
        await getUser(wallet, connection, username.current!.value);
        setToast({
          visible: true,
          isSuccess: false,
          text: "Username already in use.",
        });
        return;
      } catch {}
    }

    let pfpURL = user.pfpURL;
    let cid = "";

    try {
      // send new image to IPFS if one is uploaded
      if (image !== user.pfpURL) {
        let file = await fetch(image)
          .then(r => r.blob())
          
        let data = new FormData();
        data.append('pfp', file)
        cid = (await axios.post('/api/upload', data)).data;
        pfpURL = `https://solr-pay.infura-ipfs.io/ipfs/${cid}`;
      }

      if (props.initialize) {
        await initialize(
          username.current!.value,
          Buffer.from(cid),
          wallet,
          connection
        );
        // we only want to edit profile if either username or pfp is modified
      } else if (
        username.current!.value !== user.username ||
        image !== user.pfpURL
      ) {
        const newUser =
          username.current!.value === user.username
            ? undefined
            : username.current!.value;
        await editProfile(
          wallet,
          connection,
          newUser,
          user.username,
          cid === "" ? undefined : Buffer.from(cid)
        );
      }

      // update username/pfp/friends stored in redux
      const walletState = await getWallet(wallet, connection);
      const friendState = await getFriends(
        wallet,
        connection,
        wallet.publicKey!
      );
      const friends = await Promise.all(
        friendState.friends.map(async (f) => {
          const walletState = await getWallet(wallet, connection, f);
          return {
            pubkey: f.toString(),
            username: walletState.username ,
            pfpURL: `https://solr-pay.infura-ipfs.io/ipfs/${(
              walletState.pfpCid 
            ).toString()}`,
          };
        })
      );

      setToast({
        visible: true,
        isSuccess: true,
        text: "Profile successfully updated.",
      });
      dispatch(
        update({ username: walletState.username , pfpURL, friends })
      );
    } catch {
      setToast({ visible: true, isSuccess: false, text: "Please try again." });
    }
  };

  return (
    <div className="pb-10 flex gap-0 bg-gray-100 w-screen items-center rounded-none flex-col h-max md:py-14 md:bg-gray-800 md:gap-3 md:rounded-xl md:w-1/2">
      <div className="flex pb-10 justify-center items-center flex-col gap-4 md:gap-10 md:items-start md:flex-row md:mb-8 md:py-0">
        <div className="flex justify-center items-center">
          <label
            className={classNames(
              validate && image === ""
                ? "border-4 border-red-400"
                : "border-2 border-gray-300",
              "w-32 h-32 rounded-full flex flex-col justify-center items-center cursor-pointer hover:bg-bray-800 bg-gray-100 border-gray-600 hover:border-gray-900 hover:bg-gray-200 md:bg-gray-700 md:border-gray-600 md:hover:border-gray-500 md:hover:bg-gray-600 md:w-28 md:h-28"
            )}
          >
            <div className="flex flex-col justify-center items-center relative">
              {image === "" ? (
                <>
                  <UserIcon className="m-3 w-20 h-24 md:w-16 md:h-20 text-gray-900 md:text-gray-50" />
                  <PlusCircleIcon
                    className={classNames(
                      validate && image === ""
                        ? "text-red-400"
                        : "text-slate-900 md:text-slate-50",
                      "absolute -bottom-1 left-24 w-10 h-10 md:bottom-1 md:w-8 md:h-8 md:left-20"
                    )}
                  />
                </>
              ) : (
                <img
                  src={image}
                  className="rounded-full w-32 h-32 object-cover md:w-28 md:h-28"
                />
              )}
            </div>
            <input
              id="file"
              type="file"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>

        <div className="w-3/5 md:w-2/5 flex flex-col justify-center md:block">
          <input
            ref={username}
            className={classNames(
              validate && username.current!.value === ""
                ? "border-red-400"
                : "border-slate-500",
              "border-b-2 bg-gray-100 text-gray-800 text-center text-3xl font-bold placeholder:text-gray-600 mb-5 block outline-0 w-full h-16 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 md:text-white md:placeholder:text-white md:p-2.5 md:text-start md:bg-gray-800 md:h-auto"
            )}
            placeholder="username"
            defaultValue={user.username}
            required
          />
          <Button className="w-3/5 md:w-auto self-center" color="primary" onClick={handleSubmit}>
            {props.submitText}
          </Button>
        </div>
      </div>

      <div className="block h-px self-end w-11/12 bg-gray-300 md:hidden"/>
      
      <Card>
        <div className="flex flex-col place-self-start gap-4 mt-6 md:mt-4 w-11/12 md:w-full">
          <div className="flex justify-between">
            <div className="h-5 w-32 bg-slate-300 rounded-sm md:rounded-none md:bg-slate-800 md:w-48"></div>
            <h1 className="text-green-500 font-bold">38 USDC</h1>
          </div>
          <div className="mb-3 h-3 w-28 bg-slate-300 rounded-sm md:rounded-none md:bg-slate-800 md:w36"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col place-self-start gap-4 mt-6 md:mt-4 w-11/12 md:w-full">
          <div className="flex justify-between">
            <div className="h-5 w-36 bg-slate-300 rounded-sm md:rounded-none md:bg-slate-800"></div>
            <h1 className="text-red-500 font-bold">-1 SOL</h1>
          </div>
          <div className="mb-3 h-3 w-56 bg-slate-300 rounded-sm md:rounded-none md:bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col place-self-start gap-4 mt-6 md:mt-4 w-11/12 md:w-full">
          <div className="flex justify-between">
            <div className="h-5 w-40 bg-slate-300 rounded-sm md:rounded-none md:bg-slate-800 md:w-44"></div>
            <h1 className="text-green-500 font-bold">2.3 SOL</h1>
          </div>
          <div className="mb-3 h-3 w-24 bg-slate-300 rounded-sm md:rounded-none md:bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col place-self-start gap-4 mt-6 md:mt-4 w-11/12 md:w-full">
          <div className="flex justify-between">
            <div className="h-5 w-28 bg-slate-300 rounded-sm md:rounded-none md:bg-slate-800"></div>
            <h1 className="text-green-500 font-bold">12 USDT</h1>
          </div>
          <div className="mb-3 h-3 w-52 bg-slate-300 rounded-sm md:rounded-none md:bg-slate-800"></div>
        </div>
      </Card>
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
};

