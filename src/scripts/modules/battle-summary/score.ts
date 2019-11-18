import { topListSize } from 'data/game-config';

import { IActRecord } from 'modules/battle/act';
import { ICharacterData } from 'modules/character-creation/character-data';

export interface IScoreItem {
	readonly name: string;
	readonly amount: number;
	readonly player: number;
}

interface IScoreDataItem {
	readonly name: string;
	readonly player: number;
	kills: number;
	damage: number;
	healing: number;
}

export interface IScoreData {
	[id: string]: IScoreDataItem;
}

interface IScoreAnalysis {
	kills: IScoreItem[];
	damage: IScoreItem[];
	healing: IScoreItem[];
}

// return player agnostic character ID
const getActorID = (actorID: string, playerID: number): string => `${actorID}-${playerID}`;

export const analyzeScore = (timeline: IActRecord[], characters: ICharacterData[]): IScoreAnalysis => {
	const result: IScoreAnalysis = {
		kills: [],
		damage: [],
		healing: []
	};
	const scoreData: IScoreData = {};

	// agregate character data from each Act
	for (const act of timeline) {
		const actor = characters.find(ch => act.actor === ch.id);

		if (!actor) {
			throw new Error('Invalid score record character ID');
		}
		const actorID = getActorID(actor.id, act.player);
		const results = act.combatPhase.results;

		scoreData[actorID] = scoreData[actorID] || {
			name: actor.name,
			player: act.player,
			kills: 0,
			damage: 0,
			healing: 0
		} as IScoreDataItem;

		const data = scoreData[actorID];

		for (const res of results) {
			data.damage += res.damaged;
			data.healing += res.healed;
			data.kills += (res.killed ? 1 : 0);
		}
	}

	// create result array
	for (const id in scoreData) {
		const { name, player, kills, damage, healing } = scoreData[id];

		if (kills > 0) {
			result.kills.push({ name, player, amount: kills });
		}
		if (damage) {
			result.damage.push({ name, player, amount: damage });
		}
		if (healing) {
			result.healing.push({ name, player, amount: healing });
		}
	}

	result.kills = result.kills
		.sort((a, b) => b.amount - a.amount)
		.slice(0, topListSize);

	result.damage = result.damage
		.sort((a, b) => b.amount - a.amount)
		.slice(0, topListSize);

	result.healing = result.healing
		.sort((a, b) => b.amount - a.amount)
		.slice(0, topListSize);

	return result;
};
