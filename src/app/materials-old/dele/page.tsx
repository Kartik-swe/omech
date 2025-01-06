"use client";

import React, { useState } from "react";
import { Upload, Button, Table, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { log } from "node:console";

const SheetPage = () => {
  const [fileData, setFileData] = useState<any[]>([]);
  const [newEntries, setNewEntries] = useState<any[]>([]);
  const [updatedEntries, setUpdatedEntries] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Function to handle file upload and read its content
  const handleFileUpload = async (file: any) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (content) {
          const parsedData = JSON.parse(content as string);
          setFileData(parsedData);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      message.error("Failed to read the file. Please upload a valid JSON file.");
    }
    return false; // Prevent Ant Design from auto-uploading the file
  };

  // Function to process the file via the API
  const processFileData = async () => {
    if (fileData.length === 0) {
      message.warning("Please upload and select a file before proceeding.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/Matarials/sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileData }),
      });

      const result = await response.json();
      console.log(result);
      
      if (response.ok) {
        setNewEntries(result.newEntries);
        setUpdatedEntries(result.updatedEntries);
        setIsModalVisible(true); // Show confirmation modal
      } else {
        message.error(result.message || "Failed to process the file.");
      }
    } catch (error) {
      message.error("An error occurred while processing the file.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user confirmation
  const handleConfirm = async () => {
    setConfirmLoading(true);
    const payload = { newEntries, updatedEntries };
    try {
      const response = await axios.post("/api/Matarials/sheet/finalize", {
        payload
      });
      console.log("kartik",response);
      if (response.status === 200) {
        message.success("Entries successfully updated!");
        setIsModalVisible(false);
      } else {
        message.error("Failed to update entries.");
      }
    } catch (error) {
      console.error(error);
      // message.error("An error occurred while updating entries.");
    } finally {
      setConfirmLoading(false);
      setIsModalVisible(false);

    }
    message.success("Changes confirmed successfully!");
    // Optional: Call an API to finalize the changes here
  };

  // Function to handle user cancellation
  const handleCancel = () => {
    setIsModalVisible(false);
    message.info("Changes were not applied.");
  };

  // Table columns for new and updated entries
  const columns = [
    { title: "Challan No", dataIndex: "CHALLAN_NO", key: "CHALLAN_NO" },
    { title: "Material Grade", dataIndex: "MATERIAL_GRADE", key: "MATERIAL_GRADE" },
    { title: "Material Weight", dataIndex: "MATERIAL_WEIGHT", key: "MATERIAL_WEIGHT" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Import and Process File</h1>

      {/* Upload File */}
      <Upload
        accept=".json"
        beforeUpload={handleFileUpload}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Upload File</Button>
      </Upload>

      {/* Process File Button */}
      <Button
        type="primary"
        onClick={processFileData}
        disabled={fileData.length === 0}
        loading={loading}
        style={{ marginTop: "20px" }}
      >
        Process File
      </Button>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Changes"
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
        width={800}
        confirmLoading={confirmLoading}
      >
        <h3>New Entries</h3>
        <Table
          dataSource={newEntries}
          columns={columns}
          rowKey="CHALLAN_NO"
          pagination={{ pageSize: 5 }}
        />

        <h3>Updated Entries</h3>
        <Table
          dataSource={updatedEntries}
          columns={columns}
          rowKey="CHALLAN_NO"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default SheetPage;
