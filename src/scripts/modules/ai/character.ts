import { aiActionDelay } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Engine from 'modules/battle/engine';
import Command from 'modules/battle/command';
import { IActState, ActPhaseID } from 'modules/battle/act';

import { MovePhaseID } from 'modules/battle/act/move-phase';
import { CommandPhaseID } from 'modules/battle/act/command-phase';
import { DirectionPhaseID } from 'modules/battle/act/direct-phase';
import { ReactionPhaseID, ActiveReactionPhaseID } from 'modules/battle/act/reaction-phase';

import AIPlayer from 'modules/ai/player';
import CharacterRole from 'modules/ai/role';

import BTree from 'modules/ai/behavioral-tree/tree';
import BT, { BTData } from 'modules/ai/behavioral-tree';
import BTPhaseSelector from 'modules/ai/phase-selector';

import btMove from 'modules/ai/actions/move';
import btEvade from 'modules/ai/actions/evade';
import btBlock from 'modules/ai/actions/block';
import btShield from 'modules/ai/actions/shield';
import btDirect from 'modules/ai/actions/direct';
import btTarget from 'modules/ai/actions/target';
import btCombat from 'modules/ai/actions/combat';
import btDecide from 'modules/ai/actions/decide';
import btCommand from 'modules/ai/actions/command';
import btDontReact from 'modules/ai/actions/dont-react';
import btEvadeTo from 'modules/ai/actions/evasion-select';
import btResetMemory from 'modules/ai/actions/reset-memory';

const delayAction = (fn: () => void): void => {
	setTimeout(() => fn(), aiActionDelay);
};

export interface IAIDecision {
	readonly command: Command;
	readonly target: Tile;
	readonly move: Tile;
}

interface IAICharacterMemory {
	ally: Character[];
	enemy: Character[];
	obstacles: Tile[];
	decision: IAIDecision | null;

	hasMoved: boolean;
	commandTargeted: boolean;
	commandSelected: boolean;
	commandConfirmed: boolean;
}

export interface IAIData extends BTData {
	act: IActState;
	commands: Command[];
	memory: IAICharacterMemory;
	readonly selectTile: (tile: Tile) => void;
	readonly selectCommand: (cmd: Command) => void;
}

class AICharacter {
	public readonly character: Character;
	public readonly role: CharacterRole;

	private readonly bt: BTree<IAIData>;

	private memory: IAICharacterMemory = {
		decision: null,
		hasMoved: false,
		commandTargeted: false,
		commandSelected: false,
		commandConfirmed: false,
		ally: [],
		enemy: [],
		obstacles: []
	}
	private selectTile: (tile: Tile) => void;
	private selectCommand: (cmd: Command) => void;

	constructor(character: Character, engine: Engine, role: CharacterRole) {
		this.character = character;
		this.role = role;

		this.selectTile = (tile: Tile) => {
			delayAction(() => engine.selectTile(tile));
		};

		this.selectCommand = (cmd: Command) => {
			delayAction(() => engine.selectCommand(cmd));
		};

		this.bt = this.constructBT();
	}

	public update(act: IActState, commands: Command[]): void {
		const { character, memory } = this;

		if (character.isDead()) {
			return;
		}
		const player = character.player as AIPlayer;

		// update memory
		memory.enemy = player.getEnemy(true);
		memory.ally = player.getCharacters();
		memory.obstacles = player.getObstacles();

		// create AI data
		const data: IAIData = {
			act,
			commands,
			memory,
			selectTile: tile => this.selectTile(tile),
			selectCommand: command => this.selectCommand(command)
		};

		// update behavioral tree
		this.bt.run(data);
	}

	private constructBT(): BTree<IAIData> {
		return BT.Tree<IAIData>(
			new BTPhaseSelector<ActPhaseID | null>(data => data.act.phase, {
				COMBAT: null,
				MOVEMENT: new BTPhaseSelector<MovePhaseID>(data => data.act.phases.MOVEMENT.phase, {
					SUSPENDED: null,
					ANIMATION: null,
					SELECTED: null,
					IDLE: BT.Sequence([btDecide(), btMove(), btCommand()])
				}),
				COMMAND: new BTPhaseSelector<CommandPhaseID>(data => data.act.phases.COMMAND.phase, {
					SUSPENDED: null,
					DONE: null,
					IDLE: null,
					TARGETING: BT.Sequence([btTarget(), btCombat()])
				}),
				REACTION: new BTPhaseSelector<ReactionPhaseID>(data => data.act.phases.REACTION.phase, {
					SUSPENDED: null,
					DONE: null,
					IDLE: new BTPhaseSelector<ActiveReactionPhaseID>(data => data.act.phases.REACTION.reaction.phase, {
						SUSPENDED: null,
						IDLE: BT.Selector([btEvade(), btBlock(), btShield(), btDontReact()]),
						EVASION: btEvadeTo()
					})
				}),
				DIRECTION: new BTPhaseSelector<DirectionPhaseID>(data => data.act.phases.DIRECTION.phase, {
					SUSPENDED: null,
					IDLE: BT.Sequence([btDirect(), btResetMemory()])
				})
			})
		);
	}
}

export default AICharacter;
