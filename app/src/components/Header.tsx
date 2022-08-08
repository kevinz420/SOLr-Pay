import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { SwitchHorizontalIcon } from "@heroicons/react/solid";
import { Button } from "./Button";
import logo from "../assets/logo.svg";
import ufo from "../assets/ufo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";
import { update } from "../redux/features/user-slice";
import { Input } from "./Input";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import getWallet from "../utils/get-wallet";
import getFriends from "../utils/get-friends";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  const { connection } = useConnection();
  const user = useAppSelector((state) => state.user);

  // logic for getting a users username and pfp URL
  const getUser = async () => {
    if (!wallet.connected) return { username: "", pfpURL: "", friends: [] };

    try {
      const walletState = await getWallet(wallet, connection);
      const friendState = await getFriends(
        wallet,
        connection,
        wallet.publicKey!
      );
      const pfpURL = `https://ipfs.infura.io/ipfs/${(
        walletState.pfpCid
      ).toString()}`;
      const friends = await Promise.all(
        (friendState.friends).map(async (f) => {
          const walletState = await getWallet(wallet, connection, f);
          return {
            pubkey: f.toString(),
            username: walletState.username,
            pfpURL: `https://ipfs.infura.io/ipfs/${(
              walletState.pfpCid
            ).toString()}`,
          };
        })
      );

      return { username: walletState.username, pfpURL, friends };
    } catch {
      // if new user we set empty strings for username and pfp
      navigate("/welcome");
      return { username: "", pfpURL: "", friends: [] };
    }
  };

  // runs `getUser` on wallet change
  useEffect(() => {
    (async () => {
      const data = await getUser();
      dispatch(update(data));
    })();
  }, [wallet.connected]);

  return (
    <Disclosure as="nav" className="w-screen bg-gray-800">
      <div className="max-w-screen-xl mx-auto h-20 flex p-4 items-center justify-between">
        <Link to="/" className="h-full w-28">
          <img src={logo} alt="" className="h-full" />
        </Link>

        <div className="hidden xl:flex gap-8 text-white font-semibold">
          <Link to="/" className="h-full hover:text-gray-200">
            Docs
          </Link>
          <Link to="/" className="h-full hover:text-gray-200">
            Support
          </Link>
          <Link to="/" className="h-full hover:text-gray-200">
            Twitter
          </Link>
        </div>

        <form className="hidden w-2/5 md:block">
          <Input
            placeholder="Search for usernames, wallet addresses..."
            onSelect={(user) => navigate(`/users/${user.username}`)}
            isPayment={false}
          >
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </Input>
        </form>

        {wallet.connected ? (
          <div className="flex gap-2.5 items-center">
            <Button
              color="primary"
              className="hidden md:flex"
              onClick={() => {
                navigate("/payment");
              }}
            >
              <SwitchHorizontalIcon className="h-5 text-gray-300" />
              <p className="hidden exsm:block">Send/Request</p>
            </Button>

            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <Link className="w-10 h-10 absolute md:hidden" to={`/users/${user.username}`}/>
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.pfpURL === "" ? ufo : user.pfpURL}
                    alt=""
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="hidden md:block origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`/users/${user.username}`}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <WalletDisconnectButton
                        startIcon={undefined}
                        className={classNames(
                          active ? "!bg-gray-100" : "",
                          "!block !px-4 !text-sm !text-gray-700 !w-full !text-left hover:!bg-gray-100"
                        )}
                      />
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ) : (
          <WalletMultiButton/>
        )}
      </div>
      <form className="block w-screen pb-5 px-4 z-0 md:hidden">
          <Input
            placeholder="Search for usernames, wallet addresses..."
            onSelect={(user) => navigate(`/users/${user.username}`)}
            isPayment={false}
          >
            <svg
              className="w-5 h-5 text-gray-400 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </Input>
        </form>
    </Disclosure>
  );
};
