"use client"
import React from 'react';
import { Card, Table, Row, Col } from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Dummy data for comparison
const comparisonData = [
  { key: '1', material: 'Pipe A', rawQuantity: 100, slitQuantity: 50 },
  { key: '2', material: 'Pipe B', rawQuantity: 150, slitQuantity: 30 },
  { key: '3', material: 'Pipe C', rawQuantity: 200, slitQuantity: 20 },
];

// Dummy bar chart data for comparison
const barChartData = {
  labels: ['Pipe A', 'Pipe B', 'Pipe C'],
  datasets: [
    {
      label: 'Raw Quantity',
      data: [100, 150, 200],
      backgroundColor: '#FF5733',
    },
    {
      label: 'Slit Quantity',
      data: [50, 30, 20],
      backgroundColor: '#33FF57',
    },
  ],
};

const comparisonColumns = [
  { title: 'Material', dataIndex: 'material' },
  { title: 'Raw Quantity', dataIndex: 'rawQuantity' },
  { title: 'Slit Quantity', dataIndex: 'slitQuantity' },
];

const RawMaterialVsSlittingComparison = () => (
  <Card title="Raw Material vs Slitting Comparison">
    <Row gutter={16}>
      <Col span={24}>
        <Bar data={barChartData} />
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={24}>
        <Table dataSource={comparisonData} columns={comparisonColumns} pagination={false} />
      </Col>
    </Row>
  </Card>
);

export default RawMaterialVsSlittingComparison;
