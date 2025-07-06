'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Tooltip, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { apiClient } from '@/utils/apiClient';
import { useRouter } from 'next/navigation';
import { getCookieData } from '@/utils/common';
import SchedulePage from '../schedule/page';

export default function ScheduleListPage() {
    const { API_BASE_URL, USER_SRNO } = getCookieData();
    const [loading, setLoading] = useState(false);
    const [schedules, setSchedules] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchSchedules();
    }, []);

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

    const handleDelete = async (SCHEDULE_DT_SRNO: number) => {
        try {
            const res = await apiClient(`${API_BASE_URL}DelSchedule`, 'POST', {
                SCHEDULE_DT_SRNO,
                USER_SRNO
            });
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

    const handleEdit = (SCHEDULE_DT_SRNO: number) => {
        router.push(`/Schedule/edit/${SCHEDULE_DT_SRNO}`);
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
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
            <h2>Schedule List</h2>
            <Table
                columns={columns}
                dataSource={schedules}
                loading={loading}
                rowKey="SCHEDULE_DT_SRNO"
                bordered
            />
            
            {/* Add Modall For Scheule Entry */}
            <Modal 
                title="Add Schedule"
                visible={false} // This should be controlled by a state variable
                onCancel={() => {}} // Handle cancel action
                footer={null}   
            >
                {/* Schedule form component should be placed here */}
            <SchedulePage></SchedulePage>
            </Modal>
        </div>
    );
}
