import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { SwitchHorizontalIcon } from "@heroicons/react/solid";
import { Button } from "./Button";
import logo from "../assets/logo.svg";
import pfp from "../assets/pfp.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useAppSelector, useAppDispatch } from '../redux/app/hooks'
import { update } from '../redux/features/user-slice'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const wallet = useWallet();
  const user = useAppSelector((state) => state.user)

  const getUser = () => {
    // find wallet PDA to extract username and pfp CID
    // convert CID into IPFS URL
    return wallet.connected ? {username: "bluebear", pfpURL: pfp} : {username: "", pfpURL: ""}
  }

  useEffect(() => {
    const user = getUser();
    dispatch(update(user))
  }, [wallet])
  
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="max-w-screen-xl mx-auto h-20 flex p-4 items-center justify-between">
        <Link to="/" className="h-full w-32">
          <img src={logo} alt="" className="h-full" />
        </Link>

        <div className="flex gap-8 text-white font-semibold">
          <Link to="/" className="h-full">
            Docs
          </Link>
          <Link to="/" className="h-full">
            Support
          </Link>
          <Link to="/" className="h-full">
            Twitter
          </Link>
        </div>

        <form className="w-2/5">
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block h-10 pl-10 w-full text-sm rounded-md border-none bg-gray-700 placeholder-gray-400 text-white outline-0 shadow-inner focus:shadow-gray-500"
              placeholder="Search for usernames, wallet addresses..."
            />
          </div>
        </form>

        {wallet.connected ? (
          <div className="flex gap-2 items-center">
            <Button color="primary" onClick={() => {navigate('/welcome')}}>
              <SwitchHorizontalIcon className="h-5 text-gray-300" />
              Send/Request
            </Button>

            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <img className="h-10 w-10 rounded-full" src={user.pfpURL} alt="" />
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
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`/${user.username}`}
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
                          active ? "bg-gray-100" : "",
                          "block px-4 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                        )}
                      />
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ) : (
          <WalletMultiButton />
        )}
      </div>
    </Disclosure>
  );
};
