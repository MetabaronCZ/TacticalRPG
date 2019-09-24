import React from 'react';

import AIPresets from 'data/ai-presets';
import { IAISettings, AIPreset } from 'modules/ai/settings';

import FormField from 'ui/common/FormField';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';

interface IProps {
	readonly settings: IAISettings;
	readonly onChange: (settings: IAISettings) => void;
}

class AISettingsUI extends React.Component<IProps, IAISettings> {
	constructor(props: IProps) {
		super(props);
		this.state = { ...props.settings };
	}

	public render(): React.ReactNode {
		const { preset, config } = this.state;
		const fieldDifficulty = 'f-ai-difficulty';

		return (
			<React.Fragment>
				<FormField fieldId={fieldDifficulty} label="Difficulty">
					<FormSelect
						id={fieldDifficulty}
						name={fieldDifficulty}
						value={preset}
						onChange={this.setDifficulty}
					>
						{AIPresets.map((id, item) => (
							<FormSelectItem text={item.title} value={id} key={id} />
						))}
					</FormSelect>
				</FormField>

				{/* show custom AI config form fields */}
				{'CUSTOM' === preset && (
					<p className="Paragraph">{JSON.stringify(config)}</p>
				)}
			</React.Fragment>
		);
	}

	private setDifficulty = (e: React.SyntheticEvent<HTMLSelectElement>): void => {
		this.setState(
			{ preset: e.currentTarget.value as AIPreset },
			() => this.onUpdate()
		);
	}

	private onUpdate(): void {
		this.props.onChange(this.state);
	}
}

export default AISettingsUI;
