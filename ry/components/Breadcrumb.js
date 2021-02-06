import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types';

// Use `Ry[CompponentName]` to define a component where a name conflict is possible
const RyBreadcrumb = ({ items }) => (
  <Breadcrumb style={{ margin: '16px 0' }}>
    {
      items.map((item, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Breadcrumb.Item key={i}>{ item }</Breadcrumb.Item>
      ))
    }
  </Breadcrumb>
);

RyBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string.isRequired)
};

RyBreadcrumb.defaultProps = {
  items: []
};

export default RyBreadcrumb;
