import { Combobox, Transition } from "@headlessui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProfileType } from "../interfaces/types";
import { useAppSelector } from "../redux/app/hooks";
import getUsers from "../utils/get-users";
import getWallet from "../utils/get-wallet";

interface InputProps {
  placeholder: string;
  onSelect: (user: ProfileType) => void;
  isPayment: boolean;
  children?: React.ReactNode;
  setItems?: React.Dispatch<React.SetStateAction<ProfileType[]>>;
}

export const Input: React.FC<InputProps> = (props) => {
  const [items, setItems] = useState([{ username: "", pfpURL: "" }]);
  const [selected, setSelected] = useState(items[0]);
  const [query, setQuery] = useState("");
  const user = useAppSelector((state) => state.user);
  const filteredItems =
    query === ""
      ? user.friends.map(f => { return {username: f.username, pfpURL: f.pfpURL}})
      : items.filter((item) =>
          item.username
            .toLowerCase()
            .replace(/\s+/g, "")
            .startsWith(query.toLowerCase().replace(/\s+/g, ""))
        );

  const wallet = useWallet();
  const { connection } = useConnection();
  let location = useLocation();

  // utility function to check if input is valid PK
  const isPK = (input: string) => {
    try {
      let pubkey = new PublicKey(input);
      let isSolana = PublicKey.isOnCurve(pubkey.toBuffer());
      return isSolana;
    } catch (error) {
      return false;
    }
  };

  // populates `items` with all Solr Pay users
  useEffect(() => {
    if (!wallet.connected) return;

    (async () => {
      const users = await getUsers(wallet, connection);
      setItems(
        users.map((user) => {
          return {
            username: user.account.username as string,
            pfpURL: `https://ipfs.infura.io/ipfs/${(
              user.account.pfpCid as Uint8Array
            ).toString()}`,
          };
        })
      );
    })();
  }, [wallet.connected]);

  useEffect(() => {
    if (selected.username === "") return;

    props.onSelect(selected);
    if (props.setItems) props.setItems(filteredItems);
  }, [selected.username]);

  // converts query by pubkey into query by username
  useEffect(() => {
    if (query.length < 32 || !isPK(query)) return;

    (async () => {
      const walletState = await getWallet(
        wallet,
        connection,
        new PublicKey(query)
      );
      setQuery(walletState.username as string);
    })();
  }, [query]);

  // clears selected user after navigation
  useEffect(() => {
    setSelected({ username: "", pfpURL: "" });
  }, [location.pathname]);

  return (
    <div className="relative">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-gray-700 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className={`w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-gray-700 placeholder-gray-400 text-white outline-0 focus:ring-0 ${
                props.children ? "pl-10" : "pl-3"
              }`}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={props.placeholder}
              displayValue={(item) => (item as any).username}
            />
          </div>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              className={`absolute mt-2 w-full overflow-auto rounded-md ${
                props.isPayment
                  ? "bg-gray-800 !shadow-none h-[34rem] mt-8"
                  : "bg-gray-600 max-h-96"
              } text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10 scrollbar-hide`}
            >
              {filteredItems.length === 0 && query !== "" ? (
                props.isPayment ? (
                  <div className="my-64">
                    <h1 className="text-xl text-gray-400 text-center font-semibold">
                      We couldn't find any matches
                    </h1>
                    <div className="text-ned text-gray-400 text-center">
                      We couldn't find any matching profiles. Try using a
                      username or wallet address.
                    </div>
                  </div>
                ) : (
                  <div className="relative cursor-pointer select-none py-2 px-4 text-white">
                    No items found.
                  </div>
                )
              ) : (
                filteredItems.map((item) => (
                  <Combobox.Option
                    key={item.username}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-5 pr-4 text-white ${
                        active ? "bg-gray-700" : ""
                      } ${props.isPayment ? "bg-gray-900 mb-3 rounded-xl" : ""}`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`truncate flex items-center gap-4 ${
                            selected ? "font-semibold" : "font-medium"
                          }`}
                        >
                          <img
                            src={item.pfpURL}
                            className="h-10 rounded-full"
                          />
                          {item.username}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <div className="flex absolute inset-y-0 left-0 items-center pl-3">
        {props.children}
      </div>
    </div>
  );
};
