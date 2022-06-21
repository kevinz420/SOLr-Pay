import React, { useRef, useState } from "react";
import { Button } from "../../../components/Button";
import ufo from "../../../assets/ufo.png"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface DetailProps {}

export const Detail: React.FC<DetailProps> = ({}) => {
  const amount = useRef<HTMLInputElement>(null);
  const [validate, setValidate] = useState(false);

  const handleSubmit = () => {
    // if (image === "" || username.current!.value === "") {
    //   setValidate(true);
    //   return
    // }
    // create accounts
  };

  return (
    <div className="rounded-xl p-8 mt-20 flex justify-start items-center gap-10 bg-gray-800 w-4/12 flex-col h-fit">
      <img src={ufo} className="w-20" />

      <div className="w-3/5">
        <input
          ref={amount}
          className={classNames(
            validate && amount.current!.value === ""
              ? "border-red-400"
              : "border-slate-500",
            "text-center border-b-2 bg-gray-800  text-white text-3xl font-bold placeholder:text-gray-600 mb-5 block outline-0 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          )}
          placeholder="0 SOL"
          required
        />
      </div>
      
      <textarea
        id="message"
        rows={3}
        className="block p-3 text-med text-white bg-gray-700 rounded-lg outline-0 resize-none w-11/12"
        placeholder="What's it for?"
      ></textarea>

      <Button color="secondary" className="w-3/5">
        Send
      </Button>
    </div>
  );
};
