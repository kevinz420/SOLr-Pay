import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import planet from "../assets/planet.png";
import { useParams, useNavigate } from "react-router-dom";
import { UserAddIcon, UserRemoveIcon } from "@heroicons/react/solid";
import getWallet from "../utils/get-wallet";
import getUsername from "../utils/get-user";
import { PublicKey } from "@solana/web3.js";
import follow from "../utils/follow";
import unfollow from "../utils/unfollow";
import { update } from "../redux/features/user-slice";
import getFriends from "../utils/get-friends";

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
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
  const [toast, setToast] = useState({ visible: false, isSuccess: true, text: "" });
  const connection = useConnection();
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
      return;
    }

    try {
      const nameState = await getUsername(
        wallet,
        connection.connection,
        handle!
      );
      const pubkey = nameState.address as PublicKey;

      const walletState = await getWallet(
        wallet,
        connection.connection,
        pubkey
      );
      const count = walletState.friendCount as number;
      const pfpURL = `https://ipfs.infura.io/ipfs/${(
        walletState.pfpCid as Uint8Array
      ).toString()}`;
      setProfile({
        username: walletState.username as string,
        pfpURL,
        pk: pubkey,
      });
      setFriendInfo({
        count,
        isFriend: user.friends.includes(pubkey.toString()),
      });
    } catch {
      // if username does not exist
      navigate("/doesnotexist");
    }
  };

  // calls follow ix and updates friends state
  const updateFriends = async () => {
    const walletState = await getWallet(
      wallet,
      connection.connection,
      wallet.publicKey!
    );
    const friendState = await getFriends(
      wallet,
      connection.connection,
      walletState.friendCount as number,
      wallet.publicKey!
    );
    const friends = (friendState.friends as Array<PublicKey>).map((f) =>
      f.toString()
    );

    dispatch(update({ username: user.username, pfpURL: user.pfpURL, friends }));
  };

  // runs `setInfo` on page load
  useEffect(() => {
    (async () => {
      await setInfo();
    })()
  }, [wallet.connected, handle, user.friends]);

  return (
    <div className="min-h-screen">
      <div className="rounded-xl p-8 py-16 my-20 flex justify-start items-center gap-5 bg-gray-800 w-3/4 mx-auto flex-col">
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

            <p className="mt-2 mb-8 text-gray-400">{profile.pk?.toString()}</p>
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
                          await unfollow(
                            profile.pk!,
                            wallet,
                            connection.connection
                          );
                          setToast({ visible: true, isSuccess: true, text: "Friend successfully removed." });
                        } catch {
                          setToast({ visible: true, isSuccess: false, text: "Please try again." });
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
                          await follow(
                            profile.pk!,
                            wallet,
                            connection.connection
                          );
                          setToast({ visible: true, isSuccess: true, text: "Friend successfully added." });
                        } catch {
                          setToast({ visible: true, isSuccess: false, text: "Please try again." });
                        }
                        await updateFriends();
                      }}
                    >
                      Add Friend <UserAddIcon className="h-5 text-gray-200" />
                    </Button>
                  )}
                  <Button color="primary" onClick={() => {}}>
                    Pay or Request
                  </Button>
                </>
              )}
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
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
};
