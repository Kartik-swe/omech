// src/inventory/components/InventoryFilters.tsx
'use client'
import React, { useState } from 'react';
import { Select, Form, Button, Space } from 'antd';

const { Option } = Select;

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

const InventoryFilters: React.FC<FilterProps> = ({ onFilterChange }) => {
  // Dummy Data for dropdowns
  const grades = ['Grade A', 'Grade B', 'Grade C'];
  const outerDiameters = ['50mm', '75mm', '100mm'];
  const thicknesses = ['1mm', '2mm', '3mm'];

  // State for selected filters
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedOD, setSelectedOD] = useState<string | undefined>();
  const [selectedThickness, setSelectedThickness] = useState<string | undefined>();

  // Handle filter change
  const handleFilterChange = () => {
    const filters = {
      grade: selectedGrade,
      outerDiameter: selectedOD,
      thickness: selectedThickness,
    };
    onFilterChange(filters);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedGrade(undefined);
    setSelectedOD(undefined);
    setSelectedThickness(undefined);
    onFilterChange({});
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Grade">
        <Select
          placeholder="Select Grade"
          value={selectedGrade}
          onChange={value => setSelectedGrade(value)}
          allowClear
        >
          {grades.map((grade) => (
            <Option key={grade} value={grade}>
              {grade}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item label="Outer Diameter">
        <Select
          placeholder="Select Outer Diameter"
          value={selectedOD}
          onChange={value => setSelectedOD(value)}
          allowClear
        >
          {outerDiameters.map((od) => (
            <Option key={od} value={od}>
              {od}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item label="Thickness">
        <Select
          placeholder="Select Thickness"
          value={selectedThickness}
          onChange={value => setSelectedThickness(value)}
          allowClear
        >
          {thicknesses.map((thickness) => (
            <Option key={thickness} value={thickness}>
              {thickness}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Space>
        <Button type="primary" onClick={handleFilterChange}>
          Apply Filters
        </Button>
        <Button onClick={resetFilters}>Reset</Button>
      </Space>
    </Form>
  );
};

export default InventoryFilters;
