import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { EventMapBase, NavigationContainer, NavigationState, ParamListBase, RouteConfig } from '@react-navigation/native';
import { createElement, FunctionComponent, FunctionComponentElement, useCallback, useRef, useState } from 'react';
import { AppRegistry } from 'react-native';
import { PageConfig } from './page';
import { IActions, IAiMobile, IEvents } from './interfaces';
import init_ai from './ai';
import trans_css from './trans-css';
import { init_app_listener } from './init-events';

export interface AppConfig {
	initialRouteName?: string;
	screenOptions?: object;
}

type ParamList = ParamListBase;
type Page = (Screen: (_: RouteConfig<ParamList, string, NavigationState, object, EventMapBase>) => null, global_styles: { [name: string]: {}; }) => FunctionComponentElement<{
	name: string;
	component: FunctionComponent;
	options: PageConfig;
} & PageConfig>;

export default function container(type: 'stack' | 'drawer' | 'bottom-tab' | 'material-bottom-tab' | 'material-top-tab', name: string, actions: IActions, events: IEvents, config: AppConfig, css: string, ...pages: Page[]) {
	const global_styles = trans_css(css);
	console.log('app');
	function App() {
		const Navigator = (() => {
			switch (type) {
				case 'stack':
					return createStackNavigator();
				case 'drawer':
					return createDrawerNavigator();
				case 'bottom-tab':
					return createBottomTabNavigator();
				case 'material-bottom-tab':
					return createMaterialBottomTabNavigator();
				case 'material-top-tab':
					return createMaterialTopTabNavigator();
				default:
					throw new Error('Incorrecte type');
			}
		})();

		const emit = init_ai(actions, events);
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
			set_data
		} as IAiMobile;
		const fire_msg = useCallback((event: string, ...args: unknown[]) => {
			return emit(mm, event, ...args);
		}, [mm, emit]);
		init_app_listener(fire_msg);
		const children = pages.map((it) => {
			return it(Navigator.Screen, global_styles);
		});
		const nav = createElement<AppConfig>(Navigator.Navigator as FunctionComponent, config, ...children);
		return createElement(NavigationContainer, null, nav);
	};
	AppRegistry.registerComponent(name, () => App);
}
