import React from 'react'
import {Form} from '../components/Form'

interface SettingsProps {
}

export const Settings: React.FC<SettingsProps> = ({}) => {
    return (<div className="flex items-center mt-28 flex-col h-screen">
        <h1 className="text-4xl font-bold text-gray-700">⚙️ Edit Profile</h1>
        <p className="pt-3 pb-20">Customize your profile by changing to your username and profile picture.</p>
        <Form submitText="Save Changes" initialize={false}/>
    </div>);
}