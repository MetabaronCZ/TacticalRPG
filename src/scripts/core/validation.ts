export interface IValidation<T extends string> {
	isValid: boolean;
	errors: {
		[key in T]?: string;
	};
}
