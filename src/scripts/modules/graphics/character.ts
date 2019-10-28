import { PI } from 'core/number';

import { colorToRGB, Color, getCrossColor } from 'modules/color';
import { dirToIndex } from 'modules/geometry/direction';

import { ICharacterSnapshot } from 'modules/character';

const dirSize = 4; // size of character direction circle visual

export const renderCharacter = (char: ICharacterSnapshot, ctx: CanvasRenderingContext2D, x: number, y: number, size: number, background: Color, border: Color): void => {
	const isDying = char.dying;

	// shadow
	ctx.beginPath();
	ctx.arc(x - size * (1 / 4), y + size * (1 / 4), size, 0, 2 * PI);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
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

	if (char.animation && char.animation.isRunning() && 'COMBAT' === char.animation.type && char.id === char.animation.source.id) {
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
	glowGrad.addColorStop(0, 'rgba(255, 250, 100, 0.5)');
	glowGrad.addColorStop(1, 'rgba(255, 250, 100, 0)');

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
		ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
		ctx.fill();

		// direction circle
		ctx.beginPath();
		ctx.arc(dirX, dirY, dirSize, 0, 2 * PI);
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fill();
	}

	// glossy effect
	const glossyGradSize = size * (3 / 5);
	const gX = x + size * (1 / 4);
	const gY = y - size * (1 / 4);

	const glossyGrad = ctx.createLinearGradient(gX , gY, gX - glossyGradSize, gY + glossyGradSize);
	glossyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
	glossyGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0)');

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
		ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
		ctx.fillText(name, x + 1, y + 2);
	} else {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
		ctx.fillText(name, x - 1, y + 4);
	}

	// text
	if (isDying) {
		ctx.fillStyle = 'rgb(255, 255, 255)';
	} else {
		ctx.fillStyle = 'rgb(0, 0, 0)';
	}
	ctx.fillText(name, x, y + 3);
};
