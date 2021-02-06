import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Tag, Switch } from 'antd';

class ProductVariantSize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selAttr: props.attrs[props.activeSkuIndex],
      stockVisible: false
    };
    this.isUnavailableOrOOS = this.isUnavailableOrOOS.bind(this);
    this.isSelAttr = this.isSelAttr.bind(this);
    this.onAttrSelected = this.onAttrSelected.bind(this);
    this.getAttrCls = this.getAttrCls.bind(this);
    this.getAttrLabel = this.getAttrLabel.bind(this);
    this.getAttrStyle = this.getAttrStyle.bind(this);
    this.getStockTagColor = this.getStockTagColor.bind(this);
    this.onStockSwitchChange = this.onStockSwitchChange.bind(this);
  }

  onAttrSelected(attr, onChange) {
    this.setState({
      selAttr: attr
    });
    onChange(attr);
  }

  onStockSwitchChange(checked) {
    if (checked) {
      this.setState({
        stockVisible: true
      });
    } else {
      this.setState({
        stockVisible: false
      });
    }
  }

  getAttrLabel({ display }, displayType) {
    if (displayType === 'img') {
      return '';
    }
    return display.length > 2 ? display.substr(0, 2).toUpperCase() : display;
  }

  getAttrStyle({ display }, displayType) {
    if (displayType === 'img') {
      return {
        backgroundImage: `url(${display})`,
        color: 'white'
      };
    } else if (displayType === 'cc') {
      return {
        backgroundColor: display,
        color: display
      };
    }
    return {};
  }

  getAttrCls(attr) {
    return this.isOOS(attr) ? 'danger' : 'dashed';
  }

  getStockTagColor({ inventory: { quantity } }) {
    if (quantity === 0) {
      return 'red';
    } else if (quantity > 0 && quantity < 20) {
      return 'gold';
    }
    return 'green';
  }

  isUnavailableOrOOS({ inventory: { quantity } }) {
    return !quantity;
  }

  isSelAttr({ id }) {
    return this.state.selAttr && this.state.selAttr.id === id;
  }

  // Supported types: image, colorcodes, string value
  render() {
    const {
      selLabel,
      attrLabel,
      sizeOptions,
      attrs,
      onChange
    } = this.props;
    const { stockVisible, selAttr } = this.state;
    return (
      <div className="product-variant">
        <h2 style={{ marginBottom: 0, marginTop: 20 }}>{selLabel} {attrLabel}  <Switch checkedChildren="Hide Stock" unCheckedChildren="Show Stock" onChange={this.onStockSwitchChange} /></h2>
        <h4 style={{ marginBottom: 15 }}>
          {
            selAttr ? (
              <span>
                Selected {attrLabel}:&nbsp;
                <span style={{ color: 'green' }}>
                  {
                    sizeOptions.map(sizeOption => (
                      selAttr.size[sizeOption.name]
                    )).join(' / ')
                  }
                </span>
              </span>
            ) : ''
          } &nbsp;
          <span style={{ color: 'red' }}>
            { selAttr && selAttr.inventory.quantity > 0 && selAttr.inventory.quantity < 20 ? `Hurry, only ${selAttr.inventory.quantity} left in stock!` : '' }
          </span>
        </h4>
        {
          attrs.map(attr => (
            <div key={attr.id} style={{ display: 'inline-block' }}>
              <Button
                size="large"
                shape="circle"
                key={attr.id}
                disabled={attr.inventory ? this.isUnavailableOrOOS(attr) : false}
                className="item-attr"
                onClick={() => this.onAttrSelected(attr, onChange)}
                style={{
                  marginRight: 8,
                  fontSize: 14,
                  position: 'relative',
                  background: this.isSelAttr(attr) && '#fdf0f0',
                  border: this.isSelAttr(attr) && '2px solid lightgrey'
                }}
              >
                <Icon
                  type={this.isSelAttr(attr) ? 'check' : ''}
                  style={{
                    fontSize: 14,
                    color: 'white',
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    display: attr.inventory.quantity === 0 ? 'none' : 'block',
                    background: selAttr && selAttr.inventory.quantity > 0 && selAttr.inventory.quantity < 20 ? 'orange' : 'blue',
                    borderRadius: 8,
                    padding: 1
                }}
                />
                {
                  attr.size && attr.size[sizeOptions[0].name] ? attr.size[sizeOptions[0].name] : ''
                }
              </Button>
              <div className="tag-cnt">
                <Tag style={stockVisible ? '' : { visibility: 'hidden' }} color={this.getStockTagColor(attr)}>{attr.inventory.quantity}</Tag>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

ProductVariantSize.propTypes = {
  selLabel: PropTypes.string,
  attrLabel: PropTypes.string,
  sizeOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  attrs: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  activeSkuIndex: PropTypes.number.isRequired
};

ProductVariantSize.defaultProps = {
  selLabel: 'Pick your',
  attrLabel: 'size',
  attrs: []
};

export default ProductVariantSize;
