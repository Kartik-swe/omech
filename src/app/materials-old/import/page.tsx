"use client"
import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

// Define interfaces for the data structure
type ProgramData = {
  PROGRAM: string;
  RECD_QTY: number;
  DC_NO: string;
  DATE: string;
  REF: string;
};

type TransformedData = {
  CH_NO: number;
  DATE: string;
  GR: number;
  THIK: number;
  WIDTH: number;
  LENGTH: number;
  QTY: number;
  SCRAP: number | null;
  BALANCE_QTY: number | null;
  PROGRAMS: ProgramData[];
};
const ImportFile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<TransformedData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const transformData = (data: any[]): TransformedData[] => {
    return data.map((item, rowIndex) => {
      // Extract base fields
      const transformedItem: TransformedData = {
        CH_NO: item["CH. NO"],
        DATE: item["DATE"],
        GR: item["GR"],
        THIK: item["THIK"],
        WIDTH: item["WIDTH"],
        LENGTH: item["LENGTH"],
        QTY: item["QTY"],
        SCRAP: item["SCRAP"],
        BALANCE_QTY: item["BALANCE QTY"],
        PROGRAMS: [],
      };
  
      console.log(`Row ${rowIndex + 1} Initial Data:`, item);
  
      // Normalize headers for dynamic matching
      const normalizedKeys = Object.keys(item).map((key) => key.trim().toUpperCase());
  
      // Identify program groups dynamically
      normalizedKeys.forEach((key) => {
        if (key.startsWith("PROGRAM")) {
          const programIndex = key.match(/PROGRAM\s*(\d*)/i)?.[1]; // Extract index if available
          const programGroup = {
            PROGRAM: item[key],
            RECD_QTY: item[`RECD QTY${programIndex ? ` ${programIndex}` : ""}`] || 0,
            DC_NO: item[`DC NO${programIndex ? ` ${programIndex}` : ""}`] || "",
            DATE: item[`DATE${programIndex ? ` ${programIndex}` : ""}`] || "",
            REF: item[`REF${programIndex ? ` ${programIndex}` : ""}`] || "",
          };
  
          // Add to PROGRAMS if PROGRAM has a value
          if (programGroup.PROGRAM) {
            transformedItem.PROGRAMS.push(programGroup);
          }
        }
      });
  
      console.log(`Row ${rowIndex + 1} Transformed Data:`, transformedItem);
      return transformedItem;
    });
  };
  
  

  const parseFile = () => {
    if (!file) {
      alert("Please upload a file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      // console.log(jsonData);
      console.log(cleanHeaders(jsonData));
      

      // Transform the data
      const transformedData = transformData(jsonData);
      setParsedData(transformedData);
    };
    reader.readAsBinaryString(file);
  };

  const cleanHeaders = (data: any[]) => {
    return data.map((row) => {
      const cleanedRow: any = {};
      Object.keys(row).forEach((key) => {
        // Trim the spaces from the key
        const cleanedKey = key.trim();
        cleanedRow[cleanedKey] = row[key];
      });
      return cleanedRow;
    });
  };

  const sendDataToAPI = async () => {
    if (parsedData.length === 0) {
      alert("No data to send! Please parse the file first.");
      return;
    }

    try {
      const response = await axios.post("/api/upload", { data: parsedData });
      alert("Data sent successfully!");
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error sending data to API:", error);
      alert("Failed to send data.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Import File and Send Data</h1>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={parseFile} style={{ marginLeft: "10px" }}>
        Parse File
      </button>

      <button onClick={sendDataToAPI} style={{ marginLeft: "10px" }}>
        Send to API
      </button>

      {parsedData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Parsed Data Preview:</h3>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ImportFile;
