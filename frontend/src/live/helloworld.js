/** @flow */

import * as React from 'react'
import {Table, Column} from 'fixed-data-table'
import {Catalogue, GridBook, promise_web_catalogue} from './library'

var catalogue = promise_web_catalogue()

var LibraryGrid = React.createClass({
	getInitialState() {
		return {
			rows: this.props.catalogue.get_all_books(),
			filteredRows: null,
			filterBy: null
		}
	},

	componentWillMount() {
		this.filterRowsBy(this.state.filterBy)
	},

	filterRowsBy(filterBy: ?string) {
		var filteredRows = filterBy 
			? this.props.catalogue.get_books_with_filter({
					field: "author",
					search: filterBy
				})
			: this.props.catalogue.get_all_books()

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

catalogue.then( c =>
	React.render(
		<LibraryGrid catalogue={c} />,
		document.getElementById('example')
	)
).catch( err => { alert("error"); console.log(err)
} )

