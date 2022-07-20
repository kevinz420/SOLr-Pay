import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import planet from "../assets/planet.png";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserAddIcon,
  UserRemoveIcon,
  DuplicateIcon,
} from "@heroicons/react/solid";
import getWallet from "../utils/get-wallet";
import getUsername from "../utils/get-user";
import follow from "../utils/follow";
import unfollow from "../utils/unfollow";
import { update } from "../redux/features/user-slice";
import getFriends from "../utils/get-friends";
import getTxns from "../utils/get-txns";
import { TxnType } from "../interfaces/types";
import { Card } from "../components/Card";

export const Profile: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const wallet = useWallet();
  const [profile, setProfile] = useState({
    username: user.username,
    pfpURL: user.pfpURL,
    pk: wallet.publicKey,
  });
  const [friend, setFriendInfo] = useState({
    count: user.friends.length,
    isFriend: false,
  });
  const [toast, setToast] = useState({
    visible: false,
    isSuccess: true,
    text: "",
  });
  const [txns, setTxns] = useState<TxnType[]>([]);
  const { connection } = useConnection();
  const { handle } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // logic for settings a profile page's username and pfp URL
  const setInfo = async () => {
    if (!wallet.connected) return;
    if (handle === user.username) {
      setProfile({
        username: user.username,
        pfpURL: user.pfpURL,
        pk: wallet.publicKey,
      });
      setFriendInfo({ count: user.friends.length, isFriend: false });
      setTxns(await getTxns(wallet, connection, [wallet.publicKey!]));
      return;
    }

    try {
      const nameState = await getUsername(wallet, connection, handle!);
      const pubkey = nameState.address;

      (async () => {
        setTxns(await getTxns(wallet, connection, [pubkey]));
      })();
      const walletState = await getWallet(wallet, connection, pubkey);
      const count = walletState.friendCount ;
      const pfpURL = `https://ipfs.infura.io/ipfs/${(
        walletState.pfpCid 
      ).toString()}`;
      setProfile({
        username: walletState.username,
        pfpURL,
        pk: pubkey,
      });
      setFriendInfo({
        count,
        isFriend: user.friends.some((f) => f.pubkey === pubkey.toString()),
      });
    } catch {
      // if username does not exist
      navigate("/doesnotexist");
    }
  };

  // calls follow ix and updates friends state
  const updateFriends = async () => {
    const walletState = await getWallet(wallet, connection, wallet.publicKey!);
    const friendState = await getFriends(
      wallet,
      connection,
      walletState.friendCount ,
      wallet.publicKey!
    );
    const friends = await Promise.all(
      friendState.friends.map(async (f) => {
        const walletState = await getWallet(wallet, connection, f);
        return {
          pubkey: f.toString(),
          username: walletState.username ,
          pfpURL: `https://ipfs.infura.io/ipfs/${(
            walletState.pfpCid 
          ).toString()}`,
        };
      })
    );

    dispatch(update({ username: user.username, pfpURL: user.pfpURL, friends }));
  };

  // runs `setInfo` on page load
  useEffect(() => {
    (async () => {
      await setInfo();
    })();
  }, [wallet.connected, handle, user.friends]);

  return (
    <div className="h-screen">
      <div className="rounded-t-xl p-8 py-16 my-20 h-full flex justify-start items-center gap-5 bg-gray-800 w-3/4 mx-auto flex-col">
        <div className="flex gap-12 mb-14">
          <img
            src={profile.pfpURL}
            className="rounded-full w-36 h-36 outline outline-white"
          />
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-4xl text-white">
                {profile.username}
              </h1>
              <h2 className="text-white font-semibold bg-slate-700 p-1 rounded-xl w-28 h-8 text-center">
                {friend.count === 1 ? "1 Friend" : `${friend.count} Friends`}
              </h2>
            </div>

            <p className="mt-2 mb-8 text-gray-400  mr-36 flex gap-3">
              {profile.pk?.toString().slice(0, 13) +
                "..." +
                profile.pk?.toString().slice(-13)}
              <DuplicateIcon
                className="w-5 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(profile.pk!.toString());
                  setToast({
                    visible: true,
                    isSuccess: true,
                    text: "Copied to clipboard.",
                  });
                }}
              />
            </p>
            <div className="grid grid-cols-2 gap-5">
              {handle === user.username ? (
                <Button
                  color="primary"
                  onClick={() => {
                    navigate("/settings");
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  {friend.isFriend ? (
                    <Button
                      color="secondary"
                      onClick={async () => {
                        try {
                          await unfollow(profile.pk!, wallet, connection);
                          setToast({
                            visible: true,
                            isSuccess: true,
                            text: "Friend successfully removed.",
                          });
                        } catch {
                          setToast({
                            visible: true,
                            isSuccess: false,
                            text: "Please try again.",
                          });
                        }
                        await updateFriends();
                      }}
                    >
                      Unfriend <UserRemoveIcon className="h-5 text-gray-200" />
                    </Button>
                  ) : (
                    <Button
                      color="secondary"
                      onClick={async () => {
                        try {
                          await follow(profile.pk!, wallet, connection);
                          setToast({
                            visible: true,
                            isSuccess: true,
                            text: "Friend successfully added.",
                          });
                        } catch {
                          setToast({
                            visible: true,
                            isSuccess: false,
                            text: "Please try again.",
                          });
                        }
                        await updateFriends();
                      }}
                    >
                      Add Friend <UserAddIcon className="h-5 text-gray-200" />
                    </Button>
                  )}
                  <Button
                    color="primary"
                    onClick={() =>
                      navigate("/payment", { state: { user: profile } })
                    }
                  >
                    Pay or Request
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {txns.length > 0 ? (
          <div className="w-full flex flex-col items-center gap-3">
            {txns.map((txn) => (
              <Card>
                <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-5">
                    <img
                      src={
                        txn.payer.username === "You"
                          ? user.pfpURL
                          : txn.payer.pfpURL
                      }
                      className="w-12 h-12 rounded-full mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 ">
                        <h2 className="">
                          <b
                            onClick={() =>
                              navigate(
                                `/users/${
                                  txn.payer.username === "You"
                                    ? user.username
                                    : txn.payer.username
                                }`
                              )
                            }
                            className="cursor-pointer"
                          >
                            {txn.payer.username.charAt(0).toUpperCase() +
                              txn.payer.username.slice(1)}
                          </b>{" "}
                          paid{" "}
                          <b
                            onClick={() =>
                              navigate(
                                `/users/${
                                  txn.payee.username === "You"
                                    ? user.username
                                    : txn.payee.username
                                }`
                              )
                            }
                            className="cursor-pointer"
                          >
                            {txn.payee.username.charAt(0).toUpperCase() +
                              txn.payee.username.slice(1)}
                          </b>
                        </h2>
                        <p className="text-sm text-gray-300">• {txn.time}</p>
                      </div>
                      <h1 className="text-lg">{txn.content}</h1>
                    </div>
                  </div>

                  <h1
                    className={`font-bold ${
                      txn.payer.username === "You"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {txn.amount.toFixed(2)} SOL
                  </h1>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 my-20">
            <img src={planet} className="h-52" />

            <h1 className="text-2xl text-gray-400">
              Looks like there are no signs of life detected 😔
            </h1>
          </div>
        )}
      </div>
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
};
