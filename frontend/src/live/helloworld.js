/** @flow */

import * as React from 'react'
import {Table, Column} from 'fixed-data-table'
import {Catalogue, GridBook, promise_web_catalogue} from './library'
import {FilterSelector} from './filterbar'

//var catalogue = Promise.resolve(new Catalogue('[]'))
var catalogue = promise_web_catalogue()

var LibraryGrid = React.createClass({
	getInitialState() {
		var filters
			: Array<{field: string, search: string}> 
			= []
		return {
			filters: filters,
			text: "",
			rows: this.props.catalogue.get_all_books(),
			filteredRows: null,
		}
		
	},

	update_filters: function(text: string, filters: Array<{field: string, search: string}>)
	{
		this.setState({
			filters: filters,
			text: text
		})
		this.filterRowsBy(filters, text)
	},

	componentWillMount() {
		this.filterRowsBy(this.state.filters, this.state.text)
	},

	filterRowsBy(filters: Array<{field: string, search: string}>, free_text: string) {
		var filteredRows = filters.length 
			? this.props.catalogue.get_filtered_books(filters.concat([{field: "any", search: free_text}]))
			: this.props.catalogue.get_all_books()

		this.setState({filteredRows, filters})
	},

	_rowGetter(rowIndex) {
		var rows = this.state.filteredRows
		return rows ? rows[rowIndex] : undefined
	},

	theLength() {
		return this.state.filteredRows ? this.state.filteredRows.length : this.state.rows.length
	},

	render() {
		return (
			<div>
				 <h1>La Katalogo de la MEA</h1>
				 <FilterSelector
				 	filters={this.state.filters}
					all_filters={[
						{value: "any", label: "iu ajn"},
						{value: "author", label: "verkisto"},
						{value: "title", label: "titolo"},
						{value: "translator", label: "tradukinto"},
					]}
					text={this.state.text}
					on_change={this.update_filters}
					/>
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
		document.getElementById('container')
	)
).catch( err => { alert("error"); console.log(err)
} )

