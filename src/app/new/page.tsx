'use client';
import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Orders" value={1128} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Revenue" value="$50,000" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Machine Utilization" value="80%" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Production Quantity" value={5000} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
