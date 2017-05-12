var rule = require( '../../../lib/rules/jsx-no-unbounded-this-in-props' ),
	config = {
		env: { es6: true },
		parser: 'babel-eslint',
		parserOptions: { ecmaFeatures: { jsx: true } }
	},
	RuleTester = require( 'eslint' ).RuleTester;

( new RuleTester( config ) ).run( 'jsx-no-unbounded-this-in-props', rule, {
	valid: [
		{
			code: `
			class Test extends React.Component {
				constructor() {
					this.nullValue = null;
					this.onChange = this.onChange.bind( this );
				}
				onChange(event) {
					this.setState( { value: event.target.value } );
				}

				render() {
					return (<div onClick={ this.onChange } alt="test"></div>)
				}
			}
			`
		},
		{
			code: `
				class Hello extends React.Component {
					onChange = (event) => {
					this.setState({value: event.target.value});
					}
					render() {
						return (
							<div><a onClick={this.onChange}>Button</a></div>
						);
					}
				}
		`
		},
		{
			code: `
			class Test extends React.Component {
				onChange(event) {
					this.setState( { value: event.target.value } );
				}
				
				render() {
					return (<div onClick={ this.onChange.bind( this ) }></div>)
				}
			}
		`
		},
		{
			code: `
			class Test extends React.Component {
				onChange(event) {
					this.setState( { value: event.target.value } );
				}
				
				render() {
					return (<div onClick={ (event) => this.onChange(event) }></div>)
				}
			}
		`
		},
		{
			code: `
			const Text = React.createClass({
				onChange(event) {
					this.setState( {value: event.target.value } );
				},
				render() {
					return <div onClick={ this.onChange } />;
				}
			});
			`
		}
	],
	invalid: [ {
		code: `
			class Test extends React.Component {
				onChange(event) {
					this.setState( { value: event.target.value } );
				}
			
				render() {
					return (<div onClick={ this.onChange }></div>)
				}
			}
		`,
		errors: [ {
			message: rule.ERROR_MESSAGE
		} ]
	} ]
} );
