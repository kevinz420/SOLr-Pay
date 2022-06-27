import React, { useRef, useState } from "react";
import { Button } from "../../../components/Button";
import ufo from "../../../assets/ufo.png";
import { SwitchHorizontalIcon } from "@heroicons/react/solid";

interface DetailProps {}

export const Detail: React.FC<DetailProps> = ({}) => {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<"SOL" | "USD">("SOL")
  const [validate, setValidate] = useState(false);

  const handleSubmit = () => {
    // if (image === "" || username.current!.value === "") {
    //   setValidate(true);
    //   return
    // }
    // create accounts
  };

  return (
    <div className="rounded-xl p-10 mt-20 flex justify-start items-center gap-5 bg-gray-800 w-4/12 flex-col h-fit">
      <img src={ufo} className="w-20" />

      <div className="flex justify-start items-center flex-col">
        <input
          onChange={event => setAmount(event.target.value)}
          className="w-full text-center bottom-0 bg-gray-800  text-white text-5xl font-bold placeholder:text-gray-600 block outline-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={(currency === "SOL" ? "◎" : "$") + "0.00"}
          required
        />

        <button className="w-1/3 h-6 bg-gray-900 rounded-2xl cursor-pointer mb-3 mt-1 text-center text-gray-300 font-semibold" onClick={() => setCurrency(currency === "SOL" ? "USD" : "SOL")}>{currency}</button>

        <textarea
          id="message"
          rows={2}
          className="block p-3 text-lg text-white bg-transparent rounded-lg outline-0 resize-none w-full text-center"
          placeholder="What's it for?"
        ></textarea>
      </div>
      <Button color="secondary" className="w-3/5">
        Pay {(currency === "SOL" ? "◎" : "$") + amount}
      </Button>
    </div>
  );
};
