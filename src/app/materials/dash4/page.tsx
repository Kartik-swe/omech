"use client"

import React, { useState } from 'react';
import { Table, Input, Button, Select } from 'antd';

const { Option } = Select;

const dummyData = [
    { key: '1', name: 'Material A', quantity: 100, category: 'Category 1' },
    { key: '2', name: 'Material B', quantity: 200, category: 'Category 2' },
    { key: '3', name: 'Material C', quantity: 150, category: 'Category 1' },
    // Add more dummy data as needed
];

const RawMaterialsDashboard: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    const filteredData = dummyData.filter(item => {
        return (
            item.name.toLowerCase().includes(searchText.toLowerCase()) &&
            (selectedCategory ? item.category === selectedCategory : true)
        );
    });

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
    ];

    return (
        <div>
            <h1>Raw Materials Dashboard</h1>
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 200, marginRight: 8 }}
                />
                <Select
                    placeholder="Select category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    style={{ width: 200 }}
                >
                    <Option value="">All Categories</Option>
                    <Option value="Category 1">Category 1</Option>
                    <Option value="Category 2">Category 2</Option>
                    {/* Add more categories as needed */}
                </Select>
                <Button type="primary" style={{ marginLeft: 8 }}>
                    Add New Material
                </Button>
            </div>
            <Table columns={columns} dataSource={filteredData} />
        </div>
    );
};

export default RawMaterialsDashboard;