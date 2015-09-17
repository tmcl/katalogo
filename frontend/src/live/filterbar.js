/** @flow */

import * as React from 'react'
import {Input} from "./AutosizeInput"

type FilterField = { label: string, value: string }

var class_prefix = "filter-"

var MenuItem = React.createClass({
	render() {
		return (
			<div 
				onClick={() => this.props.on_select(this.props.item)} 
				className={class_prefix + "menu-item"}
			>
				{this.props.item.label}
			</div>
		)
	}
})

var Menu = React.createClass({
	select(item: FilterField): void {
		if (this.props.on_select)
			this.props.on_select(item)
	},

	remove(): void {
		if (this.props.on_remove)
			this.props.on_remove()
	},

	render() {
		return !this.props.is_open ? <div/> : (
			<div className={class_prefix + "menu-outer"}>
				<div className={class_prefix + "menu-inner"}>
					<MenuItem key="deletor" on_select={this.remove} item={{label: "×"}}/>
					{this.props.items.map((item, index) => <MenuItem 
							key={item.value} 
							on_select={this.select}
							item={item}/>)}
				</div>
			</div>
		)
	}
})

var Filter = React.createClass({
	propTypes: {
		filter: React.PropTypes.object,
		on_filter_changed: React.PropTypes.func,
		thing: React.PropTypes.number
	},

	getInitialState() {
		return {
			is_open: false
		}
	},

	filter_type_label: function(): string {
		return !this.props.filter || this.props.filter.field === "any" ? "" : this.props.filter.field + " "
	},

	toggle_menu: function(): void {
		this.setState({is_open: !this.state.is_open})
	},
	
	filter_changed: function(field: FilterField): void {
		if ( this.props.on_filter_changed )
			this.props.on_filter_changed(field, this.props.thing)
	},

	filter_removed: function(field: FilterField): void {
		if ( this.props.on_filter_removed )
			this.props.on_filter_removed(this.props.thing)
	},

	render: function(): any {
		return (
			<span className={class_prefix+"filter-container"} onClick={this.toggle_menu}>
				<div className={class_prefix+"filter"}>
					<div className={class_prefix + "item"}>
						<span className={class_prefix + "item-label"}>{this.props.filter?this.props.filter.search:""}</span>
						<span className={class_prefix + "item-icon"}>{this.filter_type_label()}▼</span>
					</div>
					<Menu 
						on_remove={this.filter_removed} 
						on_select={this.filter_changed} 
						is_open={this.state.is_open} 
						items={this.props.filters} />
				</div>
			</span>
		)
	}
})

var quote_if_has_space = (str) => str.match(" ") ? '"' + str + '"' : str

export var FilterBar = React.createClass({
	input_did_change: function(new_text: string): void {
		if (!this.props.on_change || !new_text)
			return

		var filters=[]
		var remaining_text = ""
		var matches = new_text.match(/"/g)

		var divider = (divider, new_text) => {
			var splat_string = new_text.split(divider)
			var remaining_text = splat_string[splat_string.length - 1]
			var extra_filters = splat_string.slice(0, -1).filter(str=>str !== "").map( str => ({
				field: "any",
				search: str
			}))
			return { remaining_text, extra_filters }
		}

		if (matches && matches.length % 2 == 1) {
			this.props.on_change(new_text, this.props.filters)
			return
		}

		var divided = divider(matches ? '"' : " ", new_text)
		var filters = this.props.filters.concat(divided.extra_filters)

		this.props.on_change(divided.remaining_text, filters)
	},

	key_down: function(event:{keyCode: number, preventDefault:() => void}): void {
		if (event.keyCode != 8)
			return
		
		event.preventDefault()
		var remaining_text = ""
		var filters = this.props.filters
	  	if (this.props.text.length)
		{
			remaining_text = this.props.text.substring(0, this.props.text.length-1)
		}
		else if (this.props.filters.length)
		{
			var last_filter = this.props.filters[this.props.filters.length-1]
			remaining_text = quote_if_has_space(last_filter.search)
			filters = this.props.filters.slice(0, -1)
		}
		this.props.on_change(remaining_text, filters)
	},

	filter_removed: function(key: number): void {
		var new_filters = this.props.filters.slice()
		delete new_filters[key]
		this.props.on_change(this.props.text, new_filters)
	},

	filter_changed: function(filter: FilterField, key: number): void {
		var new_filters = this.props.filters.slice()
		new_filters[key].field = filter.value
		this.props.on_change(this.props.text, new_filters)
	},

	select_input: function(): void {
		this.refs.input.focus()
	},

	render: function(): any {
		var items = this.props.filters.map( (filter, i) => <Filter 
				key={i} 
				thing={i}
				filter={filter} 
				filters={this.props.all_filters}
				on_filter_changed={this.filter_changed}
				on_filter_removed={this.filter_removed}
			/> )
		return (
			<div className={class_prefix+"entry"} onClick={this.select_input}>
				<span>{items}</span>
				<Input ref="input"
					inputClassName={class_prefix+"input"} 
					value={this.props.text} 
					on_change={this.input_did_change} 
					on_keydown={this.key_down}
					minWidth={5} />
			</div>
		)
	}
})

