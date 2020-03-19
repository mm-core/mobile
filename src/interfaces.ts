import { Component } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

export interface IEvents {
	[event: string]: string;
}

export interface IActions {
	[atom: string]: (mm: IAiMobile, ...args: unknown[]) => Promise<unknown> | unknown;
}

export interface IAiMobile {
	readonly page: Component<NavigationInjectedProps>;
	readonly data: { [key: string]: unknown; };
	readonly local: { [key: string]: unknown; };
	readonly global: { [key: string]: unknown; };
	emit(mm: IAiMobile, event: string, ...args: unknown[]): Promise<unknown>;
}

export type EventFunc<T> = (ev: NativeSyntheticEvent<T>) => void;

export type Action<T> = (action: string) => EventFunc<T>;

export const MM_EVENTS_STATUS_CHANGE = 'mm-events-status-change';

export const MM_EVENTS_INIT = 'mm-events-init';
export const MM_EVENTS_WILL_MOUNT = 'mm-events-will-mount';
export const MM_EVENTS_WILL_UNMOUNT = 'mm-events-will-unmount';
export const MM_EVENTS_WILL_UPDATE = 'mm-events-will-update';
export const MM_EVENTS_WILL_RECEIVE_PROPS = 'mm-events-receive-props';
export const MM_EVENTS_DID_MOUNT = 'mm-events-did-mount';
export const MM_EVENTS_DID_CATCH = 'mm-events-did-catch';
export const MM_EVENTS_DID_UPDATE = 'mm-events-did-update';

export const MM_EVENTS_DID_BLUR = 'mm-events-did-blur';
export const MM_EVENTS_DID_FOCUS = 'mm-events-did-focus';
export const MM_EVENTS_WILL_BLUR = 'mm-events-will-blur';
export const MM_EVENTS_WILL_FOCUS = 'mm-events-will-focus';

export const MM_EVENTS_KEYBOARD_WILL_SHOW = 'mm-events-keyboard-will-show';
export const MM_EVENTS_KEYBOARD_DID_SHOW = 'mm-events-keyboard-did-show';
export const MM_EVENTS_KEYBOARD_WILL_HIDE = 'mm-events-keyboard-will-hide';
export const MM_EVENTS_KEYBOARD_DID_HIDE = 'mm-events-keyboard-did-hide';
export const MM_EVENTS_KEYBOARD_WILL_CHANGEFRAME = 'mm-events-keyboard-will-changeframe';
export const MM_EVENTS_KEYBOARD_DID_CHANGEFRAME = 'mm-events-keyboard-did-changeframe';

export const MM_EVENTS_BACK_PRESS = 'mm-events-back-press';

export const MM_EVENTS_ACCESSIBILITY_CHANGE = 'mm-events-accessibility-change';
export const MM_EVENTS_ACCESSIBILITY_ANNOUCEMENT_FINISHED = 'mm-events-accessibility-annoucement-finished';

export const MM_EVENTS_NET_CHANGE = 'mm-events-net-change';
