import { createElement, FunctionComponent, FunctionComponentElement, ReactNode, useCallback, useRef, useState } from 'react';
import { NativeSyntheticEvent } from 'react-native';
// import { NavigationInjectedProps } from 'react-navigation';
import { StackNavigationOptions } from '@react-navigation/stack';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { MaterialBottomTabNavigationOptions } from '@react-navigation/material-bottom-tabs';
import { EventMapBase, NavigationState, RouteConfig } from '@react-navigation/native';
import { MaterialTopTabBarOptions, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import init_ai from './ai';
import { IActions, IAiMobile, IEvents, ParamList, Props } from './interfaces';
import trans_css from './trans-css';
import { init_page_events } from './init-events';

export type PageConfig = StackNavigationOptions | DrawerNavigationOptions | BottomTabNavigationOptions | MaterialTopTabNavigationOptions | MaterialBottomTabNavigationOptions | MaterialTopTabBarOptions;

export default function page(name: string, actions: IActions, events: IEvents, tpl: (a: (action: string, ...args: unknown[]) => (<T>(ev: NativeSyntheticEvent<T>) => void), c: (...class_names: string[]) => Array<{}>, d: <T>(d: string) => T, mm: IAiMobile) => ReactNode, page_config: PageConfig, css: string) {
	const styles = trans_css(css);
	return (Screen: (_: RouteConfig<ParamList, string, NavigationState, object, EventMapBase>) => null, global_styles: { [name: string]: {}; }) => {
		const emit = init_ai(actions, events);
		function Component(props: Props) {
			// this.handlers.push(add_keyboard_listener(fire_msg));
			// this.handlers.push(add_state_listener(fire_msg));
			// this.handlers.push(add_back_listener(fire_msg));
			// this.handlers.push(add_accesibility_listener(fire_msg));
			// // this.handlers.push(add_netinfo_listener(fire_msg));
			const local = useRef({});
			const [data, setData] = useState({});
			function set_data<T>(key: string, value: T) {
				setData({
					...data,
					[key]: value
				});
			}
			const mm = {
				emit,
				local: local.current,
				set_data,
				props
			};
			const fire_msg = useCallback((event: string, ...args: unknown[]) => {
				return emit(mm, event, ...args);
			}, [mm]);
			const { navigation } = props;
			init_page_events(navigation, fire_msg);
			function d<T>(key: string) {
				return data[key] as T;
			}
			return tpl((action: string, ...args: unknown[]) => {
				function fire<T>(ev: NativeSyntheticEvent<T>) {
					fire_msg(action, ev, ...args);
				};
				return fire;
			}, (...class_names: string[]) => {
				return class_names.map((class_name) => {
					return styles[class_name] || global_styles[class_name];
				});
			}, d, mm);
		}
		return createElement<{
			name: string;
			component: typeof Component;
			options: PageConfig;
		} & PageConfig>(Screen as FunctionComponent, {
			name,
			component: Component,
			options: page_config
		}, null) as FunctionComponentElement<{
			name: string;
			component: FunctionComponent;
			options: PageConfig;
		} & PageConfig>;
	};
}
