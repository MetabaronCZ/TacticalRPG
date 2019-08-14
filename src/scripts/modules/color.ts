export type Color = [number, number, number];

export type ColorID =
	'green' | 'greenLight' |
	'blue' | 'blueLight' |
	'yellow' | 'yellowLight' |
	'greyDarker' | 'greyDark' | 'grey' | 'greyLight' |
	'violet' | 'violetDark' |
	'orange' | 'orangeDark';

export const minColorValue = 0;
export const maxColorValue = 255;

// convert Color to canvas context RGB string
export const colorToRGB = (color: Color): string => `rgb(${color.join(', ')})`;
