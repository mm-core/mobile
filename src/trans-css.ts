import transform from 'css-to-react-native-transform';

export function trans_css<T>(css?: string) {
	return css ? transform(`.fd {${css}}`).fd as T : undefined as unknown as T;
}
