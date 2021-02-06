// Community modules: Core
import React from 'react';
import PropType from 'prop-types';
// Community modules: Next
import Error from 'next/error';
import getConfig from 'next/config';
// Community components: UI
import { Button, Modal, Row, Icon, Col, Rate, Divider, Collapse, Card, message, Avatar, Badge } from 'antd';
// App components & services
import { Layout, Carousel, ProductVariantColour, ProductVariantSize } from '../ry/components';
import { ProductService } from '../ry/services';
import AggregatedEventSource from '../ry/core/aggregatedEvtSource';

const { publicRuntimeConfig = {} } = getConfig() || {};
const { evtSourceURI } = publicRuntimeConfig;

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 1,
      discount: 530,
      addingItem: false,
      activeSwatch: props.product.styles[0],
      activeSku: props.product.styles[0].skus[0],
      product$: this.reInitializeQty(props.product),
      showPromoModal: false
    };

    // Variable bindings
    this.isFirstUpdate = true;

    // Method bindings
    this.onIncr = this.onIncr.bind(this);
    this.onDecr = this.onDecr.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.onSwatchChange = this.onSwatchChange.bind(this);
    this.onSizeChange = this.onSizeChange.bind(this);
    this.onQtyChange = this.onQtyChange.bind(this);
    this.showPromoModal = this.showPromoModal.bind(this);
    this.hidePromoModal = this.hidePromoModal.bind(this);
  }
  // Initial Props
  static async getInitialProps({ req: { params: { id } } }) {
    const res = await ProductService.getProduct(id);
    const { data, statusCode } = res;

    return {
      product: data,
      statusCode
    };
  }

  // On Mount
  componentDidMount() {
    const aggregator = new AggregatedEventSource(evtSourceURI + this.props.product.id);
    aggregator.subscribe((updates) => {
      const $product = { ...this.state.product$ };
      const { isFirstUpdate } = this;
      const { skus } = $product.styles[0];
      const sizeOptName = $product.sizeOptions.name || 'Size';
      const upcs = [];
      skus.forEach((sku, i) => {
        if (updates[sku.upc] && updates[sku.upc].inventory.quantity !== sku.inventory.quantity) {
          // Create a structure suitable for further displays
          upcs.push({
            upc: sku.upc,
            from: $product.styles[0].skus[i].inventory.quantity,
            to: updates[sku.upc].inventory.quantity,
            size: $product.styles[0].skus[i].size[sizeOptName]
          });
          $product.styles[0].skus[i].inventory.quantity = updates[sku.upc].inventory.quantity;
          return !isFirstUpdate ? message.info(`Updating inventory for ${sku.upc}`) : '';
        }
        return '';
      });
      // Proceed on updates
      if (upcs.length) {
        // Update state for the changes to take effect
        this.setState({
          product$: $product
        });

        // Notify user of changes only if they occur after page load
        if (isFirstUpdate) {
          this.updateOnLoad();
        } else {
          message.success(`A total of ${upcs.length} updates took place for UPCs: ${upcs.map(upc => upc.upc).join(', ')}!`, () => {
            const upcsDroppedToZero = upcs.filter(upc => upc.to === 0);
            const upcsBackFromZero = upcs.filter(upc => upc.from === 0);
            if (upcsDroppedToZero.length || upcsBackFromZero.length) {
              Modal.info({
                title: 'Inventory Updates!',
                content: (
                  <div>
                    {
                      upcsBackFromZero.length ?
                        <div>
                          <h4>Following sizes have just become available. Dont miss checking them out! </h4>
                          {
                            upcsBackFromZero.map((upc, i) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <Divider key={i}>
                                <Badge count={upc.from}><Avatar shape="square" size="large">{upc.size}</Avatar></Badge>
                                &nbsp;&rarr;&nbsp;<Icon type="check-circle-o" style={{ color: 'green' }} />&nbsp;&rarr;&nbsp;
                                <Badge count={upc.to}><Avatar shape="square" size="large">{upc.size}</Avatar></Badge>
                              </Divider>
                            ))
                          }
                        </div> :
                      ''
                    }
                    {
                      upcsDroppedToZero.length ?
                        <div>
                          <h4>Following sizes have went OOS. Be tuned in! </h4>
                          {
                            upcsDroppedToZero.map((upc, i) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <Divider key={i}>
                                <Badge count={upc.from}><Avatar shape="square" size="large">{upc.size}</Avatar></Badge>
                                &nbsp;&rarr;&nbsp;<Icon type="close-circle-o" style={{ color: 'red' }} />&nbsp;&rarr;&nbsp;
                                <Badge count={upc.to}><Avatar shape="square" size="large">{upc.size}</Avatar></Badge>
                              </Divider>
                            ))
                          }
                        </div>
                        : ''
                    }
                  </div>
                ),
                onOk() {}
              });
            }
            return '';
          });
        }
      }
    });
  }

  // Event listeners
  onIncr() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  onDecr() {
    const { counter } = this.state;
    if (counter > 1) {
      this.setState({
        counter: this.state.counter - 1
      });
    }
  }

  onSwatchChange(currSwatch) {
    this.setState({
      activeSwatch: currSwatch
    });
  }

  onSizeChange(currSku) {
    this.setState({
      activeSku: currSku
    });
  }

  onQtyChange() {
    // Update state on Quantity change
  }

  getActiveSku() {
    // Get currently active SKU
  }

  reInitializeQty(product) {
    if (product && product.styles) {
      product.styles.forEach((style) => {
        style.skus.forEach((opt) => {
          Object.assign(opt, {
            inventory: {}
          });
        });
      });
    }
    return product;
  }

  updateOnLoad() {
    this.isFirstUpdate = false;
  }

  showPromoModal() {
    this.setState({
      showPromoModal: true
    });
  }

  hidePromoModal() {
    this.setState({
      showPromoModal: false
    });
  }

  addToCart() {
    this.setState({
      addingItem: true
    });
    setTimeout(() => {
      this.setState({
        addingItem: false
      });
    }, 3000);
  }

  // Render
  render() {
    const { statusCode } = this.props;
    const { product$ } = this.state;
    if (statusCode > 200) {
      return <Error statusCode={statusCode} />;
    }
    return (
      <Layout
        pageTitle={`Reactyv | ${product$.name}`}
        crumbs={
          [
            product$.type,
            product$.department,
            product$.brand
          ]
        }
      >
        <Row>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Carousel items={this.state.activeSwatch.images} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <h1 style={{ marginBottom: 0 }}>{product$.name}</h1>
            <h4 style={{ textTransform: 'uppercase', color: 'silver' }}>{product$.brand}</h4>
            <Row>
              {/* Price & Rating */}
              <Col xs={24} sm={2} md={24} lg={24} xl={24}>
                <Rate defaultValue={product$.reviewsSummary.averageRating} />
                <a href={product$.reviewsSummary.reviewsUrl} title="Reviews..."> {product$.reviewsSummary.reviewCount} Reviews</a>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <h1 style={{ display: 'inline' }}>£{product$.priceSummary.maximum}</h1>
                {
                  this.state.activeSwatch &&
                  this.state.activeSwatch.skus.length &&
                  this.state.activeSwatch.skus[0].price.unitPriceString ?
                    <h4 style={{ color: 'silver' }}>£{this.state.activeSwatch.skus[0].price.unitPriceString}</h4> :
                  ''
                }
                {product$.priceSummary.previousPrices.maximum ? (
                  <h4 style={{ display: 'inline' }}>&nbsp;<strike>£{product$.priceSummary.previousPrices.maximum}</strike></h4>
                ) : ''}
                {product$.priceSummary.previousPrices.maximum ? (
                  <h5>You save <span style={{ display: 'inline' }}>£{this.state.discount}</span></h5>
                ) : ''}
              </Col>
            </Row>
            <Row className="promos">
              {/* Promotions */}
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {product$.promotions.filter(promotion => promotion.longDescription).map((promotion, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={i}>
                    <Divider dashed />
                    <a href="#" title={promotion.shortDesscription} onClick={this.showPromoModal}><Icon type="tag" />   {promotion.shortDescription}</a>
                    <Modal
                      title={promotion.shortDescription}
                      wrapClassName="vertical-center-modal"
                      visible={this.state.showPromoModal}
                      maskClosable
                      cancelText=""
                      footer={null}
                      iconType="question-circle"
                      onCancel={() => this.hidePromoModal(false)}
                    >
                      <p>{promotion.longDescription}</p>
                    </Modal>
                    <Divider dashed />
                  </div>
                ))}
              </Col>
            </Row>
            <Row className="variants">
              {/* this.state.activeSku ? JSON.stringify(this.state.activeSku) : '' */}
              {/* Color & Size selection */}
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {/* Color */}
                {product$.styles.length ? (
                  <ProductVariantColour
                    attrLabel="color"
                    display="img"
                    attrs={product$.styles}
                    activeSwatchIndex={0}
                    onChange={this.onSwatchChange}
                  />
                ) : '' }
                {/* Size */}
                {
                  product$.sizeOptions.length ? (
                    <ProductVariantSize
                      attrLabel="size"
                      sizeOptions={product$.sizeOptions}
                      display="str"
                      attrs={this.state.activeSwatch.skus}
                      activeSkuIndex={0}
                      onChange={this.onSizeChange}
                    />
                  ) : ''}
              </Col>
            </Row>
            <Row>
              <Divider />
              <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: 0, marginTop: 20 }}>
                <Button ghost type="primary" icon="minus" size="large" shape="circle" onClick={this.onDecr} />
                &nbsp;&nbsp;&nbsp;
                {this.state.counter}
                &nbsp;&nbsp;&nbsp;
                <Button ghost type="primary" icon="plus" size="large" shape="circle" onClick={this.onIncr} />
                <Divider type="vertical" />
                <Button type="primary" size="large" icon="shopping-cart" loading={this.state.addingItem} onClick={this.addToCart} >
                  <span style={{
                    color: 'limegreen',
                    fontSize: 12,
                    background: '#8484ed',
                    padding: 2,
                    borderRadius: 3,
                    marginRight: 5
                    }}
                  >
                    £{this.state.activeSku.price.currentPrice * this.state.counter}
                  </span>
                  Add to BAG
                </Button>
                <Divider type="vertical" />
                <Button ghost type="primary" size="large" icon="eye">
                    See in store
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Divider>Description</Divider>
            <p style={{ textAlign: 'center' }}>
              {product$.description}
            </p>
            <Collapse bordered={false} defaultActiveKey={['1']}>
              <Collapse.Panel header={<Divider dashed>Item Details</Divider>} key="collapse-panel-1" showArrow={false}>
                <div style={{ background: '#f0f2f5', padding: '30px' }}>
                  <Row gutter={16}>
                    {product$.productInformation.map((info, i) => (
                      info.children ?
                        // eslint-disable-next-line react/no-array-index-key
                        <Col key={i} span={8}>
                          <Card title={info.text} bordered={false}>
                            {
                              info.children.map((infoItem, idx) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={`ic_${idx}`}>
                                  <h4>{infoItem.text}</h4>
                                  {
                                    infoItem.children ?
                                    infoItem.children.map(infoSubItem => (
                                      // eslint-disable-next-line react/no-array-index-key
                                      <p key={i}>{infoSubItem.text}</p>
                                    )) : ''
                                  }
                                </div>
                              ))
                            }
                          </Card>
                        </Col> :
                      ''
                    ))}
                  </Row>
                </div>
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ background: '#f0f2f5', padding: '30px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ textAlign: 'center' }}>
                  <Icon type="tags" style={{ fontSize: 36 }} />
                  <h3>FREE home delivery*</h3>
                  <a href="#">See more</a>
                </Card>
              </Col>
              <Col span={6}>
                <Card style={{ textAlign: 'center' }}>
                  <Icon type="bulb" style={{ fontSize: 36 }} />
                  <h3>100% Manufactured in UK</h3>
                  <a href="#">See more</a>
                </Card>
              </Col>
              <Col span={6}>
                <Card style={{ textAlign: 'center' }}>
                  <Icon type="eye" style={{ fontSize: 36 }} />
                  <h3>View instore before you buy</h3>
                  <a href="#">See more</a>
                </Card>
              </Col>
              <Col span={6}>
                <Card style={{ textAlign: 'center' }}>
                  <Icon type="heart-o" style={{ fontSize: 36 }} />
                  <h3>Customize to your taste*</h3>
                  <a href="#">See more</a>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout>
    );
  }
}

const ProductPropType = PropType.shape({
  id: PropType.string,
  name: PropType.string,
  description: PropType.string,
  reviewsSummary: PropType.shape({
    averageRating: PropType.number,
    reviewCount: PropType.number
  }),
  images: PropType.arrayOf(PropType.shape({
    tiny: PropType.string,
    small: PropType.string,
    normal: PropType.string,
    huge: PropType.string
  })),
  styles: PropType.arrayOf(PropType.shape({
    colour: PropType.string,
    swatchImage: PropType.string,
    skus: PropType.arrayOf(PropType.shape({
      id: PropType.string
    }))
  }))
});

Index.propTypes = {
  product: ProductPropType.isRequired,
  statusCode: PropType.string
};

Index.defaultProps = {
  statusCode: '200'
};

