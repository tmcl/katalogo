/** @flow */

import {GridBook} from './library'

type BookGetter = () => Array<GridBook>

var standard_book_getter
	: BookGetter
	= () => []

class LibraryFilter {
	_book_getter: BookGetter;

	constructor(book_getter: BookGetter) {
		if (book_getter)
			this._book_getter = book_getter
		else
			this._book_getter = standard_book_getter
	}

	get_all_books() : Array<GridBook> { return this._book_getter() }
}

module.exports = {
	LibraryFilter: LibraryFilter
}
