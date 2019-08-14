import { PI } from 'core/number';

import Tile from 'modules/geometry/tile';
import Sprite from 'modules/graphics/Sprite';
import { colorToRGB, Color } from 'modules/color';
import { getHexDimensions } from 'modules/battle/grid';

class TileSprite extends Sprite<Tile> {
	public render(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, background: Color, border: Color) {
		this.renderHex(ctx, x, y, size - 1, border); // border
		this.renderHex(ctx, x, y, size - 3, background); // background
		this.renderHexCoords(ctx, x, y, size); // coords
	}

	public renderBoundingBox(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		const tile = this.self;
		this.renderHex(ctx, x, y, size, tile.getColor());
	}

	private renderHex(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: Color) {
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
	}

	private renderHexCoords(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		const { width, height } = getHexDimensions(size);
		const tile = this.self;

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
	}
}

export default TileSprite;
