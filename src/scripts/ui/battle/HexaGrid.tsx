import React from 'react';

import { sqrt3 } from 'core/number';
import { gridSize } from 'data/game-config';

import { getTiles } from 'modules/geometry/tiles';
import {
	getTileStyle, getCharacterStyle, getHexDimensions, getTileCoords,
	ITileCoords
} from 'modules/battle/grid';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { IActState } from 'modules/battle/act';
import { IBattleInfo } from 'modules/battle/battle-info';

import Canvas from 'ui/common/Canvas';
import GridBattleInfo from 'ui/battle/GridBattleInfo';
import CharacterTooltip from 'ui/battle/CharacterTooltip';

const gridMargin = 20; // safe area around canvas content
const tiles = getTiles();

interface IHovered {
	x: number;
	y: number;
	tile: Tile | null;
}

interface IProps {
	readonly act: IActState;
	readonly characters: Character[];
	readonly battleInfo: IBattleInfo[];
	readonly onTileSelect: (tile: Tile) => void;
}

interface IState {
	hovered: IHovered;
}

class HexaGrid extends Canvas<IProps, IState> {
	public state: IState = {
		hovered: {
			x: 0,
			y: 0,
			tile: null
		}
	};
	private readonly offCanvas = document.createElement('canvas');
	private readonly hitCanvas = document.createElement('canvas');
	private readonly offCtx: CanvasRenderingContext2D;
	private readonly hitCtx: CanvasRenderingContext2D;

	private canvas = React.createRef<HTMLCanvasElement>();
	private ctx: CanvasRenderingContext2D | null = null;

	private itemSize = 0; // grid hexagon radius
	private gridSize = 0; // canvas drawable area width / height
	private canvasSize = 0; // canvas width / height

	constructor(props: IProps) {
		super(props);

		const offCtx = this.offCanvas.getContext('2d');
		const hitCtx = this.hitCanvas.getContext('2d');

		if (!offCtx || !hitCtx) {
			throw new Error('HexaGrid could not be initialized: 2D context not supported');
		}
		this.offCtx = offCtx;
		this.hitCtx = hitCtx;
	}

	public render(): React.ReactNode {
		const { x, y, tile } = this.state.hovered;
		const { characters, battleInfo } = this.props;
		const char = characters.find(ch => tile === ch.position);

		const info = battleInfo.map(i => ({
			info: i,
			...this.getTilePctCoords(i.position)
		}));

		return (
			<div className="HexaGrid">
				<canvas
					className="HexaGrid-canvas"
					ref={this.canvas}
					onMouseUp={this.selectTile}
					onMouseMove={this.hoverTile}
					onMouseLeave={this.canvasLeave}
				/>
				<GridBattleInfo info={info} />

				{!!char && (
					<CharacterTooltip
						character={char}
						size={this.itemSize}
						orientation={y > 50 ? 'bottom' : 'top'}
						x={x}
						y={y}
					/>
				)}
			</div>
		);
	}

	public draw(): void {
		const canvas = this.canvas.current;
		const { act, characters } = this.props;
		const { ctx, itemSize, gridSize } = this;

		if (!ctx || !canvas) {
			throw new Error('HexaGrid could not be drawn: invalid canvas to draw');
		}
		const { offCanvas, offCtx, hitCtx } = this;

		// clear image
		this.clear();

		// draw tiles
		for (const tile of tiles) {
			const { x, y } = getTileCoords(tile, itemSize, gridSize, gridMargin);

			// hit-box
			tile.renderBoundingBox(hitCtx, x, y, itemSize);

			// hex
			const style = getTileStyle(tile, act);
			tile.render(offCtx, x, y, itemSize, style[0], style[1]);
		}

		// draw characters
		for (const character of characters) {
			if (character.isDead()) {
				continue;
			}
			const { x, y } = getTileCoords(character.position, itemSize, gridSize, gridMargin);
			const isActor = (character === this.props.act.actor);
			const style = getCharacterStyle(character, isActor);
			const hex = getHexDimensions(itemSize);
			character.render(offCtx, x, y, (hex.height / 2) - 2, style[0], style[1]);
		}

		// swap drawing buffers
		ctx.drawImage(offCanvas, 0, 0);
	}

	public setSize(): void {
		const canvas = this.canvas.current;

		if (!canvas) {
			throw new Error('HexaGrid could not be initialized: invalid canvas element');
		}
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('HexaGrid could not be initialized: 2D context not supported');
		}
		const { offCanvas, hitCanvas } = this;
		this.ctx = ctx;

		// reset previous dimensions
		canvas.style.width = '';
		canvas.style.height = '';
		canvas.width = 0;
		canvas.height = 0;

		// get maximum possible width
		canvas.style.width = '100%';

		const size = canvas.offsetWidth;
		this.canvasSize = size;
		this.gridSize = size - 2 * gridMargin;
		this.itemSize = this.gridSize / ((2 * gridSize - 1) * sqrt3);

		// set new dimensions and canvas resolution
		for (const c of [canvas, offCanvas, hitCanvas]) {
			c.style.width = size + 'px';
			c.style.height = size + 'px';
			c.width = size;
			c.height = size;
		}
	}

	private clear(): void {
		const { offCtx, hitCtx, canvasSize } = this;

		offCtx.fillStyle = 'rgb(53, 53, 53)';
		offCtx.fillRect(0, 0, canvasSize, canvasSize);
		offCtx.fill();

		hitCtx.fillStyle = 'rgb(0, 0, 0)';
		hitCtx.fillRect(0, 0, canvasSize, canvasSize);
		hitCtx.fill();
	}

	private getMouseOver(e: React.MouseEvent<HTMLCanvasElement>): IHovered {
		const canvas = e.currentTarget;

		const box = canvas.getBoundingClientRect();
		const x = e.clientX - box.left;
		const y = e.clientY - box.top;
		const point = this.hitCtx.getImageData(x, y, 1, 1).data;

		for (const t of tiles) {
			const color = t.getColor();

			if (color[0] === point[0] && color[1] === point[1] && color[2] === point[2]) {
				return {
					tile: t,
					...this.getTilePctCoords(t)
				};
			}
		}
		return {
			tile: null,
			...this.getTilePctCoords({ x, y })
		};
	}

	private selectTile = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		e.preventDefault();

		const { tile } = this.getMouseOver(e);

		if (tile) {
			this.props.onTileSelect(tile);
		}
	}

	private hoverTile = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		e.preventDefault();

		const current = this.state.hovered;
		const hovered = this.getMouseOver(e);

		if (hovered.tile !== current.tile) {
			this.setState({ hovered });
		}
	}

	private canvasLeave = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		e.preventDefault();

		// clear tooltip
		this.setState({
			hovered: {
				x: 0,
				y: 0,
				tile: null
			}
		});
	}

	private getTilePctCoords = (tile: Tile | ITileCoords): ITileCoords => {
		const { itemSize, gridSize, canvasSize } = this;
		let coords: ITileCoords = tile;

		if (tile instanceof Tile) {
			coords = getTileCoords(tile, itemSize, gridSize, gridMargin);
		}
		return {
			x: 100 * coords.x / canvasSize,
			y: 100 * coords.y / canvasSize
		};
	}
}

export default HexaGrid;
