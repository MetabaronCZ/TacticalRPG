import { ColorID, Color } from 'modules/color';

type ColorList = {
	[id in ColorID]: Color;
};

const colors: ColorList = {
	green: [0, 136, 68],
	greenLight: [0, 168, 81],
	blue: [0, 75, 221],
	blueLight: [0, 92, 255],
	yellow: [221, 204, 0],
	yellowLight: [255, 231, 150],
	greyDarker: [15, 15, 15],
	greyDark: [20, 20, 20],
	grey: [53, 53, 53],
	greyLight: [136, 136, 136],
	violet: [148, 0, 211],
	violetDark: [93, 0, 164],
	orange: [255, 99, 71],
	orangeDark: [201, 73, 48]
};

export default colors;
