import { isLoggingEnabled } from 'data/game-config';

type LogSeverity = 'info' | 'error';
type Loggable = number | string | object;

class Logger {
	public static info(...info: Loggable[]): void {
		this.log(info, 'info');
	}

	public static error(...info: Loggable[]): void {
		this.log(info, 'error');
	}

	private static log(info: Loggable[], severity: LogSeverity): void {
		if (!isLoggingEnabled) {
			return;
		}
		const now = new Date();
		const timestamp = `[${now.toLocaleTimeString()}]`;

		switch (severity) {
			case 'info': {
				/* tslint:disable:no-console */
				return console.log.apply(null, [timestamp, ...info]);
				/* tslint:enable:no-console */
			}
			case 'error': {
				/* tslint:disable:no-console */
				return console.error.apply(null, [timestamp, ...info]);
				/* tslint:enable:no-console */
			}
			default:
				// pass
		}
	}
}

export default Logger;
