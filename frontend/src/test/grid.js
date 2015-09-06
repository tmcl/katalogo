/* @flow */

import * as assert from "assert"
import * as Library from "../live/library"
import {readFileSync} from 'fs'

describe('library', () => {
	var mock_library_json = readFileSync( "../../../test-data/mea-katalogo-2.json", 'utf-8')
	var mock_catalogue = Library.Catalogue(mock_library_json)

	describe("filtering", () => {
		var esperanto_by_zamenhof = {
			title: "Esperanto",
			author: "L. L. Zamenhof",
			translator: "",
			callnumber: "",
			pagecount: 50,
			year: 1888,
			publisher: "Zamenhofa Domo"
		}
		var called_esperanto = Library.filter_matches_book({
			field: "title",
			search: "esperanto"
		})
		var by_zamenhof = Library.filter_matches_book({
			field: "author",
			search: "zamenhof"
		})

		describe("(author filtering)", () => {
			var by_Zamenhof = Library.filter_matches_book({
				field: "author",
				search: "Zamenhof"
			})
			var by_stalin = Library.filter_matches_book({
				field: "author",
				search: "stalin"
			})
			it("should find the book with the same case", () =>
				assert.equal(true, by_Zamenhof(esperanto_by_zamenhof))
			)
			it("should find the book with different case", () =>
				assert.equal(true, by_zamenhof(esperanto_by_zamenhof))
			)
			it("shouldn't find the book if it doesn't match", () =>
				assert.equal(false, by_stalin(esperanto_by_zamenhof))
			)
		})

		describe("(title filtering)", () =>
			it("should find the book by title", () =>
				assert.equal(true, called_esperanto(esperanto_by_zamenhof))
			)
		)

		describe("(multiple filtering)", () => {
			var little_red_riding_hood = {
				title: "Little Red Riding Hood",
				author: "Brothers Grimm",
				translator: "",
				callnumber: "",
				pagecount: 50,
				year: 1888,
				publisher: "Dead people"
			}
		})
	})

	describe(".Catalogue", () => {
		describe('.get_all_books()', () => {
			it('should get 1649 books', () => 
				assert.equal(1649, mock_catalogue.get_all_books().length)
			)
		})

		describe(".get_filtered_books(Author: Zamenhof)", () => {
			it("should get sixteen books", () => 
				assert.equal(16, mock_catalogue.get_books_with_filter({
					field: "author",
					search: "Zamenhof"
				}).length)
			)
		})
	})
})
