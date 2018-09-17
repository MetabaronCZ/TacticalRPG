interface IRule {
	readonly rule: (value: string) => boolean;
	readonly text: string;
}

interface IRules {
	readonly [name: string]: IRule;
}

type IValidationCallback<T extends string> = (fieldName: T, isValid: string|null) => void;

const rules: IRules = {
	name: {
		rule: value => !!value.match(/^[a-zA-Z0-9-_\s.]+$/),
		text: 'Name should contain at least one alphanumeric character, spaces or symbols (_, -, .)'
	}
};

export const validateField = <T extends string>(fieldName: T, value: string, cb?: IValidationCallback<T>): boolean => {
	if (!rules[fieldName]) {
		return true;
	}
	const isValid = rules[fieldName].rule(value);

	if (cb) {
		cb(fieldName, isValid ? null : rules[fieldName].text);
	}
	return isValid;
};

export const validateForm = <T extends string>(fields: { [key in T]: any }, cb: IValidationCallback<T>): boolean => {
	let isValidForm = true;

	for (const field in fields) {
		const isValid = validateField<T>(field, fields[field], cb);

		if (!isValid) {
			isValidForm = false;
		}
	}
	return isValidForm;
};
