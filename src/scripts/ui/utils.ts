import Position from 'modules/geometry/position';

export const formatPosition = (pos: Position|null) => null !== pos ? `(${pos.x}, ${pos.y})` : '-';
export const formatPositions = (arr: Position[]) => `[ ${arr.map(pos => formatPosition(pos)).join(', ')} ]`;