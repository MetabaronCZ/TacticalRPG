import React from 'react';

import { Position, IPosition } from 'models/position';
import { blockSize, gridSize, IOnTileSelect } from 'components/Game';

interface IGridProps {
	onSelect: IOnTileSelect;
	movePath?: IPosition[];
	moveArea?: IPosition[];
	moveTarget?: IPosition;
	skillTargetArea?: IPosition[];
	skillTargets?: IPosition[];
	skillEffectArea?: IPosition[];
	skillEffectTargets?: IPosition[];
}

const selectBlock = (i: number, onSelect: IOnTileSelect) => () => {
	const pos = Position.create(i % gridSize, Math.floor(i / gridSize));
	onSelect(pos);
};

const Grid: React.SFC<IGridProps> = ({ onSelect, ...props }) => {
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
			{grid.map((pos, i) => {
				const isMoveAction = (props.moveArea || props.movePath || props.moveTarget);
				const isSKillAction = (props.skillTargetArea || props.skillTargets || props.skillEffectArea || props.skillEffectTargets);
				let blockType = '';

				if (isMoveAction) {
					const isMoveArea = Position.isContained(pos, props.moveArea);
					const isMovePath = Position.isContained(pos, props.movePath);
					const isMoveTarget = Position.isEqual(pos, props.moveTarget);

					if (isMoveTarget) {
						blockType = 'is-selected';
					} else if (isMovePath) {
						blockType = 'is-effectArea';
					} else if (isMoveArea) {
						blockType = 'is-targetArea';
					}

				} else if (isSKillAction) {
					const isSkillArea = Position.isContained(pos, props.skillTargetArea);
					const isSkillTarget = Position.isContained(pos, props.skillTargets);
					const isSkillEffectArea = Position.isContained(pos, props.skillEffectArea);
					const isSkillEffectTarget = Position.isContained(pos, props.skillEffectTargets);

					if (isSkillEffectTarget) {
						blockType = 'is-selected';
					} else if (isSkillEffectArea) {
						blockType = 'is-effectArea';
					} else if (isSkillTarget) {
						blockType = 'is-targetable';
					} else if (isSkillArea) {
						blockType = 'is-targetArea';
					}
				}
				return (
					<div className="Grid-item" key={i} style={itemStyle}>
						<div className={`Grid-item-block ${blockType}`} onClick={selectBlock(i, onSelect)} />
					</div>
				);
			})}
		</div>
	);
};

export default Grid;
