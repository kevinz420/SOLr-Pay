import { useWallet } from '@solana/wallet-adapter-react';
import React, { FC, MouseEventHandler, useCallback } from 'react';
import { BaseButton as Button, BaseButtonProps } from './BaseButton';
import { LogoutIcon } from '@heroicons/react/outline';

export const DisconnectButton: FC<BaseButtonProps> = ({ disabled, onClick, ...props }) => {
    const { wallet, disconnect, disconnecting } = useWallet();

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        (event) => {
            if (onClick) onClick(event);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            if (!event.defaultPrevented) disconnect().catch(() => {});
        },
        [onClick, disconnect]
    );

    return (
        <Button
            disabled={disabled || !wallet}
            onClick={handleClick}
            icon={<LogoutIcon className='text-gray-300 h-9 w-9'/>}
            {...props}
        />
    );
};