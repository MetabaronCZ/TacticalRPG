import * as ArrayUtils from 'core/array';
import * as NumberUtils from 'core/number';
import Animation, { IAnimationStep } from 'core/animation';

import { gridSize, moveAnimDuration, skillAnimDuration, smallShieldBlock } from 'data/game-config';

import Actor from 'engine/actor';
import Damage from 'engine/damage';
import Reactor from 'engine/reactor';
import Position from 'engine/position';
import Character from 'engine/character';
import Direction from 'engine/direction';
import BattleInfo from 'engine/battle-info';
import SkillUtils from 'engine/skill/utils';
import CharacterAction from 'engine/character-action';
import CharacterActions from 'engine/character-actions';
import { getShortestPath } from 'engine/pathfinding';
import StatusEffects from 'engine/status-effect';

import GamePhaseMove from 'engine/game-step/movement';
import GamePhaseAct from 'engine/game-step/action';
import GamePhaseDirect from 'engine/game-step/direction';

type GameStepPhase =
	'IDLE' |
	'MOVE:IDLE' | 'MOVE:ANIMATION' |
	'SKILL:IDLE' | 'SKILL:SELECTED' | 'SKILL:ANIMATION' |
	'REACT:IDLE' | 'REACT:EVASION' |
	'DIRECT:START';

export type ICharacterAnimationCallback = (step: IAnimationStep) => void;

class GameStep {
	private readonly characters: Character[];
	private readonly actor: Actor;
	private readonly onEnd: () => void;

	private readonly move: GamePhaseMove;
	private readonly act: GamePhaseAct;
	private readonly direct: GamePhaseDirect;

	private phase: GameStepPhase = 'IDLE';

	private reactors: Reactor[] = [];
	private reactor: Reactor|null = null;
	private action: CharacterAction|null = null;
	private actions: CharacterAction[] = [];
	private battleInfo: BattleInfo[] = [];

	constructor(actor: Character, characters: Character[], onEnd: () => void) {
		this.actor = new Actor(actor);
		this.characters = characters;
		this.onEnd = onEnd;

		this.move = new GamePhaseMove(actor, characters);
		this.act = new GamePhaseAct(actor, characters);
		this.direct = new GamePhaseDirect(actor);

		console.log(this.move, this.act, this.direct);

		this.start();
	}

	public getActions(): CharacterAction[] {
		return this.actions;
	}

	public updateActions() {
		const { phase, actor, action, reactor} = this;

		switch (phase) {
			case 'IDLE':
			case 'MOVE:ANIMATION':
			case 'SKILL:ANIMATION':
			case 'DIRECT:START':
				this.actions = [];
				break;

			case 'MOVE:IDLE':
				this.actions = CharacterActions.getIdleActions(actor.getCharacter());
				break;

			case 'SKILL:IDLE':
				this.actions = CharacterActions.getSkillActions();
				break;

			case 'SKILL:SELECTED':
				if (!action) {
					throw new Error('Could not set actions: no action');
				}
				this.actions = CharacterActions.getSkillConfirmActions(action, actor.getSkillTargets());
				break;

			case 'REACT:IDLE':
				if (null === reactor) {
					throw new Error('Could not set actions: no reactor');
				}
				this.actions = CharacterActions.getReactiveActions(reactor.getCharacter());
				break;

			case 'REACT:EVASION':
				this.actions = CharacterActions.getEvasiveActions();
				break;

			default:
				throw new Error('Could not set actions: invalid game phase ' + phase);
		}
	}

	public start() {
		this.actor.startTurn();
		this.moveInit();
		this.moveStart();
	}

	public end() {
		this.actor.endTurn();
		this.onEnd();
	}

	public moveInit() {
		if ('IDLE' !== this.phase) {
			throw new Error('Could not init move: invalid phase ' + this.phase);
		}
		const obstacles = this.characters.map(char => char.getPosition());
		this.actor.initMove(obstacles);
	}

	public moveStart() {
		this.phase = 'MOVE:IDLE';
		this.updateActions();
	}

	public moveSelect(position: Position) {
		if ('MOVE:IDLE' !== this.phase) {
			throw new Error('Could not select move target: invalid phase ' + this.phase);
		}
		const actor = this.actor;
		const characters = this.characters;
		const moveArea = this.actor.getMovable();

		if (!position.isContained(moveArea)) {
			return;
		}
		const obstacles = characters.map(char => char.getPosition());

		// add non-moveArea positions in obstacles
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				const pos = new Position(x, y);

				if (pos.isContained(moveArea) || pos.isContained(obstacles)) {
					continue;
				}
				obstacles.push(pos);
			}
		}
		const path = getShortestPath(actor.getPosition(), position, obstacles);

		if (!path.length) {
			return;
		}
		this.phase = 'MOVE:ANIMATION';

		actor.selectMove(position, path);
		this.updateActions();
	}

	public moveRun(cb: ICharacterAnimationCallback) {
		if ('MOVE:ANIMATION' !== this.phase) {
			throw new Error('Could not run move animation: invalid phase ' + this.phase);
		}
		const actor = this.actor;
		const path = actor.getMovePath().slice(1); // path without actor position
		const timing: number[] = Array(path.length).fill(moveAnimDuration);

		// animate movement
		const moveAnim = new Animation(timing, step => {
			const tile = path[step.number];
			const dir = Direction.resolve(actor.getPosition(), tile);

			// update actor
			actor.move(tile, dir);

			if (step.isLast) {
				this.moveEnd();
			}
			cb(step);
		});

		// start move animation
		moveAnim.start();
	}

	public moveEnd() {
		if ('MOVE:ANIMATION' !== this.phase) {
			throw new Error('Could not end move: invalid phase ' + this.phase);
		}
		this.actor.endMove();
		this.moveStart();
	}

	public skillStart(action: CharacterAction, cb: ICharacterAnimationCallback) {
		if ('IDLE' !== this.phase) {
			throw new Error('Could not start skill: invalid phase ' + this.phase);
		}

		if (!action.isActive() || !action.getSkills().length) {
			throw new Error('Could not start skill: invalid action');
		}
		this.action = action;
		this.phase = 'SKILL:IDLE';

		// update actor values
		this.actor.startSkill(action, this.characters);
		this.updateActions();

		// pre-select target of skill with SELF target
		const targets = this.actor.getSkillTargets();
		const skills = SkillUtils.getByID(action.getSkills());

		if (1 === targets.length && skills[0].isTarget('SELF')) {
			this.skillSelect(targets[0], cb);
		}
	}

	public skillSelect(position: Position, cb: ICharacterAnimationCallback) {
		const { phase, actor, action } = this;

		if ('SKILL:IDLE' !== phase) {
			throw new Error('Could not select skill: invalid phase ' + phase);
		}
		const targets = actor.getSkillTargets();

		if (!actor || !action || !position.isContained(targets)) {
			return;
		}

		// confirm target on double selection
		const prevTarget = actor.getSkillEffectTarget();

		if (prevTarget && Position.isEqual(prevTarget, position)) {
			this.phase = 'SKILL:SELECTED';
			this.skillPrepare(cb);
			return;
		}

		// get skill effect area
		const skills = SkillUtils.getByID(action.getSkills() || []);

		if (!skills) {
			return;
		}
		const effectAreas = skills.map(s => SkillUtils.getEffectArea(s, actor.getPosition(), position));
		const effectArea = ArrayUtils.getIntersection(effectAreas, pos => pos.getX() + '|' + pos.getY());
		const effectTargets = SkillUtils.getEffectTargets(actor.getCharacter(), skills[0], effectArea, this.characters);

		this.phase = 'SKILL:SELECTED';

		actor.selectSkill(position, effectTargets, effectArea);
		this.updateActions();
	}

	public skillPrepare(cb: ICharacterAnimationCallback) {
		const { actor, action, phase } = this;

		if ('SKILL:SELECTED' !== phase) {
			throw new Error('Could not run skill: invalid phase ' + phase);
		}
		const targetTile = actor.getSkillEffectTarget();
		const targets = actor.getSkillEffectTargets();

		if (!action || !targetTile) {
			throw new Error('Could not run skill: invalid skill data');
		}

		if (!targets || !targets.length) {
			this.skillFinish();
			return;
		}
		this.phase = 'REACT:IDLE';

		// assign action reactors
		this.reactors = targets.map(tgt => new Reactor(tgt));

		// update actor
		actor.skillRun();

		// run avesive actions for each reactor before running skill
		this.reactStart(cb);
	}

	public skillRun(cb: ICharacterAnimationCallback) {
		const { phase, action, actor, reactors } = this;
		const actorChar = actor.getCharacter();

		if ('REACT:IDLE' !== phase) {
			throw new Error('Could not run skill animation: invalid phase ' + phase);
		}
		this.phase = 'SKILL:ANIMATION';
		this.updateActions();

		const skillEffectArea = actor.getSkillEffectArea();

		if (!reactors.length || null === action) {
			this.skillEnd();
			return;
		}
		const timing = Array(reactors.length).fill(skillAnimDuration);

		// animate skill action
		const skillAnim = new Animation(timing, step => {
			const target = reactors[step.number];

			if (!target.isDead()) {
				const targetChar = target.getCharacter();
				const targetPos = target.getPosition();

				if (targetPos.isContained(skillEffectArea)) {
					if (targetChar.getStatus().find(status => 'BLOCK_LARGE' === status.id)) {
						// target blocked attack with shield
						targetChar.removeStatus('BLOCK_LARGE');
						this.setBattleInfo('Blocked', targetPos);

					} else {
						// caclulate character changes
						let info: string[] = [];

						for (const skill of action.getSkills()) {
							const skillData = SkillUtils.getByID([skill])[0];
							const skillStatus = skillData.getStatus();
							let phyDmg = 0;
							let elmDmg = 0;

							// physical damage
							phyDmg = Damage.getPhysical(actorChar, targetChar, skill);
							info.push(NumberUtils.format(phyDmg));

							// elemental damage
							if (skillData.getElementalDamage()) {
								elmDmg = Damage.getElemental(actorChar, targetChar, skill);
								info.push(NumberUtils.format(elmDmg));
							}

							// status effects
							const effects = Damage.getStatusEffects(actorChar, targetChar, skill);

							// apply skill damage / statuses to target
							targetChar.applySkill(phyDmg + elmDmg, effects);

							if (target.isDead()) {
								info.push('Dead');
								break;

							} else if (skillStatus.length) {
								// add skill effects
								info = [...info, ...skillStatus.map(id => StatusEffects.get(id)().title)];
							}

							// show small shield block info
							if (-1 !== effects.indexOf('BLOCK_SMALL')) {
								targetChar.removeStatus('BLOCK_SMALL');
								info.unshift(`Blocked (${smallShieldBlock})`);
							}
						}
						let infoTiming = Array(info.length).fill(0);
						infoTiming = infoTiming.map(i => NumberUtils.randomBetween(250, 350));

						const infoAnim = new Animation(infoTiming, infoStep => {
							this.setBattleInfo(info[infoStep.number], targetPos);
						});

						infoAnim.start();
					}

				} else {
					// target evaded skill action
					this.setBattleInfo('Evaded', targetPos);
				}
			}

			if (step.isLast) {
				// reduce actor AP
				actorChar.skillReduceAP(action.getCost());
				this.skillEnd();
				return;
			}
		});

		// start animation
		skillAnim.start();
	}

	public skillEnd() {
		if ('SKILL:ANIMATION' !== this.phase) {
			throw new Error('Could not end skill: invalid phase ' + this.phase);
		}
		this.actor.endSkill();
		this.action = null;
		this.reactors = [];
	}

	public skillPass() {
		this.actor.endSkill();
		this.moveStart();
	}

	public skillFinish() {
		this.skillEnd();
		this.directStart();
	}

	public reactStart(cb: ICharacterAnimationCallback) {
		const { phase, reactors } = this;

		if ('REACT:IDLE' !== phase) {
			throw new Error('Could not start react: invalid phase ' + phase);
		}

		if (!reactors.length) {
			this.skillRun(cb);
			return;
		}
		this.reactor = reactors[0] || null;

		if (null === this.reactor) {
			// goto reaction of next target character
			this.reactEnd(cb);
			return;
		}
		this.updateActions();
	}

	public reactRun(cb: ICharacterAnimationCallback) {
		const { phase, action, reactor } = this;

		if ('REACT:IDLE' !== phase) {
			throw new Error('Could not start react: invalid phase ' + phase);
		}

		if (null === reactor || null === action) {
			throw new Error('Could not react: no reacting character or action');
		}
		const skills = action.getSkills();

		if (!skills.length) {
			throw new Error('Could not react: no action skill');
		}
		const skillId = skills[0];

		switch (skillId) {
			case 'EVADE':
				this.phase = 'REACT:EVASION';

				const obstacles = this.characters.map(char => char.getPosition());
				const evasionArea = reactor.getPosition().getSideTiles(obstacles);

				// update reacting character
				reactor.startEvasion(evasionArea);
				this.updateActions();

			case 'SHIELD_SMALL_BLOCK':
				// apply shield block small
				reactor.applyStatus('BLOCK_SMALL');
				this.reactEnd(cb);

			case 'SHIELD_LARGE_BLOCK':
				// apply shield block large
				reactor.applyStatus('BLOCK_LARGE');
				this.reactEnd(cb);

			default:
				throw new Error('Invalid reaction skill');
		}
	}

	public reatEvasionSelect(position: Position, cb: ICharacterAnimationCallback) {
		const { phase, action, reactor } = this;

		if ('REACT:EVASION' !== phase) {
			throw new Error('Could not select evasion target: invalid phase ' + phase);
		}
		if (null === reactor) {
			throw new Error('Could not select evasion target: no reacting character');
		}
		if (null === action || !action.getSkills().length) {
			throw new Error('Could not select evasion target: no action skills');
		}
		const evasible = reactor.getEvasionArea();

		if (!position.isContained(evasible)) {
			return;
		}
		const skills = SkillUtils.getByID(action.getSkills());
		const cost = skills[0].getCost();

		// update reacting character
		reactor.evade(position, cost);

		this.reactEnd(cb);
	}

	public reactEnd(cb: ICharacterAnimationCallback) {
		this.reactors.slice(1);
		this.reactStart(cb);
	}

	public directStart() {
		const actor = this.actor;
		const directions = actor.getPosition().getSideTiles();

		if (!directions.length) {
			this.end();
			return;
		}
		this.phase = 'DIRECT:START';
		this.action = CharacterActions.directAction;

		// show available directions
		actor.startDirect(directions);

		this.updateActions();
	}

	public directSelect(position: Position) {
		const actor = this.actor;
		const directArea = actor.getDirectArea();

		if (!position.isContained(directArea)) {
			return;
		}

		// update acting character
		actor.selectDirect(position);

		this.end();
	}

	private setBattleInfo(text: string, position: Position, duration = 3000) {
		// set battle info item
		const item = new BattleInfo(text, position);
		this.battleInfo.push(item);

		// remove battle info item after fixed amount of time
		setTimeout(() => {
			for (let i = 0, imax = this.battleInfo.length; i < imax; i++) {
				if (this.battleInfo[i] === item) {
					this.battleInfo.splice(i, 1);
					break;
				}
			}
		}, duration);
	}
}

export default GameStep;
