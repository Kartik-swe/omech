"use client";

import React, { useState } from "react";
import { Table, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { log } from "node:console";

const Page = () => {
  const [data, setData] = useState<any>([]);

  // Columns for the main table
  const mainColumns = [
    { title: "CH. NO", dataIndex: "CH. NO", key: "CH. NO" },
    { title: "DATE", dataIndex: "DATE", key: "DATE", render: (date: any) => formatDate(date) },
    { title: "GR", dataIndex: "GR", key: "GR" },
    { title: "THIK", dataIndex: "THIK", key: "THIK" },
    { title: "WIDTH", dataIndex: "WIDTH", key: "WIDTH" },
    { title: "LEGNTH", dataIndex: "LEGNTH", key: "LEGNTH" },
    { title: "QTY", dataIndex: "QTY", key: "QTY" },
    { title: "SCRAP", dataIndex: "SCRAP", key: "SCRAP" },
    { title: "BALANCE QTY", dataIndex: "BALANCE QTY", key: "BALANCE QTY" },
  ];

  // Columns for the nested table (PROGRAMS)
  const nestedColumns = [
    { title: "PROGRAM", dataIndex: "PROGRAM", key: "PROGRAM" },
    { title: "RECD QTY", dataIndex: "RECD_QTY", key: "RECD_QTY" },
    { title: "DC NO", dataIndex: "DC_NO", key: "DC_NO" },
    { title: "DATE", dataIndex: "DATE", key: "DATE", render: (date: any) => formatDate(date) },
    { title: "REF", dataIndex: "REF", key: "REF" },
  ];

   // Format date function
   const formatDate = (date: any) => {
    if (!date) return null;
    // If date is a JavaScript Date object, format it
    return new Date(date).toLocaleDateString("en-IN"); // Adjust the format as per your requirement
    // Or use moment.js for custom formatting
    // return moment(date).format("DD/MM/YYYY"); 
  };
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Log the entire sheet data for inspection
      console.log("Sheet Data:", jsonData);

      // Ensure data has at least 4 rows to process
      if (jsonData.length < 4) {
        message.error("Invalid file format!");
        return;
      }

      // Define headers manually (you can adjust as needed)
      const headers = (jsonData[0] as any[]).map((header: any) =>
        typeof header === "string" ? header.trim() : header
      );

      const requiredHeaders = [
        "CH. NO",
        "CH. DATE",
        "GR",
        "THIK",
        "WIDTH",
        "LEGNTH",
        "QTY",
        "PROGRAM",
        "RECD QTY",
        "DC NO",
        "DATE",
        "REF",
        "SCRAP",
        "BALANCE QTY",
      ];

      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header)
      );
      if (missingHeaders.length > 0) {
        message.error(`Missing columns: ${missingHeaders.join(", ")}`);
        return;
      }

       // Check for extra headers (columns that are not in requiredHeaders)
       const extraHeaders = headers.filter(
        (header) => !requiredHeaders.includes(header)
      );
      if (extraHeaders.length > 0) {
        message.warning(`Extra columns detected: ${extraHeaders.join(", ")}`);
      }

        // Function to convert Excel date number to JavaScript Date
        const excelDateToJsDate = (excelDate: number) => {
            const epoch = new Date(Date.UTC(1900, 0, 1)); // Excel's epoch date
            // console.log(new Date(epoch.getTime() + (excelDate - 2) * 86400000));
            // console.log(excelDate);
            
            
            return new Date(epoch.getTime() + (excelDate - 2) * 86400000); // Subtract 2 to adjust for Excel's leap year bug
          };

      // Process the rows manually
      const rows = jsonData.slice(1).map((row: any[]) => {
        // Create an object with your custom structure
        const rowData: Record<string, any> = {};

        // Manually define the structure of the row based on headers
        rowData["CH. NO"] = row[headers.indexOf("CH. NO")] || null;
        // Convert Excel date to JavaScript date if it's a number
        const dateValue = row[headers.indexOf("CH. DATE")];
        rowData["DATE"] = typeof dateValue === "number" ? excelDateToJsDate(dateValue) : dateValue || null;
        rowData["GR"] = row[headers.indexOf("GR")] || null;
        rowData["THIK"] = row[headers.indexOf("THIK")] || null;
        rowData["WIDTH"] = row[headers.indexOf("WIDTH")] || null;
        rowData["LEGNTH"] = row[headers.indexOf("LEGNTH")] || null;
        rowData["QTY"] = row[headers.indexOf("QTY")] || null;
        rowData["SCRAP"] = row[headers.indexOf("SCRAP")] || null;
        rowData["BALANCE QTY"] = row[headers.indexOf("BALANCE QTY")] || null;

        // Extract PROGRAM data if needed
        const programs = [];
        let i = headers.indexOf("PROGRAM");
        while (i !== -1 && headers[i]) {
          programs.push({
            PROGRAM: row[i] || null,
            RECD_QTY: row[i + 1] || null,
            DC_NO: row[i + 2] || null,
            DATE: typeof row[i + 3] === "number" ? excelDateToJsDate(row[i + 3]) : row[i + 3] || null,
            REF: row[i + 4] || null,
          });
          i = headers.indexOf("PROGRAM", i + 1);
        }

        rowData["PROGRAMS"] = programs.filter((p) => p.PROGRAM);

        // Remove individual program fields
        // delete rowData["PROGRAM"];
        // delete rowData["RECD QTY"];
        // delete rowData["DC NO"];
        // delete rowData["DATE"];
        // delete rowData["REF"];

        console.log("Row Data:", rowData);
        return rowData;
      });

      // After the data is structured, set it to state
      console.log(rows);
      
      setData(rows);
      message.success("File uploaded and processed successfully!");
    };
    reader.readAsArrayBuffer(file); // Use ArrayBuffer instead of BinaryString
  };

  return (
    <div>
      <h1>File Upload and Table Display</h1>
      <Upload
        accept=".xlsx, .xls"
        beforeUpload={(file) => {
          handleFileUpload(file);
          return false; // Prevent auto-upload
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Upload Excel File</Button>
      </Upload>
      <Table
        dataSource={data}
        columns={mainColumns}
        rowKey={(record) => record["CH. NO"] || Math.random()}
        expandable={{
          expandedRowRender: (record: any) => (
            <Table
              dataSource={record.PROGRAMS}
              columns={nestedColumns}
              pagination={false}
              rowKey={(program: any) => program.PROGRAM || Math.random()}
            />
          ),
        }}
      />
    </div>
  );
};

export default Page;


// import React, { useState } from "react";
// import { Table, Upload, Button, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import * as XLSX from "xlsx";

// const Page = () => {
//   const [data, setData] = useState<any>([]);

//   // Columns for the main table
//   const mainColumns = [
//     { title: "CH. NO", dataIndex: "CH. NO", key: "CH. NO" },
//     { title: "DATE", dataIndex: "DATE", key: "DATE" },
//     { title: "GR", dataIndex: "GR", key: "GR" },
//     { title: "THIK", dataIndex: "THIK", key: "THIK" },
//     { title: "WIDTH", dataIndex: "WIDTH", key: "WIDTH" },
//     { title: "LEGNTH", dataIndex: "LEGNTH", key: "LEGNTH" },
//     { title: "QTY", dataIndex: "QTY", key: "QTY" },
//     { title: "SCRAP", dataIndex: "SCRAP", key: "SCRAP" },
//     { title: "BALANCE QTY", dataIndex: "BALANCE QTY", key: "BALANCE QTY" },
//   ];

//   // Columns for the nested table (PROGRAMS)
//   const nestedColumns = [
//     { title: "PROGRAM", dataIndex: "PROGRAM", key: "PROGRAM" },
//     { title: "RECD QTY", dataIndex: "RECD_QTY", key: "RECD_QTY" },
//     { title: "DC NO", dataIndex: "DC_NO", key: "DC_NO" },
//     { title: "DATE", dataIndex: "DATE", key: "DATE" },
//     { title: "REF", dataIndex: "REF", key: "REF" },
//   ];

//   const handleFileUpload = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const binaryStr = e.target?.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//       console.log(sheet);
      

//       // Validate and process data
//       if (jsonData.length < 4) {
//         message.error("Invalid file format!");
        
//       }
//       const headers = (jsonData[3] as any[]).map((header: any) =>
//         typeof header === "string" ? header.trim() : header
//       );
//       const requiredHeaders = [
//         "CH. NO",
//         "DATE",
//         "GR",
//         "THIK",
//         "WIDTH",
//         "LEGNTH",
//         "QTY",
//         "PROGRAM",
//         "RECD QTY",
//         "DC NO",
//         "DATE",
//         "REF",
//         "SCRAP",
//         "BALANCE QTY",
//       ];
//       const missingHeaders = requiredHeaders.filter(
//         (header) => !headers.includes(header)
//       );
//       if (missingHeaders.length > 0) {
//         message.error(`Missing columns: ${missingHeaders.join(", ")}`);
//         return;
//       }

//       const rows = jsonData.slice(4).map((row: any[]) => {
//         const rowData: Record<string, any> = {};
//         headers.forEach((header, index) => {
//           rowData[header] = row[index] || null;
//         });

//         const programs = [];
//         let i = headers.indexOf("PROGRAM");
//         while (i !== -1 && headers[i]) {
//           programs.push({
//             PROGRAM: row[i] || null,
//             RECD_QTY: row[i + 1] || null,
//             DC_NO: row[i + 2] || null,
//             DATE: row[i + 3] || null,
//             REF: row[i + 4] || null,
//           });
//           i = headers.indexOf("PROGRAM", i + 1);
//         }

//         rowData["PROGRAMS"] = programs.filter((p) => p.PROGRAM);

//         // Remove individual program fields from top level
//         delete rowData["PROGRAM"];
//         delete rowData["RECD QTY"];
//         delete rowData["DC NO"];
//         delete rowData["DATE"];
//         delete rowData["REF"];

//         return rowData;
//       });

//       setData(rows);
//       message.success("File uploaded and processed successfully!");
//     };
//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div>
//       <h1>File Upload and Table Display</h1>
//       <Upload
//         accept=".xlsx, .xls"
//         beforeUpload={(file) => {
//           handleFileUpload(file);
//           return false;
//         }}
//         showUploadList={false}
//       >
//         <Button icon={<UploadOutlined />}>Upload Excel File</Button>
//       </Upload>
//       <Table
//         dataSource={data}
//         columns={mainColumns}
//         rowKey={(record) => record["CH. NO"] || Math.random()}
//         expandable={{
//           expandedRowRender: (record:any) => (
//             <Table
//               dataSource={record.PROGRAMS}
//               columns={nestedColumns}
//               pagination={false}
//               rowKey={(program:any) => program.PROGRAM || Math.random()}
//             />
//           ),
//         }}
//       />
//     </div>
//   );
// };

// export default Page;
