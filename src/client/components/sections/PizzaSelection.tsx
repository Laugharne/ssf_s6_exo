import BigNumber from 'bignumber.js';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
//import { useConfig } from '../../hooks/useConfig';
import { usePayment } from '../../hooks/usePayment';
//import { Digits } from '../../types';
import css from './PizzaSelection.module.css';

// interface NumPadInputButton {
// 	input: Digits | '.';
// 	onInput(key: Digits | '.'): void;
// }

// const NumPadButton: FC<NumPadInputButton> = ({ input, onInput }) => {
// 	const onClick = useCallback(() => onInput(input), [onInput, input]);
// 	return (
// 		<button className={css.button} type="button" onClick={onClick}>
// 			{input}
// 		</button>
// 	);
// };

//-	NumPad

export const PizzaSelection: FC = () => {
	// const { symbol, decimals } = useConfig();
	// const regExp = useMemo(() => new RegExp('^\\d*([.,]\\d{0,' + decimals + '})?$'), [decimals]);

	const [value, setValue] = useState('0');
	// const onInput = useCallback(
	//     (key: Digits | '.') =>
	//         setValue((value) => {
	//             let newValue = (value + key).trim().replace(/^0{2,}/, '0');
	//             if (newValue) {
	//                 newValue = /^[.,]/.test(newValue) ? `0${newValue}` : newValue.replace(/^0+(\d)/, '$1');
	//                 if (regExp.test(newValue)) return newValue;
	//             }
	//             return value;
	//         }),
	//     [regExp]
	// );
	// const onBackspace = useCallback(() => setValue((value) => (value.length ? value.slice(0, -1) || '0' : value)), []);

	const { setAmount } = usePayment();
	useEffect(() => setAmount(value ? new BigNumber(value) : undefined), [setAmount, value]);

	interface Pizza {
		idx       : number;
		name      : string;
		unit_price: number;
		quantity  : number;
	}

	const initialPizzas: Pizza[] = [
		{ idx: 0, name: 'Margherita',          unit_price: 2.50, quantity: 0 },
		{ idx: 1, name: 'Quattro Formaggi',    unit_price: 3.50, quantity: 0 },
		{ idx: 2, name: 'Prosciutto e Funghi', unit_price: 4.50, quantity: 0 },
		{ idx: 3, name: 'Diavola',             unit_price: 4.52, quantity: 0 },
		{ idx: 4, name: 'Capricciosa',         unit_price: 4.55, quantity: 0 },
		{ idx: 5, name: 'Napoli',              unit_price: 3.75, quantity: 0 },
		{ idx: 6, name: 'Hawaïan',             unit_price: 4.00, quantity: 0 },
	]

	const EURO_TO_SOL = 0.0077;

	const [pizzas, setPizzas] = useState<Pizza[]>(initialPizzas);
	const updateQuantity = (idx: number, newQuantity: number) => {
		setPizzas(prevPizzas =>
			prevPizzas.map(pizza =>
				pizza.idx === idx ? { ...pizza, quantity: newQuantity } : pizza
			)
		);
	};

	// const updatePrice = () => {
	// 	let price: number = 0;
	// 	pizzas.map((pizza) => {
	// 		price += pizza.unit_price * pizza.quantity;
	// 	});
	// 	console.log("total :", price);
	// 	return price;
	// }

	useEffect(() => {
		const totalPrice = pizzas.reduce((sum, pizza) => sum + (pizza.unit_price * pizza.quantity), 0);
		setAmount(new BigNumber(totalPrice * EURO_TO_SOL));
	}, [pizzas, setAmount]);

	const onMinus = (idx: number) => {
		//console.log("pizza idx :", idx);
		let qty = pizzas[idx].quantity;
		if (qty > 0) {
			updateQuantity(idx, qty - 1);
		}
	};

	const onPlus = (idx: number) => {
		//console.log("pizza idx :", idx);
		let qty = pizzas[idx].quantity;
		if (qty < 10) {
			updateQuantity(idx, qty + 1);
		}
	};

	return (
	  <div className={css.root}>
		<div className={css.textTitle}>Select Pizzas for your order !</div>
		<div><hr /></div>
		<div>&nbsp;</div>

		<table>
			<tbody>
			{pizzas.map((pizza) => (
				<tr>
					<td>&nbsp;&nbsp;</td><td className={css.pizzaName}>{pizza.name}</td>
					<td className={css.pizzaPrice}>{pizza.unit_price}&nbsp;€</td>
					<td><button className={css.plusminus} onClick={() => onMinus(pizza.idx)}>-</button></td>
					<td className={css.quantity}> {pizza.quantity} </td>
					<td><button className={css.plusminus} onClick={() => onPlus(pizza.idx)}>+</button></td>
				</tr>
			))}
			</tbody>
		</table>

	  </div>
	);

};
