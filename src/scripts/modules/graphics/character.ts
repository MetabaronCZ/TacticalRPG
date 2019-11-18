import { PI } from 'core/number';
import { colors } from 'data/styles';

import { dirToIndex } from 'modules/geometry/direction';
import { colorToRGB, Color, getCrossColor } from 'modules/color';

import { ICharacterSnapshot } from 'modules/character';

const dirSize = 4; // size of character direction circle visual

const blackColor = colorToRGB(colors.black);
const whiteColor = colorToRGB(colors.white);
const shadowColor = colorToRGB(colors.black, 0.35);

const glowColor1 = colorToRGB([255, 250, 100], 0.5);
const glowColor2 = colorToRGB([255, 250, 100], 0.0);

const greyColor1 = colorToRGB(colors.white, 0.0);
const greyColor2 = colorToRGB(colors.white, 0.5);
const greyColor3 = colorToRGB(colors.white, 0.35);

export const renderCharacter = (char: ICharacterSnapshot, ctx: CanvasRenderingContext2D, x: number, y: number, size: number, background: Color, border: Color): void => {
	const isDying = char.dying;

	// shadow
	ctx.beginPath();
	ctx.arc(x - size * (1 / 4), y + size * (1 / 4), size, 0, 2 * PI);
	ctx.fillStyle = shadowColor;
	ctx.fill();

	// border
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * PI);
	ctx.fillStyle = colorToRGB(border);
	ctx.fill();

	// background
	ctx.beginPath();
	ctx.arc(x, y, size - 2, 0, 2 * PI);

	let bgColor = background;

	if (char.animation && char.animation.isRunning() && 'COMBAT' === char.animation.type && char.battleId === char.animation.source.battleId) {
		// flash character doing skill animation
		const progress = char.animation.getProgress();
		const ratio = Math.sin(PI * progress);
		bgColor = getCrossColor(background, [255, 255, 255], ratio);
	}
	ctx.fillStyle = colorToRGB(bgColor);
	ctx.fill();

	// glow
	const gwX = x - size * (1 / 2);
	const gwY = y + size * (1 / 2);
	const glowGrad = ctx.createRadialGradient(gwX, gwY, 0, gwX, gwY, size);
	glowGrad.addColorStop(0, glowColor1);
	glowGrad.addColorStop(1, glowColor2);

	ctx.save();
	ctx.clip();
	ctx.globalCompositeOperation = 'overlay';

	ctx.beginPath();
	ctx.arc(gwX, gwY, size, 0, 2 * PI);
	ctx.fillStyle = glowGrad;
	ctx.fill();

	ctx.restore();

	// direction
	if (!isDying) {
		const index = dirToIndex(char.direction);
		const dirX = x + (size - dirSize) * Math.cos(2 * index * PI / 6 - PI / 2);
		const dirY = y + (size - dirSize) * Math.sin(2 * index * PI / 6 - PI / 2);

		// direction shadow
		ctx.beginPath();
		ctx.arc(dirX - 1, dirY + 1, dirSize + 1, 0, 2 * PI);
		ctx.fillStyle = shadowColor;
		ctx.fill();

		// direction circle
		ctx.beginPath();
		ctx.arc(dirX, dirY, dirSize, 0, 2 * PI);
		ctx.fillStyle = whiteColor;
		ctx.fill();
	}

	// glossy effect
	const glossyGradSize = size * (3 / 5);
	const gX = x + size * (1 / 4);
	const gY = y - size * (1 / 4);

	const glossyGrad = ctx.createLinearGradient(gX , gY, gX - glossyGradSize, gY + glossyGradSize);
	glossyGrad.addColorStop(0, greyColor2);
	glossyGrad.addColorStop(0.8, greyColor1);

	ctx.beginPath();
	ctx.arc(gX, gY, glossyGradSize, 0, 2 * PI);
	ctx.fillStyle = glossyGrad;
	ctx.fill();

	// character name
	const name = char.name.substring(0, 4).toUpperCase();

	ctx.font = 'bold 10px sans-serif';
	ctx.textAlign = 'center';

	// text shadow
	if (isDying) {
		ctx.fillStyle = shadowColor;
		ctx.fillText(name, x + 1, y + 2);
	} else {
		ctx.fillStyle = greyColor3;
		ctx.fillText(name, x - 1, y + 4);
	}

	// text
	if (isDying) {
		ctx.fillStyle = whiteColor;
	} else {
		ctx.fillStyle = blackColor;
	}
	ctx.fillText(name, x, y + 3);
};
