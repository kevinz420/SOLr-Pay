import React from "react";
import { UserIcon, PlusCircleIcon } from "@heroicons/react/solid";
import { Button } from "./Button";
import { Card } from "./Card";

interface FormProps {}

export const Form: React.FC<FormProps> = ({}) => {
  return (
    <div className="pt-14 flex gap-3 bg-gray-800 w-1/2 h-3/5 items-center rounded-xl flex-col">
      <div className="flex gap-10 mb-8 justify-center items-start">
        <div className="flex justify-center items-center">
          <label className="rounded-full flex flex-col justify-center items-center bg-gray-700 border-2 border-gray-300 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col justify-center items-center relative">
              <UserIcon className="m-3 w-20 h-20 text-gray-50" />
              <PlusCircleIcon className="absolute bottom-0 left-20 w-8 h-8 text-slate-50" />
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>

        <div className="w-2/5">
          <input
            className=" border-b-2 bg-gray-800 border-slate-500 text-white text-3xl font-bold placeholder:text-white mb-5 block outline-0 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="username"
            required
          />
          <Button>Create Account</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-48 bg-slate-800"></div>
            <h1 className="text-green-500 font-bold">3.8 SOL</h1>
          </div>
          <div className="h-3 w-32 bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-36 bg-slate-800"></div>
            <h1 className="text-red-500 font-bold">-1 SOL</h1>
          </div>
          <div className="h-3 w-56 bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-44 bg-slate-800"></div>
            <h1 className="text-green-500 font-bold">2.3 SOL</h1>
          </div>
          <div className="h-3 w-20 bg-slate-800"></div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 mt-3">
          <div className="flex justify-between">
            <div className="h-5 w-44 bg-slate-800"></div>
            <h1 className="text-green-500 font-bold">0.5 SOL</h1>
          </div>
          <div className="h-3 w-20 bg-slate-800"></div>
        </div>
      </Card>
    </div>
  );
};
