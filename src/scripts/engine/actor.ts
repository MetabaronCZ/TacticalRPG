import * as ArrayUtils from 'core/array';
import { characterCTLimit } from 'data/game-config';

import Position from 'engine/position';
import Character from 'engine/character';
import SkillUtils from 'engine/skill/utils';
import CostMap from 'engine/pathfinding/cost-map';
import { getMovableTiles } from 'engine/pathfinding';
import CharacterAction from 'engine/character-action';
import Direction, { DirectionID } from 'engine/direction';

class Actor {
	private readonly character: Character;
	private initialPosition: Position; // actor start position
	private initialAP: number; // actor's AP on turn start

	private moveArea: Position[] = []; // movable tiles
	private moveTarget: Position|null = null; // target position
	private movePath: Position[] = []; // move path
	private moveCost = new CostMap(); // movable area cost map

	private skillArea: Position[] = []; // skill range tiles
	private skillTargets: Position[] = []; // targetable tiles
	private skillEffectArea: Position[] = []; // effect area
	private skillEffectTarget: Position|null = null; // selected skill target
	private skillEffectTargets: Character[] = []; // affected characters

	private directArea: Position[] = []; // positions character can be aligned to
	private directTarget: Position|null = null; // position character is directed to

	constructor(character: Character) {
		this.character = character;
		this.initialAP = this.getAP();
		this.initialPosition = this.getPosition();
	}

	public isDead(): boolean {
		return this.character.isDead();
	}

	public getCharacter(): Character {
		return this.character;
	}

	public getInitialAP(): number {
		return this.initialAP;
	}

	public getInitialPosition(): Position {
		return this.initialPosition;
	}

	public getMovable(): Position[] {
		return this.moveArea;
	}

	public getMoveCost(position: Position): number {
		return this.moveCost.get(position);
	}

	public getMoveTarget(): Position|null {
		return this.moveTarget;
	}

	public getMovePath(): Position[] {
		return this.movePath;
	}

	public getSkillArea(): Position[] {
		return this.skillArea;
	}

	public getSkillTargets(): Position[] {
		return this.skillTargets;
	}

	public getSkillEffectArea(): Position[] {
		return this.skillEffectArea;
	}

	public getSkillEffectTarget(): Position|null {
		return this.skillEffectTarget;
	}

	public getSkillEffectTargets(): Character[] {
		return this.skillEffectTargets;
	}

	public getDirectArea(): Position[] {
		return this.directArea;
	}

	public getDirectTarget(): Position|null {
		return this.directTarget;
	}

	public getPosition(): Position {
		return this.character.getPosition();
	}

	public getDirection(): DirectionID {
		return this.character.getDirection();
	}

	public getAP(): number {
		return this.character.getAttribute('AP');
	}

	public startTurn() {
		const char = this.character;
		const baseAP = char.getBaseAttribute('AP');

		// regenerate AP
		char.setAttribute('AP', baseAP);

		// set initial values for this turn
		this.initialAP = baseAP;
		this.initialPosition = this.getPosition();
	}

	public endTurn() {
		if (this.isDead()) {
			return;
		}
		const char = this.character;
		const CT = char.getAttribute('CT');
		char.setAttribute('CT', CT % characterCTLimit);
	}

	public selectMove(target: Position, path: Position[] = []) {
		this.moveTarget = target;
		this.movePath = path;
	}

	public initMove(obstacles: Position[] = []) {
		const char = this.character;
		const MOV = char.getAttribute('MOV');
		const AP = char.getAttribute('AP');

		const range = Math.min(MOV, AP);
		const pos = char.getPosition();
		const movable = getMovableTiles(pos, obstacles, range);

		this.moveArea = movable.positions;
		this.moveCost = movable.costMap;
	}

	public move(position: Position, direction: DirectionID) {
		const char = this.character;
		char.setPosition(position);
		char.setDirection(direction);
		char.setAttribute('AP', this.initialAP - this.moveCost.get(position));
	}

	public endMove() {
		this.moveTarget = null;
		this.movePath = [];
	}

	public startSkill(action: CharacterAction, characters: Character[] = []) {
		const skills = SkillUtils.getByID(action.getSkills());
		const skillAreas = skills.map(skill => SkillUtils.getTargetableArea(skill, this.getPosition()));
		const targetable = ArrayUtils.getIntersection(skillAreas, pos => pos.getX() + '|' + pos.getY());
		const targets = SkillUtils.getTargets(this.character, skills[0], characters, targetable);

		this.skillArea = targetable;
		this.skillTargets = targets;
	}

	public selectSkill(target: Position, effectTargets: Character[] = [], effectArea: Position[] = []) {
		this.skillEffectTarget = target;
		this.skillEffectArea = effectArea;
		this.skillEffectTargets = effectTargets;
	}

	public skillRun() {
		const effectTarget = this.skillEffectTarget;

		if (null === effectTarget) {
			throw new Error('Actor ccould not run skill: no skill target');
		}
		const dir = Direction.resolve(this.getPosition(), effectTarget);

		// face character to skill target tile
		this.character.setDirection(dir);
	}

	public endSkill() {
		this.skillArea = [];
		this.skillTargets = [];
		this.skillEffectArea = [];
		this.skillEffectTarget = null;
		this.skillEffectTargets = [];
	}

	public startDirect(targets: Position[] = []) {
		this.directArea = targets,
		this.directTarget = Direction.findPositionFrom(this.getPosition(), this.getDirection());
	}

	public selectDirect(position: Position) {
		this.directArea = [];
		this.directTarget = null;

		// update character direction
		const dir = Direction.resolve(this.getPosition(), position);
		this.character.setDirection(dir);
	}
}

export default Actor;
