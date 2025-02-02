import React from "react";
import { Button, message, Popconfirm, PopconfirmProps, Table } from "antd";

// Transform flat data into nested structure
function transformToNestedData(flatData: any[]) {
  const dataMap: Record<number, any> = {};
  const nestedData: any[] = [];

  // Map all data by SLITTING_SRNO
  flatData.forEach((item) => {
    dataMap[item.SLITTING_SRNO] = { ...item, children: [] };
  });

  // Build hierarchy using SLITTING_SRNO_FK
  flatData.forEach((item) => {
    if (item.SLITTING_SRNO_FK) {
      const parent = dataMap[item.SLITTING_SRNO_FK];
      if (parent) {
        parent.children.push(dataMap[item.SLITTING_SRNO]);
      }
    } else {
      // Top-level record
      nestedData.push(dataMap[item.SLITTING_SRNO]);
    }
  });

  return nestedData;
}

// Recursive Nested Table Component
const RecursiveNestedTable = ({ data, setSlitingLevvel, setSelectedMaterial , setModalVisible, updateSlittedStatus}: { data: any[], setSlitingLevvel:any, setSelectedMaterial:any, setModalVisible:any , updateSlittedStatus:any}) => {

    const confirm: PopconfirmProps['onConfirm'] = (e:any) => {
        // console.log(e.SLITTING_SRNO, "SLITTING_SRNO");
        updateSlittedStatus(e.SLITTING_SRNO);
        message.success('Click on Yes');
      };
      
      const cancel: PopconfirmProps['onCancel'] = (e:any) => {
        // console.log(e);
        message.error('Click on No');
      };
      
  const slittingColumns = [
    //  {
    //    title: 'SLITTING_SRNO',
    //    dataIndex: 'SLITTING_SRNO',
    //    key: 'SLITTING_SRNO',
    //  },
    //  {
    //    title: 'SLITTING_SRNO_FK',
    //    dataIndex: 'SLITTING_SRNO_FK',
    //    key: 'SLITTING_SRNO_FK',
    //  },
    {
      title: 'DC No',
      dataIndex: 'DC_NO',
      key: 'DC_NO',
    },
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
      title: 'Remaining Width (mm)',
      dataIndex: 'remainingWidth',
      key: 'remainingWidth',
    },
     {
       title: 'Slit Weight (kg)',
       dataIndex: 'SLITTING_WEIGHT',
       key: 'SLITTING_WEIGHT',
     },
     {
      title: 'Remaining Weight (kg)',
      dataIndex: 'remainingWeight',
      key: 'remainingWeight',
    },
  
    //  {
    //    title: 'IS_SLITTED',
    //    key: 'IS_SLITTED',
    //    render: (text: any, record: any) => (
    //     <>
        
    //     {record.IS_SLITTED ? "Yes" : "No"}

    //      </>
    //    ),
    //  },
      {
           title: 'Actions',
           key: 'actions',
           render: (text: any, record: any) => (
            record.IS_SLITTED ? <Button color="default" variant="solid">Slitted</Button> :
            <>

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

             <Popconfirm
             className="ms-3"
                title="Slitted done"
                description="Are you sure to confirm?"
                onConfirm={() => confirm(record)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <Button color="primary" variant="solid">
            Slitted
          </Button>
            </Popconfirm>
             </>
           ),
         },
   ];

  return (
    <Table
      columns={slittingColumns}
      dataSource={data}
      rowKey="SLITTING_SRNO"
      rowClassName={(record) => (record.IS_SLITTED ? 'row-slitted' : '')}
    //   expandable={{
    //     expandedRowRender: (record) =>
    //       record.children && record.children.length > 0 ? (
    //         // <RecursiveNestedTable data={record.children} />
    //       ) : null,
    //   }}
      pagination={false}
    />
  );
};
// const SlittingTable = ({ mainTableData, slittingData }: { mainTableData: any[], slittingData: any[] }) => {

// Main Table Component
const SlittingTable = ({ mainTableData, slittingData ,setSlitingLevvel, setSelectedMaterial,setModalVisible, updateSlittedStatus}: { mainTableData: any[], slittingData: any[], setSlitingLevvel :any ,setSelectedMaterial:any, setModalVisible :any, updateSlittedStatus :any }) => {
    // console.log(slittingData, "slittingData");
      // Calculate remaining weight and width
      // console.log(mainTableData, "mainTableData");
      console.log(slittingData, "slittingData");
      
  const mainTableDataWithRemainingValues = mainTableData.map((record) => {
    // debugger
    const filteredSlittingData = slittingData.filter(
      (item) => (item.MATERIAL_SRNO === record.MATERIAL_SRNO && item.SLITTING_LEVEL === 1 && item.SLITTING_SRNO_FK === null)  
    );
    console.log(filteredSlittingData, "filteredSlittingData");
    
    // Calculate total slitted weight and width
    const totalSlittedWeight = filteredSlittingData.reduce((sum, item) => sum + (item.SLITTING_WEIGHT || 0), 0);
    const totalSlittedWidth = filteredSlittingData.reduce((sum, item) => sum + (item.SLITTING_WIDTH || 0), 0);

    // Calculate remaining values
    const remainingWeight = (record.MATERIAL_WEIGHT || 0) - totalSlittedWeight;
    const remainingWidth = (record.MATERIAL_WIDTH || 0) - totalSlittedWidth;

    return {
      ...record,
      remainingWeight: remainingWeight > 0 ? remainingWeight : 0, // Ensure no negative weights
      remainingWidth: remainingWidth > 0 ? remainingWidth : 0,   // Ensure no negative widths
    };
  });


  const slittingWithRemainingValues = slittingData.map((record) => {

    debugger
    const filteredSlittingData = slittingData.filter(
      (item) => (item.SLITTING_SRNO_FK === record.SLITTING_SRNO && item.SLITTING_LEVEL > record.SLITTING_LEVEL)  
    );

    // Calculate total slitted weight and width
    const totalSlittedWeight = filteredSlittingData.reduce((sum, item) => sum + (item.SLITTING_WEIGHT || 0), 0);
    const totalSlittedWidth = filteredSlittingData.reduce((sum, item) => sum + (item.SLITTING_WIDTH || 0), 0);

    // Calculate remaining values
    const remainingWeight = (record.SLITTING_WEIGHT || 0) - totalSlittedWeight;
    const remainingWidth = (record.SLITTING_WIDTH || 0) - totalSlittedWidth;

    return {
      ...record,
      remainingWeight: remainingWeight > 0 ? remainingWeight : 0, // Ensure no negative weights
      remainingWidth: remainingWidth > 0 ? remainingWidth : 0,   // Ensure no negative widths
    };
  });
  

  console.log(mainTableDataWithRemainingValues, "mainTableDataWithRemainingValues");  
  console.log(slittingWithRemainingValues, "slittingWithRemainingValues");
  

    const mainTableColumns = [
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
          title: 'Remaining Width (mm)',
          dataIndex: 'remainingWidth',
          key: 'remainingWidth',
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
              Slit 1
            </Button>
          ), 
        },
      ];



  return (
    <div>
      <h1>Main Table</h1>
      <Table
      className="raw-material-table"
        columns={mainTableColumns}
        dataSource={mainTableDataWithRemainingValues}
        rowKey="MATERIAL_SRNO"
        expandable={{
          expandedRowRender: (record) => {
            // Create a copy of slittingData filtered for the current MATERIAL_SRNO
            const filteredSlittingData = slittingWithRemainingValues.filter(
              (item) => item.MATERIAL_SRNO === record.MATERIAL_SRNO
            );

            // Transform filtered data into a nested structure
            const nestedSlittingData = transformToNestedData(filteredSlittingData);

            return (
              <div>
                {/* <h2>Slitting Details</h2> */}
                <RecursiveNestedTable data={nestedSlittingData} setSlitingLevvel={setSlitingLevvel} setSelectedMaterial={setSelectedMaterial} setModalVisible={setModalVisible} updateSlittedStatus={updateSlittedStatus} />
              </div>
            );
          },
        }}
        pagination={false}
      />
    </div>
  );
};

export default SlittingTable;
