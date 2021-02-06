import React from 'react';
import Link from 'next/link';
import { List, Card, Divider } from 'antd';
import { Layout } from '../ry/components';

const productList = [
  {
    title: 'Velvet Gold Button Double Breasted Jacket',
    image: 'https://asset1.marksandspencer.com/is/image/mandstest/SD_01_T59_0535J_Y0_X_EC_90',
    id: 'P60116460'
  },
  {
    title: 'Lace-up Trainers',
    image: 'https://asset1.marksandspencer.com/is/image/mandstest/SD_03_T03_2801_T2_X_EC_90',
    id: 'P60132766'
  },
  {
    title: 'Cotton Rich Striped Longline Shirt',
    image: 'https://asset1.marksandspencer.com/is/image/mands/SD_01_T43_3014U_T4_X_EC_90',
    id: 'P60163932'
  },
  {
    title: 'Quick Dry Nail Colour',
    image: 'https://asset1.marksandspencer.com/is/image/mandstest/RC_07_T22_2541_FU_X_EC_0',
    id: 'P22132204'
  }
];
export default () => (
  <Layout
    pageTitle="Reactyv | Home"
  >
    <Divider dashed><h2>Products super-powered with reactyv-ities!</h2></Divider>
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={productList}
      renderItem={item => (
        <List.Item>
          <Link href={`/product/${item.id}`}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={<img alt="example" src={item.image} />}
            >
              <Card.Meta
                title={item.title}
                description="M&S"
              />
            </Card>
          </Link>
        </List.Item>
      )}
    />
  </Layout>
);
