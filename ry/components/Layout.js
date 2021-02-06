import PropTypes from 'prop-types';
import Head from 'next/head';

import { Layout } from 'antd';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import '../styles/antd-overrides.css';

const { Content, Footer } = Layout;

const layoutStyles = {
  container: {
    background: '#fff',
    padding: 24,
    minHeight: 280
  },
  layout: {
    margin: '0 auto',
    width: '80%'
  },
  alignCenter: {
    textAlign: 'center'
  }
};

const RyLayout = props => (
  <Layout className="ry-layout" style={layoutStyles.layout}>
    <Head>
      <title>{props.pageTitle}</title>
    </Head>
    <Header className="ry-header" pageTitle={props.pageTitle} />
    <Content>
      <div style={layoutStyles.container}>
        <Breadcrumb items={props.crumbs} />
        {props.children}
      </div>
    </Content>
    <Footer style={layoutStyles.alignCenter}>
        Reactyv Commerce ©2018 Created by Team Reactyv
    </Footer>
  </Layout>
);

RyLayout.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  crumbs: PropTypes.arrayOf(PropTypes.string)
};

RyLayout.defaultProps = {
  crumbs: []
};

export default RyLayout;
