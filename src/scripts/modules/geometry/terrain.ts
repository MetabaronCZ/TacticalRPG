export type Terrain = 'DEFAULT' | 'WATER';

type ITerrainCostTable = {
	readonly [id in Terrain]: number;
};

const terrainCostTable: ITerrainCostTable = {
	DEFAULT: 1,
	WATER: 2
};

export const getTerrainCost = (terrain: Terrain): number => {
	return terrainCostTable[terrain];
};
