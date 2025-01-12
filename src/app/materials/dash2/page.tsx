"use client"
import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Select, DatePicker, Input, Button, Radio, Table, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiClient } from '@/utils/apiClient';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    vendor: null,
    grade: null,
    width: null,
    thickness: null,
    status: null,
    searchText: '',
    isSlitted: null,
  });
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
    const [slittingData, setslittingData] = useState<any[]>([]);
    const [slittingHistory1, setSlittingHistory] = useState<{ [key: number]: any[] }>({});

    useEffect(() => {
        FetchRawMaterials();
  
  }, []);
// get data from api
  //  fUNCTION TO FETCH RAW MATERIALS
  const FetchRawMaterials = async () => {
    try {
      const response = await apiClient('/api/Matarials/Raw', 'GET');
      
      
      if (response.msgId === 1) {
        if (!response.data) {
          
          return;
        }
        const RAW_MATERIALS_DATA = response.data.RAW_MATERIALS.map((material: any, index: number) => ({
          key: material.MATERIAL_SRNO,
          CHALLAN_NO: material.CHALLAN_NO,
          RECEIVED_DATE: moment(material.RECEIVED_DATE).format('YYYY-MM-DD'),
          MATERIAL_GRADE: material.MATERIAL_GRADE,
          MATERIAL_THICKNESS: material.MATERIAL_THICKNESS,
          MATERIAL_WIDTH: material.MATERIAL_WIDTH,
          MATERIAL_WEIGHT: material.MATERIAL_WEIGHT,
          remainingWeight: material.WEIGHT,
          MATERIAL_SRNO: material.MATERIAL_SRNO,
        }));

        // Populate slitting history for each raw material
       const SLIT_DATA =  response.data.RAW_MATERIALS.forEach((material: any) => {
          // Filter slitting processes for the current raw material
          const filteredSlits = response.data.SLIT_PROCESSES.filter(
            (slit: any) => material.MATERIAL_SRNO === slit.MATERIAL_SRNO
          );

          // Map filtered slitting data to the required structure
          slittingHistory1[material.MATERIAL_SRNO] = filteredSlits.map((slit: any) => ({
            key: slit.SLITTING_SRNO,
            DC_NO: slit.DC_NO || '-',
            SLITTING_DATE: moment(slit.SLITTING_DATE).format('YYYY-MM-DD'),
            SLITTING_WIDTH: slit.SLITTING_WIDTH,
            SLITTING_WEIGHT: slit.SLITTING_WEIGHT,
            MATERIAL_SRNO: slit.MATERIAL_SRNO,
            SLITTING_LEVEL: slit.SLITTING_LEVEL,
            SLITTING_SRNO_FK : slit.SLITTING_SRNO,
          }));
        });
        
        setslittingData(response.data.SLIT_PROCESSES)

        // const slittingHistory = {
        //   1: [{ DC_NO: "DC123", SLITTING_DATE: "2025-01-10" }],
        //   2: [{ DC_NO: "DC124", SLITTING_DATE: "2025-01-11" }],
        // };
        setRawMaterials(RAW_MATERIALS_DATA);
       setSlittingHistory(slittingHistory1);
        

        
      } else {
        message.error(response.msg)
        console.error('API Error:', response.msg);  // Logging the error message
      }
    } catch (error) {
      console.error('Error fetching raw materials:', error);
      message.error('Failed to fetch raw materials');
    }
  };


  const handleDateRangeChange = (dates:any) => {
    setFilters({ ...filters, dateRange: dates });
  };

  const handleVendorChange = (value:any) => {
    setFilters({ ...filters, vendor: value });
  };

  const handleGradeChange = (value:any) => {
    setFilters({ ...filters, grade: value });
  };

  const handleStatusChange = (value:any) => {
    setFilters({ ...filters, status: value });
  };

  const handleSearchChange = (e:any) => {
    setFilters({ ...filters, searchText: e.target.value });
  };

  const handleSlittedChange = (e:any) => {
    setFilters({ ...filters, isSlitted: e.target.value });
  };

  const clearFilters = () => {
    setFilters({
      dateRange: [null, null],
      vendor: null,
      grade: null,
      width: null,
      thickness: null,
      status: null,
      searchText: '',
      isSlitted: null,
    });
  };

  // Simulated API call to fetch data based on filters
  useEffect(() => {
    setLoading(true);
    const fetchData = () => {
      // Simulate fetching filtered data from an API
      setTimeout(() => {
        const filteredData = [
          { name: 'Vendor 1', grade: 'Grade 1', status: 'Active', width: 120, thickness : 1.5 , slitted: true },
          { name: 'Vendor 2', grade: 'Grade 2', status: 'Inactive', width: 80, thickness : 2.0 , slitted: false },
          // Add more data objects for simulation
        ];
        setData(filteredData);
        setLoading(false);
      }, 1000); // Simulating network delay
    };
    fetchData();
  }, [filters]);

  // Pie chart data for status
  const statusData = [
    { name: 'Active', value: data.filter((d:any) => d.status === 'Active').length },
    { name: 'Inactive', value: data.filter((d:any) => d.status === 'Inactive').length },
  ];

  // Bar chart data for slitted vs not slitted
  const slittedData = [
    { name: 'Slitted', value: data.filter((d:any) => d.slitted).length },
    { name: 'Not Slitted', value: data.filter((d:any) => !d.slitted).length },
  ];

  // Table columns for data
  const columns = [
    { title: 'Vendor', dataIndex: 'name', key: 'name' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade' },
    { title: 'width', dataIndex: 'width', key: 'width' },
    { title: 'thickness', dataIndex: 'thickness', key: 'thickness' },
    { title: 'Slitted', dataIndex: 'slitted', key: 'slitted', render: (text:any) => (text ? 'Yes' : 'No') },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content style={{ padding: '0 50px', marginTop: 64 }}>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Card title="Filters" bordered={false}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {/* Date Range Filter */}
                <RangePicker
                //   value={filters.dateRange}
                  onChange={handleDateRangeChange}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                />

                {/* Vendor Filter */}
                <Select
                  value={filters.vendor}
                  onChange={handleVendorChange}
                  placeholder="Select Vendor"
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="vendor1">Vendor 1</Option>
                  <Option value="vendor2">Vendor 2</Option>
                </Select>

                {/* Grade Filter */}
                <Select
                  value={filters.grade}
                  onChange={handleGradeChange}
                  placeholder="Select Grade"
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="grade1">Grade 1</Option>
                  <Option value="grade2">Grade 2</Option>
                </Select>
                {/* Grade WIDTH */}
                <Input
                //   value={filters.width}
                //   onChange={handleGradeChange}
                  placeholder="Select width"
                  style={{ width: '100%' }}
                  allowClear
               />
               

                {/* thickenss Filter */}
                <Select
                  value={filters.thickness}
                //   onChange={handleGradeChange}
                  placeholder="Select thickness"
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="grade1">1.5 mm</Option>
                  <Option value="grade2">2.0 mm</Option>
                </Select>

                {/* Status Filter */}
                <Select
                  value={filters.status}
                  onChange={handleStatusChange}
                  placeholder="Select Status"
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>

                {/* Search Filter */}
                <Input
                  value={filters.searchText}
                  onChange={handleSearchChange}
                  placeholder="Search"
                  prefix={<SearchOutlined />}
                />

                {/* Slitted Filter */}
                <Radio.Group onChange={handleSlittedChange} value={filters.isSlitted}>
                  <Radio value={null}>All</Radio>
                  <Radio value={true}>Slitted</Radio>
                  <Radio value={false}>Not Slitted</Radio>
                </Radio.Group>

                {/* Clear Filters Button */}
                <Button type="default" onClick={clearFilters} style={{ width: '100%' }}>
                  Clear Filters
                </Button>
              </Space>
            </Card>
          </Col>

          <Col span={16}>
            <Card title="Data Overview" bordered={false}>
                {/* Displaying Table with Data */}
              <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                rowKey="name"
                pagination={{ pageSize: 5 }}
                style={{ marginTop: 20 }}
              />
              {/* Displaying Pie Chart for Status */}
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Displaying Bar Chart for Slitted vs Not Slitted */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={slittedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>

              
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default Dashboard;
