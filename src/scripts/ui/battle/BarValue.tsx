import React from 'react';

const cipherCnt = 3; // number of cipher to display

interface IProps {
	value: number;
	max: number;
}

const BarValue: React.SFC<IProps> = ({ value, max }) => {
	if (max <= 0) {
		return (
			<span className="u-disabled">
				−−− / <span className="u-text-small">−−−</span>
			</span>
		);
	}
	const valCipherCnt = (value + '').length; // current value cipher count
	const maxCipherCnt = (max + '').length; // max value cipher count
	const valZeroCnt = cipherCnt - valCipherCnt;
	const maxZeroCnt = cipherCnt - maxCipherCnt;
	const valZeros = valZeroCnt > 0 ? Array(valZeroCnt).fill(0) : [];
	const maxZeros = maxZeroCnt > 0 ? Array(maxZeroCnt).fill(0) : [];
	return (
		<span>
			{valZeros.map((zero, z) => (
				<span className="u-disabled" key={z}>{zero}</span>
			))}
			{value}

			{' / '}

			<span className="u-text-small">
				{maxZeros.map((zero, z) => (
					<span className="u-disabled" key={z}>{zero}</span>
				))}
				{max}
			</span>
		</span>
	);
};

export default BarValue;
