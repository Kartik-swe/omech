'use client';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Table, Tooltip, Empty, message, Popconfirm, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { apiClient } from '@/utils/apiClient';
import { getCookieData } from '@/utils/common';

const { TextArea } = Input;

export interface ScheduleProps {
isMoOpen : boolean;
setIsMoOpen: (isOpen: boolean) => void;
SCHEDULE_SRNO?: number | null; // <-- Add this
}


type OptionType = {
    value: string | number;
    label: string;
};

type ScheduleItem = {
    key: number;
    SCHEDULE_DT_SRNO: string | number | null;
    OD_SRNO: string | number | null;
    THICKNESS_SRNO: string | number | null;
    GRADE_SRNO: string | number | null;
    LENGTH: string;
    QUANTITY: string;
    STATUS_SRNO: string | number | null;
    isInvalid?: boolean; // <-- New field

};


export default function ScheduleModal({isMoOpen, setIsMoOpen, SCHEDULE_SRNO } : ScheduleProps) {
    const cookiesData = getCookieData();
    const { USER_SRNO, API_BASE_URL, UT_SRNO } = cookiesData;
    const [form] = Form.useForm();
    const [items, setItems] = useState<ScheduleItem[]>([]);
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [editCache, setEditCache] = useState<ScheduleItem | null>(null);

    // CSV Import
    const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;
            // Simple CSV parsing (expects header row)
            const lines = text.split('\n').filter(Boolean);
            if (lines.length < 2) {
                message.error('CSV must have header and at least one row.');
                return;
            }
            const header = lines[0].split(',').map(h => h.trim().toUpperCase());
            const requiredHeaders = ['OD', 'THICKNESS', 'GRADE', 'LENGTH', 'NOS'];
            const missing = requiredHeaders.filter(h => !header.includes(h));
            if (missing.length) {
                message.error(`Missing columns: ${missing.join(', ')}`);
                return;
            }
            const newItems: ScheduleItem[] = lines.slice(1).map((line, idx) => {
                const values = line.split(',').map(v => v.trim());
                const obj: any = {};
                header.forEach((h, i) => { obj[h] = values[i]; });

                const od = odOptions.find(opt => opt.label === obj['OD']);
                const thickness = thicknessOptions.find(opt => opt.label === obj['THICKNESS']);
                const grade = gradeOptions.find(opt => opt.label === obj['GRADE']);

                const isInvalid = !(od && thickness && grade); // check if any is missing

                return {
                    key: Date.now() + idx,
                    SCHEDULE_DT_SRNO: null,
                    OD_SRNO: od?.value || null,
                    THICKNESS_SRNO: thickness?.value || null,
                    GRADE_SRNO: grade?.value || null,
                    LENGTH: obj['LENGTH'] || '',
                    QUANTITY: obj['NOS'] || '',
                    STATUS_SRNO: null,
                    isInvalid,
                };
            });

            setItems(prev => [...prev, ...newItems]);
            message.success('CSV imported!');
        };
        reader.readAsText(file);
        // Reset input value so same file can be uploaded again
        e.target.value = '';
    };
    const [odOptions, setOdOptions] = useState<OptionType[]>([]);
    const [thicknessOptions, setThicknessOptions] = useState<OptionType[]>([]);
    const [gradeOptions, setGradeOptions] = useState<OptionType[]>([]);


        useEffect(() => {
    

    if (isMoOpen) {
        FetchPlCommon();
        fetchSchedule();
    }
    }, [SCHEDULE_SRNO, isMoOpen]);

    const addItem = () => {
        const newItem: ScheduleItem = {
            key: Date.now(),
            SCHEDULE_DT_SRNO: null,
            OD_SRNO: null,
            THICKNESS_SRNO: null,
            GRADE_SRNO: null,
            LENGTH: '',
            QUANTITY: '',
            STATUS_SRNO: null,
        };
        setItems(prev => [...prev, newItem]);
        setEditingKey(newItem.key);
        setEditCache(newItem);
    };

    const removeItem = (key: number) => {
        if (editingKey === key) {
            setEditingKey(null);
            setEditCache(null);
        }
        setItems(prev => prev.filter(item => item.key !== key));
    };

    // Start editing a row
    const editItem = (item: ScheduleItem) => {
        setEditingKey(item.key);
        setEditCache({ ...item });
    };

    // Cancel editing, discard changes
    const cancelEdit = () => {
        setEditingKey(null);
        setEditCache(null);
    };

    const handleCancel = () => {
  setIsMoOpen(false);
  form.resetFields();
  setItems([]);
  setEditingKey(null);
  setEditCache(null);
};

    // Fetch common options for OD, Thickness, and Grade
    // Function to fetch common dropdown options
      const FetchPlCommon = async () => {
        const response = await apiClient<Record<string, any>>(`${API_BASE_URL}Pl_Common?USER_SRNO=${USER_SRNO}&UT_SRNO=${UT_SRNO}&TBL_SRNO=1,2,3`, 'GET');
        if (response.msgId === 200) {
          if (!response.data) { return; }
          const { Table1, Table2, Table3 } = response.data;
          setGradeOptions(Table1)
          setOdOptions(Table2)
          setThicknessOptions(Table3)
        } else {
          message.error(response.msg)
          console.error('API Error:', response.msg);  // Logging the error message
        }
      };

    // Fetch existing schedule data if SCHEDULE_SRNO is provided
     const fetchSchedule = async () => {
    if (!SCHEDULE_SRNO) return;

    try {
      const response = await apiClient(
        `${API_BASE_URL}dispSchedule?SCHEDULE_SRNO=${SCHEDULE_SRNO}&USER_SRNO=${USER_SRNO}`,
        'GET'
      );

      if (response.msgId === 200) {
        const { Table: masterData, Table1: detailData } = response.data;

        if (masterData?.length) {
          const master = masterData[0];
          form.setFieldsValue({
            PARTY_NAME: master.PARTY_NAME,
            PO_NUMBER: master.PO_NUMBER,
            SCHEDULE_DATE: master.SCHEDULE_DATE ? dayjs(master.SCHEDULE_DATE) : null,
            ESTIMATED_DELIVERY_DATE: master.ESTIMATED_DELIVERY_DATE ? dayjs(master.ESTIMATED_DELIVERY_DATE) : null,
            REMARKS: master.REMARKS,
          });
        }

        if (detailData?.length) {
          const detailItems: ScheduleItem[] = detailData.map((item: any, idx: number) => ({
            key: Date.now() + idx,
            SCHEDULE_DT_SRNO: item.SCHEDULE_DT_SRNO,
            OD_SRNO: item.OD_SRNO,
            THICKNESS_SRNO: item.THICKNESS_SRNO,
            GRADE_SRNO: item.GRADE_SRNO,
            LENGTH: item.LENGTH,
            QUANTITY: item.QUANTITY,
            STATUS_SRNO: item.STATUS_SRNO,
          }));
          setItems(detailItems);
        }
      } else {
        message.error(response.msg);
      }
    } catch (error) {
      message.error("Error loading schedule for edit.");
    }
  };

    // Save changes from editCache to items list
    const saveEdit = () => {
        if (!editCache) return;

        // Basic validation example:
        if (
            !editCache.OD_SRNO ||
            !editCache.THICKNESS_SRNO ||
            !editCache.GRADE_SRNO ||
            !editCache.LENGTH ||
            !editCache.QUANTITY
        ) {
            message.error('Please fill all fields before saving.');
            return;
        }

        setItems(prev =>
            prev.map(item => (item.key === editCache.key ? editCache : item))
        );
        setEditingKey(null);
        setEditCache(null);
    };

    // Change handler for editCache fields
    const handleEditChange = (field: keyof ScheduleItem, value: any) => {
        if (!editCache) return;
        setEditCache({ ...editCache, [field]: value });
    };

    const onFinish = async (values: Record<string, any>) => {
        if (editingKey !== null) {
            message.warning('Please save or cancel the current edit before submitting.');
            return;
        }

        const payload = {
            ...values,
            IU_FLAG: SCHEDULE_SRNO ? 'U' : 'I',
            SCHEDULE_SRNO: SCHEDULE_SRNO || undefined,
            DETAIL_JSON: items,
            USER_SRNO,
            UT_SRNO,
            };


        try {
            const response = await apiClient(`${API_BASE_URL}IuSchedule`, 'POST', payload);
            if (response.msgId === 200) {
                console.log('Submit payload:', payload);
            message.success('PO submitted successfully!');
            form.resetFields();
            setItems([]);
            } else {
                message.error(response.msg);
                console.error("API Error:", response.msg);
            }
            
            // Submit to API here
        } catch (error) {
            message.error('Failed to submit PO.');
        }
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            width: 50,
            align: 'center' as const,
            render: (_: any, __: ScheduleItem, idx: number) => idx + 1,
        },
        {
            title: 'OD',
            dataIndex: 'OD_SRNO',
            render: (_: any, record: ScheduleItem) => {
                if (editingKey === record.key && editCache) {
                    return (
                        <Select
                            value={editCache.OD_SRNO}
                            onChange={val => handleEditChange('OD_SRNO', val)}
                            style={{ width: '100%' }}
                            placeholder="Select OD"
                        >
                            {odOptions.map(opt => (
                                <Select.Option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
                const label = odOptions.find(o => o.value === record.OD_SRNO)?.label || '-';
                return label;
            },
        },
        {
            title: 'Thickness',
            dataIndex: 'THICKNESS_SRNO',
            render: (_: any, record: ScheduleItem) => {
                if (editingKey === record.key && editCache) {
                    return (
                        <Select
                            value={editCache.THICKNESS_SRNO}
                            onChange={val => handleEditChange('THICKNESS_SRNO', val)}
                            style={{ width: '100%' }}
                            placeholder="Select Thickness"
                        >
                            {thicknessOptions.map(opt => (
                                <Select.Option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
                const label = thicknessOptions.find(o => o.value === record.THICKNESS_SRNO)?.label || '-';
                return label;
            },
        },
        {
            title: 'Grade',
            dataIndex: 'GRADE_SRNO',
            render: (_: any, record: ScheduleItem) => {
                if (editingKey === record.key && editCache) {
                    return (
                        <Select
                            value={editCache.GRADE_SRNO}
                            onChange={val => handleEditChange('GRADE_SRNO', val)}
                            style={{ width: '100%' }}
                            placeholder="Select Grade"
                        >
                            {gradeOptions.map(opt => (
                                <Select.Option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
                const label = gradeOptions.find(o => o.value === record.GRADE_SRNO)?.label || '-';
                return label;
            },
        },
        {
            title: 'Length',
            dataIndex: 'LENGTH',
            render: (_: any, record: ScheduleItem) => {
                if (editingKey === record.key && editCache) {
                    return (
                        <Input
                            value={editCache.LENGTH}
                            onChange={e => handleEditChange('LENGTH', e.target.value)}
                            placeholder="Enter length"
                            type="number"
                            min={0}
                        />
                    );
                }
                return record.LENGTH || '-';
            },
        },
        {
            title: 'Quantity',
            dataIndex: 'QUANTITY',
            render: (_: any, record: ScheduleItem) => {
                if (editingKey === record.key && editCache) {
                    return (
                        <Input
                            value={editCache.QUANTITY}
                            onChange={e => handleEditChange('QUANTITY', e.target.value)}
                            placeholder="Enter quantity"
                            type="number"
                            min={1}
                        />
                    );
                }
                return record.QUANTITY || '-';
            },
        },
        {
            title: 'Action',
            align: 'center' as const,
            render: (_: any, record: ScheduleItem) => {
                if (editingKey === record.key) {
                    return (
                        <>
                            <Tooltip title="Save">
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={saveEdit}
                                    style={{ marginRight: 8 }}
                                />
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Button icon={<CloseOutlined />} onClick={cancelEdit} />
                            </Tooltip>
                        </>
                    );
                }
                return (
                    <>
                        <Tooltip title="Edit">
                            <Button
    icon={<EditOutlined />}
    onClick={() => editingKey === null && editItem(record)}
    disabled={editingKey !== null}
/>

                        </Tooltip>
                        <Tooltip title="Remove this item">
                            <Popconfirm title="Are you sure to delete this?" onConfirm={() => removeItem(record.key)}>
    <Button danger icon={<DeleteOutlined />} />
</Popconfirm>

                        </Tooltip>
                    </>
                );
            },
        },
    ];

    return (
        <Modal
            open={isMoOpen}
            width={1000}
            title="Add PO"    
            onCancel={handleCancel}
            footer={null}
        >

        
        <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            style={{
                maxWidth: 900,
                margin: '0 auto',
                padding: 24,
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px #f0f1f2',
            }}
        >
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <Form.Item
                    name="PARTY_NAME"
                    label="Party Name"
                    rules={[{ required: true }]}
                    style={{ flex: 1, minWidth: 220 }}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="PO_NUMBER"
                    label="PO Number"
                    rules={[{ required: true }]}
                    style={{ flex: 1, minWidth: 220 }}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="SCHEDULE_DATE"
                    label="PO Date"
                    rules={[{ required: true }]}
                    style={{ flex: 1, minWidth: 220 }}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="ESTIMATED_DELIVERY_DATE"
                    label="Estimated Delivery Date"
                    style={{ flex: 1, minWidth: 220 }}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
            </div>
            <Form.Item name="REMARKS" label="Remarks">
                <TextArea rows={2} />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <Button icon={<PlusOutlined />} onClick={addItem} type="dashed" disabled={editingKey !== null}>
    Add PO Item
</Button>
            <label htmlFor="csv-upload" style={{ marginLeft: 12 }}>
                <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={handleCSVImport}
                    disabled={editingKey !== null}
                />
                <Button
                    icon={<PlusOutlined />}
                    type="default"
                    disabled={editingKey !== null}
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                        // trigger file input
                        document.getElementById('csv-upload')?.click();
                    }}
                >
                    Import CSV
                </Button>
            </label>

            </div>

            <Table
                columns={columns}
                dataSource={items}
                pagination={false}
                rowKey="key"
                style={{
                    marginBottom: 24,
                    border: '1px solid #f0f0f0',
                    borderRadius: 6,
                    overflow: 'hidden',
                }}
                scroll={{ x: true }}
                rowClassName={(_, idx) => {
    const item = items[idx];
    if (item?.isInvalid) return 'table-row-error';
    return idx % 2 === 0 ? 'table-row-light' : 'table-row-dark';
}}

                locale={{
                    emptyText: <Empty description="No PO items. Click 'Add PO Item' to begin." />,
                }}
            />

            <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" disabled={editingKey !== null}>
                    Submit PO
                </Button>
            </Form.Item>

           
             {/* 👇 Add styles here at the bottom of your component */}
      <style jsx global>{`
        .table-row-light {
          background: #fafafa;
        }
        .table-row-dark {
          background: #fff;
        }
        .table-row-error {
          background: #fff1f0 !important; /* light red */
        }
        .ant-table-tbody > tr:hover > td {
          background: #e6f7ff !important;
        }
      `}</style>
        </Form>
        </Modal>
    );
}


