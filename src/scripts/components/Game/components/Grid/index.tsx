import React from 'react';

import { blockSize, gridSize } from 'data/game-config';
import { Position, IPosition } from 'modules/position';
import { IOnTileSelect, ActPhase } from 'modules/game';

interface IGridProps {
	readonly phase: ActPhase;
	readonly onSelect: IOnTileSelect;
	readonly movePath?: IPosition[];
	readonly moveArea?: IPosition[];
	readonly moveTarget?: IPosition;
	readonly skillTargetArea?: IPosition[];
	readonly skillTargets?: IPosition[];
	readonly skillEffectArea?: IPosition[];
	readonly skillEffectTargets?: IPosition[];
	readonly directArea?: IPosition[];
	readonly directTarget?: IPosition;
}

enum BlockType {
	NONE = '',
	SELECTED = 'is-selected',
	TARGETABLE = 'is-targetable',
	EFFECT_AREA = 'is-effectArea',
	TARGET_AREA = 'is-targetArea'
}

const selectBlock = (i: number, onSelect: IOnTileSelect) => () => {
	const pos = Position.create(i % gridSize, Math.floor(i / gridSize));
	onSelect(pos);
};

const getBlockType = (pos: IPosition, props: IGridProps) => {
	switch (props.phase) {
		case ActPhase.MOVE:
		case ActPhase.MOVE_ANIM:
			const isMoveArea = Position.isContained(pos, props.moveArea);
			const isMovePath = Position.isContained(pos, props.movePath);
			const isMoveTarget = Position.isEqual(pos, props.moveTarget);

			if (isMoveTarget) {
				return BlockType.SELECTED;
			} else if (isMovePath) {
				return BlockType.EFFECT_AREA;
			} else if (isMoveArea) {
				return BlockType.TARGET_AREA;
			}
			break;

		case ActPhase.ACTION:
		case ActPhase.ACTION_ANIM:
			const isSkillArea = Position.isContained(pos, props.skillTargetArea);
			const isSkillTarget = Position.isContained(pos, props.skillTargets);
			const isSkillEffectArea = Position.isContained(pos, props.skillEffectArea);
			const isSkillEffectTarget = Position.isContained(pos, props.skillEffectTargets);

			if (isSkillEffectTarget) {
				return BlockType.SELECTED;
			} else if (isSkillEffectArea) {
				return BlockType.EFFECT_AREA;
			} else if (isSkillTarget) {
				return BlockType.TARGETABLE;
			} else if (isSkillArea) {
				return BlockType.TARGET_AREA;
			}
			break;

		case ActPhase.DIRECT:
			const isDirectArea = Position.isContained(pos, props.directArea);
			const isDirectTarget = Position.isEqual(pos, props.directTarget);

			if (isDirectTarget) {
				return BlockType.SELECTED;
			} else if (isDirectArea) {
				return BlockType.TARGET_AREA;
			}
			break;

		default:
			throw new Error('Unsupported act phase');
	}
	return BlockType.NONE;
};

const Grid: React.SFC<IGridProps> = (props: IGridProps) => {
	const itemStyle: React.CSSProperties = {
		width: `${blockSize}px`,
		height: `${blockSize}px`
	};
	const grid: IPosition[] = [];

	// generate grid item coordinates
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			grid.push(Position.create(y, x));
		}
	}

	return (
		<div className="Grid">
			{grid.map((pos, i) => (
				<div className="Grid-item" key={i} style={itemStyle}>
					<div className={`Grid-item-block ${getBlockType(pos, props)}`} onClick={selectBlock(i, props.onSelect)} />
				</div>
			))}
		</div>
	);
};

export default Grid;
