// debug
export const isLoggingEnabled = true;

// grid
export const gridSize = 8;
export const blockSize = 64;
export const tileAnimationDuration = 1000; // in milliseconds

// engine
export const tickDelay = 0; // in milliseconds

// sudden death
export const suddenDeathStart = 30; // time after which sudden death mode starts [in game ticks]
export const suddenDeathInterval = 10; // interval of sudden death mode grid tile destruction [in game ticks]

// animation
export const moveAnimDuration = 150;

// order
export const maxOrderSize = 20; // maximum size of ordered character array

// character
export const maxCharacterNameLength = 16;
export const characterCTLimit = 100;
export const maxJumpHeight = 1;
export const characterBBox = Math.sqrt(3) / 2; // character bounding box radius
export const mpRegen = 0.1; // character mana regenerated fraction
export const conditionDanger = 0.65;
export const conditionCritical = 0.35;

// party
export const maxPartySize = 8; // maximum character count in one party
export const maxPartyNameLength = 16; // maximum party name length
export const randomPartyID = 'RANDOM_PARTY';

// player
export const playerMaxNameLength = 16;

// validation
export const textInputRegex = /^[a-zA-Z0-9-_\s.]+$/;

// AI
export const aiActionDelay = 650;
