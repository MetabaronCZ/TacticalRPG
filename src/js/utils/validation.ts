export interface IRule {
	readonly rule: (value: string) => boolean;
	readonly text: string;
}

export interface IRules {
	readonly [name: string]: IRule;
}

export type IValidationCallback = (fieldName: string, isValid: string|null) => boolean;

const rules: IRules = {
	name: {
		rule: (value) => !!value.match(/^[a-zA-Z0-9-_\s.]+$/),
		text: 'Name should contain at least one alphanumeric character, spaces or symbols (_, -, .)'
	}
};

export const validateField = (fieldName: string, value: string, cb?: IValidationCallback): boolean => {
	if (!rules[fieldName]) {
		return true;
	}
	const isValid: boolean = rules[fieldName].rule(value);

	if ('function' === typeof cb) {
		cb(fieldName, isValid ? null : rules[fieldName].text);
	}
	return isValid;
};

export const validateForm = (fields: { [name: string]: string }, cb: IValidationCallback): boolean => {
	let isValidForm: boolean = true;

	for (const field in fields) {
		if (!fields[field]) {
			continue;
		}
		const isValid: boolean = validateField(field, fields[field], cb);

		if (!isValid) {
			isValidForm = false;
		}
	}
	return isValidForm;
};
