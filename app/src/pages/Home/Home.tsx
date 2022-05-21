import React, { useEffect } from "react";
import empty from "../../assets/empty.png";
import { Tab } from "@headlessui/react";
import { UserIcon, UsersIcon } from "@heroicons/react/solid";

function classNames(...classes: string[]){
    return classes.filter(Boolean).join(' ')
  }

export const Home: React.FC = () => {
  return (
    <>
      <div className="p-5 pt-12 flex justify-between items-center">
        <h1 className="text-4xl font-medium">Transaction Feed</h1>
        
        <div className="bg-gray-300 rounded-xl">
        <Tab.Group>
          <Tab.List className="w-40 flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab key="friends" className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700',
                  'ring-white ring-opacity-60 focus:outline-none',
                  selected
                    ? 'bg-white shadow'
                    : 'hover:bg-gray-200'
                )
              }>
                  <UsersIcon className="w-6 mx-auto"/>
              </Tab>
            <Tab key="individual" className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700',
                  'ring-white ring-opacity-60 focus:outline-none',
                  selected
                    ? 'bg-white shadow'
                    : 'hover:bg-gray-200'
                )
              }><UserIcon className="w-6 mx-auto"/></Tab>
          </Tab.List>
        </Tab.Group>
        </div>
      </div>

      <div className="mt-36 flex justify-start items-center h-screen flex-col gap-16">
        <img src={empty} alt="" className="w-2/6" />
        <h1 className="text-2xl text-gray-500">
          Ready for takeoff. Start exploring the Solr system by making your
          first payment.
        </h1>
      </div>
    </>
  );
};