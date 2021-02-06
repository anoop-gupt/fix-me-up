import Link from 'next/link';
import {
  Layout,
  // Menu,
  Divider
} from 'antd';

const { Header } = Layout;

const RyHeader = () => (
  <Header>
    <Divider>
      <h2>
        <img className="logo-img" src="../../static/Reactyv_Logo.png" alt="Reactyv logo" />
        <div>COMMERCE</div>
      </h2>
      <div style={{ textAlign: 'center' }}>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Divider type="vertical" />
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
    </Divider>
  </Header>
);

export default RyHeader;
