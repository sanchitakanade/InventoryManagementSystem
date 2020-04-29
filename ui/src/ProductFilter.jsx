/* Author: Sanchita Kanade
   File: ProductFilter.jsx
*/

/* eslint "react/prefer-stateless-function": "off" */
/* eslint linebreak-style: ["error", "windows"] */

import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Form, FormControl, FormGroup, ControlLabel, Button,
} from 'react-bootstrap';
import URLSearchParams from 'url-search-params';

class ProductFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      Category: params.get('Category') || '',
      changed: false,
    };
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeCategory(e) {
    this.setState({ Category: e.target.value, changed: true });
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      Category: params.get('Category') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { Category } = this.state;
    const { history } = this.props;
    history.push({
      pathname: '/products',
      search: Category ? `?Category=${Category}` : '',
    });
  }

  render() {
    const { Category, changed } = this.state;
    return (
      <Form inline>
        <FormGroup>
          <ControlLabel>
            Category:
          </ControlLabel>
          {' '}
          <FormControl componentClass="select" value={Category} onChange={this.onChangeCategory}>
            <option value="">(All)</option>
            <option value="Shirts">Shirts</option>
            <option value="Jeans">Jeans</option>
            <option value="Jackets">Jackets</option>
            <option value="Sweaters">Sweaters</option>
          </FormControl>
        </FormGroup>
        {' '}
        <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
          Apply
        </Button>
        {' '}
        <Button
          type="button"
          onClick={this.showOriginalFilter}
          disabled={!changed}
        >
          Reset
        </Button>
      </Form>
    );
  }
}

export default withRouter(ProductFilter);
