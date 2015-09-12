/* @flow */

//import * as fs from 'fs'
import {ajax, cache_method, liftP1} from './utilities'

export type GridBook = {
  title: string,
  author: string,
  translator: ?string,
  callnumber: string,
  pagecount: number,
  year: ?number,
  publisher: string
}

export type ImportedBook = {
	note: ?string,
	callnumber: ?string,
	title: ?string,
	original_language: ?string,
	various_authors: ?string,
	author_title_1: ?string,
	author_1: ?string,
	other_names_1: ?string,
	author_2: ?string,
	author_3: ?string,
	author_4: ?string,
	translator_1: ?string,
	translator_2: ?string,
	editor_1: ?string,
	editor_2: ?string,
	preparer: ?string,
	compilor_title: ?string,
	compilor: ?string,
	pagecount: ?string,
	publisher: ?string,
	year: ?string,
	location: ?string,
	random_symbols: ?string,
	nothing: ?string,
	probably_irrelevant: ?string,
	nothing_1: ?string,
	nothing_2: ?string,
	nothing_3: ?string,
	nothing_4: ?string,
	nothing_5: ?string,
	nothing_6: ?string,
	nothing_7: ?string,
	nothing_8: ?string,
	nothing_9: ?string
}

export type LibraryDownloader = () => Promise<string>

export type GridFilter = 
	{field: "author",      search: string} |
	{field: "title",       search: string} |
	{field: "translator",  search: string} |
	{field: "any",         search: string}

export type TCatalogue = { 
	get_all_books: () => Array<GridBook>,
	get_books_with_filter: (filter: GridFilter) => Array<GridBook>,
	get_filtered_books: (filters: Array<GridFilter>) => Array<GridBook>
}

export var promise_web_catalogue 
	: () => Promise<TCatalogue>
	= () => promise_catalogue(ajax( mea.paths.catalogue ))

var promise_catalogue 
	: (p: Promise<string>) => Promise<TCatalogue>
	= liftP1(Catalogue)

var imported_book_to_grid_book
	: (b:ImportedBook) => GridBook
	= book => ({
		title      : book.title         ? book.title                  : "",
		author     : book.author_1      ? book.author_1               : "",
		translator : book.translator_1,
		callnumber : book.callnumber    ? book.callnumber             : "",
		pagecount  : book.pagecount     ? parseInt(book.pagecount)||0 : 0,
		year       : book.year          ? parseInt(book.year) || 0    : 0,
		publisher  : book.publisher     ? book.publisher              : ""
	})

var imported_books_to_grid_books
	: (books: Array<ImportedBook>) => Array<GridBook>
	= (books) => books.map(imported_book_to_grid_book)

var string_matches_string 
	= (needle, haystack) => {
		if ( typeof haystack !== "string" )
			return false
		return haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0
	}

var field_to_filter
	= (filter: GridFilter) => {
		if (filter.field == "any")
		{
			return (book) => Object.keys(book).reduce((b, k) => b||string_matches_string(filter.search, book[k]), false)
		}
		else
		{
			// $FlowFixMe ignore me
			return (book) => string_matches_string(filter.search, book[filter.field])
		}
	}

export var filter_matches_book
	: (filter: GridFilter) => (book: GridBook) => boolean
	= field_to_filter 

/*
export var filter_matches_book
	: (filter: GridFilter) => (book: GridBook) => boolean
	= (filter) => (book) => book[filter.field].toLowerCase().indexOf(filter.search.toLowerCase()) >= 0
	*/

var filter_books
	: (books: Array<GridBook>, filter: GridFilter) => Array<GridBook>
	= (books, filter) => books.filter(filter_matches_book(filter))

var intersection = (f, g) => (t) => f(t) && g(t)

var combine_filters 
	: (filters: Array<GridFilter>) => (book: GridBook) => boolean
	= (filters) => filters.map(filter_matches_book).reduce(intersection)

var filtered_books
	: (filters: Array<GridFilter>, books: Array<GridBook>) => Array<GridBook>
	= (filters, books) => books.filter(combine_filters(filters))

export function Catalogue (library_json: string): TCatalogue {
	var read_library
		: (json_library: string) => Array<ImportedBook> 
		= (json_library) => {
			var library = JSON.parse(json_library)
			return library.map ( (book) => ({
				note: book.hasOwnProperty('note') ? book.note : null,
				callnumber          : book.hasOwnProperty('callnumber')          ? book.callnumber          : null,
				original_language   : book.hasOwnProperty('original_language')   ? book.original_language   : null,
				title   : book.hasOwnProperty('title')   ? book.title   : null,
				various_authors     : book.hasOwnProperty('various_authors')     ? book.various_authors     : null,
				author_title_1      : book.hasOwnProperty('author_title_1')      ? book.author_title_1      : null,
				author_1            : book.hasOwnProperty('author_1')            ? book.author_1            : null,
				other_names_1       : book.hasOwnProperty('other_names_1')       ? book.other_names_1       : null,
				author_2            : book.hasOwnProperty('author_2')            ? book.author_2            : null,
				author_3            : book.hasOwnProperty('author_3')            ? book.author_3            : null,
				author_4            : book.hasOwnProperty('author_4')            ? book.author_4            : null,
				translator_1        : book.hasOwnProperty('translator_1')        ? book.translator_1        : null,
				translator_2        : book.hasOwnProperty('translator_2')        ? book.translator_2        : null,
				editor_1            : book.hasOwnProperty('editor_1')            ? book.editor_1            : null,
				editor_2            : book.hasOwnProperty('editor_2')            ? book.editor_2            : null,
				preparer            : book.hasOwnProperty('preparer')            ? book.preparer            : null,
				compilor_title      : book.hasOwnProperty('compilor_title')      ? book.compilor_title      : null,
				compilor            : book.hasOwnProperty('compilor')            ? book.compilor            : null,
				pagecount           : book.hasOwnProperty('pagecount')           ? book.pagecount           : null,
				publisher           : book.hasOwnProperty('publisher')           ? book.publisher           : null,
				year                : book.hasOwnProperty('year')                ? book.year                : null,
				location            : book.hasOwnProperty('location')            ? book.location            : null,
				random_symbols      : book.hasOwnProperty('random_symbols')      ? book.random_symbols      : null,
				nothing             : book.hasOwnProperty('nothing')             ? book.nothing             : null,
				probably_irrelevant : book.hasOwnProperty('probably_irrelevant') ? book.probably_irrelevant : null,
				nothing_1           : book.hasOwnProperty('nothing_1')           ? book.nothing_1           : null,
				nothing_2           : book.hasOwnProperty('nothing_2')           ? book.nothing_2           : null,
				nothing_3           : book.hasOwnProperty('nothing_3')           ? book.nothing_3           : null,
				nothing_4           : book.hasOwnProperty('nothing_4')           ? book.nothing_4           : null,
				nothing_5           : book.hasOwnProperty('nothing_5')           ? book.nothing_5           : null,
				nothing_6           : book.hasOwnProperty('nothing_6')           ? book.nothing_6           : null,
				nothing_7           : book.hasOwnProperty('nothing_7')           ? book.nothing_7           : null,
				nothing_8           : book.hasOwnProperty('nothing_8')           ? book.nothing_8           : null,
				nothing_9           : book.hasOwnProperty('nothing_9')           ? book.nothing_9           : null,
			}))
	}

	var get_library_cached
		: () => Array<ImportedBook>
		= cache_method(() => read_library(library_json))

	var get_all_books 
		= () => imported_books_to_grid_books(get_library_cached())

	var get_books_with_filter
		= (filter: GridFilter) => filter_books(get_all_books(), filter)

	var get_filtered_books 
		: (f: Array<GridFilter>) => Array<GridBook>
		= (filters: Array<GridFilter>) => filtered_books(filters, get_all_books())

	return { 
		get_all_books,
		get_books_with_filter,
		get_filtered_books
  	}
}
