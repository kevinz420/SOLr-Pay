import React from 'react'
import {Form} from '../components/Form'
import initialize from '../utils/initialize'

interface SignupProps {
}

export const Signup: React.FC<SignupProps> = ({}) => {
        return (<div className="flex items-center mt-28 flex-col h-screen">
            <h1 className="text-4xl font-bold text-gray-700">👋 Welcome to SOLr Pay!</h1>
            <p className="pt-3 pb-20">Create an account to start exploring the Solr System.</p>
            <Form submitText="Create Account" initialize={true}/>
        </div>);
}