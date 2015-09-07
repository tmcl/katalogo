/** @flow */
import * as React from "react"

var sizerStyle = { position: 'absolute', visibility: 'hidden', height: 0, width: 0, overflow: 'scroll', whiteSpace: 'nowrap' };

export var Input = React.createClass({
	propTypes: {
		value: React.PropTypes.any,                 // field value
		defaultValue: React.PropTypes.any,          // default field value
		on_change: React.PropTypes.func,             // onChange handler: function(newValue) {}
		on_keydown: React.PropTypes.func,             // onChange handler: function(newValue) {}
		style: React.PropTypes.object,              // css styles for the outer element
		className: React.PropTypes.string,          // className for the outer element
		minWidth: React.PropTypes.number,       	// minimum width for input element
		inputStyle: React.PropTypes.object,         // css styles for the input element
		inputClassName: React.PropTypes.string,      // className for the input element
	},
	getDefaultProps: function (): {minWidth: number} {
		return { minWidth: 1 };
	},
	getInitialState: function () {
		return {
			inputWidth: this.props.minWidth
		};
	},
	componentDidMount: function () {
		this.copyInputStyles();
		this.updateInputWidth();
	},
	componentDidUpdate: function () {
		this.updateInputWidth();
	},
	copyInputStyles: function () {
		var self = this;
		if (!self.isMounted() || !window.getComputedStyle) {
			return;
		}
		var inputStyle = window.getComputedStyle(React.findDOMNode(this.refs.input));
		var widthNode = React.findDOMNode(this.refs.sizer);
		widthNode.style.fontSize = inputStyle.fontSize;
		widthNode.style.fontFamily = inputStyle.fontFamily;
		if (self.props.placeholder) {
			var placeholderNode = React.findDOMNode(this.refs.placeholderSizer);
			placeholderNode.style.fontSize = inputStyle.fontSize;
			placeholderNode.style.fontFamily = inputStyle.fontFamily;
		}
	},
	updateInputWidth: function () {
		if (!this.isMounted() || typeof React.findDOMNode(this.refs.sizer).scrollWidth === 'undefined')
			return;

		var newInputWidth = Math.max( 
				// $FlowFixMe this seems to be a bug in Flow, both values should be numbers according to the type specs.
				this.props.minWidth, 
				this.props.placeholder
					? 2 + Math.max(
						React.findDOMNode(this.refs.sizer).scrollWidth, 
						React.findDOMNode(this.refs.placeholderSizer).scrollWidth)
					: React.findDOMNode(this.refs.sizer).scrollWidth + 2 )

		if (newInputWidth !== this.state.inputWidth)
			this.setState({ inputWidth: newInputWidth })
	},
	getInput: function (): string {
		return this.refs.input;
	},
	focus: function () {
		React.findDOMNode(this.refs.input).focus();
	},
	select: function () {
		React.findDOMNode(this.refs.input).select();
	},
	handle_change: function() {
		var new_text = this.refs.input.getDOMNode().value
		if (this.props.on_change) 
			this.props.on_change( new_text|| "[undefined]")
	},

	handle_keydown: function(e:any):void {
		if ( this.props.on_keydown )
			this.props.on_keydown(e)
	},

	render: function (): any {
		var wrapperStyle = this.props.style || {};
		wrapperStyle.display = 'inline-block';
		var inputStyle = this.props.inputStyle || {};
		inputStyle.width = this.state.inputWidth;
		var placeholder = this.props.placeholder ? <div ref="placeholderSizer" style={sizerStyle}>{this.props.placeholder}</div> : null;
		return (
			<div className={this.props.className} style={wrapperStyle}>
				<input {...this.props} onChange={this.handle_change} onKeyDown={this.handle_keydown} ref="input" className={this.props.inputClassName} style={inputStyle} />
				<div ref="sizer" style={sizerStyle}>{this.props.value}</div>
				{placeholder}
			</div>
		);
	}
});
