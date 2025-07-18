// schedule/page.tsx
'use client';
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import ScheduleModal from "@/app/components/schedule";
import { Button, Card, Col, Form, Input, message, Popconfirm, Row, Select, Table, Tooltip, DatePicker, Tag } from "antd";
const { Option } = Select;
const { RangePicker } = DatePicker;
import { useEffect, useState } from "react";

import { getCookieData } from '@/utils/common';
import { apiClient } from '@/utils/apiClient';
// top
import DispatchModal from "@/app/components/dispatchSchedule";


export default function SchedulePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editScheduleSrno, setEditScheduleSrno] = useState<number | null>(null);
const [form] = Form.useForm();
const [isDispatchOpen, setIsDispatchOpen] = useState(false);
const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'PIPE' | 'COIL' | 'SHEET' | null>('PIPE');


     const { API_BASE_URL, USER_SRNO } = getCookieData();
        const [loading, setLoading] = useState(false);
        const [schedules, setSchedules] = useState<any[]>([]);
    
        useEffect(() => {
            form.setFieldsValue({ ITEM_TYPE: 'PIPE' });
            fetchSchedules();
        }, []);
        // Default itemType

        useEffect(() => {
            if (!isModalOpen) {
                fetchSchedules();
            }
        }, [isModalOpen]);
    
        const fetchSchedules = async () => {
  setLoading(true);
  try {
    const values = form.getFieldsValue();
    const { ENTRY_DATE, DELIVERY_DATE, ...rest } = values;

    const filters: any = {
      ...rest,
    };

    if (ENTRY_DATE && ENTRY_DATE.length === 2) {
      filters.ENTRY_DATE_FROM = ENTRY_DATE[0]?.format('YYYY-MM-DD');
      filters.ENTRY_DATE_TO = ENTRY_DATE[1]?.format('YYYY-MM-DD');
    }

    if (DELIVERY_DATE && DELIVERY_DATE.length === 2) {
      filters.DELIVERY_DATE_FROM = DELIVERY_DATE[0]?.format('YYYY-MM-DD');
      filters.DELIVERY_DATE_TO = DELIVERY_DATE[1]?.format('YYYY-MM-DD');
    }

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );

    const stringFilters = Object.fromEntries(
      Object.entries(cleanedFilters).map(([k, v]) => [k, String(v)])
    );

    const queryParams = new URLSearchParams(stringFilters).toString();
    const res = await apiClient(`${API_BASE_URL}DtSchedule?${queryParams}`, 'GET');
    setSchedules(res.data.Table || []);
  } catch (err) {
    message.error('Failed to load schedules.');
  } finally {
    setLoading(false);
  }
};


    
        const handleDelete = async (SCHEDULE_SRNO: any) => {
            try {
                const res = await apiClient(`${API_BASE_URL}DelSchedule?SCHEDULE_SRNO=${SCHEDULE_SRNO}&USER_SRNO=${USER_SRNO}`, 'DELETE');
                if (res.msgId === 200) {
                    message.success('Schedule deleted');
                    fetchSchedules();
                } else {
                    message.error(res.msg);
                }
            } catch (err) {
                message.error('Failed to delete schedule.');
            }
        };
    
       const handleEdit = (SCHEDULE_SRNO: number) => {
  setEditScheduleSrno(SCHEDULE_SRNO);
  setIsModalOpen(true);
};

    
        const columns = [
            {
                title: 'Party Name',
                dataIndex: 'PARTY_NAME',
            },
            {
                title: 'PO Number',
                dataIndex: 'PO_NUMBER',
            },
            {
                title: 'PO Date',
                dataIndex: 'SCHEDULE_DATE',
            },
           {
  title: 'Est. Delivery Date',
  dataIndex: 'ESTIMATED_DELIVERY_DATE',
  render: (date:any,record:any) => {
    const isUrgent = record.IS_URGENT_DELIVERY === 'Y';
    return (
       <Tag color={isUrgent ? 'red' : 'default'}>
        {record.ESTIMATED_DELIVERY_DATE}
      </Tag>
    );
  },
},

             {
    title: 'Total Ordered',
    children: [
      {
        title: 'Qty',
        dataIndex: 'T_ORDER_QTY',
        key: 't_order_qty',
        align: 'center',
        width: 80,
      },
      {
        title: 'Wt (kg)',
        dataIndex: 'T_ORDER_WEIGHT',
        key: 't_order_weight',
        align: 'center',
        width: 100,
      },
    ],
  },
        //  {
//   title: 'Total Ordered',
//   align: 'center',
//   render: (item: any) => {
//     if (item.ITEM_TYPE === 'PIPE') {
//       return (
//         <div style={{ textAlign: 'center' }}>
//           <div>Qty: <b>{item.T_ORDER_QTY}</b></div>
//           <div>Wt: <b>{item.T_ORDER_WEIGHT} kg</b></div>
//         </div>
//       );
//     } else {
//       return (
//         <div style={{ textAlign: 'center' }}>
//           <div>Wt: <b>{item.T_ORDER_WEIGHT} kg</b></div>
//         </div>
//       );
//     }
//   },
// },

            // {
            //     title: 'ITEM Type',
            //     dataIndex: 'ITEM_TYPE',
            //     hidden: true, // Hide this column by default
            // },
             {
    title: 'Status',
    dataIndex: 'STATUS_NAME',
    key: 'STATUS_NAME',
    render: (text: string, record: any) => {
        let color = '';

        switch (record.STATUS_SRNO) {
            case 11:
                color = 'orange'; // Pending
                break;
            case 12:
                color = 'green'; // Completed
                break;
            case 13:
                color = 'red'; // Closed
                break;
            default:
                color = 'default';
        }

        return <Tag color={color}>{text}</Tag>;
    }
},

            {
                title: 'Actions',
                render: (_: any, record: any) => (
                    <>
                        <Tooltip title="Edit">
                            <Button icon={<EditOutlined />} onClick={() => handleEdit(record.SCHEDULE_SRNO)} />
                        </Tooltip>
                        <Popconfirm
                            title="Are you sure to delete?"
                            onConfirm={() => handleDelete(record.SCHEDULE_SRNO)}
                        >
                            <Tooltip title="Delete">
                                <Button danger icon={<DeleteOutlined />} style={{ marginLeft: 8 }} />
                            </Tooltip>
                        </Popconfirm>
                         <Tooltip title="Dispatch">
                    <Button
                        icon={<PlusOutlined />}
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                            setSelectedSchedule(record.SCHEDULE_SRNO);
                            setIsDispatchOpen(true);
                            setSelectedItemType(record.ITEM_TYPE); 
                        }}
                    />
                </Tooltip>
                    </>
                ),
            },
        ];
    
        
  return (
    <>
    <Card title="Purchases Ordered" bordered={false} style={{ margin: 20 }}
    extra={<>
       
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Add PO
                  </Button>
                  </>
                }
                >
                      {/* 🔍 Search Filters */}
<Form
  form={form}
  layout="vertical"
  onFinish={fetchSchedules}
  style={{ marginBottom: 24 }}
>
  <Row gutter={16}>
    <Col>
      <Form.Item label="Item Type" name="ITEM_TYPE">
        <Select style={{ width: 150 }}>
          <Option value="PIPE">PIPE</Option>
          <Option value="COIL">COIL</Option>
          <Option value="SHEET">SHEET</Option>
        </Select>
      </Form.Item>
    </Col>
     <Col>
    <Form.Item label="Party Name" name="PARTY_NAME">
      <Input placeholder="Party Name" />
    </Form.Item>
  </Col>

    <Col>
      <Form.Item label="PO Entry Date" name="ENTRY_DATE">
        <RangePicker />
      </Form.Item>
    </Col>
    <Col>
      <Form.Item label="Est. Delivery Date" name="DELIVERY_DATE">
        <RangePicker />
      </Form.Item>
    </Col>
    <Col>
      <Form.Item label="Status" name="STATUS_SRNO">
        <Select allowClear style={{ width: 150 }} placeholder="Select Status">
          <Option value="11">Pending</Option>
          <Option value="12">Completed</Option>
          <Option value="13">Closed</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col>
      <Form.Item label=" " colon={false}>
        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
    </Col>
    <Col>
      <Form.Item label=" " colon={false}>
        <Button
          onClick={() => {
            form.resetFields();
            form.setFieldsValue({ ITEM_TYPE: 'PIPE' }); // reset to default
            fetchSchedules(); // Unfiltered
          }}
        >
          Reset
        </Button>
      </Form.Item>
    </Col>
  </Row>
</Form>

                   <Table
                columns={columns}
                dataSource={schedules}
                loading={loading}
                rowKey="SCHEDULE_DT_SRNO"
                bordered
            />
                </Card>
                    <ScheduleModal
  isMoOpen={isModalOpen}
  setIsMoOpen={(open) => {
    setIsModalOpen(open);
    if (!open) setEditScheduleSrno(null); // Reset on close
  }}
  SCHEDULE_SRNO={editScheduleSrno}
/>
{isDispatchOpen && selectedSchedule && (
  <DispatchModal
    isOpen={isDispatchOpen}
    setIsOpen={(open:any) => {
      setIsDispatchOpen(open);
      if (!open) setSelectedSchedule(null);
    }}
    itemType={selectedItemType}
    setItemType={setSelectedItemType}
    SCHEDULE_SRNO={selectedSchedule}
/>
)}



                </>
  )
}
