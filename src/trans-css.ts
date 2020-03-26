import transform from 'css-to-react-native-transform';

export default function trans_css<T = { [name: string]: {}; }>(css?: string) {
	return css ? transform(css) as unknown as T : undefined as unknown as T;
}
