'use client';
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const StaffAssignmentsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([
    {
      key: '1',
      staffName: 'Staff 1',
      machine: 'Tube Machine #5',
      shift: 'Morning (6 AM - 2 PM)',
      date: '2024-11-19',
    },
  ]);

  const handleAddAssignment = (values: any) => {
    const newAssignment = {
      key: `${assignments.length + 1}`,
      staffName: values.staffName,
      machine: values.machine,
      shift: values.shift,
      date: values.date.format('YYYY-MM-DD'),
    };

    setAssignments([...assignments, newAssignment]);
    message.success('Staff assignment added successfully!');
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Staff Assignments</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
      >
        Assign Staff
      </Button>
      <Table
        dataSource={assignments}
        columns={[
          { title: 'Staff Name', dataIndex: 'staffName', key: 'staffName' },
          { title: 'Machine', dataIndex: 'machine', key: 'machine' },
          { title: 'Shift', dataIndex: 'shift', key: 'shift' },
          { title: 'Date', dataIndex: 'date', key: 'date' },
        ]}
        style={{ marginTop: 16 }}
      />
      <Modal
        title="Assign Staff"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form onFinish={handleAddAssignment}>
          <Form.Item
            label="Staff Name"
            name="staffName"
            rules={[{ required: true, message: 'Please select a staff member!' }]}
          >
            <Select placeholder="Select staff">
              <Option value="Staff 1">Staff 1</Option>
              <Option value="Staff 2">Staff 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Machine"
            name="machine"
            rules={[{ required: true, message: 'Please select a machine!' }]}
          >
            <Select placeholder="Select machine">
              <Option value="Tube Machine #5">Tube Machine #5</Option>
              <Option value="Laser Machine #2">Laser Machine #2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Shift"
            name="shift"
            rules={[{ required: true, message: 'Please select a shift!' }]}
          >
            <Select placeholder="Select shift">
              <Option value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</Option>
              <Option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</Option>
              <Option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Assign
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffAssignmentsPage;
