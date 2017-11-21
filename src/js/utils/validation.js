const rules = {
	name: {
		rule: value => value.match(/^[a-zA-Z0-9-_\s.]+$/),
		text: 'Name should contain at least one alphanumeric character, spaces or symbols (_, -, .)'
	}
};

export const validateField = (field, value, cb) => {
	if ( !rules[field] ){
		return true;
	}
	let isValid = rules[field].rule(value);
	cb && cb(field, isValid ? null : rules[field].text);

	return isValid;
};

export const validateForm = (fields, cb) =>{
	let isValidForm = true;

	for ( let field in fields ){
		let isValid = validateField(field, fields[field], cb);

		if ( !isValid ){
			isValidForm = false;
		}
	}
	return isValidForm;
};
