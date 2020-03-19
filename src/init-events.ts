import { Component } from 'react';
import { AccessibilityAnnoucementFinishedEvent, AccessibilityChangeEvent, AccessibilityInfo, AppState, AppStateStatus, BackHandler, Keyboard } from 'react-native';
import { NavigationEventPayload, NavigationInjectedProps } from 'react-navigation';
import { MM_EVENTS_ACCESSIBILITY_ANNOUCEMENT_FINISHED, MM_EVENTS_ACCESSIBILITY_CHANGE, MM_EVENTS_BACK_PRESS, MM_EVENTS_DID_BLUR, MM_EVENTS_DID_FOCUS, MM_EVENTS_KEYBOARD_DID_CHANGEFRAME, MM_EVENTS_KEYBOARD_DID_HIDE, MM_EVENTS_KEYBOARD_DID_SHOW, MM_EVENTS_KEYBOARD_WILL_CHANGEFRAME, MM_EVENTS_KEYBOARD_WILL_HIDE, MM_EVENTS_KEYBOARD_WILL_SHOW, MM_EVENTS_STATUS_CHANGE, MM_EVENTS_WILL_BLUR, MM_EVENTS_WILL_FOCUS } from './interfaces';

type FireMessage = (event: string, ...args: unknown[]) => Promise<unknown>;

/**
 * 键盘事件
 */
export function add_keyboard_listener(fire_msg: FireMessage) {
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
	return {
		destroy() {
			handler1.remove();
			handler2.remove();
			handler3.remove();
			handler4.remove();
			handler5.remove();
			handler6.remove();
		}
	};
}

/**
 * 应用状态改变事件
 */
export function add_state_listener(fire_msg: FireMessage) {
	function listener(state: AppStateStatus) {
		fire_msg(MM_EVENTS_STATUS_CHANGE, state);
	}
	AppState.addEventListener('change', listener);
	return {
		destroy() {
			AppState.removeEventListener('change', listener);
		}
	};
}

/**
 * 返回键事件
 */
export function add_back_listener(fire_msg: FireMessage) {
	function listener() {
		fire_msg(MM_EVENTS_BACK_PRESS);
		return false;	// todo 返回true则页面不返回, 现无法根据项目逻辑进行该操作,需项目上再次通过原子操作监听该事件,并同步返回非false来实现页面不跳转
	}
	BackHandler.addEventListener('hardwareBackPress', listener);
	return {
		destroy() {
			BackHandler.removeEventListener('hardwareBackPress', listener);
		}
	};
}

/**
 * 添加读屏事件
 */
export function add_accesibility_listener(fire_msg: FireMessage) {
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
	return {
		destroy() {
			AccessibilityInfo.removeEventListener('change', listener1);
			AccessibilityInfo.removeEventListener('announcementFinished', listener2);
		}
	};
}

/**
 * 联网状态改变
 */
// export function add_netinfo_listener(fire_msg: FireMessage) {
// 	function listener(event: {
// 		fire_msg(MM_EVENTS_NET_CHANGE, event);
// 	};
// 	if (NetInfo) {
// 		NetInfo.addEventListener('connectionChange', listener);
// 	}
// 	return {
// 		destroy() {
// 			NetInfo.removeEventListener('connectionChange', listener);
// 		}
// 	};
// }

/**
 * 页面事件
 */
export function add_page_listener(fire_msg: FireMessage, page: Component<NavigationInjectedProps>) {
	const didBlur = page.props.navigation.addListener('didBlur', (event: NavigationEventPayload) => {
		fire_msg(MM_EVENTS_DID_BLUR, event);
	});
	const didFocus = page.props.navigation.addListener('didFocus', (event: NavigationEventPayload) => {
		fire_msg(MM_EVENTS_DID_FOCUS, event);
	});
	const willBlur = page.props.navigation.addListener('willBlur', (event: NavigationEventPayload) => {
		fire_msg(MM_EVENTS_WILL_BLUR, event);
	});
	const willFocus = page.props.navigation.addListener('willFocus', (event: NavigationEventPayload) => {
		fire_msg(MM_EVENTS_WILL_FOCUS, event);
	});
	return {
		destroy() {
			didBlur.remove();
			didFocus.remove();
			willBlur.remove();
			willFocus.remove();
		}
	};
}
