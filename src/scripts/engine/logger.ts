import { isLoggingEnabled } from 'data/game-config';

type LogSeverity = 'info' | 'error';

class Logger {
	public static info(info: any) {
		this.log(info, 'info');
	}

	public static error(info: any) {
		this.log(info, 'error');
	}

	private static log(info: any, severity: LogSeverity) {
		if (!isLoggingEnabled) {
			return;
		}
		const now = new Date();
		const timestamp = now.toLocaleTimeString() + ':';

		switch (severity) {
			case 'info': {
				/* tslint:disable:no-console */
				return console.log(timestamp, info);
				/* tslint:enable:no-console */
			}
			case 'error': {
				/* tslint:disable:no-console */
				return console.error(timestamp, info);
				/* tslint:enable:no-console */
			}
			default:
				// pass
		}
	}
}

export default Logger;
