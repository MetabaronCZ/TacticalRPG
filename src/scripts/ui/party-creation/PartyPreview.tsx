import React from 'react';
import { observer } from 'mobx-react';

import { sqrt3 } from 'core/number';
import { gridSize } from 'data/game-config';

import Character from 'modules/character';
import Player from 'modules/battle/player';
import { PlayerData } from 'modules/battle-configuration/player-data';
import { ICharacterData } from 'modules/character-creation/character-data';
import {
	getCharacterPositions, getHexDimensions,
	getTileCoords, tileStyles, characterStyles, ITileCoords
} from 'modules/battle/grid';

import { renderTile } from 'modules/graphics/tile';
import { renderCharacter } from 'modules/graphics/character';

import Canvas from 'ui/common/Canvas';

const positions = getCharacterPositions()[0];
const gridMargin = 20; // safe area around canvas content

const dummyPlayerConfig = new PlayerData(0, {});
const dummyPlayer = new Player(dummyPlayerConfig, []);

interface IProps {
	slots: Array<ICharacterData | null>;
}

class PartyPreview extends Canvas<IProps> {
	private canvas = React.createRef<HTMLCanvasElement>();
	private ctx: CanvasRenderingContext2D | null = null;
	private slots: Array<Character | null> = [];

	private itemSize = 0;
	private gridWidth = 0; // canvas drawable area width
	private gridHeight = 0; // canvas drawable area height
	private canvasWidth = 0;
	private canvasHeight = 0;

	public componentDidMount(): void {
		this.setSlots();
		super.componentDidMount();
	}

	public componentDidUpdate(): void {
		this.setSlots();
		super.componentDidUpdate();
	}

	public render(): React.ReactNode {
		return (
			<canvas className="PartyPreview" ref={this.canvas} />
		);
	}

	public draw(): void {
		const canvas = this.canvas.current;
		const { ctx, itemSize, gridWidth } = this;

		if (!ctx || !canvas) {
			throw new Error('HexaGrid could not be drawn: invalid canvas to draw');
		}
		const { slots } = this;

		// clear image
		this.clear();

		// draw tiles
		for (const tile of positions) {
			const coords = getTileCoords(tile, itemSize, gridWidth, gridMargin);
			const { x, y } = this.getUpdatedCoords(coords);
			const style = tileStyles.default;
			renderTile(tile, ctx, x, y, itemSize, style[0], style[1]);
		}

		// draw characters
		for (const char of slots) {
			if (!char || char.isDead()) {
				continue;
			}
			const charData = char.serialize();
			const coords = getTileCoords(charData.position, itemSize, gridWidth, gridMargin);
			const { x, y } = this.getUpdatedCoords(coords);
			const hex = getHexDimensions(itemSize);
			const style = characterStyles.violet;
			renderCharacter(charData, ctx, x, y, (hex.height / 2) - 2, style[0], style[1]);
		}
	}

	public setSize(): void {
		const canvas = this.canvas.current;

		if (!canvas) {
			throw new Error('PartyPreview could not be initialized: invalid canvas element');
		}
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('PartyPreview could not be initialized: 2D context not supported');
		}
		this.ctx = ctx;

		// reset previous dimensions
		canvas.style.width = '';
		canvas.style.height = '';
		canvas.width = 0;
		canvas.height = 0;

		// get maximum possible width
		canvas.style.width = '100%';

		const size = canvas.offsetWidth;
		this.gridWidth = size - 2 * gridMargin;
		this.itemSize = this.gridWidth / ((2 * gridSize - 1) * sqrt3);

		const hex = getHexDimensions(this.itemSize);
		this.gridHeight = 3 * hex.height;

		const canvasWidth = size;
		const canvasHeight = this.gridHeight + 2 * gridMargin;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// set new dimensions and canvas resolution
		canvas.style.width = canvasWidth + 'px';
		canvas.style.height = canvasHeight + 'px';
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
	}

	private setSlots(): void {
		this.slots = this.props.slots.map((data, d) => {
			if (!data) {
				return null;
			}
			return new Character(data, positions[d], 'N', dummyPlayer);
		});
	}

	private clear(): void {
		const { ctx, canvasWidth, canvasHeight } = this;

		if (ctx) {
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			ctx.fill();
		}
	}

	// transform coordinates to non-typical canvas height
	private getUpdatedCoords(coords: ITileCoords): ITileCoords {
		const { canvasWidth, canvasHeight } = this;
		const offset = canvasWidth - canvasHeight;
		return {
			x: coords.x,
			y: coords.y - offset
		};
	}
}

export default observer(PartyPreview);
