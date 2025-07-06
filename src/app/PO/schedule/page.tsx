// schedule/page.tsx
'use client';
import { PlusOutlined, DeleteOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import ScheduleModal from "@/app/components/schedule";
import { Button, Card, message, Popconfirm, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";

import { getCookieData } from '@/utils/common';
import { apiClient } from '@/utils/apiClient';
// top
import DispatchModal from "@/app/components/dispatchSchedule";


export default function SchedulePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editScheduleSrno, setEditScheduleSrno] = useState<number | null>(null);

const [isDispatchOpen, setIsDispatchOpen] = useState(false);
const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

     const { API_BASE_URL, USER_SRNO } = getCookieData();
        const [loading, setLoading] = useState(false);
        const [schedules, setSchedules] = useState<any[]>([]);
    
        useEffect(() => {
            fetchSchedules();
        }, []);
        useEffect(() => {
            if (!isModalOpen) {
                fetchSchedules();
            }
        }, [isModalOpen]);
    
        const fetchSchedules = async () => {
            setLoading(true);
            try {
                const res = await apiClient(`${API_BASE_URL}DtSchedule?USER_SRN0=${USER_SRNO}`, 'GET');
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
                title: 'Schedule Date',
                dataIndex: 'SCHEDULE_DATE',
            },
            {
                title: 'Est. Delivery Date',
                dataIndex: 'ESTIMATED_DELIVERY_DATE',
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
            {
                title: 'Remarks',
                dataIndex: 'REMARKS',
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
                        }}
                    />
                </Tooltip>
                    </>
                ),
            },
        ];
    
        
  return (
    <>
    <Card title="Schedules" bordered={false} style={{ margin: 20 }}
    extra={<>
       
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Add PO
                  </Button>
                  </>
                }
                >
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
    SCHEDULE_SRNO={selectedSchedule}
/>
)}



                </>
  )
}
