'use client';

import React, { useState } from 'react';
import { Table, Button, Form, Select, DatePicker, Row, Col, Card, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
// import moment from 'moment';

const { RangePicker } = DatePicker;

// Dummy Data Interfaces
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

// Dummy Dropdown Data
const dummyDropdownData = {
  products: [
    { productId: 1, od: 'OD 50', grade: 'Grade A', thickness: '3mm' },
    { productId: 2, od: 'OD 75', grade: 'Grade B', thickness: '5mm' },
    { productId: 3, od: 'OD 100', grade: 'Grade C', thickness: '7mm' },
  ],
  machines: [
    { machineId: 1, name: 'Tube Machine 1' },
    { machineId: 2, name: 'Tube Machine 2' },
    { machineId: 3, name: 'Laser Machine 1' },
  ],
  staff: [
    { staffId: 1, name: 'Staff 1' },
    { staffId: 2, name: 'Staff 2' },
    { staffId: 3, name: 'Mike Johnson' },
  ],
  shifts: ['Morning', 'Evening', 'Night'],
};

// Dummy Production Log Data
const dummyProductionData: ProductionLogEntry[] = [
  {
    productionId: 1,
    productId: 1,
    machineId: 1,
    staffId: 1,
    shift: 'Morning',
    quantityProduced: 150,
    productionDate: '2024-11-01',
    od: 'OD 50',
    grade: 'Grade A',
    thickness: '3mm',
  },
  {
    productionId: 2,
    productId: 2,
    machineId: 2,
    staffId: 2,
    shift: 'Evening',
    quantityProduced: 200,
    productionDate: '2024-11-02',
    od: 'OD 75',
    grade: 'Grade B',
    thickness: '5mm',
  },
  {
    productionId: 3,
    productId: 3,
    machineId: 3,
    staffId: 3,
    shift: 'Night',
    quantityProduced: 100,
    productionDate: '2024-11-03',
    od: 'OD 100',
    grade: 'Grade C',
    thickness: '7mm',
  },
  {
    productionId: 4,
    productId: 1,
    machineId: 1,
    staffId: 1,
    shift: 'Morning',
    quantityProduced: 180,
    productionDate: '2024-11-04',
    od: 'OD 50',
    grade: 'Grade A',
    thickness: '3mm',
  },
];

// Main Component
const CombinedViewPage = () => {
  // State Management
  const [data, setData] = useState<ProductionLogEntry[]>(dummyProductionData);
  const [filteredData, setFilteredData] = useState<ProductionLogEntry[]>(dummyProductionData);
  const [viewMode, setViewMode] = useState('table'); // To switch between views

  // Filters State
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined);
  const [selectedMachine, setSelectedMachine] = useState<number | undefined>(undefined);
  const [selectedStaff, setSelectedStaff] = useState<number | undefined>(undefined);
  const [selectedShift, setSelectedShift] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[any | null] | null>(null);

  // Filter Handler Function
  const handleFilter = () => {
    const filtered = data.filter((entry) => {
      const matchesProduct = selectedProduct ? entry.productId === selectedProduct : true;
      const matchesMachine = selectedMachine ? entry.machineId === selectedMachine : true;
      const matchesStaff = selectedStaff ? entry.staffId === selectedStaff : true;
      const matchesShift = selectedShift ? entry.shift === selectedShift : true;
      // const matchesDate =
      //   dateRange && dateRange[0] && dateRange[1]
      //     ? moment(entry.productionDate).isBetween(dateRange[0], dateRange[1], 'day', '[]')
      //     : true;

      return matchesProduct && matchesMachine && matchesStaff && matchesShift;
    });

    setFilteredData(filtered);
  };

  return (
    <div>
      <h2></h2>

      {/* Filters Section */}
      <Form layout="vertical" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Product">
              <Select
                placeholder="Select Product"
                onChange={(value) => setSelectedProduct(value)}
                allowClear
              >
                {dummyDropdownData.products.map((product) => (
                  <Select.Option key={product.productId} value={product.productId}>
                    {`${product.od} | ${product.grade} | ${product.thickness}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Machine">
              <Select
                placeholder="Select Machine"
                onChange={(value) => setSelectedMachine(value)}
                allowClear
              >
                {dummyDropdownData.machines.map((machine) => (
                  <Select.Option key={machine.machineId} value={machine.machineId}>
                    {machine.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Staff">
              <Select
                placeholder="Select Staff"
                onChange={(value) => setSelectedStaff(value)}
                allowClear
              >
                {dummyDropdownData.staff.map((staff) => (
                  <Select.Option key={staff.staffId} value={staff.staffId}>
                    {staff.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Shift">
              <Select
                placeholder="Select Shift"
                onChange={(value) => setSelectedShift(value)}
                allowClear
              >
                {dummyDropdownData.shifts.map((shift) => (
                  <Select.Option key={shift} value={shift}>
                    {shift}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Date Range">
              <RangePicker
               // onChange={(dates) => setDateRange(dates)}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" onClick={handleFilter}>
          Apply Filters
        </Button>
      </Form>

      {/* View Mode Toggle */}
      <Radio.Group
        style={{ marginBottom: 20 }}
        value={viewMode}
        onChange={(e: RadioChangeEvent) => setViewMode(e.target.value)}
      >
        <Radio.Button value="table">Table View</Radio.Button>
        <Radio.Button value="card">Card View</Radio.Button>
      </Radio.Group>

      {/* Data Display Section */}
      {viewMode === 'table' ? (
        <Table
          dataSource={filteredData}
          columns={[
            {
              title: 'Product',
              dataIndex: 'productId',
              key: 'productId',
            },
            {
              title: 'Machine',
              dataIndex: 'machineId',
              key: 'machineId',
            },
            {
              title: 'Staff',
              dataIndex: 'staffId',
              key: 'staffId',
            },
            {
              title: 'Shift',
              dataIndex: 'shift',
              key: 'shift',
            },
            {
              title: 'Quantity Produced',
              dataIndex: 'quantityProduced',
              key: 'quantityProduced',
            },
            {
              title: 'Production Date',
              dataIndex: 'productionDate',
              key: 'productionDate',
            },
          ]}
          rowKey="productionId"
        />
      ) : (
        <Row gutter={16}>
          {filteredData.map((entry) => (
            <Col span={8} key={entry.productionId} style={{ marginBottom: 20 }}>
              <Card title={`Production ID: ${entry.productionId}`}>
                <p>Product: {entry.productId}</p>
                <p>Machine: {entry.machineId}</p>
                <p>Staff: {entry.staffId}</p>
                <p>Shift: {entry.shift}</p>
                <p>Quantity Produced: {entry.quantityProduced}</p>
                <p>Production Date: {entry.productionDate}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CombinedViewPage;
