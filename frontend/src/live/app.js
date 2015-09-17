/** @flow */

import * as React from 'react'
import Dialog from 'rc-dialog'
import {Table, Column} from 'fixed-data-table'
import {Catalogue, GridBook, promise_web_catalogue} from './library'
import {FilterBar} from './filterbar'
import {submit_form} from "./utilities"

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
				 <FilterBar
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

var ImportDialog = React.createClass({
	on_close() {
		if ( this.props.on_close )
			this.props.on_close()
	},

	upload() {
		submit_form(this.refs.form.getDOMNode()).then(x => alert("yay\n" + x), x => alert("boo\n" + x))
		return false
	},

	render() {
		return (
			<Dialog
				visible={this.props.is_open}
				title="Import Json records"
				animation="zoom"
				maskAnimation="fade"
				onClose={this.on_close}
			>
				<form ref="form"
					method="post" 
					encType="multipart/form-data" 
					action={mea.paths.json_import}
				>
					<input name="json_file" type="file">Json file</input>
					<button onClick={this.upload}>Import them</button>
				</form>
			</Dialog>
		)
	}
})

var App = React.createClass({
	getInitialState() {
		return {
			dialog_is_open: false
		}
	},

	open_import_dialog() {
		this.setState({dialog_is_open: true})
	},

	close_import_dialog() {
		this.setState({dialog_is_open: false})
	},

	render() {
		return (
			<div>
				 <h1>La Katalogo  de la MEA — changed</h1>
				 <p>If i want to throw some text in here, I probably should use md</p>
				 <button onClick={this.open_import_dialog}>Import</button>
				 <ImportDialog is_open={this.state.dialog_is_open} on_close={this.close_import_dialog} />
				 <LibraryGrid catalogue={this.props.catalogue} />
			</div>
		)
	}

})

catalogue.then( c =>
	React.render(
		<App catalogue={c} />,
		document.getElementById('container')
	)
).catch( err => { alert("error"); console.log(err)
} )

