import React from 'react';
import ReactDOM from 'react-dom';

function selectInputText(element) {
  element.setSelectionRange(0, element.value.length);
}

export default class InlineEdit extends React.Component {
  static propTypes = {
    text: React.PropTypes.string.isRequired,
    paramName: React.PropTypes.string.isRequired,
    change: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    minLength: React.PropTypes.number,
    maxLength: React.PropTypes.number,
    validate: React.PropTypes.func,
    style: React.PropTypes.object,
    editingElement: React.PropTypes.string,
    editingElementRenderer: React.PropTypes.func,
    staticElement: React.PropTypes.string,
    tabIndex: React.PropTypes.number,
    isDisabled: React.PropTypes.bool,
    editing: React.PropTypes.bool
  };

  static defaultProps = {
    minLength: 1,
    maxLength: 256,
    editingElement: 'input',
    staticElement: 'span',
    tabIndex: 0,
    isDisabled: false,
    editing: false
  };

  componentWillMount() {
    this.isInputValid = this.props.validate || this.isInputValid;
    // Warn about deprecated elements
    if (this.props.element) {
      console.warn('`element` prop is deprecated: instead pass editingElement or staticElement to InlineEdit component');
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidUpdate(prevProps, prevState) {
    let inputElem = ReactDOM.findDOMNode(this.refs.input);
    if (this.props.editing && !prevProps.editing) {
      inputElem.focus();
      selectInputText(inputElem);
    }
  }

  textChanged = (event) => {
    let newProp = {};
    newProp[this.props.paramName] = event.target.value;
    this.props.change(newProp);
    this.setState({
      text: event.target.value.trim()
    });
  };

  render() {

    if (this.props.isDisabled) {

      const Element = this.props.element || this.props.staticElement;

      return <Element
        className={this.props.className}
        style={this.props.style} >
        {this.state.text || this.props.placeholder}
      </Element>;

    } else if (!this.props.editing) {

      const Element = this.props.element || this.props.staticElement;

      return <Element
        className={this.props.className}
        onClick={this.startEditing}
        tabIndex={this.props.tabIndex}
        style={this.props.style} >
        {this.state.text || this.props.placeholder}
      </Element>;

    } else {

      if (this.props.editingElementRenderer) {

        return this.props.editingElementRenderer();

      } else {

        const Element = this.props.element || this.props.editingElement;

        return <Element
          className={this.props.activeClassName}
          placeholder={this.props.placeholder}
          value={this.props.text}
          onChange={this.textChanged}
          style={this.props.style}
          ref="input" />;

      }
    }
  }
}
