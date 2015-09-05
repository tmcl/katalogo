/* @flow */

import * as assert from "assert"
import {LibraryFilter} from "../live/library filter"
import {GridBook, Catalogue} from "../live/library"
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

var mock_library_downloader = () => readFile( "../../../test-data/mea-katalogo-2.json")


describe('library', () => {
	describe('.get_all_books()', () => {
		it('should get seven books', (done) => {
			Catalogue(mock_library_downloader).get_all_books().then( bb => {
				assert.equal(1649, bb.length)
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
