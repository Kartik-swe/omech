"use client"
import React, { useState } from "react";
import { Table, Button, Form, Input, InputNumber, DatePicker, Modal, Typography } from "antd";

const { Title } = Typography;

// Dummy data for initial vendors and slitting history
const initialData = [
  {
    key: "1",
    challanNo: "CHL001",
    date: "2025-01-01",
    vendor: "Vendor A",
    grade: "409",
    thickness: 2,
    width: 1250,
    weight: 9640,
    slittingHistory: [
      {
        key: "1.1",
        date: "2025-01-02",
        dcNo: "DC001",
        slitWidths: [80, 100, 250],
        allocatedTo: "In-house 1",
      },
      {
        key: "1.2",
        date: "2025-01-03",
        dcNo: "DC002",
        slitWidths: [100, 150],
        allocatedTo: "Tube Machine",
      },
    ],
  },
  {
    key: "2",
    challanNo: "CHL002",
    date: "2025-01-03",
    vendor: "Vendor B",
    grade: "316",
    thickness: 1.5,
    width: 1500,
    weight: 12300,
    slittingHistory: [],
  },
];

const RawMaterialDashboard = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleAddSlitting = (record:any) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalOk = (values:any) => {
  

      
    const updatedData = data.map((item:any) => {
      if ((selectedRecord?.key != undefined) && item.key === selectedRecord?.key) {
        return {
          ...item,
          slittingHistory: [
            ...item.slittingHistory,
            {
              key: `${item.key}.${item.slittingHistory.length + 1}`,
              date: values.date.format("YYYY-MM-DD"),
              dcNo: values.dcNo,
              slitWidths: values.slitWidths.split(",").map(Number),
              allocatedTo: values.allocatedTo,
            },
          ],
        };
      }
      return item;
    });
    setData(updatedData);
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Challan No",
      dataIndex: "challanNo",
      key: "challanNo",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "Thickness (mm)",
      dataIndex: "thickness",
      key: "thickness",
    },
    {
      title: "Width (mm)",
      dataIndex: "width",
      key: "width",
    },
    {
      title: "Weight (kg)",
      dataIndex: "weight",
      key: "weight",
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_:any, record:any) => (
    //     <Button type="link" onClick={() => handleAddSlitting(record)}>
    //       Add Slitting
    //     </Button>
    //   ),
    // },
  ];

  const expandedRowRender = (record:any) => {
    const slittingColumns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "DC No",
        dataIndex: "dcNo",
        key: "dcNo",
      },
      {
        title: "Slit Widths (mm)",
        dataIndex: "slitWidths",
        key: "slitWidths",
        render: (widths:any) => widths.join(", "),
      },
      {
        title: "Allocated To",
        dataIndex: "allocatedTo",
        key: "allocatedTo",
      },
    ];
    return <Table columns={slittingColumns} dataSource={record.slittingHistory} pagination={false} />;
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* <Title level={2}>Raw Material Dashboard</Title> */}
      <Table
        columns={columns}
        dataSource={data}
        expandable={{ expandedRowRender }}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Add Slitting"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => handleModalOk(values))
            .catch((info) => console.log("Validate Failed:", info));
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="dcNo"
            label="DC No"
            rules={[{ required: true, message: "Please enter DC number!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="slitWidths"
            label="Slit Widths (comma-separated)"
            rules={[{ required: true, message: "Please enter slit widths!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="allocatedTo"
            label="Allocated To"
            rules={[{ required: true, message: "Please specify allocation!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RawMaterialDashboard;
