import React from 'react';
import { Divider } from 'antd';

import { Layout } from '../ry/components';

export default () => (
  <Layout pageTitle="Reactyv | About">
    <Divider dashed><h2>What&apos;s Reactyv?</h2></Divider>
    <p><strong>Reactyv</strong> is UI face built to give a product detail page experience, that&apos;s able to watch the changes
    happening to the crucial attributes like price, inventory, etc. it relies upon and give customers/users a more accurate view
    and prevent them from taking actions that could fail due to a stale data display
    </p>
    <br />
    <Divider dashed><h2>What&apos;s it built upon?</h2></Divider>
    <p><strong>Reactyv</strong> is built upon some of the most popular and robust modules available out of Javascript/NodeJS ecosystem like React,
    RxJS, NextJS, etc.
    </p>
  </Layout>
);
