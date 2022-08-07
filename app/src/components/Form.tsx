import React, { useState, useRef } from "react";
import { UserIcon, PlusCircleIcon } from "@heroicons/react/solid";
import { Button } from "./Button";
import { Card } from "./Card";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { update } from "../redux/features/user-slice";
import { Toast } from "../components/Toast";

import initialize from "../utils/initialize";
import getWallet from "../utils/get-wallet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { create } from "ipfs-http-client";
import getFriends from "../utils/get-friends";
import { PublicKey } from "@solana/web3.js";
import getUser from "../utils/get-user";
import editProfile from "../utils/edit-profile";

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
  const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

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
          .then((r) => r.blob())
          .then(
            (blobFile) => new File([blobFile], "pfp", { type: "image/png" })
          );
        const created = await client.add(file);
        cid = created.path;
        pfpURL = `https://ipfs.infura.io/ipfs/${created.path}`;
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
        (friendState.friends as Array<PublicKey>).map(async (f) => {
          const walletState = await getWallet(wallet, connection, f);
          return {
            pubkey: f.toString(),
            username: walletState.username as string,
            pfpURL: `https://ipfs.infura.io/ipfs/${(
              walletState.pfpCid as Uint8Array
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
        update({ username: walletState.username as string, pfpURL, friends })
      );
    } catch {
      setToast({ visible: true, isSuccess: false, text: "Please try again." });
    }
  };

  return (
    <div className="py-14 flex gap-3 bg-gray-800 w-screen items-center rounded-none flex-col h-max md:rounded-xl md:w-1/2">
      <div className="flex gap-10 mb-8 justify-center items-start">
        <div className="flex justify-center items-center">
          <label
            className={classNames(
              validate && image === ""
                ? "border-4 border-red-400"
                : "border-2 border-gray-300",
              "w-28 h-28 rounded-full flex flex-col justify-center items-center bg-gray-700  cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            )}
          >
            <div className="flex flex-col justify-center items-center relative">
              {image === "" ? (
                <>
                  <UserIcon className="m-3 w-16 h-20 text-gray-50" />
                  <PlusCircleIcon
                    className={classNames(
                      validate && image === ""
                        ? "text-red-400"
                        : "text-slate-50",
                      "absolute bottom-1 left-20 w-8 h-8"
                    )}
                  />
                </>
              ) : (
                <img
                  src={image}
                  className="rounded-full w-28 h-28 object-cover"
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

        <div className="w-2/5">
          <input
            ref={username}
            className={classNames(
              validate && username.current!.value === ""
                ? "border-red-400"
                : "border-slate-500",
              "border-b-2 bg-gray-800  text-white text-3xl font-bold placeholder:text-white mb-5 block outline-0 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            )}
            placeholder="username"
            defaultValue={user.username}
            required
          />
          <Button color="primary" onClick={handleSubmit}>
            {props.submitText}
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-32 bg-slate-800 md:w-48"></div>
            <h1 className="text-green-500 font-bold">38 USDC</h1>
          </div>
          <div className="mb-3 h-3 w-28 bg-slate-800 md:w36"></div>
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
            <div className="h-5 w-40 bg-slate-800 md:w-44"></div>
            <h1 className="text-green-500 font-bold">2.3 SOL</h1>
          </div>
          <div className="mb-3 h-3 w-24 bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-28 bg-slate-800"></div>
            <h1 className="text-green-500 font-bold">12 USDT</h1>
          </div>
          <div className="mb-3 h-3 w-52 bg-slate-800"></div>
        </div>
      </Card>
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
};
