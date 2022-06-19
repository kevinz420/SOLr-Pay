import React from 'react'
import { Search } from './components/Search'
import { Detail } from './components/Detail'

interface PaymentProps {

}

export const Payment: React.FC<PaymentProps> = ({}) => {
        return (<div className="min-h-screen flex justify-center gap-5">
            <Search/>
            <Detail/>
        </div>);
}