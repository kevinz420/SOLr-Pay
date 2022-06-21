import React, { useState, useRef } from "react";
import { UserIcon, PlusCircleIcon } from "@heroicons/react/solid";
import { Button } from "./Button";
import { Card } from "./Card";
import { useAppDispatch, useAppSelector } from '../redux/app/hooks'
import { useNavigate } from "react-router-dom";
import { update } from "../redux/features/user-slice";

import initialize from "../utils/initialize";
import getWallet from "../utils/get-wallet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { create } from "ipfs-http-client";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface FormProps {
  submitText: string; // submit button text
  initialize: boolean; // T/F depending on whether the form is being used to initialize or to modify profile
}

export const Form: React.FC<FormProps> = (props) => {
  const user = useAppSelector((state) => state.user)
  const [image, setImage] = useState(user.pfpURL);
  const [validate, setValidate] = useState(false);
  const username = useRef<HTMLInputElement>(null);
  
  const wallet = useWallet()
  const connection = useConnection()
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const client = create({url: 'https://ipfs.infura.io:5001/api/v0'});

  // sets preview image with uploaded file
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    var file = e.target.files[0];
    var img = URL.createObjectURL(file);

    setImage(img);
  };

  // logic for creating/updating profile information
  const handleSubmit = async () => {
    if (image === "" || username.current!.value === "") {
      setValidate(true); // ensures both image and username fields are filled
      return
    }

    try {
      let pfpURL

      if (props.initialize) {
        let file = await fetch(image).then(r => r.blob()).then(blobFile => new File([blobFile], "pfp", { type: "image/png" }))
        const created = await client.add(file)
        pfpURL = `https://ipfs.infura.io/ipfs/${created.path}`
        await initialize(username.current!.value, Buffer.from(created.path), wallet, connection.connection)
      } else {
        pfpURL = ""
      }

      // update username/pfp stored in redux
      const walletState = await getWallet(wallet, connection.connection);
      dispatch(update({ username: walletState.username as string, pfpURL}));
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="py-14 flex gap-3 bg-gray-800 w-1/2 items-center rounded-xl flex-col h-max">
      <div className="flex gap-10 mb-8 justify-center items-start">
        <div className="flex justify-center items-center">
          <label className={classNames(validate && image === "" ? "border-4 border-red-400" : "border-2 border-gray-300", "w-28 h-28 rounded-full flex flex-col justify-center items-center bg-gray-700  cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600")}>
            <div className="flex flex-col justify-center items-center relative">
              {image === "" ? (
                <>
                  <UserIcon className="m-3 w-16 h-20 text-gray-50" />
                  <PlusCircleIcon className={classNames(validate && image === "" ? "text-red-400" : "text-slate-50", "absolute bottom-1 left-20 w-8 h-8")} />
                </>
              ) : (
                <img src={image} className="rounded-full w-28 h-28 object-cover" />
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

        <div className="w-2/5">
          <input
            ref={username}
            className={classNames(validate && username.current!.value === "" ? "border-red-400" : "border-slate-500", "border-b-2 bg-gray-800  text-white text-3xl font-bold placeholder:text-white mb-5 block outline-0 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500")}
            placeholder="username"
            defaultValue={user.username}
            required
          />
          <Button color="primary" onClick={handleSubmit}>{props.submitText}</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-48 bg-slate-800"></div>
            <h1 className="text-green-500 font-bold">38 USDC</h1>
          </div>
          <div className="mb-3 h-3 w-32 bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-36 bg-slate-800"></div>
            <h1 className="text-red-500 font-bold">-1 SOL</h1>
          </div>
          <div className="mb-3 h-3 w-56 bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-44 bg-slate-800"></div>
            <h1 className="text-green-500 font-bold">2.3 SOL</h1>
          </div>
          <div className="mb-3 h-3 w-20 bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-44 bg-slate-800"></div>
            <h1 className="text-green-500 font-bold">12 USDT</h1>
          </div>
          <div className="mb-3 h-3 w-20 bg-slate-800"></div>
        </div>
      </Card>
    </div>
  );
};
