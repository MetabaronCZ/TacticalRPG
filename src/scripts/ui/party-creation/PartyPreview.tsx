import React from 'react';
import { observer } from 'mobx-react';

import { sqrt3 } from 'core/number';
import { gridSize } from 'data/game-config';

import Character from 'modules/character';
import Player from 'modules/battle/player';
import { PlayerData } from 'modules/battle-configuration/player-data';
import { CharacterData } from 'modules/character-creation/character-data';
import {
	getCharacterPositions, getHexDimensions,
	getTileCoords, tileStyles, characterStyles, ITileCoords
} from 'modules/battle/grid';

import Canvas from 'ui/common/Canvas';

const positions = getCharacterPositions()[0];

const dummyPlayerConfig = new PlayerData(0, {});
const dummyPlayer = new Player(dummyPlayerConfig, []);

interface IProps {
	slots: Array<CharacterData | null>;
}

class PartyPreview extends Canvas<IProps> {
	private canvas = React.createRef<HTMLCanvasElement>();
	private ctx: CanvasRenderingContext2D | null = null;
	private slots: Array<Character | null> = [];

	private itemSize: number = 0;
	private canvasWidth: number = 0;
	private canvasHeight: number = 0;

	public componentDidMount() {
		this.setSlots();
		super.componentDidMount();
	}

	public componentDidUpdate() {
		this.setSlots();
		super.componentDidUpdate();
	}

	public render() {
		return (
			<canvas className="PartyPreview" ref={this.canvas} />
		);
	}

	public draw() {
		const canvas = this.canvas.current;
		const { ctx, itemSize, canvasWidth } = this;

		if (!ctx || !canvas) {
			throw new Error('HexaGrid could not be drawn: invalid canvas to draw');
		}
		const { slots } = this;

		// clear image
		this.clear();

		// draw tiles
		for (const tile of positions) {
			const coords = getTileCoords(tile, itemSize, canvasWidth);
			const { x, y } = this.getUpdatedCoords(coords);
			const style = tileStyles.default;
			tile.render(ctx, x, y, itemSize, style[0], style[1]);
		}

		// draw characters
		for (const character of slots) {
			if (!character || character.isDead()) {
				continue;
			}
			const coords = getTileCoords(character.position, itemSize, canvasWidth);
			const { x, y } = this.getUpdatedCoords(coords);
			const hex = getHexDimensions(itemSize);
			const style = characterStyles.violet;
			character.render(ctx, x, y, (hex.height / 2) - 2, style[0], style[1]);
		}
	}

	public setSize() {
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
		this.itemSize = size / ((2 * gridSize - 1) * sqrt3);

		const hex = getHexDimensions(this.itemSize);

		const canvasHeight = 3 * hex.height;
		const canvasWidth = size;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// set new dimensions and canvas resolution
		canvas.style.width = canvasWidth + 'px';
		canvas.style.height = canvasHeight + 'px';
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
	}

	private setSlots() {
		this.slots = this.props.slots.map((data, d) => {
			if (!data) {
				return null;
			}
			return new Character(data, positions[d], 'N', dummyPlayer);
		});
	}

	private clear() {
		const { ctx, canvasWidth, canvasHeight } = this;

		if (ctx) {
			ctx.fillStyle = `rgb(0, 0, 0)`;
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
