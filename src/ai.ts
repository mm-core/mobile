import { IActions, IEvents, IFeidaoAiMobile } from './interfaces';

export default function init(actions: IActions, events: IEvents) {
	// 执行事件对应的js响应函数，或者规则编号对应的响应函数
	function fire_action(fd: IFeidaoAiMobile, action: string, ...args: unknown[]) {
		const fun = actions[action];
		if (!fun) {
			return Promise.resolve();
		}
		return Promise.resolve(fun(fd, ...args));
	}

	function fire(fd: IFeidaoAiMobile, action: string, ...args: unknown[]) {
		return fire_action(fd, action, ...args);
	}

	function emit(fd: IFeidaoAiMobile, type: string, ...args: unknown[]) {
		if (type) {
			return fire(fd, events[type] || type, ...args);
		}
		return Promise.resolve();
	}
	// Object.freeze(data);	// Could not freeze data here, see page.ts

	return emit;
}
