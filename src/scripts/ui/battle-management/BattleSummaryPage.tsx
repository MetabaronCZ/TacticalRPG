import React from 'react';

import Page from 'ui/common/Page';
import Chronox, { IChronoxRecord } from 'modules/battle/chronox';

interface IState {
	record: IChronoxRecord | null;
}

class BattleSummaryPage extends React.Component<{}, IState> {
	public state: IState = {
		record: null
	};

	public componentDidMount() {
		const record = Chronox.loadRocord();
		this.setState({ record });
	}

	public render() {
		const { record } = this.state;

		if (!record) {
			return (
				<Page heading="Summary">
					<p className="Paragraph">Loading...</p>
				</Page>
			);
		}
		return (
			<Page heading="Summary">
				<div className="Paragraph">
					<pre>{JSON.stringify(record, null, '\t')}</pre>
				</div>
			</Page>
		);
	}
}

export default BattleSummaryPage;
