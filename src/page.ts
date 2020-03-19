import { Component, createElement, ReactNode } from 'react';
import { Image, ImageSourcePropType, ImageStyle, ImageURISource, NativeSyntheticEvent, StyleProp } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import init_ai from './ai';
import { add_accesibility_listener, add_back_listener, add_keyboard_listener, add_page_listener, add_state_listener } from './init-events';
import { IActions, IAiMobile, IEvents, MM_EVENTS_DID_CATCH, MM_EVENTS_DID_MOUNT, MM_EVENTS_DID_UPDATE, MM_EVENTS_INIT, MM_EVENTS_WILL_MOUNT, MM_EVENTS_WILL_RECEIVE_PROPS, MM_EVENTS_WILL_UNMOUNT, MM_EVENTS_WILL_UPDATE } from './interfaces';
import { trans_css } from './trans-css';

interface IHandler {
	destroy(): void;
}

export interface IPageConfig {
	title: string; // 标题
	header_title: string;
	header_title_allow_font_scaling: boolean; // 标题字体是否应缩放以符合文本大小辅助功能设置。默认为true。
	header_back_allow_font_scaling: boolean; // 后退按钮标题字体是否应缩放以符合文本大小辅助功能设置。默认为false。
	header_back_image: string; // 自定义返回按钮图片
	header_back_title: string; // 后退按钮使用的标题字符串
	header_truncated_back_title: string; // 当 headerbacktitle 在屏幕上不适合时, "后退" 按钮使用的标题字符串。
	header_style: string;
	header_force_inset: boolean; // 允许将 forceinset 对象传递给页眉中使用的内部 safeareaview。
	header_title_style: string;
	header_back_title_style: string;
	header_left_container_style: string;
	header_right_container_style: string;
	header_title_container_style: string;
	header_tint_color: string; // 返回按钮和标题都使用这个属性作为它们的颜色
	header_press_color_android: string; // 颜色为材料波纹 (Android >= 5.0)
	header_transparent: boolean; // 标题是否透明。默认false。如果为true，则头将没有背景，除非您显式地为其提供HeaderStyle或HeaderBackground。
	header_background: string; // 将此与HeaderTransparent一起使用，以提供要在头的背景中呈现的组件。例如，可以将其与模糊视图一起使用，以创建半透明的页眉。
	header_background_transition_preset: 'toggle' | 'fade' | 'translate'; //
	gestures_enabled: boolean; // 是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上默认为false。
	gesture_response_distance: { // 设置触摸从屏幕边缘开始的距离，以识别手势。
		horizontal: number; // - 水平方向的距离 默认为25。
		vertical: number; // - 垂直方向的距离 默认为135。
	};
	gesture_direction: string; // 设置解除手势的方向。默认为正常行为或从右向左滑动的反转。
	tab_bar_icon: ImageSourcePropType | ImageURISource[];	// require('a.png')
	tab_bar_icon_style: StyleProp<ImageStyle>;
	tab_bar_focused_icon: ImageSourcePropType | ImageURISource[];	// require('b.png')
	tab_bar_focused_icon_style: StyleProp<ImageStyle>;
	params: { // 在路由定义内提供默认参数:
		[key: string]: string | number | boolean
	};
}

interface INavagationOptions {
	title: string; // 标题
	header: Component;
	headerTitle: string | Component;
	headerTitleAllowFontScaling: boolean; // 标题字体是否应缩放以符合文本大小辅助功能设置。默认为true。
	headerBackAllowFontScaling: boolean; // 后退按钮标题字体是否应缩放以符合文本大小辅助功能设置。默认为false。
	headerBackImage: string; // 自定义返回按钮图片
	headerBackTitle: string; // 后退按钮使用的标题字符串
	headerTruncatedBackTitle: string; // 当 headerBackTitle 在屏幕上不适合时, "后退" 按钮使用的标题字符串。
	headerRight: Component;
	headerLeft: Component;
	headerStyle: { // 一个应用于 header 的最外层 View 的 样式对象
		backgroundColor: string; // header 的颜色
	};
	headerForceInset: boolean; // 允许将 forceInset 对象传递给页眉中使用的内部 SafeAreaView。
	headerTitleStyle: { // 如果我们想为标题定制fontFamily，fontWeight和其他Text样式属性，我们可以用它来完成。
		fontFamily: string;
		fontWeight: string;
	};
	headerBackTitleStyle: { // 返回标题的样式对象
	};
	headerLeftContainerStyle: { // 自定义 headerLeft 组件容器的样式，例如，增加 padding。
		padding: string;
	};
	headerRightContainerStyle: {
		padding: string;
	};
	headerTitleContainerStyle: {
		padding: string;
	};
	headerTintColor: string; // 返回按钮和标题都使用这个属性作为它们的颜色
	headerPressColorAndroid: string; // 颜色为材料波纹 (Android >= 5.0)
	headerTransparent: boolean; // 标题是否透明。默认false。如果为true，则头将没有背景，除非您显式地为其提供HeaderStyle或HeaderBackground。
	headerBackground: string; // 将此与HeaderTransparent一起使用，以提供要在头的背景中呈现的组件。例如，可以将其与模糊视图一起使用，以创建半透明的页眉。
	headerBackgroundTransitionPreset: 'toggle' | 'fade' | 'translate'; //
	gesturesEnabled: boolean; // 是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上默认为false。
	gestureResponseDistance: { // 设置触摸从屏幕边缘开始的距离，以识别手势。
		horizontal: number; // - 水平方向的距离 默认为25。
		vertical: number; // - 垂直方向的距离 默认为135。
	};
	gestureDirection: string; // 设置解除手势的方向。默认为正常行为或从右向左滑动的反转。
	tabBarIcon: (focused: unknown) => JSX.Element;
	params: { // 在路由定义内提供默认参数:
		[key: string]: string | number | boolean
	};
}

function trans_option(options: Partial<IPageConfig>) {
	const tabBarIcon = (() => {
		if (options.tab_bar_icon || options.tab_bar_focused_icon) {
			return ({ focused }: { focused: boolean }) => {
				if (focused) {
					const source = options.tab_bar_focused_icon || options.tab_bar_icon;
					const style = options.tab_bar_focused_icon_style || options.tab_bar_icon_style;
					if (Boolean(style) && !(style as ImageStyle).resizeMode) {
						(style as ImageStyle).resizeMode = 'stretch';
					}
					if (source) {
						return createElement(Image, {
							source,
							style
						});
					}
					return undefined;

				}
				const source = options.tab_bar_icon || options.tab_bar_focused_icon;
				const style = options.tab_bar_icon_style || options.tab_bar_focused_icon_style;
				if (Boolean(style) && !(style as ImageStyle).resizeMode) {
					(style as ImageStyle).resizeMode = 'stretch';
				}
				if (source) {
					return createElement(Image, {
						source,
						style
					});
				}
				return undefined;


			};
		}
		return undefined;

	})();
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return {
		gestureDirection: options.gesture_direction,
		gestureResponseDistance: options.gesture_response_distance ? { // 设置触摸从屏幕边缘开始的距离，以识别手势。
			horizontal: options.gesture_response_distance.horizontal,
			vertical: options.gesture_response_distance.vertical
		} : undefined,
		gesturesEnabled: options.gestures_enabled,
		headerBackAllowFontScaling: options.header_back_allow_font_scaling,
		headerBackImage: options.header_back_image,
		headerBackTitle: options.header_back_title,
		headerBackTitleStyle: trans_css(options.header_back_title_style),
		headerBackground: options.header_background,
		headerBackgroundTransitionPreset: options.header_background_transition_preset,
		headerForceInset: options.header_force_inset,
		headerLeftContainerStyle: trans_css(options.header_left_container_style),
		headerPressColorAndroid: options.header_press_color_android,
		headerRightContainerStyle: trans_css(options.header_right_container_style),
		headerStyle: trans_css(options.header_style),
		headerTintColor: options.header_tint_color,
		headerTitle: options.header_title,
		headerTitleAllowFontScaling: options.header_title_allow_font_scaling,
		headerTitleContainerStyle: trans_css(options.header_title_container_style),
		headerTitleStyle: trans_css(options.header_title_style),
		headerTransparent: options.header_transparent,
		headerTruncatedBackTitle: options.header_truncated_back_title,
		params: options.params,
		tabBarIcon,
		title: options.title
	} as INavagationOptions;
}

export function a() {
	return class extends Component<NavigationInjectedProps> {
	};
}

export default function init(global: { [key: string]: unknown; }, global_styles: { [name: string]: {}; }, actions: IActions, events: IEvents, tpl: (a: (action: string) => ((...args: unknown[]) => void), c: (...class_names: string[]) => Array<{}>, d: <T>(d: string) => T, mm: IAiMobile) => ReactNode, page_config: Partial<IPageConfig>, styles: { [name: string]: {}; }) {
	const emit = init_ai(actions, events);
	const options = trans_option(page_config);
	return class extends Component<NavigationInjectedProps> {
		public static navigationOptions = options;
		private handlers = [] as IHandler[];
		private data = {};
		private local = {};
		public constructor(props: NavigationInjectedProps, context?: unknown) {
			super(props, context);
		}
		public componentWillMount() {
			const fire_msg = (event: string, ...args: unknown[]) => {
				return this.fire_msg(event, ...args);
			};
			this.handlers.push(add_page_listener(fire_msg, this));
			return this.fire_msg(MM_EVENTS_WILL_MOUNT);
		}
		public componentWillUnmount() {
			this.handlers.forEach((handler) => {
				handler.destroy();
			});
			this.handlers = [];
			return this.fire_msg(MM_EVENTS_WILL_UNMOUNT);
		}
		public componentWillUpdate() {
			return this.fire_msg(MM_EVENTS_WILL_UPDATE);
		}
		public componentWillReceiveProps() {
			return this.fire_msg(MM_EVENTS_WILL_RECEIVE_PROPS);
		}
		public async componentDidMount() {
			const fire_msg = (event: string, ...args: unknown[]) => {
				return this.fire_msg(event, ...args);
			};
			this.handlers.push(add_keyboard_listener(fire_msg));
			this.handlers.push(add_state_listener(fire_msg));
			this.handlers.push(add_back_listener(fire_msg));
			this.handlers.push(add_accesibility_listener(fire_msg));
			// this.handlers.push(add_netinfo_listener(fire_msg));
			await this.fire_msg(MM_EVENTS_INIT, this.props, this.context);
			return this.fire_msg(MM_EVENTS_DID_MOUNT);
		}
		public componentDidCatch() {
			return this.fire_msg(MM_EVENTS_DID_CATCH);
		}
		public componentDidUpdate() {
			return this.fire_msg(MM_EVENTS_DID_UPDATE);
		}
		public render() {
			const dom = tpl((action: string, ...args: unknown[]) => {
				return <T>(ev: NativeSyntheticEvent<T>) => {
					return this.fire_msg(action, ev, ...args);
				};
			}, (...class_names: string[]) => {
				return class_names.map((class_name) => {
					return styles[class_name] || global_styles[class_name];
				});
			}, <T>(d: string) => {
				return this.data[d] as T;
			}, {
				data: this.data,
				emit,
				global,
				local: this.local,
				page: this
			});
			return dom;
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
	} as unknown as Component<NavigationInjectedProps>;
}
