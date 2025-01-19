"use client"
import React, { useState } from 'react';
import { Table, Form, Input, Button, InputNumber, DatePicker, Modal, message,Row, Col, Select, notification, Space } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { apiClient } from '@/utils/apiClient';
import { getCookieData } from '@/utils/common';
import SlitTable from '@/app/components/slitTable';
// import slitTable from '@/app/components/slitTable copy';

// import { useRouter } from 'next/router';


const RawMaterialDashboard = () => {
  interface RawMaterial {
    key: number;
    CHALLAN_NO: string;
    RECEIVED_DATE: string;
    MATERIAL_GRADE: string;
    MATERIAL_THICKNESS: number;
    MATERIAL_WIDTH: number;
    MATERIAL_WEIGHT: number;
    remainingWeight: number;
    MATERIAL_SRNO: number;
  }

  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [slittingData, setslittingData] = useState<any[]>([]);
  const [slittingHistory1, setSlittingHistory] = useState<{ [key: number]: any[] }>({});
  const [form] = Form.useForm();
  const [slitForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
// state for grade options with interface
  const [optGrades, setOptGrades] = useState<{ label: string; value: string }[]>([]);
  const [optThickNess, setoptThickNess] = useState<{ label: string; value: string }[]>([]);
  const [optVendors, setOptVendors] = useState<{ label: string; value: string }[]>([]);
  const cookiesData = getCookieData();
  const {USER_SRNO, API_BASE_URL, UT_SRNO} = cookiesData;
    // load useeffect to fetch grades
    React.useEffect(() => {
      FetchPlCommon();
      FetchRawMaterials();

}, []);


  // Function to fetch common dropdown options
  const FetchPlCommon = async () => {
    const response = await apiClient<Record<string, any>>(`${API_BASE_URL}Pl_Common?USER_SRNO=${USER_SRNO}&UT_SRNO=${UT_SRNO}&TBL_SRNO=1,3,4`, 'GET');
    if (response.msgId === 200) {
      if (!response.data) {
        
        return;
      }
      // Destructure the fields (M_GRADE, M_GENDER, M_PRODUCT)
      
      
      const { Table1,Table3,Table4 } = response.data;
      setOptGrades(Table1)
      setoptThickNess(Table3)
      setOptVendors(Table4)
    } else {
      message.error(response.msg)
      console.error('API Error:', response.msg);  // Logging the error message
    }
  };

  const updateSlittedStatus = (id: number) => {
    console.log("id", id);
    
    // Find the record by SLITTING_SRNO and set IS_SLITTED to true
    const updatedData = [...slittingData]; // Assuming slittingData is a state
    const record = updatedData.find((item) => item.SLITTING_SRNO === id);
    if (record) {
      record.IS_SLITTED = true;
      setSlittingHistory(updatedData); // Update state to re-render table
    }
  };
  

//  fUNCTION TO FETCH RAW MATERIALS
  const FetchRawMaterials = async () => {
    try {
      const response = await apiClient('/api/Matarials/Raw', 'GET');
      
      
      if (response.msgId === 1) {
        if (!response.data) {
          
          return;
        }
        console.log(response.data, "response.data");  
        
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
            IS_SLITTED: slit.IS_SLITTED,
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


  // Adjusted function to handle adding raw material with API request
  const handleAddRawMaterial = async (values: any) => {
    try {
      const payload = {
        IU_FLAG: 'I', // For insert
        MATERIAL_SRNO: 0, // To be generated by the database
        VENDOR_SRNO: 1, // Example: replace with actual vendor ID
        MATERIAL_GRADE: values.MATERIAL_GRADE,
        MATERIAL_WIDTH: values.MATERIAL_WIDTH,
        MATERIAL_THICKNESS: values.MATERIAL_THICKNESS,
        MATERIAL_WEIGHT: values.MATERIAL_WEIGHT,
        CHALLAN_NO: values.CHALLAN_NO,
        RECEIVED_DATE: values.RECEIVED_DATE.format('YYYY-MM-DD'),
        MATERIAL_STATUS_SRNO : 1,
        USER_SRNO: 1, // Example: replace with actual user ID
        // MATERIAL_SRNO: 0, // Example: replace with actual user ID
      }
      const response = await apiClient(`${API_BASE_URL}IuRawMaterial`, 'POST', payload);
      if (response.msgId === 200) {
        message.success('Raw material added successfully!');
        setRawMaterials([...rawMaterials, {
          key: rawMaterials.length + 1,
          CHALLAN_NO: values.CHALLAN_NO,
          RECEIVED_DATE: values.RECEIVED_DATE.format('YYYY-MM-DD'),
          MATERIAL_GRADE: values.MATERIAL_GRADE,
          MATERIAL_THICKNESS: values.MATERIAL_THICKNESS,
          MATERIAL_WIDTH: values.MATERIAL_WIDTH,
          MATERIAL_WEIGHT: values.MATERIAL_WEIGHT,
          remainingWeight: values.SLITTING_WEIGHT,
          MATERIAL_SRNO: response.data.Table[0].MATERIAL_SRNO, // Assuming the response contains MATERIAL_SRNO
        }]);
        form.resetFields();
        
        
      } else {
        message.error(`Error: ${response.msg}`);
      }
    } catch (error) {
      console.error('Error adding raw material:', error);
      message.error('Failed to add raw material');
    }
  };

  // Adjusted function to handle slitting operation with API request
  const handleSlitMaterial = async (values: any) => {
    alert("")
    
    
    
    if (!selectedMaterial) return;

    try {
      const payload = {
        IU_FLAG: 'I', // For insert
        MATERIAL_SRNO: selectedMaterial.MATERIAL_SRNO, // Example: replace with actual user ID
        VENDOR_SRNO: values.VENDOR_SRNO, // Example: replace with actual vendor ID
        SLITTING_SRNO_FK: values.SLITTING_SRNO_FK, // Example: replace with actual vendor ID
        SLITTING_LEVEL: values.SLITTING_LEVEL, // Example: replace with actual vendor ID
        SLITTING_DATE: values.SLITTING_DATE.format('YYYY-MM-DD'),
        DC_NO: values.DC_NO,
        USER_SRNO: USER_SRNO,
        SlitDetails : values.SLITTING_DTL,
      }
      
      
      const response = await apiClient(`${API_BASE_URL}IuRawSlitArr`, 'POST', payload);
      
      if (response.msgId === 200) {
        message.success('Material slit successfully!');
        const updatedMaterials = rawMaterials.map((material) =>
          material.key === selectedMaterial.key
            ? { ...material, remainingWeight: material.remainingWeight - values.MATERIAL_WEIGHT }
            : material
        );
        setRawMaterials(updatedMaterials);

        const newSlitting = {
          ...values,
          SLITTING_DATE: values.SLITTING_DATE.format('YYYY-MM-DD'),
        };

        setSlittingHistory({
          ...slittingHistory1,
          [selectedMaterial.key]: [...(slittingHistory1[selectedMaterial.key] || []), newSlitting],
        });

        setModalVisible(false);
      } else {
        message.error(response.msg);
      }
    } catch (error) {
      console.error('Error slitting raw material:', error);
      message.error('Failed to slit material');
    }
  };

  const columns = [
    {
      title: 'Challan No',
      dataIndex: 'CHALLAN_NO',
      key: 'CHALLAN_NO',
    },
    {
      title: 'Date',
      dataIndex: 'RECEIVED_DATE',
      key: 'RECEIVED_DATE',
    },
    {
      title: 'Grade',
      dataIndex: 'MATERIAL_GRADE',
      key: 'MATERIAL_GRADE',
    },
    {
      title: 'Thickness (mm)',
      dataIndex: 'MATERIAL_THICKNESS',
      key: 'MATERIAL_THICKNESS',
    },
    {
      title: 'Width (mm)',
      dataIndex: 'MATERIAL_WIDTH',
      key: 'MATERIAL_WIDTH',
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'MATERIAL_WEIGHT',
      key: 'MATERIAL_WEIGHT',
    },
    {
      title: 'Remaining Weight (kg)',
      dataIndex: 'remainingWeight',
      key: 'remainingWeight',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedMaterial(record);
            setModalVisible(true);
          }}
        >
          Slit
        </Button>
      ), 
    },
  ];

  const slittingColumns = [
    {
      title: 'Date',
      dataIndex: 'SLITTING_DATE',
      key: 'SLITTING_DATE',
    },
    {
      title: 'Slit Width (mm)',
      dataIndex: 'SLITTING_WIDTH',
      key: 'SLITTING_WIDTH',
    },
    {
      title: 'Slit Weight (kg)',
      dataIndex: 'SLITTING_WEIGHT',
      key: 'SLITTING_WEIGHT',
    },
    {
      title: 'DC No',
      dataIndex: 'DC_NO',
      key: 'DC_NO',
    },
     {
          title: 'Actions',
          key: 'actions',
          render: (text: any, record: any) => (
            <Button
              type="primary"
              onClick={() => {
                setSlitingLevvel(record);
                setSelectedMaterial(record);
                setModalVisible(true);
              }}
            >
              Slit
            </Button>
          ),
        },
  ];
// function setSlitingLevvel
  const setSlitingLevvel = (record: any) => {
    console.log("record", record);
    
    
    slitForm.setFieldsValue({
      MATERIAL_SRNO: record.MATERIAL_SRNO,
      SLITTING_SRNO_FK: record.SLITTING_SRNO,
      SLITTING_LEVEL :record.SLITTING_LEVEL + 1,
    });
  };

  
  return (
    <div style={{ padding: '20px' }}>
      {/* <h1>Raw Material Dashboard</h1> */}

      <Form
        form={form}
        layout="horizontal"
        onFinish={handleAddRawMaterial}
        style={{ marginBottom: '20px' }}
      >
        <Row gutter={16}>
          <Col span={8}>
        <Form.Item name="CHALLAN_NO" label="Challan No" rules={[{ required: true, message: 'Please enter challan number' }]}>
          <Input placeholder="Enter Challan No" />
        </Form.Item>
          </Col>
          <Col span={8}>
        <Form.Item name="RECEIVED_DATE" label="Date" rules={[{ required: true, message: 'Please select date' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
          </Col>
          <Col span={8}>
        <Form.Item name="MATERIAL_GRADE" label="Grade" rules={[{ required: true, message: 'Please select grade' }]}>
          <Select showSearch placeholder="Select Grade" options={optGrades}></Select>
        </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={7}>
        <Form.Item name="MATERIAL_THICKNESS" label="Thickness (mm)" rules={[{ required: true, message: 'Select Thickness' }]}>
          <Select showSearch placeholder="Select Thickness" options={optThickNess}></Select>
        </Form.Item>
          </Col>
          <Col span={7}>
        <Form.Item name="MATERIAL_WIDTH" label="Width (mm)" rules={[{ required: true, message: 'Please enter width' }]}>
          <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter Width" />
        </Form.Item>
          </Col>
          <Col span={7}>
        <Form.Item name="MATERIAL_WEIGHT" label="Weight (kg)" rules={[{ required: true, message: 'Please enter weight' }]}>
          <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter Weight" />
        </Form.Item>
          </Col>
          <Col span={3}>
        <Button type="primary" htmlType="submit">Add Raw Material</Button>
          </Col>
        </Row>
        <Row>
         
        </Row>
      </Form>

     {/* Render Raw Material Table */}
     {/* <Table
        columns={[
          { title: 'Challan No', dataIndex: 'CHALLAN_NO', key: 'CHALLAN_NO' },
          { title: 'Received Date', dataIndex: 'RECEIVED_DATE', key: 'RECEIVED_DATE' },
          { title: 'Material Grade', dataIndex: 'MATERIAL_GRADE', key: 'MATERIAL_GRADE' },
          { title: 'Material Thickness', dataIndex: 'MATERIAL_THICKNESS', key: 'MATERIAL_THICKNESS' },
          { title: 'Material Width', dataIndex: 'MATERIAL_WIDTH', key: 'MATERIAL_WIDTH' },
          { title: 'Weight', dataIndex: 'MATERIAL_WEIGHT', key: 'MATERIAL_WEIGHT' },
          { title: 'Action', key: 'action', render: (_, record) => (
            <Space size="middle">
              <Button onClick={() => setSelectedMaterial(record)}>Slit</Button>
            </Space>
          ) },
        ]}
        dataSource={rawMaterials}
        rowKey="MATERIAL_SRNO"
        pagination={false}
      />

      {selectedMaterial && slittingHistory1[selectedMaterial.MATERIAL_SRNO] && (
        <RecursiveNestedTable data={slittingHistory1[selectedMaterial.MATERIAL_SRNO]} />
      )} */}

<SlitTable mainTableData={rawMaterials} slittingData={slittingData} setSlitingLevvel={setSlitingLevvel} setSelectedMaterial={setSelectedMaterial} setModalVisible={setModalVisible} updateSlittedStatus={updateSlittedStatus} />
       <Modal
      title="Slit Material"
      visible={modalVisible}
      onCancel={() => {
        slitForm.resetFields();
        setModalVisible(false);
      }}
      footer={null}
      bodyStyle={{ padding: '24px 32px' }}
      centered
    >
      <Form
        layout="vertical"
        form={slitForm}
        onFinish={handleSlitMaterial}
      >
        {/* Hidden Controls */}
        <Form.Item name="MATERIAL_SRNO" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="SLITTING_SRNO_FK" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="SLITTING_LEVEL" initialValue={1} hidden>
          <Input />
        </Form.Item>
    
        {/* Vendor Dropdown */}
        <Form.Item
          name="VENDOR_SRNO"
          label="Vendor"
          rules={[{ required: true, message: 'Please select a vendor' }]}
        >
          <Select placeholder="Select Vendor" options={optVendors} showSearch ></Select>
        </Form.Item>

        {/* Date Picker */}
        <Form.Item
          name="SLITTING_DATE"
          label="Date"
          rules={[{ required: true, message: 'Please select date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            // disabledDate={(current) => current && current < Date.now()}
          />
        </Form.Item>

        {/* Dynamic Fields for Width and Nos */}
        <Form.List name="SLITTING_DTL">
          {(fields, { add, remove }) => (
            <div>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  {/* Width Field */}
                  <Form.Item
                    {...restField}
                    name={[name, 'SLITTING_WIDTH']}
                    fieldKey={[fieldKey?? key, 'SLITTING_WIDTH']}
                    rules={[{ required: true, message: 'Enter width (mm)' }]}
                    style={{ flex: 1 }}
                  >
                    <InputNumber
                      min={0}
                      placeholder="Width (mm)"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'SLITTING_WEIGHT']}
                    fieldKey={[fieldKey?? key, 'Weight']}
                    rules={[{ required: true, message: 'Enter Weight (KG)' }]}
                    style={{ flex: 1 }}
                  >
                    <InputNumber
                      min={0}
                      placeholder="Weight (KG)"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  {/* Nos Field */}
                  <Form.Item
                    {...restField}
                    name={[name, 'nos']}
                    fieldKey={[fieldKey ?? key, 'nos']}
                    rules={[{ required: true, message: 'Enter nos' }]}
                    style={{ flex: 1 }}
                  >
                    <InputNumber
                      min={0}
                      placeholder="Nos"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  {/* Remove Icon */}
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{
                      color: 'red',
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                  />
                </Space>
              ))}

              {/* Add Button */}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusCircleOutlined />}
                style={{ marginTop: 16 }}
              >
                Add Width and Nos
              </Button>
            </div>
          )}
        </Form.List>

        {/* Other Fields */}
        
        <Form.Item
          name="DC_NO"
          label="DC No"
          rules={[{ required: true, message: 'Please enter DC number' }]}
        >
          <Input placeholder="Enter DC No" />
        </Form.Item>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          // loading={loading}
          style={{ width: '100%', marginTop: 20 }}
        >
          Submit
        </Button>
      </Form>
    </Modal>
    </div>
  );
};

export default RawMaterialDashboard;
