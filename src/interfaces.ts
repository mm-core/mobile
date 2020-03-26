import { NativeSyntheticEvent } from 'react-native';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { BottomTabBarProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export interface IEvents {
	[event: string]: string;
}

export interface IActions {
	[atom: string]: (mm: IAiMobile, ...args: unknown[]) => Promise<unknown> | unknown;
}

export type ParamList = ParamListBase;

export type ScreenNavigationProp = StackNavigationProp<ParamList> | DrawerNavigationProp<ParamList> | MaterialBottomTabNavigationProp<ParamList> | BottomTabNavigationProp<ParamList>;

export type ScreenRouteProp = RouteProp<ParamList, 'mmstudio'>;

export type Props = {
	navigation: ScreenNavigationProp;
	route: ScreenRouteProp;
} | BottomTabBarProps;

export interface IAiMobile {
	props: Props;
	readonly local: { [key: string]: unknown; };
	set_data<T>(key: string, value: T): void;
	emit(mm: IAiMobile, event: string, ...args: unknown[]): Promise<unknown>;
}

export type EventFunc<T> = (ev: NativeSyntheticEvent<T>) => void;

export type Action<T> = (action: string) => EventFunc<T>;
