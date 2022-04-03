/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable fp/no-unused-expression */

import * as assert from "assert"
import {
	String, isWhitespace, isEmptyOrWhitespace,
	toCamelCase, toSnakeCase, toDashCase, toTitleCase,
	plural, trimLeft, trimRight
} from "../dist/text/string.js"
import { CharASCII } from "../dist/text/char.js"

// TODO: Test with XMLHTTPRequest capitalization variations (and other comented out cases)

/** The string containing all printable ASCII characters. */
export const PRINTABLE_ASCII = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

/** The string containing all printable ASCII characters in reverse order. */
export const REVERSED_PRINTABLE_ASCII = '~}|{zyxwvutsrqponmlkjihgfedcba`_^]\\[ZYXWVUTSRQPONMLKJIHGFEDCBA@?>=<;:9876543210/.-,+*)(\'&%$#"! '


describe("plural", () => {

	it("should work", () => {
		assert.strictEqual(plural("batch"), "batches")
		assert.strictEqual(plural('unicorn'), 'unicorns')
		assert.strictEqual(plural('horse'), 'horses')
		assert.strictEqual(plural('bus'), 'buses')
		assert.strictEqual(plural('box'), 'boxes')
		assert.strictEqual(plural('fizz'), 'fizzes')
		assert.strictEqual(plural('batch'), 'batches')
		assert.strictEqual(plural('batCh'), 'batChes')
		assert.strictEqual(plural('bush'), 'bushes')
		assert.strictEqual(plural('bUsh'), 'bUshes')
		assert.strictEqual(plural('Bush'), 'Bushes')
		assert.strictEqual(plural('guppy'), 'guppies')
		assert.strictEqual(plural('UNICORN'), 'UNICORNS')
		assert.strictEqual(plural('puppY'), 'puppIES')
		assert.strictEqual(plural('man'), 'men')
		assert.strictEqual(plural('woman'), 'women')
		assert.strictEqual(plural('fish'), 'fishes')
		assert.strictEqual(plural('sheep'), 'sheep')
		assert.strictEqual(plural('tooth'), 'teeth')
		assert.strictEqual(plural('tomato'), 'tomatoes')
		assert.strictEqual(plural('wifE'), 'wives')
		assert.strictEqual(plural('wiFe'), 'wiVES')
		assert.strictEqual(plural('wife'), 'wives')
		assert.strictEqual(plural('shelf'), 'shelves')
		assert.strictEqual(plural('day'), 'days')
		assert.strictEqual(plural('diy'), 'diys')
		assert.strictEqual(plural('diY'), 'diYS')
		assert.strictEqual(plural('child'), 'children')
		assert.strictEqual(plural('chilD'), 'chilDREN')
		assert.strictEqual(plural('shelf'), 'shelves')
		assert.strictEqual(plural('Shelf'), 'Shelves')
		assert.strictEqual(plural('SHELF'), 'SHELVES')
	})
})

describe("isUrl()", () => {
	it(`should return true for valid URLs that start with 'www'`, () => {
		const expected = true
		const actual = new String("www.data.com/table.csv").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for valid URLs that start with neither 'http', 'https' or 'www' `, () => {
		const expected = true
		const actual = new String("gist.github.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for valid URLs that start with 'http'`, () => {
		const expected = true
		const actual = new String("http://gist.github.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for invalid URLs that start with 'https'`, () => {
		const expected = false
		const actual = new String("https:/gist.github.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for invalid URLs that start with 'http'`, () => {
		const expected = false
		const actual = new String("http//gist.github.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for invalid URLs that have no domain extension`, () => {
		const expected = false
		const actual = new String("http://test").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for empty URLs`, () => {
		const expected = false
		const actual = new String("").isURL()
		assert.equal(actual, expected)
	})

	it(`should return false for invalid URLs that start with special characters`, () => {
		const expected = false
		const actual = new String("http://www.*test.com").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for urls that contain a * character in the query after the domain name`, () => {
		const expected = true
		const actual = new String("https://en.wikipedia.org/w/api.php?format=json&origin=*&titles=P-value").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for urls that contain parentheses in the query after the domain name`, () => {
		const expected = true
		const actual = new String("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Mode_(statistics)").isURL()
		assert.equal(actual, expected)
	})

	it(`should return true for urls that contain non-alphanumeric characters`, () => {
		const expected = true
		const actual = new String("https://docs.google.com/document/d/17fF-U9mMalQiFEzJrsdXYyw7YNCv8ihKGnrIKyz0M-E/edit?ts=6015dedd").isURL()
		assert.equal(actual, expected)
	})

})

describe('camelCase', function () {
	it('should return the camel case of a string', function () {
		assert.strictEqual(toCamelCase('bird'), 'bird')
		assert.strictEqual(toCamelCase('BIRD'), 'bird')
		assert.strictEqual(toCamelCase('BirdFlight'), 'birdFlight')
		assert.strictEqual(toCamelCase('bird flight'), 'birdFlight')
		assert.strictEqual(toCamelCase('San Diego Zoo Safari Park'), 'sanDiegoZooSafariPark')
		assert.strictEqual(toCamelCase('-BIRD-FLIGHT-'), 'birdFlight')
		// assert.strictEqual(toCamelCase('__BIRD___FLIGHT___'), 'birdFlight')
		assert.strictEqual(toCamelCase('Restless flycatcher'), 'restlessFlycatcher')
		// assert.strictEqual(toCamelCase('XMLHttpRequest'), 'xmlHttpRequest')
		assert.strictEqual(toCamelCase('weight of up to 12 kg'), 'weightOfUpTo12Kg')
		assert.strictEqual(toCamelCase('/home/dmitri/projects/voca'), 'homeDmitriProjectsVoca')
		// assert.strictEqual(toCamelCase(PRINTABLE_ASCII), '0123456789AbcdefghijklmnopqrstuvwxyzAbcdefghijklmnopqrstuvwxyz')
		assert.strictEqual(toCamelCase('****'), '')
		assert.strictEqual(toCamelCase('****'), '')
		assert.strictEqual(toCamelCase('-----'), '')
		assert.strictEqual(toCamelCase('     '), '')
		assert.strictEqual(toCamelCase('\n\n\n\n   ***\t\t'), '')
		assert.strictEqual(toCamelCase(''), '')
	})

	it('should return the camel case of a non-latin string', function () {
		assert.strictEqual(toCamelCase('zborul păsării'), 'zborulPăsării')
		assert.strictEqual(toCamelCase('полет птицы'), 'полетПтицы')
		assert.strictEqual(toCamelCase('fuerza de sustentación'), 'fuerzaDeSustentación')
		assert.strictEqual(toCamelCase('skrzydło ptaka składa się'), 'skrzydłoPtakaSkładaSię')
	})

	it('should not modify numbers', function () {

		// assert.strictEqual(toCamelCase(0), '0')
		// assert.strictEqual(toCamelCase(1200), '1200')
		assert.strictEqual(toCamelCase('8965'), '8965')
	})

	// it('should return the camel case of a string representation of an object', function () {
	// 	assert.strictEqual(toCamelCase(['bird flight']), 'birdFlight')
	// 	assert.strictEqual(
	// 		toCamelCase({ toString: function () { return 'bird flight' }, }), 'birdFlight')
	// })

	it('should return empty string for null or undefined', function () {
		assert.strictEqual(toCamelCase(""), '')
		// assert.strictEqual(toCamelCase(undefined), '')
		// assert.strictEqual(toCamelCase(null), '')
	})
})

describe('snakeCase', function () {
	it('should return the snake case of a string', function () {
		assert.strictEqual(toSnakeCase('bird'), 'bird')
		assert.strictEqual(toSnakeCase('BIRD'), 'bird')
		assert.strictEqual(toSnakeCase('BirdFlight'), 'bird_flight')
		assert.strictEqual(toSnakeCase('bird flight'), 'bird_flight')
		assert.strictEqual(toSnakeCase('San Diego Zoo Safari Park'), 'san_diego_zoo_safari_park')
		assert.strictEqual(toSnakeCase('-BIRD-FLIGHT-'), 'bird_flight')
		// assert.strictEqual(toSnakeCase('__BIRD___FLIGHT___'), 'bird_flight')
		assert.strictEqual(toSnakeCase('Restless flycatcher'), 'restless_flycatcher')
		// assert.strictEqual(toSnakeCase('XMLHttpRequest'), 'xml_http_request')
		assert.strictEqual(toSnakeCase('weight of up to 12 kg'), 'weight_of_up_to_12_kg')
		assert.strictEqual(toSnakeCase('/home/dmitri/projects/voca'), 'home_dmitri_projects_voca')
		// assert.strictEqual(toSnakeCase(PRINTABLE_ASCII), '0123456789_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz')
		assert.strictEqual(toSnakeCase('****'), '')
		assert.strictEqual(toSnakeCase('-----'), '')
		assert.strictEqual(toSnakeCase('     '), '')
		assert.strictEqual(toSnakeCase('\n\n\n\n   ***\t\t'), '')
		assert.strictEqual(toSnakeCase(''), '')
	})

	it('should return the snake case of a non-latin string', function () {
		assert.strictEqual(toSnakeCase('zborul păsării'), 'zborul_păsării')
		assert.strictEqual(toSnakeCase('полет птицы'), 'полет_птицы')
		assert.strictEqual(toSnakeCase('fuerza de sustentación'), 'fuerza_de_sustentación')
		assert.strictEqual(toSnakeCase('skrzydło ptaka składa się'), 'skrzydło_ptaka_składa_się')
		assert.strictEqual(toSnakeCase('bird flight'), 'bird_flight')
	})

	it('should not modify numbers', function () {
		assert.strictEqual(toSnakeCase('0'), '0')
		assert.strictEqual(toSnakeCase('1200'), '1200')
		assert.strictEqual(toSnakeCase('8965'), '8965')
	})

	it('should return empty string for null or undefined', function () {
		assert.strictEqual(toSnakeCase(''), '')
		// assert.strictEqual(toSnakeCase(undefined), '')
		// assert.strictEqual(toSnakeCase(null), '')
	})
})

describe('titleCase', function () {
	it('should return the title case of a string', function () {
		assert.strictEqual(toTitleCase('hello world'), 'Hello World')
		assert.strictEqual(toTitleCase('Hello world'), 'Hello World')
		assert.strictEqual(toTitleCase('hello World'), 'Hello World')
		assert.strictEqual(toTitleCase('Hello World'), 'Hello World')
		assert.strictEqual(toTitleCase('HELLO WORLD'), 'Hello World')
		assert.strictEqual(toTitleCase('bird'), 'Bird')
		assert.strictEqual(toTitleCase('BIRD'), 'Bird')
		// assert.strictEqual(toTitleCase('bird-flight'), 'Bird-Flight')
		assert.strictEqual(toTitleCase('bird flight'), 'Bird Flight')
		assert.strictEqual(toTitleCase('san diego zoo safari park'), 'San Diego Zoo Safari Park')
		assert.strictEqual(toTitleCase('Who wants to try next?'), 'Who Wants To Try Next?')
		assert.strictEqual(toTitleCase('WHO WANTS TO TRY NEXT?'), 'Who Wants To Try Next?')
		// assert.strictEqual(toTitleCase('-BIRD-FLIGHT-'), '-Bird-Flight-')
		// assert.strictEqual(toTitleCase('__BIRD___FLIGHT___'), '__Bird___Flight___')
		assert.strictEqual(toTitleCase('Restless flycatcher'), 'Restless Flycatcher')
		// assert.strictEqual(toTitleCase('XMLHttpRequest'), 'XmlHttpRequest')
		assert.strictEqual(toTitleCase('weight of up to 12 kg'), 'Weight Of Up To 12 Kg')
		// assert.strictEqual(toTitleCase('/home/dmitri/projects/voca'), '/Home/Dmitri/Projects/Voca')
		assert.strictEqual(toTitleCase('****'), '****')
		assert.strictEqual(toTitleCase('-----'), '-----')
		// assert.strictEqual(toTitleCase('     '), '     ')
		// assert.strictEqual(toTitleCase('\n\n\n\n   ***\t\t'), '\n\n\n\n   ***\t\t')
		assert.strictEqual(toTitleCase(''), '')
	})

	it('should return the title case of a non-latin string', function () {
		assert.strictEqual(toTitleCase('zborul păsării'), 'Zborul Păsării')
		assert.strictEqual(toTitleCase('полет птицы'), 'Полет Птицы')
		assert.strictEqual(toTitleCase('fuerza de sustentación'), 'Fuerza De Sustentación')
		assert.strictEqual(toTitleCase('skrzydło ptaka składa się'), 'Skrzydło Ptaka Składa Się')
	})

	// it('should return the title case and not capitalize at specific characters', function () {
	// 	assert.strictEqual(toTitleCase('jean-luc is good-looking', ['-']), 'Jean-luc Is Good-looking')
	// 	assert.strictEqual(toTitleCase('Un·e déput·é·e', ['·']), 'Un·e Déput·é·e')
	// 	assert.strictEqual(toTitleCase('Who*wants to-try*next?', ['-', '*']), 'Who*wants To-try*next?')
	// 	assert.strictEqual(toTitleCase('WHO*WANTS*TO*TRY*NEXT?', ['*']), 'Who*wants*to*try*next?')
	// 	assert.strictEqual(toTitleCase('bird flight'), 'Bird Flight')

	// 	assert.strictEqual(toTitleCase(
	// 		"Well, congratulations! You got yourself caught! Now what's the next step in your master plan?", ["'",]),
	// 		"Well, Congratulations! You Got Yourself Caught! Now What's The Next Step In Your Master Plan?"
	// 	)
	// })

	it('should not modify numbers', function () {
		assert.strictEqual(toTitleCase('0'), '0')
		assert.strictEqual(toTitleCase('1200'), '1200')
		assert.strictEqual(toTitleCase('8965'), '8965')
	})

	it('should return empty string for empty, null, or undefined', function () {
		assert.strictEqual(toTitleCase(''), '')
		// assert.strictEqual(toTitleCase(undefined), '')
		// assert.strictEqual(toTitleCase(null), '')
	})
})

/*describe('pascalCase', function () {
	it('should capitalize the first character in a string', function () {
		assert.strictEqual(capitalize('APPLE'), 'APPLE')
		assert.strictEqual(capitalize('apple'), 'Apple')
		assert.strictEqual(capitalize('FReemacBook'), 'FreeMacBook')
		assert.strictEqual(capitalize('f'), 'F')
		assert.strictEqual(capitalize(''), '')
		assert.strictEqual(capitalize('*apple'), '*apple')
		assert.strictEqual(capitalize(PRINTABLE_ASCII), PRINTABLE_ASCII)
	})

	it('should capitalize the first character in a string and keep the rest unmodified', function () {
		assert.strictEqual(capitalize('apple', true), 'Apple')
		assert.strictEqual(capitalize('APPLE', true), 'Apple')
		assert.strictEqual(capitalize('яблоко', true), 'Яблоко')
		assert.strictEqual(capitalize('f', true), 'F')
		assert.strictEqual(capitalize('', true), '')
		assert.strictEqual(capitalize('100', true), '100')
		assert.strictEqual(capitalize('  ', true), '  ')
		assert.strictEqual(capitalize('oRaNgE', true), 'ORaNgE')
	})



	it('should not modify numbers', function () {
		assert.strictEqual(capitalize('100'), '100')
		assert.strictEqual(capitalize('812'), '812')
	})

	it('should return an empty string for null or undefined', function () {
		assert.strictEqual(capitalize(''), '')
		assert.strictEqual(capitalize(undefined), '')
		assert.strictEqual(capitalize(null), '')
		assert.strictEqual(capitalize(undefined, true), '')
		assert.strictEqual(capitalize(undefined, false), '')
	})
})*/

describe('dashCase', function () {
	it('should return the dash case of a string', function () {
		assert.strictEqual(toDashCase('bird'), 'bird')
		assert.strictEqual(toDashCase('BIRD'), 'bird')
		assert.strictEqual(toDashCase('BirdFlight'), 'bird-flight')
		assert.strictEqual(toDashCase('bird flight'), 'bird-flight')
		assert.strictEqual(toDashCase('San Diego Zoo Safari Park'), 'san-diego-zoo-safari-park')
		assert.strictEqual(toDashCase('-BIRD-FLIGHT-'), 'bird-flight')
		// assert.strictEqual(toDashCase('__BIRD___FLIGHT___'), 'bird-flight')
		assert.strictEqual(toDashCase('Restless flycatcher'), 'restless-flycatcher')
		// assert.strictEqual(toDashCase('XMLHttpRequest'), 'xmlhttp-request')
		assert.strictEqual(toDashCase('weight of up to 12 kg'), 'weight-of-up-to-12-kg')
		assert.strictEqual(toDashCase('/home/dmitri/projects/voca'), 'home-dmitri-projects-voca')
		// assert.strictEqual(toDashCase(PRINTABLE_ASCII), '0123456789-abcdefghijklmnopqrstuvwxyz-abcdefghijklmnopqrstuvwxyz')
		assert.strictEqual(toDashCase('****'), '')
		assert.strictEqual(toDashCase('****'), '')
		assert.strictEqual(toDashCase('-----'), '')
		assert.strictEqual(toDashCase('     '), '')
		assert.strictEqual(toDashCase('\n\n\n\n   ***\t\t'), '')
		assert.strictEqual(toDashCase(''), '')
	})

	it('should return the dash case of a non-latin string', function () {
		assert.strictEqual(toDashCase('zborul păsării'), 'zborul-păsării')
		assert.strictEqual(toDashCase('полет птицы'), 'полет-птицы')
		assert.strictEqual(toDashCase('fuerza de sustentación'), 'fuerza-de-sustentación')
		assert.strictEqual(toDashCase('skrzydło ptaka składa się'), 'skrzydło-ptaka-składa-się')
		assert.strictEqual(toDashCase('bird flight'), 'bird-flight')
	})

	it('should not modify numbers', function () {
		assert.strictEqual(toDashCase('0'), '0')
		assert.strictEqual(toDashCase('1200'), '1200')
		assert.strictEqual(toDashCase('8965'), '8965')
	})

	it('should return empty string for null or undefined', function () {
		assert.strictEqual(toDashCase(''), '')
		// assert.strictEqual(toDashCase(undefined), '')
		// assert.strictEqual(toDashCase(null), '')
	})
})

describe('isWhitespace', function () {
	it('should return false when no whitespace exists', function () {
		assert(!isWhitespace('foo'))
	})
	it('should return true for multiple spaces', function () {
		assert(isWhitespace('         '))
	})
	it('should return true for single space', function () {
		assert(isWhitespace(' '))
	})
	it('should return true for tabs', function () {
		assert(isWhitespace('	'))
		assert(isWhitespace('\t'))
	})
	it('should return true for newlines', function () {
		assert(isWhitespace(`\n`))
		assert(isWhitespace(`
		`))
	})
	// it('should be true for all ES5-compliant whitespace values', function () {
	// 	assert(isWhitespace("\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF"))
	// })
	it('should not be true for the zero-width space', function () {
		assert(!isWhitespace('\u200b'))
	})
})

describe('trimLeft', function () {
	it('should trim all subsequent argument strings from main argument', function () {
		const str = "GH&#8373; 2,000"
		const toTrim = ["GH₵", "GH&#8373;", "GHC", "USD", "GBP"]
		assert.strictEqual(trimLeft(str, ...toTrim), " 2,000")
	})
	it('should trim spaces if desired', function () {
		const str = " 2,000"
		assert.strictEqual(trimLeft(str, " "), "2,000")
	})
})

describe('trimRight', function () {
	it('should trim all subsequent argument strings from main argument', function () {
		const str = "2,000 GH&#8373;"
		const toTrim = ["GH₵", "GH&#8373;", "GHC", "USD", "GBP"]
		assert.strictEqual(trimRight(str, ...toTrim), "2,000 ")
	})
	it('should trim spaces if desired', function () {
		const str = " 2,000 "
		assert.strictEqual(trimRight(str, " "), " 2,000")
	})
})