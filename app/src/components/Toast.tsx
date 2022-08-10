import { Transition } from "@headlessui/react";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { ToastType } from "../interfaces/types";

interface ToastProps {
  toast: ToastType;
  setToast: Dispatch<SetStateAction<ToastType>>;
}

export const Toast: React.FC<ToastProps> = (props) => {
  useEffect(() => {
    if (props.toast.visible) {
      setTimeout(() => {
        props.setToast({ visible: false, isSuccess: props.toast.isSuccess, text: props.toast.text})
      }, 5000)
    }
  }, [props.toast.visible]);

  return (
    <Transition
      className="relative md:block"
      show={props.toast.visible}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="flex items-center w-full max-w-xs p-4 mb-4 text-center rounded-lg shadow text-gray-900 bg-neutral-200 fixed top-5 md:right-8 md:bg-gray-800 md:text-gray-500 md:bottom-5 md:top-auto">
        {props.toast.isSuccess ? (
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-green-800 text-green-200">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-800 text-red-200">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        )}
        <div className="ml-3 text-sm font-normal">
          {props.toast.text}
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 text-gray-800 hover:text-white bg-neutral-200 hover:bg-gray-700 md:text-gray-500 md:bg-gray-800"
          aria-label="Close"
          onClick={() => props.setToast({ visible: false, isSuccess: props.toast.isSuccess, text: props.toast.text })}
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </Transition>
  );
};
