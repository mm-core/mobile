import { IActions, IAiMobile, IEvents } from './interfaces';

export default function init(actions: IActions, events: IEvents) {
	// 执行事件对应的js响应函数，或者规则编号对应的响应函数
	function fire(mm: IAiMobile, action: string, ...args: unknown[]) {
		const fun = actions[action];
		if (!fun) {
			return Promise.resolve();
		}
		return Promise.resolve(fun(mm, ...args));
	}

	function emit(mm: IAiMobile, type: string, ...args: unknown[]) {
		if (type) {
			return fire(mm, events[type] || type, ...args);
		}
		return Promise.resolve();
	}
	// Object.freeze(data);	// Could not freeze data here, see page.ts

	return emit;
}
