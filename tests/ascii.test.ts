import { it, describe } from "bun:test"
import assert from "assert"

import {
	String, tokenizeWords, isWhitespace,
	camelCase, snakeCase, dashCase, titleCase,
	plural, trimLeft, trimRight, initialCaps
} from "../source"

describe("ascii", function () {
	describe("plural", function () {
		it("should work", function () {
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

	describe("isUrl()", function () {
		it(`should return true for valid URLs that start with 'www'`, function () {
			const expected = true
			const actual = new String("www.data.com/table.csv").isURL()
			assert.equal(actual, expected)
		})

		it(`should return true for valid URLs that start with neither 'http', 'https' or 'www' `, function () {
			const expected = true
			const actual = new String("gist.github.com").isURL()
			assert.equal(actual, expected)
		})

		it(`should return true for valid URLs that start with 'http'`, function () {
			const expected = true
			const actual = new String("http://gist.github.com").isURL()
			assert.equal(actual, expected)
		})

		it(`should return false for invalid URLs that start with 'https'`, function () {
			const expected = false
			const actual = new String("https:/gist.github.com").isURL()
			assert.equal(actual, expected)
		})

		it(`should return false for invalid URLs that start with 'http'`, function () {
			const expected = false
			const actual = new String("http//gist.github.com").isURL()
			assert.equal(actual, expected)
		})

		it(`should return false for invalid URLs that have no domain extension`, function () {
			const expected = false
			const actual = new String("http://test").isURL()
			assert.equal(actual, expected)
		})

		it(`should return false for empty URLs`, function () {
			const expected = false
			const actual = new String("").isURL()
			assert.equal(actual, expected)
		})

		it(`should return false for invalid URLs that start with special characters`, function () {
			const expected = false
			const actual = new String("http://www.*test.com").isURL()
			assert.equal(actual, expected)
		})

		it(`should return true for urls that contain a * character in the query after the domain name`, function () {
			const expected = true
			const actual = new String("https://en.wikipedia.org/w/api.php?format=json&origin=*&titles=P-value").isURL()
			assert.equal(actual, expected)
		})

		it(`should return true for urls that contain parentheses in the query after the domain name`, function () {
			const expected = true
			const actual = new String("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Mode_(statistics)").isURL()
			assert.equal(actual, expected)
		})

		it(`should return true for urls that contain non-alphanumeric characters`, function () {
			const expected = true
			const actual = new String("https://docs.google.com/document/d/17fF-U9mMalQiFEzJrsdXYyw7YNCv8ihKGnrIKyz0M-E/edit?ts=6015dedd").isURL()
			assert.equal(actual, expected)
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

	describe('initialCaps', function () {
		// it('should initialCaps the first character in a string and keep the rest unmodified', function () {
		// 	assert.strictEqual(initialCaps('APPLE'), 'APPLE')
		// 	assert.strictEqual(initialCaps('apple'), 'Apple')
		// 	assert.strictEqual(initialCaps('fReeMacBook'), 'FReeMacBook')
		// 	assert.strictEqual(initialCaps('f'), 'F')
		// 	assert.strictEqual(initialCaps(''), '')
		// 	assert.strictEqual(initialCaps('*apple'), '*apple')
		// 	assert.strictEqual(initialCaps(PRINTABLE_ASCII), PRINTABLE_ASCII)
		// 	assert.strictEqual(initialCaps('oRaNgE'), 'ORaNgE')
		// })

		it('should initialCaps the first character in a string and convert the rest to lowercase', function () {
			assert.strictEqual(initialCaps('apple'), 'Apple')
			assert.strictEqual(initialCaps('APPLE', true), 'Apple')
			assert.strictEqual(initialCaps('яблоко', true), 'Яблоко')
			assert.strictEqual(initialCaps('f', true), 'F')
			assert.strictEqual(initialCaps('', true), '')
			assert.strictEqual(initialCaps('100', true), '100')
			assert.strictEqual(initialCaps('  ', true), '  ')
			assert.strictEqual(initialCaps('oRaNgE', true), 'Orange')
		})

		it('should not modify numbers', function () {
			assert.strictEqual(initialCaps('100'), '100')
			assert.strictEqual(initialCaps('812'), '812')
		})

		it('should return an empty string for null or undefined', function () {
			assert.strictEqual(initialCaps(''), '')
			// assert.strictEqual(initialCaps(undefined), '')
			// assert.strictEqual(initialCaps(null), '')
			// assert.strictEqual(initialCaps(undefined, true), '')
			// assert.strictEqual(initialCaps(undefined, false), '')
		})
	})

	describe('tokenizeWords', function () {
		it('applies the correct default settings', function () {
			assert.deepStrictEqual(tokenizeWords('Hello, this is a test!'), ['Hello,', 'this', 'is', 'a', 'test!'])
			assert.deepStrictEqual(tokenizeWords('thisIsATest'), ['this', 'Is', 'ATest'])
		})

		it('tokenizes a string using custom separators', function () {
			const result = tokenizeWords('Hello! This.is!a!test', { sepChars: ['!', '.'] })
			assert.deepStrictEqual(result, ['Hello', ' This', 'is', 'a', 'test'])

			assert.deepStrictEqual(tokenizeWords('hello_world', { sepChars: ['_'] }), ['hello', 'world'])
		})

		it('handles all case changes as separators properly', function () {
			assert.deepStrictEqual(tokenizeWords('helloTHISisATEST', { sepCaseChanges: 'all' }), ['hello', 'THIS', 'is', 'ATEST'])
		})

		it('handles character and case separators together properly', function () {
			const actual = tokenizeWords('camelCase&LowerToUPPER', { sepChars: ["&"], sepCaseChanges: "upper" })
			const expected = ['camel', 'Case', 'Lower', 'To', 'UPPER']
			assert.deepStrictEqual(actual, expected)
		})

		it('should split words on lower to upper case change', function () {
			const result = tokenizeWords('lowerToUpper', { sepCaseChanges: 'upper' })
			assert.deepStrictEqual(result, ['lower', 'To', 'Upper'])
		})

		it('should split words on upper to lower case change', function () {
			const result = tokenizeWords('uppeRtOlOWER', { sepCaseChanges: 'lower' })
			assert.deepStrictEqual(result, ['uppeR', 'tO', 'lOWER'])
		})

		it('should not split words when sepCaseChanges is none', function () {
			const result = tokenizeWords('NoSplitHere', { sepCaseChanges: 'none' })
			assert.deepStrictEqual(result, ['NoSplitHere'])
		})

		it('should return an empty array for an empty string', function () {
			const result = tokenizeWords('')
			assert.deepStrictEqual(result, [])
		})
	})

	describe('camelCase', function () {
		it('should return the camel case of a string', function () {
			assert.strictEqual(camelCase('bird'), 'bird')
			assert.strictEqual(camelCase('BIRD'), 'bird')
			assert.strictEqual(camelCase('BirdFlight'), 'birdFlight')
			assert.strictEqual(camelCase('bird flight'), 'birdFlight')
			assert.strictEqual(camelCase('San Diego Zoo Safari Park'), 'sanDiegoZooSafariPark')
			assert.strictEqual(camelCase('-BIRD-FLIGHT-'), 'birdFlight')
			assert.strictEqual(camelCase('__BIRD___FLIGHT___'), 'birdFlight')
			assert.strictEqual(camelCase('Restless flycatcher'), 'restlessFlycatcher')
			assert.strictEqual(camelCase('XmlHttpRequest'), 'xmlHttpRequest')
			assert.strictEqual(camelCase('weight of up to 12 kg'), 'weightOfUpTo12Kg')
			assert.strictEqual(camelCase('/home/dmitri/projects/voca'), 'homeDmitriProjectsVoca')
			// assert.strictEqual(camelCase(PRINTABLE_ASCII), '0123456789AbcdefghijklmnopqrstuvwxyzAbcdefghijklmnopqrstuvwxyz')
			assert.strictEqual(camelCase('****'), '')
			assert.strictEqual(camelCase('****'), '')
			assert.strictEqual(camelCase('-----'), '')
			assert.strictEqual(camelCase('     '), '')
			assert.strictEqual(camelCase('\n\n\n\n   ***\t\t'), '')
			assert.strictEqual(camelCase(''), '')
		})

		it('should return the camel case of a non-latin string', function () {
			assert.strictEqual(camelCase('zborul păsării'), 'zborulPăsării')
			assert.strictEqual(camelCase('полет птицы'), 'полетПтицы')
			assert.strictEqual(camelCase('fuerza de sustentación'), 'fuerzaDeSustentación')
			assert.strictEqual(camelCase('skrzydło ptaka składa się'), 'skrzydłoPtakaSkładaSię')
		})

		it('should not modify numbers', function () {
			assert.strictEqual(camelCase('0'), '0')
			assert.strictEqual(camelCase('1200'), '1200')
			assert.strictEqual(camelCase('8965'), '8965')
		})

		it('should return empty string for null or undefined', function () {
			assert.strictEqual(camelCase(""), '')
			// assert.strictEqual(camelCase(undefined), '')
			// assert.strictEqual(camelCase(null), '')
		})
	})

	describe('snakeCase', function () {
		it('should return the snake case of a string', function () {
			assert.strictEqual(snakeCase('bird'), 'bird')
			assert.strictEqual(snakeCase('BIRD'), 'bird')
			assert.strictEqual(snakeCase('BirdFlight'), 'bird_flight')
			assert.strictEqual(snakeCase('bird flight'), 'bird_flight')
			assert.strictEqual(snakeCase('San Diego Zoo Safari Park'), 'san_diego_zoo_safari_park')
			// assert.strictEqual(snakeCase('-BIRD-FLIGHT-'), 'bird_flight')
			// assert.strictEqual(snakeCase('__BIRD___FLIGHT___'), 'bird_flight')
			assert.strictEqual(snakeCase('Restless flycatcher'), 'restless_flycatcher')
			// assert.strictEqual(snakeCase('XMLHttpRequest'), 'xml_http_request')
			// assert.strictEqual(snakeCase('weight of up to 12 kg'), 'weight_of_up_to_12_kg')
			// assert.strictEqual(snakeCase('/home/dmitri/projects/voca'), 'home_dmitri_projects_voca')
			// assert.strictEqual(snakeCase(PRINTABLE_ASCII), '0123456789_abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz')
			// assert.strictEqual(snakeCase('****'), '')
			// assert.strictEqual(snakeCase('-----'), '')
			// assert.strictEqual(snakeCase('     '), '')
			// assert.strictEqual(snakeCase('\n\n\n\n   ***\t\t'), '')
			assert.strictEqual(snakeCase(''), '')
		})

		it('should return the snake case of a non-latin string', function () {
			assert.strictEqual(snakeCase('zborul păsării'), 'zborul_păsării')
			assert.strictEqual(snakeCase('полет птицы'), 'полет_птицы')
			assert.strictEqual(snakeCase('fuerza de sustentación'), 'fuerza_de_sustentación')
			assert.strictEqual(snakeCase('skrzydło ptaka składa się'), 'skrzydło_ptaka_składa_się')
			assert.strictEqual(snakeCase('bird flight'), 'bird_flight')
		})

		it('should not modify numbers', function () {
			assert.strictEqual(snakeCase('0'), '0')
			assert.strictEqual(snakeCase('1200'), '1200')
			assert.strictEqual(snakeCase('8965'), '8965')
		})

		it('should return empty string for null or undefined', function () {
			assert.strictEqual(snakeCase(''), '')
			// assert.strictEqual(snakeCase(undefined), '')
			// assert.strictEqual(snakeCase(null), '')
		})
	})

	describe('titleCase', function () {
		it('should return the title case of a string', function () {
			assert.strictEqual(titleCase("userReadonly"), "User Readonly")
			assert.strictEqual(titleCase('hello world'), 'Hello World')
			assert.strictEqual(titleCase('Hello world'), 'Hello World')
			assert.strictEqual(titleCase('hello World'), 'Hello World')
			assert.strictEqual(titleCase('Hello World'), 'Hello World')
			assert.strictEqual(titleCase('HELLO WORLD'), 'Hello World')
			assert.strictEqual(titleCase('bird'), 'Bird')
			assert.strictEqual(titleCase('BIRD'), 'Bird')
			// assert.strictEqual(titleCase('bird-flight'), 'Bird-Flight')
			assert.strictEqual(titleCase('bird flight'), 'Bird Flight')
			assert.strictEqual(titleCase('san diego zoo safari park'), 'San Diego Zoo Safari Park')
			assert.strictEqual(titleCase('Who wants to try next?'), 'Who Wants To Try Next?')
			assert.strictEqual(titleCase('WHO WANTS TO TRY NEXT?'), 'Who Wants To Try Next?')
			// assert.strictEqual(titleCase('-BIRD-FLIGHT-'), '-Bird-Flight-')
			// assert.strictEqual(titleCase('__BIRD___FLIGHT___'), '__Bird___Flight___')
			assert.strictEqual(titleCase('Restless flycatcher'), 'Restless Flycatcher')
			// assert.strictEqual(titleCase('XMLHttpRequest'), 'XmlHttpRequest')
			assert.strictEqual(titleCase('weight of up to 12 kg'), 'Weight Of Up To 12 Kg')
			// assert.strictEqual(titleCase('/home/dmitri/projects/voca'), '/Home/Dmitri/Projects/Voca')
			// assert.strictEqual(titleCase('****'), '****')
			// assert.strictEqual(titleCase('-----'), '-----')
			// assert.strictEqual(titleCase('     '), '     ')
			// assert.strictEqual(titleCase('\n\n\n\n   ***\t\t'), '\n\n\n\n   ***\t\t')
			assert.strictEqual(titleCase(''), '')
		})

		it('should return the title case of a non-latin string', function () {
			assert.strictEqual(titleCase('zborul păsării'), 'Zborul Păsării')
			assert.strictEqual(titleCase('полет птицы'), 'Полет Птицы')
			assert.strictEqual(titleCase('fuerza de sustentación'), 'Fuerza De Sustentación')
			assert.strictEqual(titleCase('skrzydło ptaka składa się'), 'Skrzydło Ptaka Składa Się')
		})

		// it('should return the title case and not initialCaps at specific characters', function () {
		// 	assert.strictEqual(titleCase('jean-luc is good-looking', ['-']), 'Jean-luc Is Good-looking')
		// 	assert.strictEqual(titleCase('Un·e déput·é·e', ['·']), 'Un·e Déput·é·e')
		// 	assert.strictEqual(titleCase('Who*wants to-try*next?', ['-', '*']), 'Who*wants To-try*next?')
		// 	assert.strictEqual(titleCase('WHO*WANTS*TO*TRY*NEXT?', ['*']), 'Who*wants*to*try*next?')
		// 	assert.strictEqual(titleCase('bird flight'), 'Bird Flight')

		// 	assert.strictEqual(titleCase(
		// 		"Well, congratulations! You got yourself caught! Now what's the next step in your master plan?", ["'",]),
		// 		"Well, Congratulations! You Got Yourself Caught! Now What's The Next Step In Your Master Plan?"
		// 	)
		// })

		it('should not modify numbers', function () {
			assert.strictEqual(titleCase('0'), '0')
			assert.strictEqual(titleCase('1200'), '1200')
			assert.strictEqual(titleCase('8965'), '8965')
		})

		it('should return empty string for empty, null, or undefined', function () {
			assert.strictEqual(titleCase(''), '')
			// assert.strictEqual(titleCase(undefined), '')
			// assert.strictEqual(titleCase(null), '')
		})
	})

	describe('dashCase', function () {
		it('should return the dash case of a string', function () {
			assert.strictEqual(dashCase('bird'), 'bird')
			assert.strictEqual(dashCase('BIRD'), 'bird')
			assert.strictEqual(dashCase('BirdFlight'), 'bird-flight')
			assert.strictEqual(dashCase('bird flight'), 'bird-flight')
			assert.strictEqual(dashCase('San Diego Zoo Safari Park'), 'san-diego-zoo-safari-park')
			// assert.strictEqual(dashCase('-BIRD-FLIGHT-'), 'bird-flight')
			// // assert.strictEqual(dashCase('__BIRD___FLIGHT___'), 'bird-flight')
			// assert.strictEqual(dashCase('Restless flycatcher'), 'restless-flycatcher')
			// // assert.strictEqual(dashCase('XMLHttpRequest'), 'xmlhttp-request')
			// assert.strictEqual(dashCase('weight of up to 12 kg'), 'weight-of-up-to-12-kg')
			// assert.strictEqual(dashCase('/home/dmitri/projects/voca'), 'home-dmitri-projects-voca')
			// // assert.strictEqual(dashCase(PRINTABLE_ASCII), '0123456789-abcdefghijklmnopqrstuvwxyz-abcdefghijklmnopqrstuvwxyz')
			// assert.strictEqual(dashCase('****'), '')
			// assert.strictEqual(dashCase('****'), '')
			// assert.strictEqual(dashCase('-----'), '')
			// assert.strictEqual(dashCase('     '), '')
			// assert.strictEqual(dashCase('\n\n\n\n   ***\t\t'), '')
			// assert.strictEqual(dashCase(''), '')
		})

		it('should return the dash case of a non-latin string', function () {
			assert.strictEqual(dashCase('zborul păsării'), 'zborul-păsării')
			assert.strictEqual(dashCase('полет птицы'), 'полет-птицы')
			assert.strictEqual(dashCase('fuerza de sustentación'), 'fuerza-de-sustentación')
			assert.strictEqual(dashCase('skrzydło ptaka składa się'), 'skrzydło-ptaka-składa-się')
			assert.strictEqual(dashCase('bird flight'), 'bird-flight')
		})

		it('should not modify numbers', function () {
			assert.strictEqual(dashCase('0'), '0')
			assert.strictEqual(dashCase('1200'), '1200')
			assert.strictEqual(dashCase('8965'), '8965')
		})

		it('should return empty string for null or undefined', function () {
			assert.strictEqual(dashCase(''), '')
			// assert.strictEqual(dashCase(undefined), '')
			// assert.strictEqual(dashCase(null), '')
		})
	})
})

/** The string containing all printable ASCII characters. */
const PRINTABLE_ASCII = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

/** The string containing all printable ASCII characters in reverse order. */
const REVERSED_PRINTABLE_ASCII = '~}|{zyxwvutsrqponmlkjihgfedcba`_^]\\[ZYXWVUTSRQPONMLKJIHGFEDCBA@?>=<;:9876543210/.-,+*)(\'&%$#"! '
