/* Author: Sanchita Kanade
   File: ProductEdit.jsx
*/

import React from 'react';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel, ButtonToolbar,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';
import Toast from './Toast.jsx';

export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
      invalidFields: {},
      toastVisible: false,
      toastMessage: ' ',
      toastType: 'success',
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);

    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { product, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;
    const query = `mutation updateProduct(
      $id: Int!
      $changes: ProductUpdateInputs!
    ) {
       updateProduct(
         id: $id 
         changes: $changes) {
          id Category Name
          Price Image
       }
      }`;
    const { id, ...changes } = product;
    const data = await graphQLFetch(query, { changes, id }, this.showError);
    if (data) {
      this.setState({ product: data.updateProduct });
      this.showSuccess('Updated product successfully');
    }
  }

  async loadData() {
    const query = `query product($id: Int!) {
      product(id: $id) {
      id Category Name Price
      Image
      }
    }`;

    const { match: { params: { id } } } = this.props;
    const data = await graphQLFetch(query, { id }, this.showError);

    if (data) {
      this.setState({ product: data ? data.product : {}, invalidFields: {} });
    }
  }

  /* Following code is for displaying a text */

  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { product: { id } } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }
    const { product: { Name, Category } } = this.state;
    const { product: { Image, Price } } = this.state;
    const { invalidFields } = this.state;

    let validationMessage;
    if (Object.keys(invalidFields).length !== 0) {
      validationMessage = (
        <div className="error">
          Please correct invalid fields before submitting.
        </div>
      );
    }

    return (
      <Col sm={9}>
        <Panel>
          <Panel.Heading>
            <Panel.Title>{`Editing Product: ${id}`}</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <Form horizontal onSubmit={this.handleSubmit}>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Name:</Col>
                <Col sm={7}>
                  <FormControl
                    componentClass={TextInput}
                    name="Name"
                    value={Name}
                    onChange={this.onChange}
                    key={id}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Category:</Col>
                <Col sm={7}>
                  <FormControl componentClass="select" name="Category" value={Category} onChange={this.onChange}>
                    <option>Shirts</option>
                    <option>Jeans</option>
                    <option>Jackets</option>
                    <option>Sweaters</option>
                    <option>Accessories</option>
                  </FormControl>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Price:</Col>
                <Col sm={7}>
                  <FormControl
                    componentClass={NumInput}
                    name="Price"
                    value={Price}
                    onChange={this.onChange}
                    key={id}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>Image:</Col>
                <Col sm={7}>
                  <FormControl
                    componentClass={TextInput}
                    name="Image"
                    value={Image}
                    onChange={this.onChange}
                    key={id}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col smOffset={3} sm={6}>
                  <ButtonToolbar>
                    <Button id="updateButton" bsStyle="primary" type="submit">Submit</Button>
                    <LinkContainer to="/products">
                      <Button bsStyle="link">Back</Button>
                    </LinkContainer>
                  </ButtonToolbar>
                </Col>
              </FormGroup>

              <FormGroup>
                <Col smOffset={3} sm={9}>{validationMessage}</Col>
              </FormGroup>
            </Form>
          </Panel.Body>

          <Panel.Footer>
            <Link to={`/edit/${id - 1}`} id="prev">Prev</Link>
            {' | '}
            <Link to={`/edit/${id + 1}`} id="next">Next</Link>
          </Panel.Footer>

          <Toast
            showing={toastVisible}
            onDismiss={this.dismissToast}
            bsStyle={toastType}
          >
            {toastMessage}
          </Toast>
        </Panel>
      </Col>
    );
  }
}
