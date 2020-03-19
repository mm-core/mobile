import { Component, createElement } from 'react';
import { Animated, AppRegistry, Easing, FlexStyle, I18nManager, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { createAppContainer, NavigationInjectedProps } from 'react-navigation';
import { createStackNavigator, StackViewStyleInterpolator } from 'react-navigation-stack';
import { SceneInterpolatorProps } from 'react-navigation-stack/lib/typescript/types';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import init_ai from './ai';
import { add_accesibility_listener, add_back_listener, add_keyboard_listener, add_state_listener } from './init-events';
import { FD_EVENTS_DID_CATCH, FD_EVENTS_DID_MOUNT, FD_EVENTS_DID_UPDATE, FD_EVENTS_INIT, FD_EVENTS_WILL_MOUNT, FD_EVENTS_WILL_RECEIVE_PROPS, FD_EVENTS_WILL_UNMOUNT, FD_EVENTS_WILL_UPDATE, IActions, IEvents } from './interfaces';
import { trans_css } from './trans-css';

export interface IAppConfig {
	main_page: string;
	tabs: {
		tab_page: string;
		pages: string[];
		position?: 'top' | 'bottom';
		active_tintColor?: string;
		allow_font_scaling?: boolean;
		active_background_color?: string;
		inactive_tint_color?: string;
		inactive_background_color?: string;
		show_label?: boolean;
		style?: string;
		label_style?: string;
		icon_style?: string;
		show_icon?: boolean;
		upper_case_label?: boolean;
		press_color?: string;
		press_opacity?: number;
		scroll_enabled?: boolean;
		tab_style?: string;
		indicator_style?: string;
	};
}

interface IHandler {
	destroy(): void;
}
interface IPosition {
	interpolate(opt: {
		inputRange: number[];
		outputRange: number[]
	}): void;
}

export default function init(name: string, actions: IActions, events: IEvents, pages: {
	[routeName: string]: ((global: { [key: string]: unknown; }, styles: { [name: string]: StyleProp<FlexStyle>; }) => Component<NavigationInjectedProps>);
}, app_config: IAppConfig, styles: { [name: string]: {}; }) {
	const emit = init_ai(actions, events);
	const global = {};
	const page_names = Object.keys(pages);
	const config = page_names.reduce((pre, cur) => {
		pre[cur] = pages[cur](global, styles);
		return pre;
	}, {});
	const tab_config = app_config.tabs;
	const tab_pages = tab_config.pages.reduce((pre, page_name) => {
		pre[page_name] = config[page_name];
		return pre;
	}, {} as { [name: string]: Component<NavigationInjectedProps> });
	const tabBarOptions = {
		activeBackgroundColor: tab_config.active_background_color,
		activeTintColor: tab_config.active_tintColor,
		allowFontScaling: tab_config.allow_font_scaling,
		iconStyle: trans_css<StyleProp<ViewStyle>>(tab_config.icon_style),
		inactiveBackgroundColor: tab_config.inactive_background_color,
		inactiveTintColor: tab_config.inactive_tint_color,
		indicatorStyle: trans_css<StyleProp<ViewStyle>>(tab_config.indicator_style),
		labelStyle: trans_css<StyleProp<TextStyle>>(tab_config.label_style),
		pressColor: tab_config.press_color,
		pressOpacity: tab_config.press_opacity,
		scrollEnabled: tab_config.scroll_enabled,
		showIcon: tab_config.show_icon,
		showLabel: tab_config.show_label,
		style: trans_css<StyleProp<ViewStyle>>(tab_config.style),
		tabStyle: trans_css<StyleProp<ViewStyle>>(tab_config.tab_style),
		upperCaseLabel: tab_config.upper_case_label
	};
	const tabs = {
		navigationOptions: {
			header: null
		},
		screen: ((tab_config.position !== 'top') ? createBottomTabNavigator : createMaterialTopTabNavigator)(tab_pages, {
			tabBarOptions
		})
	};
	const all = createStackNavigator({
		...config,
		[app_config.tabs.tab_page]: tabs
	}, {
		headerMode: 'screen',
		initialRouteName: app_config.main_page.replace(/-/g, '_'),
		transitionConfig: TransitionConfiguration
	});
	const app_container = createAppContainer(all);

	class App extends Component<NavigationInjectedProps> {
		private handlers = [] as IHandler[];
		private data = {};
		private local = {};
		public constructor(props: NavigationInjectedProps, context?: unknown) {
			super(props, context);
			this.fire_msg(FD_EVENTS_INIT, props, context);
		}
		public componentWillMount() {
			return this.fire_msg(FD_EVENTS_WILL_MOUNT);
		}
		public componentWillUnmount() {
			this.handlers.forEach((handler) => {
				handler.destroy();
			});
			this.handlers = [];
			return this.fire_msg(FD_EVENTS_WILL_UNMOUNT);
		}
		public componentWillUpdate() {
			return this.fire_msg(FD_EVENTS_WILL_UPDATE);
		}
		public componentWillReceiveProps() {
			return this.fire_msg(FD_EVENTS_WILL_RECEIVE_PROPS);
		}
		public componentDidMount() {
			const fire_msg = (event: string, ...args: unknown[]) => {
				return this.fire_msg(event, ...args);
			};
			this.handlers.push(add_keyboard_listener(fire_msg));
			this.handlers.push(add_state_listener(fire_msg));
			this.handlers.push(add_back_listener(fire_msg));
			this.handlers.push(add_accesibility_listener(fire_msg));
			// this.handlers.push(add_netinfo_listener(fire_msg));
			return this.fire_msg(FD_EVENTS_DID_MOUNT);
		}
		public componentDidCatch() {
			return this.fire_msg(FD_EVENTS_DID_CATCH);
		}
		public componentDidUpdate() {
			return this.fire_msg(FD_EVENTS_DID_UPDATE);
		}
		public render() {
			return createElement(app_container, null);
		}
		private fire_msg(event: string, ...args: unknown[]) {
			return emit({
				data: this.data,
				emit,
				global,
				local: this.local,
				page: this
			}, event, ...args);
		}
	}
	AppRegistry.registerComponent(name, () => App as unknown as typeof App);
}

// 实现定义某个页面的动画效果
function TransitionConfiguration() {
	return {
		screenInterpolator: (sceneProps: SceneInterpolatorProps) => {
			const { scene } = sceneProps;
			const { route } = scene;
			const params = (route as unknown as { params: { [key: string]: unknown } }).params || {};
			const transition = (params.transition || 'forVertical') as string;
			switch (transition) {
				case 'forVerticalTop':
					return forVerticalTop(sceneProps);
				case 'forHorizontalLeft':
					return forHorizontalLeft(sceneProps);
				default:
					{
						const forVertical = StackViewStyleInterpolator[transition] as (sceneProps: SceneInterpolatorProps) => unknown;
						return forVertical(sceneProps);
					}
			}
		},
		transitionSpec: {
			duration: 300,
			easing: Easing.linear,
			timing: Animated.timing
		}
	};
}
function forVerticalTop(sceneProps: SceneInterpolatorProps) {
	const { layout, position, scene } = sceneProps;
	const tmp_position = position as IPosition;
	const index = scene.index;
	const inputRange = [index - 1, index, index + 1];

	const height = layout.initHeight;
	const outputRange = !I18nManager.isRTL
		? ([height, 0, -height * 0.3])
		: ([-height, 0, height * -0.3]);
	const opacity = tmp_position.interpolate({
		inputRange: ([
			index - 1,
			index - 0.99,
			index,
			index + 0.99,
			index + 1
		]),
		outputRange: ([0, 1, 1, 0.85, 0])
	});

	const translateX = 0;
	const translateY = tmp_position.interpolate({
		inputRange,
		outputRange
	});

	return {
		opacity,
		transform: [{ translateX }, { translateY }]
	};

}
function forHorizontalLeft(sceneProps: SceneInterpolatorProps) {
	const { layout, position, scene } = sceneProps;
	const tmp_position = position as IPosition;
	const index = scene.index;
	const inputRange = [index - 1, index, index + 1];

	const width = layout.initWidth;
	const outputRange = !I18nManager.isRTL
		? ([width, 0, -width * 0.3])
		: ([-width, 0, width * -0.3]);
	// Add [index - 1, index - 0.99] to the interpolated opacity for screen transition.
	// This makes the screen's shadow to disappear smoothly.
	const opacity = tmp_position.interpolate({
		inputRange: ([
			index - 1,
			index - 0.99,
			index,
			index + 0.99,
			index + 1
		]),
		outputRange: ([0, 1, 1, 0.85, 0])
	});

	const translateY = 0;
	const translateX = tmp_position.interpolate({
		inputRange,
		outputRange
	});

	return {
		opacity,
		transform: [{ translateX }, { translateY }]
	};
}
