/** @flow */

import * as React from 'react'
import {Table, Column} from 'fixed-data-table'
import {Catalogue, GridBook} from './library'


var rows = Catalogue().get_all_books()

var LibraryGrid = React.createClass({
	getInitialState() {
		return {
			rows: [],
			filteredRows: null,
			filterBy: null
		}
	},

	componentWillMount() {
		this.props.rows_promise.then(
				rr => {this.setState({rows: rr});this.filterRowsBy(this.state.filterBy)}
		)

	},

	filterRowsBy(filterBy) {
		var bookMatchesAuthor 
			: (f:string) => (b:GridBook) => boolean
			= (theFilter) => (book) => book.author.toLowerCase().indexOf(theFilter.toLowerCase()) >= 0
		var rows = this.state.rows.slice()
		var filteredRows = filterBy ? rows.filter(bookMatchesAuthor(filterBy)) : rows

		this.setState({filteredRows, filterBy})
	},

	_rowGetter(rowIndex) {
		var rows = this.state.filteredRows
		return rows ? rows[rowIndex] : undefined
	},

	_onFilterChange(e) {
		this.filterRowsBy(e.target.value)
	},

	theLength() {
		return this.state.filteredRows ? this.state.filteredRows.length : this.state.rows.length
	},

	render() {
		return (
			<div>
				 <h1>Saluton, mundo!</h1>
				 <input onChange={this._onFilterChange} placeholder='Filter by author' />
				 <br />
				 <Table
					  rowHeight={50}
					  rowGetter={this._rowGetter}
					  rowsCount={this.theLength()}
					  width={770}
					  height={500}
					  headerHeight={50}
				 >
				 <Column
					label="Numero"
					width={70}
					dataKey="callnumber"
				 />
				 <Column
					label="Titolo"
					width={300}
					dataKey="title"
				 />
				 <Column
					label="Verkisto"
					width={200}
					dataKey="author"
				 />
				 <Column
					label="Tradukinto"
					width={200}
					dataKey="translator"
				 />
				 </Table>
			</div>
		)
	}

})

React.render(
	<LibraryGrid rows_promise={rows} />,
	document.getElementById('example')
)

