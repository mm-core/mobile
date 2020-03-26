import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { EventMapBase, NavigationState, ParamListBase, RouteConfig } from '@react-navigation/native';
import { createElement, FunctionComponent, FunctionComponentElement, useCallback, useRef, useState } from 'react';
import { PageConfig } from './page';
import { IActions, IEvents, Props } from './interfaces';
import init_ai from './ai';
import { init_page_events } from './init-events';

export interface ContainerConfig {
	initialRouteName?: string;
	screenOptions?: object;
}
type ParamList = ParamListBase;
type Page = (Screen: (_: RouteConfig<ParamList, string, NavigationState, object, EventMapBase>) => null, global_styles: { [name: string]: {}; }) => FunctionComponentElement<{
	name: string;
	component: FunctionComponent;
	options: PageConfig;
} & PageConfig>;

export default function container(type: 'stack' | 'drawer' | 'bottom-tab' | 'material-bottom-tab' | 'material-top-tab', name: string, actions: IActions, events: IEvents, config: ContainerConfig & PageConfig, ...pages: Page[]) {
	return (Screen: (_: RouteConfig<ParamList, string, NavigationState, object, EventMapBase>) => null, global_styles: { [name: string]: {}; }) => {
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
			const children = pages.map((it) => {
				return it(Navigator.Screen, global_styles);
			});
			return createElement<ContainerConfig>(Navigator.Navigator as FunctionComponent, config, ...children);
		}
		return createElement<{
			name: string;
			component: typeof Component;
			options: PageConfig;
		} & PageConfig>(Screen as FunctionComponent, {
			name,
			component: Component,
			options: config
		}, null) as FunctionComponentElement<{
			name: string;
			component: FunctionComponent;
			options: PageConfig;
		} & PageConfig>;
	};
}
