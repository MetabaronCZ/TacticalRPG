import { ColorID, Color } from 'modules/color';
import { CharacterColors, ColorStyle, TileColors } from 'modules/battle/grid';

type ColorList = {
	[id in ColorID]: Color;
};

type TileStyles = {
	[id in TileColors]: ColorStyle;
};

type CharacterStyles = {
	[id in CharacterColors]: ColorStyle;
};

const colors: ColorList = {
	green: [0, 136, 68],
	greenLight: [0, 168, 81],
	blue: [0, 75, 221],
	blueLight: [0, 92, 255],
	yellow: [221, 204, 0],
	yellowLight: [255, 231, 150],
	greyDarkest: [15, 15, 15],
	greyDarker: [20, 20, 20],
	greyDark: [40, 40, 40],
	grey: [53, 53, 53],
	greyLight: [136, 136, 136],
	violet: [148, 0, 211],
	violetDark: [93, 0, 164],
	orange: [255, 99, 71],
	orangeDark: [201, 73, 48],
	red: [250, 50, 50]
};

// tile colors
export const tileStyles: TileStyles = {
	default: [colors.greyDarker, colors.greyDarkest],
	green: [colors.green, colors.greenLight],
	blue: [colors.blue, colors.blueLight],
	yellow: [colors.yellow, colors.yellowLight],
	highlighted: [colors.greyDarker, colors.red],
	destroyed: [colors.grey, colors.greyDark]
};

// character colors
export const characterStyles: CharacterStyles = {
	grey: [colors.grey, colors.greyDarker],
	violet: [colors.violet, colors.violetDark],
	orange: [colors.orange, colors.orangeDark],
	highlighted: [colors.yellowLight, colors.yellowLight]
};
