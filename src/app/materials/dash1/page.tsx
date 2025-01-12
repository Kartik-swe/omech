"use client"
import React, { useState } from 'react';
import { Card, Table, Input, Row, Col, Button, Select } from 'antd';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const { Option } = Select;

// Dummy data for raw materials
const rawMaterialData = [
  { key: '1', material: 'Pipe A', grade: 'Grade 1', thickness: '5mm', width: '300mm', weight: '120kg' },
  { key: '2', material: 'Pipe B', grade: 'Grade 2', thickness: '6mm', width: '400mm', weight: '150kg' },
  { key: '3', material: 'Pipe C', grade: 'Grade 3', thickness: '4mm', width: '500mm', weight: '180kg' },
  { key: '4', material: 'Pipe D', grade: 'Grade 1', thickness: '5mm', width: '350mm', weight: '140kg' },
];

const rawMaterialColumns = [
  { title: 'Material', dataIndex: 'material' },
  { title: 'Grade', dataIndex: 'grade' },
  { title: 'Thickness', dataIndex: 'thickness' },
  { title: 'Width', dataIndex: 'width' },
  { title: 'Weight', dataIndex: 'weight' },
];

// Dummy pie chart data
const pieChartData = {
  labels: ['Grade 1', 'Grade 2', 'Grade 3'],
  datasets: [
    {
      data: [60, 30, 10],
      backgroundColor: ['#FF5733', '#FFBD33', '#33FF57'],
    },
  ],
};

const RawMaterialOverview = () => {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (value:any) => {
    setFilter(value);
  };

  const filteredData = rawMaterialData.filter((item) => item.grade.includes(filter));

  return (
    <Card title="Raw Material Overview">
      <Row gutter={16}>
        <Col span={12}>
          <Input.Search
            placeholder="Search by Material"
            onSearch={(value) => handleFilterChange(value)}
            style={{ marginBottom: '20px' }}
          />
        </Col>
        <Col span={12}>
          <Select
            defaultValue="All"
            onChange={handleFilterChange}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            <Option value="">All</Option>
            <Option value="Grade 1">Grade 1</Option>
            <Option value="Grade 2">Grade 2</Option>
            <Option value="Grade 3">Grade 3</Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Pie data={pieChartData} />
        </Col>
        <Col span={16}>
          <Table dataSource={filteredData} columns={rawMaterialColumns} pagination={false} />
        </Col>
      </Row>
    </Card>
  );
};

export default RawMaterialOverview;
