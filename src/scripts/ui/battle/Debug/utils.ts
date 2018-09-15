import Position from 'engine/position';

export const formatPosition = (pos: Position|null) => null !== pos ? `(${pos.getX()}, ${pos.getY()})` : '-';
export const formatPositions = (arr: Position[]) => `[ ${arr.map(pos => formatPosition(pos)).join(', ')} ]`;
