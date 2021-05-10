import math from 'mathjs'

export const runMath = () => {

	const trans_1 = {
		price: 1005.32,
	}

	const trans_2 = {
		price: 33.45,
	}

	const formula = `(${trans_2.price} + ${trans_1.price})`


	console.log(math.evaluate(`${formula}`))

	math.chain(3).add(4).multiply(2).done() // 14
}