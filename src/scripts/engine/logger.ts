import { isLoggingEnabled } from 'data/game-config';

class Logger {
	public static log(info: any) {
		if (!isLoggingEnabled) {
			return;
		}
		const now = new Date();
		const timestamp = now.toLocaleTimeString() + ':';

		/* tslint:disable:no-console */
		console.log(timestamp, info);
		/* tslint:enable:no-console */
	}
}

export default Logger;
