import { PI } from 'core/number';

import Tile from 'modules/geometry/tile';
import { colorToRGB, Color } from 'modules/color';
import { getHexDimensions } from 'modules/battle/grid';

const renderHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: Color): void => {
	ctx.beginPath();
	ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

	for (let i = 0; i < 6; i++) {
		ctx.lineTo(
			x + size * Math.cos(2 * i * PI / 6),
			y + size * Math.sin(2 * i * PI / 6)
		);
	}
	ctx.fillStyle = colorToRGB(color);
	ctx.fill();
};

const renderHexCoords = (tile: Tile, ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void => {
	const { width, height } = getHexDimensions(size);

	ctx.save();

	ctx.font = '8px sans-serif';
	ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';

	ctx.textAlign = 'left';
	ctx.fillText(tile.x + '', x - (1 / 4) * width, y - (1 / 8) *  height);

	ctx.textAlign = 'right';
	ctx.fillText(tile.z + '', x + (1 / 4) * width, y - (1 / 8) *  height);

	ctx.textAlign = 'center';
	ctx.fillText(tile.y + '', x, y + (1 / 3) * height);

	ctx.restore();
};

export const renderTile = (tile: Tile, ctx: CanvasRenderingContext2D, x: number, y: number, size: number, background: Color, border: Color, showCoords = true): void => {
	renderHex(ctx, x, y, size - 1, border); // border
	renderHex(ctx, x, y, size - 3, background); // background

	if (showCoords) {
		renderHexCoords(tile, ctx, x, y, size); // coords
	}
};

export const renderTileBoundingBox = (tile: Tile, ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void => {
	renderHex(ctx, x, y, size, tile.getColor());
};
