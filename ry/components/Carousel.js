import React, { Component } from 'react';
import PropType from 'prop-types';
import { Carousel, Col, Row } from 'antd';

import '../styles/slider.css';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  fade: true,
  cssEase: 'linear',
  centerMode: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
};

export default class RyCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  render() {
    const { items } = this.props;
    const imgNormal = items.map(item => item.normal);
    const imgSmall = items.map(item => item.small);
    return (
      <Row style={{ paddingRight: 20 }}>
        <Col xs={0} sm={6} md={6} lg={6} xl={6} style={{ maxHeight: 480 }}>
          <Carousel
            className="carousel-nav"
            asNavFor={this.state.nav1}
            ref={slider => (this.slider2 = slider)}
            slidesToShow={4}
            swipeToSlide
            focusOnSelect
            vertical
            dots={false}
            infinite
            arrows
          >
            {
              imgSmall.map((img, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i}><img src={img} alt="" /></div>
              ))
            }
          </Carousel>
        </Col>
        <Col xs={24} sm={18} md={18} lg={18} xl={18}>
          <Carousel
            className="carousel-main"
            asNavFor={this.state.nav2}
            ref={slider => (this.slider1 = slider)}
            arrows
            accessibility
            settings={settings}
          >
            {
              imgNormal.map((img, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i}><img src={img} alt="" /></div>
              ))
            }
          </Carousel>
        </Col>
      </Row>
    );
  }
}

RyCarousel.propTypes = {
  items: PropType.arrayOf(PropType.shape({
    tiny: PropType.string,
    small: PropType.string,
    normal: PropType.string,
    huge: PropType.string
  })).isRequired
};

