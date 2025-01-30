"use client";
import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col, message, Button, Form, Input, Modal, Select, Tooltip, Spin, Tabs, Descriptions } from "antd";
import { apiClient } from "@/utils/apiClient";
import { getCookieData } from "@/utils/common";
import TextArea from "antd/es/input/TextArea";

const { TabPane } = Tabs;

const RawMaterialsShiftHis = () => {
  const [MotherData, setMotherData] = useState<any[]>([]);
  const [SemiSlittedData, setSemiSlittedData] = useState<any[]>([]);
  const [SlittedData, setSlittedData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [optVendors, setOptVendors] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("MOTHER");

  const [form] = Form.useForm();

  const cookiesData = getCookieData();
  const { USER_SRNO, API_BASE_URL, UT_SRNO } = cookiesData;

  // Fetch dropdown options for locations
  const FetchPlCommon = async () => {
    const response = await apiClient<Record<string, any>>(
      `${API_BASE_URL}Pl_Common?USER_SRNO=${USER_SRNO}&UT_SRNO=${UT_SRNO}&TBL_SRNO=4`,
      "GET"
    );
    if (response.msgId === 200) {
      if (!response.data) return;
      const { Table4 } = response.data;
      setOptVendors(Table4);
    } else {
      message.error(response.msg);
      console.error("API Error:", response.msg);
    }
  };

  // Fetch Mother data
  const fetchMotherCoil = async () => {
    try {
      setLoading(true);
      const MATERIAL_FLAG = "M"; // S for Slitted
      const response = await apiClient(`${API_BASE_URL}DtRawMaterialShift?${USER_SRNO}&MATERIAL_FLAG=${MATERIAL_FLAG}`, "GET");

      if (response.msgId === 200) {
        if (!response.data) return;
        setMotherData(response.data.Table);
      } else {
        message.error(response.msg);
        console.error("API Error:", response.msg);
      }
    } catch (error: any) {
      console.error("Error fetching mother Coil:", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch semi-slitted data
  const fetchSemiSlitted = async () => {
    try {
      setLoading(true);
      const MATERIAL_FLAG ='P'
      const response = await apiClient(`${API_BASE_URL}DtRawMaterialShift?${USER_SRNO}&MATERIAL_FLAG=${MATERIAL_FLAG}`, "GET");


      if (response.msgId === 200) {
        if (!response.data) return;
        setSemiSlittedData(response.data.Table1);
      } else {
        message.error(response.msg);
        console.error("API Error:", response.msg);
      }
    } catch (error: any) {
      console.error("Error fetching semi-slitted Coil:", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch slitted data
  const fetchSlitted = async () => {
    try {
      // alert("dfg")
      setLoading(true);
      const MATERIAL_FLAG ='S'
      const response = await apiClient(`${API_BASE_URL}DtRawMaterialShift?${USER_SRNO}&MATERIAL_FLAG=${MATERIAL_FLAG}`, "GET");


      if (response.msgId === 200) {
        if (!response.data) return;
        setSlittedData(response.data.Table2);
      } else {
        message.error(response.msg);
        console.error("API Error:", response.msg);
      }
    } catch (error: any) {
      console.error("Error fetching semi-slitted Coil:", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchPlCommon();
    fetchMotherCoil();
  }, []);

  // Handle "Shift" button click
  const handleShift = (record: any, flag: string) => {
    setSelectedMaterial({ ...record, flag });
    setIsModalVisible(true);
  };

  // Handle modal OK button click
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { flag } = selectedMaterial;

      const payload = {
        IU_FLAG: "I",
        MATERIAL_SRNO: flag === 'M' ? selectedMaterial.MATERIAL_SRNO : null ,
        SLITTING_SRNO: flag==='M' ? null : selectedMaterial.SLITTING_SRNO ,
        FROM_LOCATION: selectedMaterial.FROM_LOCATION_SRNO,
        TO_LOCATION: values.TO_LOCATION,
        SHIFT_DATE: values.SHIFT_DATE,
        SHIFT_REASON: values.SHIFT_REASON,
        SHIFTING_SRNO: null,
        USER_SRNO: USER_SRNO,
      };

      const response = await apiClient(`${API_BASE_URL}IuRawMaterialShift`, "POST", payload);

      if (response.msgId === 200) {
        message.success("Shift successful!");
        setIsModalVisible(false);
        form.resetFields();
        // add case statement for falg and call the appropriate function to refresh the table for M, P, S
        switch (flag) {
          case 'M':
            fetchMotherCoil();
            break;
          case 'P':
            fetchSemiSlitted();
            break;
          case 'S':
            fetchSlitted();
            break;
          default:
            break;
        }
        // isMotherCoil ? fetchSemiSlitted() : fetchMotherCoil(); // Refresh the appropriate table
      } else {
      alert(response.msg)
      console.log(response.msgId);
      

        message.error(response.msg);
      }
    } catch (error: any) {
      alert(error)
      message.error(error.message);
    }
  };

  // Handle modal Cancel button click
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Generate table columns
  const generateTableColumns = (flag: string) => {
    const baseColumns = [
      { title: "Challan No", dataIndex: "CHALLAN_NO", key: "CHALLAN_NO" },
      { title: "Material Width", dataIndex: "MATERIAL_WIDTH", key: "MATERIAL_WIDTH" },
      { title: "Material Weight", dataIndex: "MATERIAL_WEIGHT", key: "MATERIAL_WEIGHT" },
      { title: "Material Thickness", dataIndex: "MATERIAL_THICKNESS", key: "MATERIAL_THICKNESS" },
      { title: "Material Grade", dataIndex: "MATERIAL_GRADE", key: "MATERIAL_GRADE" },
      { title: "Location", dataIndex: "FROM_LOCATION", key: "FROM_LOCATION" },
      { title: "is slitetd", dataIndex: "IS_RAW_SLITTED", key: "IS_RAW_SLITTED" },
    ];

    if (flag === 'p' || flag === 'S') {
      baseColumns.splice(1, 0, { title: "DC No", dataIndex: "DC_NO", key: "DC_NO" });
    }

    const actionColumn = {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        // disable in case of IS_RAW_SLITTED = y

        <Tooltip title={record.IS_RAW_SLITTED === 'Y' ? "Material already slitted" : ""}>
          <Button type="primary" onClick={() => handleShift(record, flag)} disabled={record.IS_RAW_SLITTED === 'Y'}>
            Shift
          </Button>
        </Tooltip>
        // <Button type="primary" onClick={() => handleShift(record, flag)}>
          // Shift
        // </Button>
      ),
    };

    return [...baseColumns, actionColumn];
  };

  // Handle tab change
  const onTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "SEMI_SLITTED") {
      fetchSemiSlitted();
    }else if(key === "SLITTED"){
      fetchSlitted();
    }
  };

  return (
    <Card title="Material Shift">
      <Tabs activeKey={activeTab} onChange={onTabChange}>
        <TabPane tab="Slitted Materials" key="MOTHER">
          <Spin spinning={loading}>
            <Table dataSource={MotherData} columns={generateTableColumns('M')} pagination={false} />
          </Spin>
        </TabPane>
        <TabPane tab="Semi-Slitted Materials" key="SEMI_SLITTED">
          <Spin spinning={loading}>
            <Table dataSource={SemiSlittedData} columns={generateTableColumns('P')} pagination={false} />
          </Spin>
        </TabPane>
        <TabPane tab="Slitted Materials" key="SLITTED">
          <Spin spinning={loading}>
            <Table dataSource={SlittedData} columns={generateTableColumns('S')} pagination={false} />
          </Spin>
        </TabPane>
      </Tabs>

      {/* Modal for shifting material */}
      <Modal
        title="Shift Material"
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={800} // Increase the modal width
      >
        {selectedMaterial && (
          <div style={{ marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Challan No">{selectedMaterial.CHALLAN_NO}</Descriptions.Item>
              <Descriptions.Item label="Material Width">{selectedMaterial.MATERIAL_WIDTH} mm</Descriptions.Item>
              <Descriptions.Item label="Material Weight">{selectedMaterial.MATERIAL_WEIGHT} kg</Descriptions.Item>
              <Descriptions.Item label="Material Thickness">{selectedMaterial.MATERIAL_THICKNESS} mm</Descriptions.Item>
              <Descriptions.Item label="Material Grade">{selectedMaterial.MATERIAL_GRADE}</Descriptions.Item>
              <Descriptions.Item label="From Location">{selectedMaterial.FROM_LOCATION}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleOk} >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
          label="To Location"
          name="TO_LOCATION"
          rules={[{ required: true, message: "Please select the destination location!" }]}
              >
          <Select
            showSearch
            placeholder="Select"
            options={optVendors}
            filterOption={(input:any, option:any) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            }
          />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
          label="Shift Date"
          name="SHIFT_DATE"
          rules={[{ required: true, message: "Please select the shift date!" }]}
              >
          <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Shift Reason"
            name="SHIFT_REASON"
            rules={[{ required: false, message: "Please enter the Shift Reason!" }]}
          >
            <TextArea placeholder="Shift Reason" autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
          {/* Submit Button */}
                    <Button
                      type="primary"
                      htmlType="submit"
                      // loading={loading}
                      style={{ width: '100%', marginTop: 20 }}
                    >
                      Shift
                    </Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default RawMaterialsShiftHis;
