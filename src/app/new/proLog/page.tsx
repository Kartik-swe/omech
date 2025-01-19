'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, Input, Space, message,notification, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { apiService } from '../../../../utils-old/apiUtils'; // Import the utility function
import { ApiResponse } from '../../../../utils-old/common_utils';

const { Option } = Select;


interface ProductionLogEntry {
  productionId: number;
  productId: number;
  machineId: number;
  staffId: number;
  shift: string;
  quantityProduced: number;
  productionDate: string;
  od: string;
  grade: string;
  thickness: string;
}

// Dropdown data structure
interface DropdownData {
  products: Array<{ productId: number; od: string; thickness: string; grade: string }>;
  machines: Array<{ machineId: number; name: string }>;
  staff: Array<{ staffId: number; name: string }>;
  shifts: string[];
}


const ProductionLogsPage: React.FC = () => {
  const [data, setData] = useState<ProductionLogEntry[]>([]);
    const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
    const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [machineType, setMachineType] = useState<'Tube' | 'Laser'>('Tube');
  const [logs, setLogs] = useState([
    {
      key: '1',
      machineType: 'Tube',
      machine: 'Tube Machine #3',
      staff: 'Staff 1',
      shift: 'Morning (6 AM - 2 PM)',
      date: '2024-11-19',
      quantity: '200',
      od: '50mm',
      thickness: '3mm',
      grade: 'SS304',
    },
  ]);

  // Sample Tube Machine product list (this should ideally come from a backend API)
  const tubeMachineProducts = [
    { productId: '1', od: '50mm', thickness: '3mm', grade: 'SS304' },
    { productId: '2', od: '75mm', thickness: '5mm', grade: 'SS316' },
  ];

  // Dropdown values
  const machines = [
    'Tube Machine #1',
    'Tube Machine #2',
    'Tube Machine #3',
    'Laser Machine #1',
    'Laser Machine #2',
  ];
  const staffList = ['Staff 1', 'Staff 2', 'Alice Johnson', 'Bob Lee'];
  const shifts = [
    'Morning (6 AM - 2 PM)',
    'Evening (2 PM - 10 PM)',
    'Night (10 PM - 6 AM)',
  ];
  const ods = ['50mm', '75mm', '100mm', '150mm'];
  const thicknesses = ['3mm', '5mm', '8mm', '10mm'];
  const grades = ['SS304', 'SS316', 'MS', 'Aluminum'];

  // Handle new log submission
  const handleAddLog = (values: any) => {
    let selectedProduct = null;

    if (machineType === 'Laser') {
      // Find the selected product from the tubeMachineProducts using the productId
      selectedProduct = tubeMachineProducts.find(
        (product) => product.productId === values.selectedProduct
      );
    }

    const newLog = {
      key: `${logs.length + 1}`,
      machineType,
      machine: values.machine,
      staff: values.staff,
      shift: values.shift,
      date: values.date.format('YYYY-MM-DD'),
      quantity: values.quantity,
      od: machineType === 'Tube' ? values.od : selectedProduct?.od,
      thickness: machineType === 'Tube' ? values.thickness : selectedProduct?.thickness,
      grade: machineType === 'Tube' ? values.grade : selectedProduct?.grade,
    };

    setLogs([...logs, newLog]);
    message.success(`${machineType} Machine log added successfully!`);
    setIsModalOpen(false);
  };


  

    
  
    // Fetch production logs and dropdown data
    const fetchProductionLogs = async () => {
      setLoading(true);
      try {
        const logs:ApiResponse = await apiService.get('/productionlog', 'applicationq/json');
        setData(logs.Msg.data);
      } catch (error) {
        notification.error({ message: 'Error fetching production logs' });
      } finally {
        setLoading(false);
      }
    };
  
    const fetchDropdownData = async () => {
      try {
        const dropdownData:ApiResponse = await apiService.get('/productionlog', 'application/json');
        setDropdownData(dropdownData.Msg.data);
      } catch (error) {
        notification.error({ message: 'Error fetching dropdown data' });
      }
    };
  
    useEffect(() => {
      fetchProductionLogs();
      fetchDropdownData();
    }, []);


  return (
    <div>
      <Flex style={{justifyContent:'space-between'}}>
        <h2>Production/Processing Logs</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Add Log
        </Button>
      </Flex>
      <Table
        dataSource={logs}
        columns={[
          { title: 'Machine Type', dataIndex: 'machineType', key: 'machineType' },
          { title: 'Machine', dataIndex: 'machine', key: 'machine' },
          { title: 'Staff', dataIndex: 'staff', key: 'staff' },
          { title: 'Shift', dataIndex: 'shift', key: 'shift' },
          { title: 'Date', dataIndex: 'date', key: 'date' },
          { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
          { title: 'OD', dataIndex: 'od', key: 'od' },
          { title: 'Thickness', dataIndex: 'thickness', key: 'thickness' },
          { title: 'Grade', dataIndex: 'grade', key: 'grade' },
        ]}
      />
      <Modal
        title="Add Production Log"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form onFinish={handleAddLog}>
          {/* Machine Type Selector */}
          <Form.Item label="Machine Type">
            <Select
              defaultValue="Tube"
              onChange={(value) => setMachineType(value as 'Tube' | 'Laser')}
            >
              <Option value="Tube">Tube Machine</Option>
              <Option value="Laser">Laser Machine</Option>
            </Select>
          </Form.Item>
          
          {/* Common Fields */}
          <Form.Item
            label="Machine"
            name="machine"
            rules={[{ required: true, message: 'Please select a machine!' }]}
          >
            <Select placeholder="Select machine">
              {machines
                .filter((m) =>
                  machineType === 'Tube' ? m.includes('Tube') : m.includes('Laser')
                )
                .map((machine) => (
                  <Option key={machine} value={machine}>
                    {machine}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Staff"
            name="staff"
            rules={[{ required: true, message: 'Please select staff!' }]}
          >
            <Select placeholder="Select staff">
              {staffList.map((staff) => (
                <Option key={staff} value={staff}>
                  {staff}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Shift"
            name="shift"
            rules={[{ required: true, message: 'Please select a shift!' }]}
          >
            <Select placeholder="Select shift">
              {shifts.map((shift) => (
                <Option key={shift} value={shift}>
                  {shift}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select date!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter quantity!' }]}
          >
            <Input placeholder="Enter quantity" />
          </Form.Item>

          {/* Tube Machine-specific Fields */}
          {machineType === 'Tube' && (
            <>
              <Form.Item
                label="OD"
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
            </>
          )}

          {/* Laser Machine-specific Fields */}
          {machineType === 'Laser' && (
            <Form.Item
              label="Select Product"
              name="selectedProduct"
              rules={[{ required: true, message: 'Please select a product!' }]}
            >
              <Select placeholder="Select product">
                {tubeMachineProducts.map((product) => (
                  <Option key={product.productId} value={product.productId}>
                    {`OD: ${product.od}, Thickness: ${product.thickness}, Grade: ${product.grade}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Space>
            <Button type="primary" htmlType="submit">
              Add Log
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductionLogsPage;
