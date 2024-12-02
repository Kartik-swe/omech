'use client';
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, Input, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([
    {
      key: '1',
      machine: 'Tube Machine #1',
      product: 'Pipe',
      grade: 'SS304',
      quantity: '1000',
      od: '50mm',
      thickness: '3mm',
    },
  ]);

  const machines = ['Tube Machine #1', 'Tube Machine #2', 'Laser Machine #1'];
  const grades = ['SS304', 'SS316', 'MS', 'Aluminum'];
  const ods = ['50mm', '75mm', '100mm'];
  const thicknesses = ['3mm', '5mm', '8mm'];

  const handleAddInventory = (values: any) => {
    const newInventory = {
      key: `${inventoryData.length + 1}`,
      machine: values.machine,
      product: values.product,
      grade: values.grade,
      quantity: values.quantity,
      od: values.od,
      thickness: values.thickness,
    };
    setInventoryData([...inventoryData, newInventory]);
    message.success('Inventory item added successfully!');
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Inventory Management</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Add Inventory
      </Button>
      <Table
        dataSource={inventoryData}
        columns={[
          { title: 'Machine', dataIndex: 'machine', key: 'machine' },
          { title: 'Product', dataIndex: 'product', key: 'product' },
          { title: 'Grade', dataIndex: 'grade', key: 'grade' },
          { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
          { title: 'OD', dataIndex: 'od', key: 'od' },
          { title: 'Thickness', dataIndex: 'thickness', key: 'thickness' },
        ]}
      />
      <Modal
        title="Add Inventory Item"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form onFinish={handleAddInventory}>
          <Form.Item
            label="Machine"
            name="machine"
            rules={[{ required: true, message: 'Please select a machine!' }]}
          >
            <Select placeholder="Select machine">
              {machines.map((machine) => (
                <Option key={machine} value={machine}>
                  {machine}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true, message: 'Please enter the product!' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            label="Grade"
            name="grade"
            rules={[{ required: true, message: 'Please select grade!' }]}
          >
            <Select placeholder="Select grade">
              {grades.map((grade) => (
                <Option key={grade} value={grade}>
                  {grade}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter quantity!' }]}
          >
            <Input placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item
            label="Outer Diameter (OD)"
            name="od"
            rules={[{ required: true, message: 'Please select OD!' }]}
          >
            <Select placeholder="Select OD">
              {ods.map((od) => (
                <Option key={od} value={od}>
                  {od}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Thickness"
            name="thickness"
            rules={[{ required: true, message: 'Please select thickness!' }]}
          >
            <Select placeholder="Select thickness">
              {thicknesses.map((thickness) => (
                <Option key={thickness} value={thickness}>
                  {thickness}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Add Inventory
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
