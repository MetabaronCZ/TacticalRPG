interface IRule {
	readonly test: (value: string) => boolean;
	readonly text: string;
}

interface IRules {
	readonly [name: string]: IRule;
}

export interface IValidationResult {
	isValid: boolean;
	error?: string;
}

export interface IValidationFormResult<T extends string> {
	isValid: boolean;
	errors: {
		[key in T]?: string;
	};
}

export const validationRules: IRules = {
	name: {
		test: value => !!value.match(/^[a-zA-Z0-9-_\s.]+$/),
		text: 'Name should contain at least one alphanumeric character, spaces or symbols (_, -, .)'
	}
};

export const validateField = (fieldName: string, value: string): IValidationResult => {
	const result: IValidationResult = {
		isValid: true
	};
	if (!validationRules[fieldName]) {
		return result;
	}
	result.isValid = validationRules[fieldName].test(value);

	if (!result.isValid) {
		result.error = validationRules[fieldName].text;
	}
	return result;
};

export const validateForm = <T extends string>(fields: { [key in T]: any }): IValidationFormResult<T> => {
	const result: IValidationFormResult<T> = {
		isValid: true,
		errors: {}
	};

	for (const field in fields) {
		const fieldResult = validateField(field, fields[field]);

		if (!fieldResult.isValid) {
			result.isValid = false;
			result.errors[field] = fieldResult.error || 'Invalid field';
		}
	}
	return result;
};
