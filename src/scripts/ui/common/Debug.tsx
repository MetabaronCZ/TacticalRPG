import React from 'react';

interface IDebugState {
	MobxDebug?: typeof React.Component;
}

class Debug extends React.Component<{}, IDebugState> {
	public state: IDebugState = {};

	constructor(props: {}) {
		super(props);
	}

	public componentDidMount() {
		if (process.env.DEBUG) {
			import(/* webpackChunkName: "mobx-debug" */ 'mobx-react-devtools').then(DevTools => {
				this.setState({
					MobxDebug: DevTools.default
				});
			});
		}
	}

	public render() {
		const { MobxDebug } = this.state;
		return MobxDebug ? <MobxDebug /> : null;
	}
}

export default Debug;
