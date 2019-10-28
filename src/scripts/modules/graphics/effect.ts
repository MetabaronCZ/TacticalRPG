import { PI } from 'core/number';

import { Color, colorToRGB } from 'modules/color';
import SkillAnimation from 'modules/battle/act/skill-animation';

export const renderEffect = (animation: SkillAnimation, ctx: CanvasRenderingContext2D, x: number, y: number, minSize: number, maxSize: number, color: Color): void => {
	const progress = animation.getProgress();
	const alpha = 0.5 * (1 - progress);
	const size = minSize + (maxSize - minSize) * progress;

	switch (animation.type) {
		case 'COMBAT':
			ctx.beginPath();
			
			ctx.strokeStyle = colorToRGB(color, alpha);
			ctx.arc(x, y, size, 0, 2 * PI);
			ctx.stroke(); 
			break;

		default:
			// do nothing
	}
};
