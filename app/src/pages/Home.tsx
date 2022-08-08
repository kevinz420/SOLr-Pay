import React, { useEffect, useState } from "react";
import empty from "../assets/empty.png";
import { Tab } from "@headlessui/react";
import { GlobeIcon, UsersIcon } from "@heroicons/react/solid";
import { TxnType } from "../interfaces/types";
import { Card } from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/app/hooks";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import getTxns from "../utils/get-txns";
import { PublicKey } from "@solana/web3.js";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Home: React.FC = () => {
  const [txns, setTxns] = useState<TxnType[]>([]);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    (async () => {
      setTxns(await getTxns(wallet, connection));
    })();
  }, [wallet.connected]);

  return (
    <div className="h-screen">
      <div className="flex flex-col items-center gap-3 md:bg-gray-800 py-16 rounded-t-xl mt-20 w-3/4 mx-auto h-full">
        <div className="flex justify-between w-3/4 mb-8">
          <h1 className="text-4xl font-medium text-white">Transaction Feed</h1>

          <div className="bg-gray-700 rounded-xl">
            <Tab.Group
              onChange={async (index) => {
                index === 0
                  ? setTxns(await getTxns(wallet, connection))
                  : setTxns(
                      await getTxns(
                        wallet,
                        connection,
                        user.friends.map((f) => new PublicKey(f))
                      )
                    );
              }}
            >
              <Tab.List className="w-36 flex space-x-1 rounded-xl bg-gray-900/20 p-1">
                <Tab
                  key="global"
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                      "ring-white ring-opacity-60 focus:outline-none",
                      selected ? "bg-gray-900 shadow" : "hover:bg-gray-800"
                    )
                  }
                >
                  <GlobeIcon className="w-5 mx-auto text-white" />
                </Tab>
                <Tab
                  key="friends"
                  className={({ selected }) =>
                    classNames(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                      "ring-white ring-opacity-60 focus:outline-none",
                      selected ? "bg-gray-900 shadow" : "hover:bg-gray-800"
                    )
                  }
                  disabled={!wallet.connected}
                >
                  <UsersIcon className="w-5 mx-auto text-white" />
                </Tab>
              </Tab.List>
            </Tab.Group>
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
                      className="w-12 h-12 rounded-full"
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
          <div className="my-16 flex justify-start items-center flex-col gap-16 w-1/2 text-center">
            <img src={empty} alt="" className="w-1/2" />
            <h1 className="text-2xl text-gray-500">
              Ready for takeoff. Start exploring the Solr System by making your
              first payment.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
