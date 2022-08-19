import React from "react";
import { Form } from "../components/Form";

export const Settings: React.FC = () => {
  return (
    <div className="flex items-center mt-10 flex-col min-h-screen md:mt-20">
      <h1 className="text-5xl font-bold font-body text-gray-700 text-center pb-6 md:pb-0">⚙️Edit Profile</h1>
      <p className="hidden text-center px-4 pt-3 pb-16 md:block">
        Customize your profile by changing your username and/or profile picture.
      </p>
      <Form submitText="Save Changes" initialize={false} />
    </div>
  );
};
