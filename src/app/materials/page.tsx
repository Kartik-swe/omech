"use client"
import React, { useState } from 'react';
import { Row, Col, Table, DatePicker, Select, Button, Card, Statistic, Typography } from 'antd';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import Link from 'next/link';

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,  // For x-axis
  LinearScale,    // For y-axis
  BarElement,     // For bar elements (useful for Line chart too)
  PointElement,   // For points (used in Line chart)
  LineElement,    // For line elements (used in Line chart)
  Title,          // For chart title
  Tooltip,        // For tooltips
  Legend,         // For chart legend
  ArcElement      // For pie/doughnut chart elements
);

const { Title: AntTitle } = Typography;


const Dashboard = () => {
  const [filters, setFilters] = useState<{
    startDate: string | null;
    endDate: string | null;
    grade: string | null;
    thickness: string | null;
    vendor: string | null;
    status: string | null;
    machine: string | null;
  }>({
    startDate: null, endDate: null, grade: null, thickness: null, vendor: null, status: null, machine: null,
  });

  // Dummy Data for Raw Materials and Slitting Processes
  const rawMaterials = [
    { material_srno: 'RM001', vendor: 'Vendor A', challan_no: '12345', grade: 'MS', weight: 120, received_date: '2025-01-01' },
    { material_srno: 'RM002', vendor: 'Vendor B', challan_no: '12346', grade: 'SS', weight: 150, received_date: '2025-01-02' },
    { material_srno: 'RM003', vendor: 'Vendor C', challan_no: '12347', grade: 'MS', weight: 100, received_date: '2025-01-03' },
  ];

  const slittingProcesses = [
    { slitting_srno: 'SP001', material_srno: 'RM001', slitting_date: '2025-01-05', weight: 120, status: 'Completed' },
    { slitting_srno: 'SP002', material_srno: 'RM002', slitting_date: '2025-01-06', weight: 150, status: 'Pending' },
    { slitting_srno: 'SP003', material_srno: 'RM003', slitting_date: '2025-01-07', weight: 100, status: 'Completed' },
  ];

  // Key Metrics Data
  const keyMetrics = [
    { title: 'Total Raw Materials Received', value: rawMaterials.length },
    { title: 'Total Weight Processed', value: slittingProcesses.reduce((acc, item) => acc + item.weight, 0) },
    { title: 'Pending Slitting Tasks', value: slittingProcesses.filter(p => p.status === 'Pending').length },
    { title: 'Low Stock Alerts', value: rawMaterials.filter(m => m.weight < 10).length },
  ];

  // Chart Data
  const slittingWeightData = {
    labels: ['Grade A', 'Grade B', 'Grade C'],
    datasets: [
      {
        data: [120, 150, 100],
        backgroundColor: ['#FF5733', '#FFBD33', '#33FF57'],
      },
    ],
  };

  const rawMaterialData = {
    labels: ['2025-01-01', '2025-01-02', '2025-01-03'],
    datasets: [
      {
        label: 'Raw Materials Received',
        data: [120, 150, 100],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
      },
    ],
  };

  // Table Columns
  const columns = [
    { title: 'Material SRNO', dataIndex: 'material_srno' },
    { title: 'Vendor', dataIndex: 'vendor' },
    { title: 'Challan No', dataIndex: 'challan_no' },
    { title: 'Grade', dataIndex: 'grade' },
    { title: 'Weight', dataIndex: 'weight' },
    { title: 'Received Date', dataIndex: 'received_date' },
  ];

  const slittingColumns = [
    { title: 'Slitting SRNO', dataIndex: 'slitting_srno' },
    { title: 'Material SRNO', dataIndex: 'material_srno' },
    { title: 'Slitting Date', dataIndex: 'slitting_date' },
    { title: 'Weight', dataIndex: 'weight' },
    { title: 'Status', dataIndex: 'status' },
  ];

  // Date Change Handler
  const handleDateChange = (date:any, dateString:any) => {
    setFilters(prev => ({ ...prev, startDate: dateString[0], endDate: dateString[1] }));
  };

  return (
    <div>
      <Row gutter={16}>
      <Col span={21}>
      <AntTitle level={2}>Advanced Dashboard</AntTitle>

      </Col>
    
      <Col span={3}>
        <Link href="/new-materials">
          <Button type="primary" danger>
            Add Raw Materials
          </Button>
        </Link>
      </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <DatePicker.RangePicker onChange={handleDateChange} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Select
              placeholder="Select Grade"
              onChange={value => setFilters(prev => ({ ...prev, grade: value }))}
              style={{ width: '100%' }}
            >
              <Select.Option value="GradeA">Grade A</Select.Option>
              <Select.Option value="GradeB">Grade B</Select.Option>
              <Select.Option value="GradeC">Grade C</Select.Option>
            </Select>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Button type="primary" onClick={() => setFilters({ ...filters, status: 'Completed' })}>Completed Slitting</Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        {keyMetrics.map(metric => (
          <Col span={6} key={metric.title}>
            <Card>
              <Statistic title={metric.title} value={metric.value} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Slitting Weight Distribution">
            <Doughnut data={slittingWeightData} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Raw Materials Over Time">
            <Line data={rawMaterialData} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Table columns={columns} dataSource={rawMaterials} rowKey="material_srno" />
        </Col>
        <Col span={12}>
          <Table columns={slittingColumns} dataSource={slittingProcesses} rowKey="slitting_srno" />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
