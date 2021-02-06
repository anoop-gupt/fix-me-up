import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';

class ProductVariantColour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selAttr: props.attrs[props.activeSwatchIndex]
    };
    this.isOOS = this.isOOS.bind(this);
    this.onAttrSelected = this.onAttrSelected.bind(this);
    this.getAttrCls = this.getAttrCls.bind(this);
    this.getAttrLabel = this.getAttrLabel.bind(this);
    this.getAttrStyle = this.getAttrStyle.bind(this);
  }

  onAttrSelected(attr, onChange) {
    this.setState({
      selAttr: attr
    });
    onChange(attr);
  }

  getAttrCls(attr) {
    return this.isOOS(attr) ? 'danger' : 'dashed';
  }

  getAttrStyle({ swatchImage }) {
    return {
      backgroundImage: `url(${swatchImage})`,
      color: 'white',
      marginRight: 8,
      marginBottom: 8
    };
  }

  getAttrLabel({ display }, displayType) {
    if (displayType === 'img') {
      return '';
    }
    return display.length > 2 ? display.substr(0, 2).toUpperCase() : display;
  }

  isOOS(attr) {
    return attr && attr.skus && attr.skus[0].inventory.quantity === 0;
  }

  // Supported types: image, colorcodes, string value
  render() {
    const {
      selLabel,
      attrLabel,
      attrs,
      onChange
    } = this.props;
    return (
      <div className="product-variant">
        <h2 style={{ marginBottom: 0 }}>{selLabel} { attrLabel }</h2>
        <h4>{this.state.selAttr ? 'Selected: ' : ' '}
          <span style={{ color: 'green' }}>
            {`${this.state.selAttr && this.state.selAttr.colour ? this.state.selAttr.colour : 'only available style/type'}`}
          </span>&nbsp;
        </h4>
        {
          attrs.map(attr => (
            <Button
              size="large"
              shape="circle"
              // icon={this.state.selAttr && this.state.selAttr.colour === attr.colour ? 'check' : ''}
              title={attr.colour}
              key={attr.colour ? attr.colour.toLowerCase() : ''}
              style={this.getAttrStyle(attr)}
              disabled={this.isOOS(attr)}
              className="item-attr"
              onClick={() => this.onAttrSelected(attr, onChange)}
            >
              <Icon type={this.state.selAttr && this.state.selAttr.colour === attr.colour ? 'check' : ''} style={{ fontSize: 16, color: '#08c' }} />
            </Button>
          ))
        }
      </div>
    );
  }
}

ProductVariantColour.propTypes = {
  selLabel: PropTypes.string,
  attrLabel: PropTypes.string.isRequired,
  attrs: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  activeSwatchIndex: PropTypes.number.isRequired
};

ProductVariantColour.defaultProps = {
  selLabel: 'Pick your',
  attrs: []
};

export default ProductVariantColour;
