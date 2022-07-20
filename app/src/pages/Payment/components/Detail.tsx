import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/Button";
import ufo from "../../../assets/ufo.png";
import { Toast } from "../../../components/Toast";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ProfileType } from "../../../interfaces/types";
import getUser from "../../../utils/get-user";
import pay from "../../../utils/pay";

interface DetailProps {
  user: ProfileType;
  setUser: React.Dispatch<React.SetStateAction<ProfileType>>;
}

export const Detail: React.FC<DetailProps> = (props) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"SOL" | "USD">("USD");
  const [address, setAddress] = useState("");
  const [toast, setToast] = useState({
    visible: false,
    isSuccess: true,
    text: "",
  });
  const note = useRef<HTMLTextAreaElement>(null);

  const wallet = useWallet();
  const { connection } = useConnection();

  const convertPrice = async (amount: string) => {
    if (currency === "USD") {
      const response = await fetch(
        "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDC"
      );
      const data = await response.json();
      return parseFloat(amount) / parseFloat(data.price);
    }

    return parseFloat(amount);
  };

  const handleSubmit = async () => {
    if (
      amount === "" ||
      props.user.username === "" ||
      note.current!.value === ""
    ) {
      setToast({
        visible: true,
        isSuccess: false,
        text: "Oops! A required field is missing.",
      });
      return;
    }

    try {
      await pay(
        await convertPrice(amount),
        note.current!.value,
        new PublicKey(address),
        wallet,
        connection
      );
      setToast({ visible: true, isSuccess: true, text: "Payment successful." });
    } catch {
      setToast({
        visible: true,
        isSuccess: false,
        text: "Payment failed. Please try again.",
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (props.user.username === "") return;

      const data = await getUser(wallet, connection, props.user.username);
      setAddress((data.address).toString());
    })();
  }, [props.user.username]);

  return (
    <div className="rounded-xl p-10 mt-20 flex justify-start items-center gap-3 bg-gray-800 w-4/12 flex-col h-fit">
      <img
        src={props.user.username === "" ? ufo : props.user.pfpURL}
        className="w-20 rounded-full"
      />
      <h1 className="text-2xl text-white font-medium">{props.user.username}</h1>
      <p className="text-gray-400 mb-5">
        {address.slice(0, 9) + "..." + address.slice(-9)}
      </p>

      <div className="flex justify-start items-center flex-col">
        <input
          onChange={(event) =>
            setAmount(
              event.target.value.match(/^\d{1,}(\.\d{0,4})?$/)
                ? event.target.value
                : amount
            )
          }
          className="w-full text-center bottom-0 bg-gray-800  text-white text-5xl font-bold placeholder:text-gray-600 block outline-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={(currency === "SOL" ? "◎" : "$") + "0.00"}
          required
        />

        <button
          className="w-1/3 h-6 bg-gray-900 rounded-2xl cursor-pointer mb-3 mt-1 text-center text-gray-300 font-semibold"
          onClick={() => setCurrency(currency === "SOL" ? "USD" : "SOL")}
        >
          {currency}
        </button>

        <textarea
          id="message"
          rows={3}
          className="block p-3 text-lg text-white bg-transparent rounded-lg outline-0 resize-none w-full text-center"
          placeholder="What's it for?"
          ref={note}
        ></textarea>
      </div>
      <Button color="secondary" className="w-3/5" onClick={handleSubmit}>
        Pay {(currency === "SOL" ? "◎" : "$") + amount}
      </Button>
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
};
