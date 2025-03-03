"use client";
import { RetweetOutlined, DollarCircleOutlined, BuildOutlined, SwapOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col, message, Button, Form, Input, Modal, Select, Tooltip, Spin, Tabs, Descriptions, Popconfirm } from "antd";
import { apiClient } from "@/utils/apiClient";
import { getCookieData } from "@/utils/common";
import TextArea from "antd/es/input/TextArea";

const { TabPane } = Tabs;

const RawMaterialsShiftHis = () => {
  const [MotherData, setMotherData] = useState<any[]>([]);
  const [SemiSlittedData, setSemiSlittedData] = useState<any[]>([]);
  const [SlittedData, setSlittedData] = useState<any[]>([]);
  const [fetchCoilsData, setFetchCoilsData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [optVendors, setOptVendors] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("MOTHER");

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();


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
  const fetchMotherCoil = async (queryString : string) => {
    try {
      setLoading(true);
      const MATERIAL_FLAG = "M"; // S for Slitted
      const response = await apiClient(`${API_BASE_URL}DtRawMaterialShift?${USER_SRNO}&MATERIAL_FLAG=${MATERIAL_FLAG}&${queryString}`, "GET");

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
  const fetchSemiSlitted = async (queryString : string) => {
    try {
      setLoading(true);
      const MATERIAL_FLAG ='P'
      const response = await apiClient(`${API_BASE_URL}DtRawMaterialShift?${USER_SRNO}&MATERIAL_FLAG=${MATERIAL_FLAG}&${queryString}`, "GET");


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
  const fetchSlitted = async (queryString : string) => {
    try {
      // alert("dfg")
      setLoading(true);
      const MATERIAL_FLAG ='S'
      const response = await apiClient(`${API_BASE_URL}DtRawMaterialShift?${USER_SRNO}&MATERIAL_FLAG=${MATERIAL_FLAG}&${queryString}`, "GET");


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

  // Fetch slitted data
  const fetchCoils = async (MATERIAL_FLAG:string) => {
    try {
      // alert("dfg")
      setLoading(true);
      // const MATERIAL_FLAG ='S'
      const response = await apiClient(`${API_BASE_URL}DtRawMaterialShift?${USER_SRNO}&MATERIAL_FLAG=${MATERIAL_FLAG}`, "GET");


      if (response.msgId === 200) {
        if (!response.data) return;
        setFetchCoilsData(response.data.Table3);
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
    fetchMotherCoil('');
  }, []);

  // Handle "Shift" button click
  const handleShift = (record: any, flag: string) => {
    setSelectedMaterial({ ...record, flag });
    setIsModalVisible(true);
  };

  // Handle Row Action 
  const handleRowAction = async (SRNO: number, COIL_FLAG: string,STATUS_FLAG: string) => {
      // STATUS_FLAG = S-SELL, R- RETURN, P- PRODUCTION ]
      try {
       const response = await apiClient(`${API_BASE_URL}IuShiftStock?IU_FLAG=U&COIL_FLAG=${COIL_FLAG}&STATUS_FLAG=${STATUS_FLAG}&SRNO=${SRNO}&USER_SRNO=${USER_SRNO}`, "GET");
  
        if (response.msgId === 200) {
          message.success("Record Saved Succesfully!");
          setIsModalVisible(false);
          form.resetFields();
          // add case statement for falg and call the appropriate function to refresh the table for M, P, S
          //remove the record from the table
            switch (COIL_FLAG) {
            case 'M':
              setMotherData((prevData) => prevData.filter(item => item.MATERIAL_SRNO !== SRNO));
              break;
            case 'P':
              setSemiSlittedData((prevData) => prevData.filter(item => item.SLITTING_SRNO !== SRNO));
              break;
            case 'S':
              setSlittedData((prevData) => prevData.filter(item => item.SLITTING_SRNO !== SRNO));
              break;
            default:
              break;
            }

          // switch (COIL_FLAG) {
          //   case 'M':
          //     //fetchMotherCoil();
          //     break;
          //   case 'P':
          //     //fetchSemiSlitted();
          //     break;
          //   case 'S':
          //     //fetchSlitted();
          //     break;
          //   default:
          //     break;
          // }
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
  }

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
            fetchMotherCoil('');
            break;
          case 'P':
            fetchSemiSlitted('');
            break;
          case 'S':
            fetchSlitted('');
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
      
      // { title: "is slitetd", dataIndex: "IS_RAW_SLITTED", key: "IS_RAW_SLITTED" },
    ];

    const baseColumns1 = [
      { title: "Challan No", dataIndex: "CHALLAN_NO", key: "CHALLAN_NO" },
      { title: "DC No", dataIndex: "DC_NO", key: "DC_NO" },
      { title: "Width", dataIndex: "WIDTH", key: "WIDTH" },
      { title: "Weight", dataIndex: "WEIGHT", key: "WEIGHT" },
      { title: "Thickness", dataIndex: "THICKNESS", key: "THICKNESS" },
      { title: "Grade", dataIndex: "GRADE", key: "GRADE" },
      { title: "Coil Type", dataIndex: "COIL_TYPE", key: "COIL_TYPE" },

    ];
    if (flag === 'M' || flag === 'P' || flag === 'S') {
      baseColumns.splice(1, 0, { title: "Location", dataIndex: "FROM_LOCATION", key: "FROM_LOCATION" });
    }
    if (flag === 'P' || flag === 'S' ) {
      baseColumns.splice(1, 0, { title: "DC No", dataIndex: "DC_NO", key: "DC_NO" });
    }
   
    

    const actionColumn = {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
      {/* Shift */}
      <Tooltip title={record.IS_RAW_SLITTED === 'Y' ? "Material already slitted" : "Shift to another location"}>
      <Popconfirm
                     className=""
                     title="Shift to another location"
                     description="Are you sure to confirm?"
                     onConfirm={() =>  handleShift(record, flag)}
                    //  onCancel={cancel}
                     okText="Yes"
                     cancelText="No"
                   >
        <Button
          style={{
            backgroundColor: record.IS_RAW_SLITTED === 'Y' ? "#d9d9d9" : "#1890ff",
            borderColor: record.IS_RAW_SLITTED === 'Y' ? "#d9d9d9" : "#1890ff",
            color: "white",
            opacity: record.IS_RAW_SLITTED === 'Y' ? 0.5 : 1,
          }}
          // onClick={() =>}
          disabled={record.IS_RAW_SLITTED === 'Y'}
          icon={<SwapOutlined />}
        />
        </Popconfirm>
      </Tooltip>

      {/* Return */}
      <Tooltip title="Return material to supplier">
      <Popconfirm
                     className=""
                     title="Return material to supplier"
                     description="Are you sure to confirm?"
                     onConfirm={() =>   handleRowAction(flag=='M' ? record.MATERIAL_SRNO : record.SLITTING_SRNO,flag,'R')}
                    //  onCancel={cancel}
                     okText="Yes"
                     cancelText="No"
                   >
       <Button
          style={{
            backgroundColor: record.IS_RAW_SLITTED === 'Y' ? "#d9d9d9" : "#FFA500",
            borderColor: record.IS_RAW_SLITTED === 'Y' ? "#d9d9d9" : "#FFA500",
            color: "white",
            opacity: record.IS_RAW_SLITTED === 'Y' ? 0.5 : 1,
          }}
          // onClick={() => handleRowAction(flag=='M' ? record.MATERIAL_SRNO : record.SLITTING_SRNO,flag,'R')}
          disabled={record.IS_RAW_SLITTED === 'Y'}
          icon={<RetweetOutlined />}
        />
        </Popconfirm>
      </Tooltip>

      {/* Sell */}
      <Tooltip title="Sell material">
      <Popconfirm
                     className=""
                     title="Sell Material"
                     description="Are you sure to confirm?"
                     onConfirm={() =>   handleRowAction(flag=='M' ? record.MATERIAL_SRNO : record.SLITTING_SRNO,flag,'S')}
                    //  onCancel={cancel}
                     okText="Yes"
                     cancelText="No"
                   >
        <Button
          style={{
            backgroundColor: record.IS_RAW_SLITTED === 'Y' ? "#d9d9d9" : "#008000",
            borderColor: record.IS_RAW_SLITTED === 'Y' ? "#d9d9d9" : "#008000",
            color: "white",
            opacity: record.IS_RAW_SLITTED === 'Y' ? 0.5 : 1,
          }}
          // onClick={() => handleRowAction(flag=='M' ? record.MATERIAL_SRNO : record.SLITTING_SRNO,flag,'S')}
          disabled={record.IS_RAW_SLITTED === 'Y'}
          icon={<DollarCircleOutlined />}
        />
        </Popconfirm>
      </Tooltip>

      {/* Shift to Production */}
      <Tooltip title="Shift material to production">
      <Popconfirm
                     className=""
                     title="Shift material to production"
                     description="Are you sure to confirm?"
                     onConfirm={() =>   handleRowAction(flag=='M' ? record.MATERIAL_SRNO : record.SLITTING_SRNO,flag,'P')}
                    //  onCancel={cancel}
                     okText="Yes"
                     cancelText="No"
                   >
        <Button
          style={{
            backgroundColor: record.IS_RAW_SLITTED === 'Y' ? "#d9d9d9" : "#800080",
            borderColor: record.IS_RAW_SLITTED === 'Y' ? "#d9d9d9" : "#800080",
            color: "white",
            opacity: record.IS_RAW_SLITTED === 'Y' ? 0.5 : 1,
          }}
          // onClick={() => handleRowAction(flag=='M' ? record.MATERIAL_SRNO : record.SLITTING_SRNO,flag,'P')}
          disabled={record.IS_RAW_SLITTED === 'Y'}
          icon={<BuildOutlined />}
        />
        </Popconfirm>
      </Tooltip>
    </div>
      ),
    };
   

    // Add action column to the base columns ONLY for Mother Coils AND SLITTED
    if (flag === 'M' || flag === 'S') {
      return [...baseColumns, actionColumn];
    }else if(flag === 'P'){
    return [...baseColumns];
    }
    else if(flag === 'F' || flag === 'R' || flag === 'O'){
      return [...baseColumns1];
    }
    else{
      return [...baseColumns];

    }
  };

  // Handle search form submit
  const handleSearch = () => {
    const searchFromValues = searchForm.getFieldsValue();
    const searchParam = {
      ...searchFromValues
    };
    // Handle undefined values
    Object.keys(searchParam).forEach(queryKey => {
      if (searchParam[queryKey] === undefined) {
      searchParam[queryKey] = '';
      }
    });
    // conveert it into query string USING FOREACH
    let queryString = '';
    Object.keys(searchParam).forEach(queryKey => {
      if (searchParam[queryKey]) {
        queryString += `${queryKey}=${searchParam[queryKey]}&`;
      }
    });

    if (activeTab === "SEMI_SLITTED") {
      fetchSemiSlitted(queryString);
    }else if(activeTab === "SLITTED"){
      fetchSlitted(queryString);
    }else if(activeTab === "MOTHER"){
      fetchMotherCoil(queryString);
    }else if (activeTab === "PRODUCTION"){
      fetchCoils('F');
    }else if (activeTab === "RETURNED"){
      fetchCoils('R');
    }else if (activeTab === "SOLD"){
      fetchCoils('O');
    }
  };


  // Handle tab change
  const onTabChange = (key: string) => {
    setActiveTab(key);
    // Handle undefined values
    const searchParam = searchForm.getFieldsValue();
    Object.keys(searchParam).forEach(queryKey => {
      if (searchParam[queryKey] === undefined) {
        searchParam[queryKey] = '';
      }
    });
    // conveert it into query string USING FOREACH
    let queryString = '';
    Object.keys(searchParam).forEach(queryKey => {
      if (searchParam[queryKey]) {
        queryString += `${queryKey}=${searchParam[queryKey]}&`;
      }
    });
    if (key === "SEMI_SLITTED") {
      fetchSemiSlitted(queryString);
    }else if(key === "SLITTED"){
      fetchSlitted(queryString);
    }else if(key === "MOTHER"){
      fetchMotherCoil(queryString);
    }else if (key === "PRODUCTION"){
      fetchCoils('F');
    }else if (key === "RETURNED"){
      fetchCoils('R');
    }else if (key === "SOLD"){  
      fetchCoils('O');
    }
      
  };

  return (
    <Card title="Material Shift">
      <div>
      {/* Search Fields Inside the Tab */}
      <Form layout="inline" style={{ marginBottom: 16 }} onFinish={handleSearch} form={searchForm} hidden={activeTab === "PRODUCTION" || activeTab === "RETURNED" || activeTab === "SOLD"}>
        <Form.Item name="CHALLAN_NO">
          <Input placeholder="Challan No" />
        </Form.Item>
        <Form.Item name="REG_DATE_FROM">
          <Input type="date" placeholder="Date From" />
        </Form.Item>
        <Form.Item name="REG_DATE_TO">
          <Input type="date" placeholder="Date To" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
        Search
          </Button>
        </Form.Item>
      </Form>

      {/* Table */}
      {/* <Spin spinning={loading}>
        <Table dataSource={filteredData[key]} columns={generateTableColumns(columnType)} pagination={false} />
      </Spin> */}
    </div>

      <Tabs activeKey={activeTab} onChange={onTabChange} >
        <TabPane tab="Mother Coils" key="MOTHER">
          <Spin spinning={loading}>
            <Table dataSource={MotherData} columns={generateTableColumns('M')} pagination={false} />
          </Spin>
        </TabPane>
        <TabPane tab="Semi-Slitted Coils" key="SEMI_SLITTED">
          <Spin spinning={loading}>
            <Table dataSource={SemiSlittedData} columns={generateTableColumns('P')} pagination={false} />
          </Spin>
        </TabPane>
        <TabPane tab="Slitted Coils" key="SLITTED">
          <Spin spinning={loading}>
            <Table dataSource={SlittedData} columns={generateTableColumns('S')} pagination={false} />
          </Spin>
        </TabPane>
        <TabPane tab="Production Coils" key="PRODUCTION">
          <Spin spinning={loading}>
            <Table dataSource={fetchCoilsData} columns={generateTableColumns('F')} pagination={false} />
          </Spin>
        </TabPane>
        <TabPane tab="Return Coils" key="RETURNED">
          <Spin spinning={loading}>
            <Table dataSource={fetchCoilsData} columns={generateTableColumns('R')} pagination={false} />
          </Spin>
        </TabPane>
        <TabPane tab="Sold Coils" key="SOLD">
          <Spin spinning={loading}>
            <Table dataSource={fetchCoilsData} columns={generateTableColumns('O')} pagination={false} />
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
