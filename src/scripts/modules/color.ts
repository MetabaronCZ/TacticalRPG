export type Color = [number, number, number];

export type ColorID =
	'green' | 'greenLight' |
	'blue' | 'blueLight' |
	'yellow' | 'yellowLight' |
	'greyDarkest' | 'greyDarker' | 'greyDark' | 'grey' | 'greyLight' |
	'violet' | 'violetDark' |
	'orange' | 'orangeDark' |
	'red';

export const minColorValue = 0;
export const maxColorValue = 255;

// convert Color to canvas context RGB string
export const colorToRGB = (color: Color, alpha = 1): string => {
	return `rgba(${color.join(', ')}, ${alpha})`;
};

// get color between given two colors
export const getCrossColor = (colA: Color, colB: Color, ratio: number): Color => {
	if (ratio < 0 || ratio > 1) {
		throw new Error('Could not get cross color - invalid ratio: ' + ratio);
	}
	const color = [...colA] as Color;

	for (let c = 0, cmax = colB.length; c < cmax; c++) {
		color[c] = color[c] + Math.round(ratio * (colB[c] - color[c]));
	}
	return color;
};
