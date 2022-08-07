import React from "react";
import { Form } from "../components/Form";

export const Signup: React.FC = () => {
  return (
    <div className="flex items-center mt-10 flex-col min-h-screen">
      <h1 className="text-6xl font-bold text-slate-900 font-body">  
        SOLr Pay
      </h1>
      <h1 className="text-xl font-body font-light text-slate-800 pt-3">
        New here? Let's get started.
      </h1>
      <p className="text-center px-4 pt-3 pb-10 md:pb-20">
        Create an account to start exploring the Solr System.
      </p>
      <Form submitText="Create Account" initialize={true} />
    </div>
  );
};
