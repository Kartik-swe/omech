"use client"
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Layout, Form, Modal, Select, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

// Dummy data generator
const generateDummyData = (count:any) => {
  const vendors = ['Vendor A', 'Vendor B', 'Vendor C', 'In-House 1', 'In-House 2'];
  const grades = ['409', '304', '316', '201'];
  const data = [];

  for (let i = 1; i <= count; i++) {
    data.push({
      key: i,
      challanNumber: `CH-${1000 + i}`,
      date: `2025-01-${String(i % 30).padStart(2, '0')}`,
      grade: grades[i % grades.length],
      thickness: (Math.random() * 5 + 1).toFixed(2),
      width: Math.floor(Math.random() * 1000 + 500),
      weight: Math.floor(Math.random() * 10000 + 1000),
      vendor: vendors[i % vendors.length],
    });
  }

  return data;
};

const Dashboard = () => {
  const [data, setData] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Generate 200 dummy records
    setData(generateDummyData(200));
  }, []);

  const columns = [
    {
      title: 'Challan Number',
      dataIndex: 'challanNumber',
      key: 'challanNumber',
      sorter: (a:any, b:any) => a.challanNumber.localeCompare(b.challanNumber),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      filters: [
        { text: '409', value: '409' },
        { text: '304', value: '304' },
        { text: '316', value: '316' },
        { text: '201', value: '201' },
      ],
      onFilter: (value:any, record:any) => record.grade.includes(value),
    },
    {
      title: 'Thickness (mm)',
      dataIndex: 'thickness',
      key: 'thickness',
    },
    {
      title: 'Width (mm)',
      dataIndex: 'width',
      key: 'width',
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, record:any) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDetails(record)}>View Details</Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleAddMaterial = (values:any) => {
    const newData = {
      key: data.length + 1,
      ...values,
      weight: parseInt(values.weight, 10),
      width: parseInt(values.width, 10),
    };
    setData([newData, ...data]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (key:any) => {
    setData(data.filter((item:any) => item.key !== key));
  };

  const handleViewDetails = (record:any) => {
    Modal.info({
      title: 'Material Details',
      content: (
        <div>
          <p>Challan Number: {record.challanNumber}</p>
          <p>Date: {record.date}</p>
          <p>Grade: {record.grade}</p>
          <p>Thickness: {record.thickness} mm</p>
          <p>Width: {record.width} mm</p>
          <p>Weight: {record.weight} kg</p>
          <p>Vendor: {record.vendor}</p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <Layout>
      <Header style={{ backgroundColor: '#001529', color: '#fff', padding: '10px 20px' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Raw Material Dashboard
        </Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: '20px' }}
        >
          Add Raw Material
        </Button>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
        <Modal
          title="Add Raw Material"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddMaterial}>
            <Form.Item name="challanNumber" label="Challan Number" rules={[{ required: true, message: 'Please input the Challan Number!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select a Date!' }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="grade" label="Grade" rules={[{ required: true, message: 'Please select a Grade!' }]}>
              <Select>
                <Option value="409">409</Option>
                <Option value="304">304</Option>
                <Option value="316">316</Option>
                <Option value="201">201</Option>
              </Select>
            </Form.Item>
            <Form.Item name="thickness" label="Thickness (mm)" rules={[{ required: true, message: 'Please input Thickness!' }]}>
              <Input type="number" step="0.01" />
            </Form.Item>
            <Form.Item name="width" label="Width (mm)" rules={[{ required: true, message: 'Please input Width!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true, message: 'Please input Weight!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="vendor" label="Vendor" rules={[{ required: true, message: 'Please select a Vendor!' }]}>
              <Select>
                <Option value="Vendor A">Vendor A</Option>
                <Option value="Vendor B">Vendor B</Option>
                <Option value="Vendor C">Vendor C</Option>
                <Option value="In-House 1">In-House 1</Option>
                <Option value="In-House 2">In-House 2</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Dashboard;
