import { Component } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

export interface IEvents {
	[event: string]: string;
}

export interface IActions {
	[atom: string]: (fd: IFeidaoAiMobile, ...args: unknown[]) => Promise<unknown> | unknown;
}

export interface IFeidaoAiMobile {
	readonly page: Component<NavigationInjectedProps>;
	readonly data: { [key: string]: unknown; };
	readonly local: { [key: string]: unknown; };
	readonly global: { [key: string]: unknown; };
	emit(fd: IFeidaoAiMobile, event: string, ...args: unknown[]): Promise<unknown>;
}

export type EventFunc<T> = (ev: NativeSyntheticEvent<T>) => void;

export type Action<T> = (action: string) => EventFunc<T>;

export const FD_EVENTS_STATUS_CHANGE = 'fd-events-status-change';

export const FD_EVENTS_INIT = 'fd-events-init';
export const FD_EVENTS_WILL_MOUNT = 'fd-events-will-mount';
export const FD_EVENTS_WILL_UNMOUNT = 'fd-events-will-unmount';
export const FD_EVENTS_WILL_UPDATE = 'fd-events-will-update';
export const FD_EVENTS_WILL_RECEIVE_PROPS = 'fd-events-receive-props';
export const FD_EVENTS_DID_MOUNT = 'fd-events-did-mount';
export const FD_EVENTS_DID_CATCH = 'fd-events-did-catch';
export const FD_EVENTS_DID_UPDATE = 'fd-events-did-update';

export const FD_EVENTS_DID_BLUR = 'fd-events-did-blur';
export const FD_EVENTS_DID_FOCUS = 'fd-events-did-focus';
export const FD_EVENTS_WILL_BLUR = 'fd-events-will-blur';
export const FD_EVENTS_WILL_FOCUS = 'fd-events-will-focus';

export const FD_EVENTS_KEYBOARD_WILL_SHOW = 'fd-events-keyboard-will-show';
export const FD_EVENTS_KEYBOARD_DID_SHOW = 'fd-events-keyboard-did-show';
export const FD_EVENTS_KEYBOARD_WILL_HIDE = 'fd-events-keyboard-will-hide';
export const FD_EVENTS_KEYBOARD_DID_HIDE = 'fd-events-keyboard-did-hide';
export const FD_EVENTS_KEYBOARD_WILL_CHANGEFRAME = 'fd-events-keyboard-will-changeframe';
export const FD_EVENTS_KEYBOARD_DID_CHANGEFRAME = 'fd-events-keyboard-did-changeframe';

export const FD_EVENTS_BACK_PRESS = 'fd-events-back-press';

export const FD_EVENTS_ACCESSIBILITY_CHANGE = 'fd-events-accessibility-change';
export const FD_EVENTS_ACCESSIBILITY_ANNOUCEMENT_FINISHED = 'fd-events-accessibility-annoucement-finished';

export const FD_EVENTS_NET_CHANGE = 'fd-events-net-change';
