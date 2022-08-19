import React, { CSSProperties, FC, MouseEvent, ReactElement } from 'react';

export interface BaseButtonProps {
    icon?: ReactElement;
    disabled?: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    tabIndex?: number;
    className?: string;
    style?: CSSProperties;
}

export const BaseButton: FC<BaseButtonProps> = (props) => {
    return (
        <button
            className={`${props.className || ''}`}
            disabled={props.disabled}
            onClick={props.onClick}
            tabIndex={props.tabIndex || 0}
            type="button"
        >
            {props.icon}
        </button>
    );
};
