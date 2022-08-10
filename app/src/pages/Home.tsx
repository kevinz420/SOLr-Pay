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
    <div className="min-h-screen">
      <div className="flex flex-col items-center gap-0 py-0 rounded-t-xl w-screen mx-0 h-full md:gap-3 md:w-3/4 md:mx-auto md:py-16 md:mt-20 md:bg-gray-800">
        <div className="flex flex-col justify-between w-full items-center md:mb-10 md:w-3/4 md:flex-row">
          <h1 className="hidden font-body text-4xl pb-0 font-medium text-white md:block">Transaction Feed</h1>
          <div className="w-full bg-transparent flex justify-center items-center h-16 md:p-0 md:h-fit md:block md:w-fit">
            <div className="rounded-xl w-11/12 md:w-auto md:bg-gray-700">
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
                <Tab.List className="w-full flex space-x-1 rounded-xl p-1 bg-gray-600/25 md:bg-gray-900/20 md:w-36">
                  <Tab
                    key="global"
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-lg py-1 text-sm font-medium leading-5 md:py-2.5",
                        "ring-white ring-opacity-60 focus:outline-none",
                        selected ? "bg-gray-100 md:bg-gray-900 shadow" : "hover:bg-gray-800"
                      )
                    }
                  >
                    <GlobeIcon className="w-5 mx-auto text-gray-900 md:text-white" />
                  </Tab>
                  <Tab
                    key="friends"
                    className={({ selected }) =>
                      classNames(
                        "w-full rounded-lg text-sm font-medium leading-5 py-1 md:py-2.5",
                        "ring-white ring-opacity-60 focus:outline-none",
                        selected ? "bg-gray-100 md:bg-gray-900 shadow" : "hover:bg-gray-800"
                      )
                    }
                    disabled={!wallet.connected}
                  >
                    <UsersIcon className="w-5 mx-auto text-gray-900 md:text-white" />
                  </Tab>
                </Tab.List>
              </Tab.Group>
            </div>
          </div>
          
        </div>
        {txns.length > 0 ? (
          <div className="w-full flex flex-col items-center gap-0 bg-gray-100 md:bg-transparent md:gap-3">
            {txns.map((txn) => (
              <Card>
                <div className="flex justify-between mt-4">
                  <div className="flex items-start gap-5 md:items-center">
                    <img
                      src={
                        txn.payer.username === "You"
                          ? user.pfpURL
                          : txn.payer.pfpURL
                      }
                      className="w-12 h-12 rounded-full outline outline-1 outline-gray-500 md:outline-gray-300"
                    />
                    <div>
                      <div className="flex gap-1.5 flex-col items-start md:items-center md:flex-row">
                        <h2 className="text-gray-800 md:text-current">
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
                        <p className="text-sm text-gray-300 hidden md:block">• {txn.time}</p>
                        <p className="text-xs text-gray-700 block md:hidden pb-2"> {txn.time}</p>
                      </div>
                      <h1 className="text-gray-800 text-sm md:text-current md:text-lg">{txn.content}</h1>
                    </div>
                  </div>

                  <h1
                    className={`pr-6 text-sm font-bold md:pr-0 md:text-base ${
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
          <div className="my-16 flex justify-start items-center flex-col gap-8 w-1/2 text-center md:gap-16">
            <img src={empty} alt="" className="w-full md:w-1/2" />
            <h1 className="md:text-2xl text-gray-500">
              Ready for takeoff. Start exploring the Solr System by making your
              first payment.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};
