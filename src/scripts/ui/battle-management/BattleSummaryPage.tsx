import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';
import Chronox, { IChronoxRecord } from 'modules/battle/chronox';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import Separator from 'ui/common/Separator';
import ButtonRow from 'ui/common/ButtonRow';

type IProps = RouteComponentProps<any>;

interface IState {
	record: IChronoxRecord | null;
}

const exit = (history: History) => () => {
	gotoRoute(history, 'ROOT');
};

class BattleSummaryPage extends React.Component<IProps, IState> {
	public state: IState = {
		record: null
	};

	public componentDidMount() {
		const record = Chronox.loadRocord();
		this.setState({ record });
	}

	public render() {
		const { history } = this.props;
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

				<Separator />

				<ButtonRow>
					<Button text="Exit" onClick={exit(history)} />
				</ButtonRow>
			</Page>
		);
	}
}

export default withRouter(BattleSummaryPage);
