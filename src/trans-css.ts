import transform from 'css-to-react-native-transform';

export function trans_css<T>(css?: string) {
	return css ? transform(`.mm {${css}}`).mm as T : undefined as unknown as T;
}
