'use client';

import React, { useEffect, useState } from 'react';
import {Table,Button,Modal,Form,Select,DatePicker,Input,Space,message,notification, Alert} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { apiService } from '../../../utils-old/apiUtils'; // Utility function for API calls
// import { ApiResponse } from '../../../utils/common_utils';
import { apiClient } from '@/utils/apiClient';
import { getCookieData } from '@/utils/common';
import { table } from 'console';

const { Option } = Select;


const ProductionLogsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [machineType, setMachineType] = useState<'Tube' | 'Laser'>('Tube');
  const [machinesOpt, setmachinesOpt] = useState([]);
  const [staffOpt, setstaffOpt] = useState([]);
  const [shiftsOpt, setshiftsOpt] = useState([]);
  const [odOpt, setOdOpt] = useState([]);
  const [thicknessOpt, setThicknessOpt] = useState([]); 
  const [gradeOpt, setGradeOpt] = useState([]);
  const [productOpt, setproductOpt] = useState([]);
  

    const cookiesData = getCookieData();
    const {USER_SRNO, API_BASE_URL, UT_SRNO} = cookiesData;
    
  const tubeMachineProducts = [
    { productId: '1', od: '50mm', thickness: '3mm', grade: 'SS304' },
    { productId: '2', od: '75mm', thickness: '5mm', grade: 'SS316' },
  ];

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



const handleAddLog = async (values: any) => {
  try {
    debugger
    // // Determine Insert or Update based on PIPE_SRNO
    // const IU_FLAG = values.PIPE_SRNO ? 'U' : 'I';

    // // Prepare the common payload fields
    // const commonPayload = {
    //   IU_FLAG, // Insert or Update
    //   PIPE_SRNO: values.PIPE_SRNO || null, // Use existing PIPE_SRNO for updates or null for new entries
    //   MACHINE_SRNO: values.MACHINE_SRNO,
    //   STAFF_SRNO: values.STAFF_SRNO,
    //   WORK_SHIFT_SRNO: values.WORK_SHIFT_SRNO,
    //   CREATED_DATE: values.CREATED_DATE.format('YYYY-MM-DD'), // Format date for API
    //   PIPE_QUANTITY: values.PIPE_QUANTITY,
    //   PIPE_GROUP: values.PIPE_GROUP || null, // Optional
    //   STATUS_SRNO: values.STATUS_SRNO || null, // Optional
    //   PIPE_TYPE: values.PIPE_TYPE || null, // Optional
    //   USER_SRNO: 1, // Replace with actual user ID
    //   MATERIAL_SRNO: 1, // Replace with actual material ID
    //   LENGTH: values.LENGTH, // Replace with actual length
    // };
    // let payload: {}

    // // Different logic for Tube Machine and Laser Machine
    // if (machineType === 'Tube') {
    //   payload = {
    //     ...commonPayload,
    //     OD: values.OD,
    //     THICKNESS: values.THICKNESS,
    //     GRADE: values.GRADE,
    //   };
    // } else {
    //   payload = {
    //     ...commonPayload,
    //     PRODUCT_SRNO: values.PRODUCT_SRNO,
    //   };
    // }


    const payload1 = {
      IU_FLAG : 'I',
      MATERIAL_SRNO : null,
      SLITTING_SRNO : null,
      MACHINE_SRNO : values.MACHINE_SRNO,
      GRADE_SRNO : values.GRADE_SRNO,
      THICKNESS_SRNO : values.THICKNESS_SRNO,
      OD_SRNO : values.OD_SRNO,
      WORK_SHIFT_SRNO : values.WORK_SHIFT_SRNO || null,
      C_LOCATION : values.C_LOCATION,
      IS_COIL_COMPLETED : false,
      P_LENGTH : values.P_LENGTH,
      PIPE_NOS : values.PIPE_NOS,
      PG_SCRAP_WT : null,
      P_WEIGHT : null,
      REMARKS : null,
      TRN_DATE : values.TRN_DATE,
      TRN_BY : values.TRN_BY,
      TRN_REMARK : values.TRN_REMARK,
      UT_SRNO : UT_SRNO,
      USER_SRNO : USER_SRNO,
      PG_SRNO : null,
    };

    // Call the API
    const response = await apiClient(`${API_BASE_URL}IuPipes`, "POST", payload1);
console.log(response, "Response api post");
debugger
    // Handle the API response
    if (response.msgId == 1 || response.msgId == 0) {
      message.success('Log added successfully!');
      setIsModalOpen(false); // Close modal after success
    } else {
      throw new Error(response.msg || 'Failed to add log');
    }
  } catch (error: any) {
    console.error('Error adding log:', error);
    message.error(error.message || 'Something went wrong!');
  }
};



  useEffect(() => {
  //  fetchProductionLogs()
    fetchPlCommon();
    // fetchDropdownData();
  }, []);

  const fetchPlCommon = async ( ) => {
    try{
      const TBL_SRNO = '1,2,3,4,5,6,7'
      const response = await apiClient<Record<string, any>>(`${API_BASE_URL}Pl_Common?USER_SRNO=${USER_SRNO}&UT_SRNO=${UT_SRNO}&TBL_SRNO=${TBL_SRNO}`, 'GET');
      if (response.msgId === 200) {
      
       
          const apiResData = response.data; 
          console.log(apiResData, "apiResData");
          if (apiResData == null) {return;}
          const  {M_MACHINE,STAFF,M_SHIFT,M_GRADE,M_OD,M_THICKNESS,M_PRODUCT} = apiResData;
          console.log(M_THICKNESS,M_PRODUCT, "apiResData");  
          console.log(apiResData, "apiResData");
          setmachinesOpt(M_MACHINE);
          setstaffOpt(STAFF);
          setshiftsOpt(M_SHIFT);
          setOdOpt(M_OD);
          setThicknessOpt(M_THICKNESS);
          setGradeOpt(M_GRADE);
          setproductOpt(M_PRODUCT);
      }


  } catch (error:any) {
    // Show the error message in a toast
    const errorMessage = error?.message || 'Something went wrong!';
  } finally {
    // setLoading(false); // Set loading to false after completion
  }
  }


  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Production/Processing Logs</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Add Log  121
        </Button>
      </div>
      {/* <Table
        dataSource={pipeLogs}
        columns={pipeLogsColumns}
      /> */}
      <Modal
        title="Add Production Log 1"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form onFinish={handleAddLog}>
  <Form.Item label="Pipe Srno" hidden name="PIPE_SRNO">
    <input type="hidden"  />
  </Form.Item>
  <Form.Item label="Machine Type">
    <Select
      defaultValue="Tube"
      onChange={(value) => setMachineType(value as 'Tube' | 'Laser')}
    >
      <Option value="Tube">Tube Machine</Option>
      <Option value="Laser">Laser Machine</Option>
    </Select>
  </Form.Item>

  <Form.Item
    label="Machine"
    name="MACHINE_SRNO"
    rules={[{ required: true, message: 'Please select a machine!' }]}
  >
    <Select
      placeholder="Select machine"
      // options={machinesOpt
      //   .filter((machine: any) => machine.MACHINE_TYPE === machineType)
      //   .map((machine: any) => ({ value: machine.value, label: machine.label }))}
    />
  </Form.Item>

  <Form.Item
    label="Staff"
    name="TRN_BY"
    rules={[{ required: false, message: 'Please select staff!' }]}
  >
    <Select placeholder="Select staff" options={staffOpt} />
  </Form.Item>
  <Form.Item
    label="Location"
    name="C_LOCATION"
    rules={[{ required: true, message: 'Please select staff!' }]}
  >
    <Select placeholder="Select staff" options={shiftsOpt} />
  </Form.Item>

  <Form.Item
    label="Shift"
    name="WORK_SHIFT_SRNO"
    rules={[{ required: true, message: 'Please select a shift!' }]}
  >
    <Select placeholder="Select shift" options={shiftsOpt} />
  </Form.Item>

  <Form.Item
    label="Date"
    name="TRN_DATE"
    rules={[{ required: true, message: 'Please select date!' }]}
  >
    <DatePicker />
  </Form.Item>

  <Form.Item
    label="Quantity"
    name="PIPE_NOS"
    rules={[{ required: true, message: 'Please enter quantity!' }]}
  >
    <Input placeholder="Enter quantity" />
  </Form.Item>

  {machineType === 'Tube' && (
    <>
      <Form.Item
        label="OD"
        name="OD_SRNO"
        rules={[{ required: true, message: 'Please select OD!' }]}
      >
        <Select placeholder="Select OD" options={odOpt} />
      </Form.Item>

      <Form.Item
        label="Thickness"
        name="THICKNESS_SRNO"
        rules={[{ required: true, message: 'Please select thickness!' }]}
      >
        <Select placeholder="Select thickness" options={thicknessOpt} />
      </Form.Item>

      <Form.Item
        label="Grade"
        name="GRADE_SRNO"
        rules={[{ required: true, message: 'Please select grade!' }]}
      >
        <Select placeholder="Select grade" options={gradeOpt} />
      </Form.Item>
    </>
  )}

  {machineType === 'Laser' && (
    <>
    <Form.Item
      label="Product"
      name="PRODUCT_SRNO"
      rules={[{ required: true, message: 'Please select a product!' }]}
    >
      <Select placeholder="Select product" options={productOpt} />
    </Form.Item>

<Form.Item
label="Length"
name="P_LENGTH"
rules={[{ required: true, message: 'Please select a Length!' }]}
>
<Input placeholder="Enter Length" />
</Form.Item>
</>
  )}



  {/* <Form.Item
    label="Status"
    name="STATUS_SRNO"
    rules={[{ required: true, message: 'Please select a status!' }]}
  >
    <Select placeholder="Select status" options={statusOpt} />
  </Form.Item>

  <Form.Item
    label="Pipe Type"
    name="PIPE_TYPE"
    rules={[{ required: true, message: 'Please select pipe type!' }]}
  >
    <Select placeholder="Select pipe type" options={pipeTypeOpt} />
  </Form.Item> */}

  <Form.Item>
    <Space>
      <Button 
      type="primary" htmlType="submit">
        Add Log 1
      </Button>
      <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
    </Space>
  </Form.Item>
</Form>

      </Modal>
    </>
  );
};

export default ProductionLogsPage;
