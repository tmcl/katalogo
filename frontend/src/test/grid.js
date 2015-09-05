/* @flow */

import * as assert from "assert"
import {LibraryFilter} from "../live/library filter"
import {promise_catalogue} from "../live/library"
import {readFile} from "../live/denodified.js"

var LibraryFilterMock = new LibraryFilter( () => [
		{
			author: "Ivan Vazoy",
			callnumber: "8-31 VAZ SUB",
			pagecount: 459,
			year: 1888,
			publisher: "Bulgara Esperanto Asocio",
			title: "Sub la JugAo",
			translator: null
		},
		{
			author: 'Martinus',
			callnumber: '28 MAR',
			pagecount: 96,
			year: 1989,
			publisher: "Folioj el la Bildlibro de Dio",
			title: "Penlekosla brilo super la vivo",
			translator: "G. Graversen"
		}
] )

describe('library', () => {
	var mock_library_downloader = () => readFile( "../../../test-data/mea-katalogo-2.json")
	var mock_catalogue = promise_catalogue(mock_library_downloader())

	describe('.get_all_books()', () => {
		it('should get seven books', (done) => {
			mock_catalogue.then( c=>{
				assert.equal(1649, c.get_all_books().length)
				done()
			})
		})
	})
})

describe('LibraryFilter', () => {
	describe('#get_all_books()', () => {
		it('should get two books', () => {
			assert.equal(2, LibraryFilterMock.get_all_books().length)
		})
	})
})
