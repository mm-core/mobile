/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { AccessibilityAnnoucementFinishedEvent, AccessibilityChangeEvent, AccessibilityInfo, AppState, AppStateStatus, Keyboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigationHelpers } from '@react-navigation/native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { ParamList, ScreenNavigationProp } from './interfaces';

type FireMessage = (event: string, ...args: unknown[]) => Promise<unknown>;

export function init_page_events(navigation: ScreenNavigationProp | NavigationHelpers<ParamList>, fire_msg: FireMessage) {
	// this.handlers.push(add_keyboard_listener(fire_msg));
	// this.handlers.push(add_state_listener(fire_msg));
	// this.handlers.push(add_back_listener(fire_msg));
	// this.handlers.push(add_accesibility_listener(fire_msg));
	// // this.handlers.push(add_netinfo_listener(fire_msg));
	useEffect(() => {
		// common events
		const nav = navigation as StackNavigationProp<ParamList>;
		const f = nav.addListener('focus', (e) => {
			fire_msg(MM_EVENTS_INIT, e);
			fire_msg(MM_EVENTS_NAV_FOCUS, e);
		});
		const b = nav.addListener('blur', (e) => {
			fire_msg(MM_EVENTS_NAV_BLUR, e);
		});
		const s = nav.addListener('state', (e) => {
			fire_msg(MM_EVENTS_NAV_STATE, e);
		});
		return () => {
			f();
			b();
			s();
		};
	}, [fire_msg, navigation]);
	useEffect(() => {
		// stack navigator events
		const nav = navigation as StackNavigationProp<ParamList>;
		const ts = nav.addListener('transitionStart', (e) => {
			fire_msg(MM_EVENTS_NAV_TRANSITION_START, e);
		});
		const te = nav.addListener('transitionEnd', (e) => {
			fire_msg(MM_EVENTS_NAV_TRANSITION_END, e);
		});
		return () => {
			ts();
			te();
		};
	}, [fire_msg, navigation]);
	useEffect(() => {
		// tab navigator events
		const nav = navigation as BottomTabNavigationProp<ParamList>;
		const tp = nav.addListener('tabPress', (e) => {
			fire_msg(MM_EVENTS_NAV_TAB_PRESS, e);
		});
		const tl = nav.addListener('tabLongPress', (e) => {
			fire_msg(MM_EVENTS_NAV_TAB_LONG_PRESS, e);
		});
		return () => {
			tp();
			tl();
		};
	}, [fire_msg, navigation]);
	add_keyboard_listener(fire_msg);
	add_state_listener(fire_msg);
	add_accesibility_listener(fire_msg);
	add_netinfo_listener(fire_msg);
}

export function init_app_listener(fire_msg: FireMessage) {
	useEffect(() => {
		fire_msg(MM_EVENTS_INIT);
	}, [fire_msg]);
	add_state_listener(fire_msg);
	add_netinfo_listener(fire_msg);
}

/**
 * 键盘事件
 */
export function add_keyboard_listener(fire_msg: FireMessage) {
	useEffect(() => {
		const handler1 = Keyboard.addListener('keyboardWillShow', (keyboard_event) => {
			fire_msg(MM_EVENTS_KEYBOARD_WILL_SHOW, keyboard_event);
		});
		const handler2 = Keyboard.addListener('keyboardDidShow', (keyboard_event) => {
			fire_msg(MM_EVENTS_KEYBOARD_DID_SHOW, keyboard_event);
		});
		const handler3 = Keyboard.addListener('keyboardWillHide', (keyboard_event) => {
			fire_msg(MM_EVENTS_KEYBOARD_WILL_HIDE, keyboard_event);
		});
		const handler4 = Keyboard.addListener('keyboardDidHide', (keyboard_event) => {
			fire_msg(MM_EVENTS_KEYBOARD_DID_HIDE, keyboard_event);
		});
		const handler5 = Keyboard.addListener('keyboardWillChangeFrame', (keyboard_event) => {
			fire_msg(MM_EVENTS_KEYBOARD_WILL_CHANGEFRAME, keyboard_event);
		});
		const handler6 = Keyboard.addListener('keyboardDidChangeFrame', (keyboard_event) => {
			fire_msg(MM_EVENTS_KEYBOARD_DID_CHANGEFRAME, keyboard_event);
		});
		return () => {
			handler1.remove();
			handler2.remove();
			handler3.remove();
			handler4.remove();
			handler5.remove();
			handler6.remove();
		};
	});
}

/**
 * 应用状态改变事件
 */
export function add_state_listener(fire_msg: FireMessage) {
	useEffect(() => {
		function listener(state: AppStateStatus) {
			fire_msg(MM_EVENTS_STATUS_CHANGE, state);
		}
		AppState.addEventListener('change', listener);
		return () => {
			AppState.removeEventListener('change', listener);
		};
	});
}

/**
 * 添加读屏事件
 */
export function add_accesibility_listener(fire_msg: FireMessage) {
	useEffect(() => {
		function listener1(event: AccessibilityChangeEvent) {
			fire_msg(MM_EVENTS_ACCESSIBILITY_CHANGE, event);
			return true;
		}
		function listener2(event: AccessibilityAnnoucementFinishedEvent) {
			fire_msg(MM_EVENTS_ACCESSIBILITY_ANNOUCEMENT_FINISHED, event);
			return true;
		}
		AccessibilityInfo.addEventListener('change', listener1);
		AccessibilityInfo.addEventListener('announcementFinished', listener2);
		return () => {
			AccessibilityInfo.removeEventListener('change', listener1);
			AccessibilityInfo.removeEventListener('announcementFinished', listener2);
		};
	});
}

/**
 * 联网状态改变
 */
export function add_netinfo_listener(fire_msg: FireMessage) {
	useEffect(() => {
		function listener(state: NetInfoState) {
			fire_msg(MM_EVENTS_NET_CHANGE, state);
		}
		return NetInfo.addEventListener(listener);
	});
}


const MM_EVENTS_STATUS_CHANGE = 'mm-events-status-change';

const MM_EVENTS_INIT = 'mm-events-init';

const MM_EVENTS_NAV_BLUR = 'mm-events-nav-blur';
const MM_EVENTS_NAV_FOCUS = 'mm-events-nav-focus';
const MM_EVENTS_NAV_STATE = 'mm-events-nav-state';
const MM_EVENTS_NAV_TRANSITION_START = 'mm-events-nav-stack-trans-start';
const MM_EVENTS_NAV_TRANSITION_END = 'mm-events-nav-stack-trans-end';
const MM_EVENTS_NAV_TAB_PRESS = 'mm-events-nav-tab-press';
const MM_EVENTS_NAV_TAB_LONG_PRESS = 'mm-events-nav-tab-long-press';

const MM_EVENTS_KEYBOARD_WILL_SHOW = 'mm-events-keyboard-will-show';
const MM_EVENTS_KEYBOARD_DID_SHOW = 'mm-events-keyboard-did-show';
const MM_EVENTS_KEYBOARD_WILL_HIDE = 'mm-events-keyboard-will-hide';
const MM_EVENTS_KEYBOARD_DID_HIDE = 'mm-events-keyboard-did-hide';
const MM_EVENTS_KEYBOARD_WILL_CHANGEFRAME = 'mm-events-keyboard-will-changeframe';
const MM_EVENTS_KEYBOARD_DID_CHANGEFRAME = 'mm-events-keyboard-did-changeframe';

const MM_EVENTS_ACCESSIBILITY_CHANGE = 'mm-events-accessibility-change';
const MM_EVENTS_ACCESSIBILITY_ANNOUCEMENT_FINISHED = 'mm-events-accessibility-annoucement-finished';

const MM_EVENTS_NET_CHANGE = 'mm-events-net-change';
