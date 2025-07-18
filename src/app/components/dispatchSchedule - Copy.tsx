'use client';

import { useState, useEffect } from 'react';
import {
  Card, Table, Button, InputNumber, Input, message, Modal,
  Descriptions, Typography, Tag, Spin,
  Popconfirm,
  Tooltip
} from 'antd';

import { CloseCircleOutlined, RedoOutlined, StopOutlined } from '@ant-design/icons';

import type { ColumnsType } from 'antd/es/table';
import { apiClient } from '@/utils/apiClient';
import { getCookieData } from '@/utils/common';
import { Console } from 'console';

const { Text } = Typography;

interface DispatchModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  SCHEDULE_SRNO: number;
}

interface DispatchHistory {
  DISPATCH_SRNO: number;
  DISPATCH_DATE: string;
  DISPATCH_QTY: number;
  REJECTED_QTY : number;
  REJECTED_REMARK?: string;
}

interface DispatchItem {
  SCHEDULE_DT_SRNO: number;
  ITEM_NAME: string;
  OD: string;
  THICKNESS: string;
  GRADE: string;
  LENGTH: string;
  ORDERED_WEIGHT : number;
  ORDERED_QTY: number;
  DISPATCHED_QTY: number;
  DISPATCHED_WEIGHT : number;
  REMAINING_QTY: number;
  REMAINING_WEIGHT : number;
  REJECTED_QTY: number;
  REJECTED_WEIGHT : number;
  IS_CLOSED: string;
  STATUS_FLAG : string;
  STATUS_NAME: string;
  DISPATCH_HISTORY?: DispatchHistory[];
}

interface PoData {
  PO_NUMBER: string;
  PARTY_NAME: string;
  SCHEDULE_DATE: string;
  items: DispatchItem[];
}

const DispatchModal: React.FC<DispatchModalProps> = ({ isOpen, setIsOpen, SCHEDULE_SRNO }) => {
  const { USER_SRNO, API_BASE_URL, UT_SRNO } = getCookieData();

  const [poData, setPoData] = useState<PoData | null>(null);
  const [dispatchQty, setDispatchQty] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingRow, setEditingRow] = useState<string | null>(null);
const [editedQty, setEditedQty] = useState<number | null>(null);
// const [rejectedQty, setrejectedQty] = useState<number | null>(null);
// const [rejectionRemark, setRejectionRemark] = useState<string>('');

const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
const [rejectItem, setRejectItem] = useState<DispatchItem | null>(null);
const [rejectedQty, setRejectedQty] = useState<number | null>(null);
const [rejectionRemark, setRejectionRemark] = useState<string>('');


  useEffect(() => {
    if (isOpen && SCHEDULE_SRNO) fetchDispatchSchedule();
  }, [isOpen, SCHEDULE_SRNO]);

  const fetchDispatchSchedule = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}dispDispatchSchedule?SCHEDULE_SRNO=${SCHEDULE_SRNO}&USER_SRNO=${USER_SRNO}`;
      const res = await apiClient(url, 'GET');

      if (res.msgId === 200 && res.data) {
        const { Table, Table1,Table2 } = res.data;
        const mappedData: PoData = {
          PO_NUMBER: Table[0].PO_NUMBER,
          PARTY_NAME: Table[0].PARTY_NAME,
          SCHEDULE_DATE: Table[0].SCHEDULE_DATE,
          items: Table1?.map((item: any) => ({
            SCHEDULE_DT_SRNO: item.SCHEDULE_DT_SRNO,
            ITEM_NAME: item.ITEM_NAME,
            OD: item.OD,
            THICKNESS: item.THICKNESS,
            GRADE: item.GRADE,
            LENGTH: item.LENGTH,
            ORDERED_QTY: item.ORDERED_QTY,
            ORDERED_WEIGHT: item.ORDERED_WEIGHT,
            DISPATCHED_QTY: item.DISPATCHED_QTY,
            DISPATCHED_WEIGHT: item.DISPATCHED_WEIGHT,
            REMAINING_QTY: item.REMAINING_QTY,
            REMAINING_WEIGHT: item.REMAINING_WEIGHT,
            REJECTED_QTY: item.REJECTED_QTY,
            REJECTED_WEIGHT: item.REJECTED_WEIGHT,
            IS_CLOSED: item.IS_CLOSED,
            STATUS_FLAG: item.STATUS_FLAG,
            STATUS_NAME: item.STATUS_NAME,
            DISPATCH_HISTORY: Table2?.filter((dispItem: any) => dispItem.SCHEDULE_DT_SRNO === item.SCHEDULE_DT_SRNO)
    .map((dispItem: any) => ({
            DISPATCH_SRNO : dispItem.DISPATCH_SRNO,
            DISPATCH_QTY: dispItem.DISPATCH_QTY,
            REJECTED_QTY: dispItem.REJECTED_QTY,
            DISPATCH_DATE: dispItem.  DISPATCH_DATE}))
          }))
        };
        console.log('Mapped Dispatch Data:', mappedData);
        setPoData(mappedData);
        setDispatchQty({});
      } else {
        message.error(res.msg || 'Failed to fetch dispatch schedule.');
      }
    } catch (err) {
      console.error(err);
      message.error('Error fetching dispatch schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (itemSrno: number, value: number | null) => {
    setDispatchQty((prev) => ({ ...prev, [itemSrno]: value || 0 }));
  };

  const handleDispatch = (item: DispatchItem) => {
    const qty = dispatchQty[item.SCHEDULE_DT_SRNO] || 0;
    const remaining = item.REMAINING_QTY || 0;

    if (qty < 1) return message.warning('Please enter a dispatch quantity greater than zero.');

    const doDispatch = async () => {
      setSaving(true);
      try {
        const payload = {
          IU_FLAG: 'I',
          USER_SRNO,
          SCHEDULE_SRNO,
          SCHEDULE_DT_SRNO: item.SCHEDULE_DT_SRNO,
          DISPATCH_QTY: qty,
          DISPATCH_SRNO: 0, // Assuming 0 for new dispatch
        };
        const res = await apiClient(`${API_BASE_URL}IUDispatch`, 'POST', payload);

        if (res.msgId === 200) {
          message.success(`Dispatched ${qty} of ${item.ITEM_NAME} successfully.`);
          setDispatchQty((prev) => ({ ...prev, [item.SCHEDULE_DT_SRNO]: 0 }));
          fetchDispatchSchedule();
        } else {
          message.error(res.msg || 'Dispatch failed.');
        }
      } catch (err) {
        console.error(err);
        message.error('Error dispatching item.');
      } finally {
        setSaving(false);
      }
    };

    if (qty > remaining) {
      Modal.confirm({
        title: 'Quantity exceeds remaining',
        content: `Entered quantity (${qty}) is more than remaining quantity (${remaining}). Do you want to continue?`,
        onOk: doDispatch,
        onCancel: () => message.info('Dispatch cancelled.'),
      });
    } else {
      doDispatch();
    }
  };

  // Handle edit dispatch history
const handleDispatchEdit = (record: DispatchHistory, rowKey: string) => {
  setEditingRow(rowKey);
  setEditedQty(record.DISPATCH_QTY);
  
};

const handleDispatchUpdate = async (record: DispatchHistory, item: DispatchItem) => {
  console.log('Updating dispatch:', record, item);
  if (editedQty == null || editedQty <= 0) {
    message.warning('Please enter a valid dispatch quantity.');
    return;
  }

  try {
    const payload = {
      IU_FLAG: 'U',
          USER_SRNO,
          SCHEDULE_SRNO,
          SCHEDULE_DT_SRNO: item.SCHEDULE_DT_SRNO,
          DISPATCH_QTY: editedQty,
          REJECTED_QTY: rejectedQty,
          DISPATCH_SRNO: record.DISPATCH_SRNO // Assuming 0 for new dispatch
    };

    const res = await apiClient(`${API_BASE_URL}IUDispatch`, 'POST', payload);

    if (res.msgId === 200) {
      message.success('Dispatch quantity updated.');
      fetchDispatchSchedule();
    } else {
      message.error(res.msg || 'Update failed.');
    }
  } catch (error) {
    console.error(error);
    message.error('Error while updating dispatch.');
  } finally {
    setEditingRow(null);
    setEditedQty(null);
   // setrejectedQty(null);
    setRejectionRemark('');
  }
};

const handleAddRejectedQty = (item: DispatchItem) => {
    if (!item.DISPATCH_HISTORY || item.DISPATCH_HISTORY.length === 0) {
    message.warning('No dispatch history found to add rejected quantity.');
    return;
  }

  setRejectItem(item);
  setRejectedQty(null);
  setRejectionRemark('');
  setIsRejectModalOpen(true);
};

const handleRejectQtySubmit = async (item:any, REJECTED_QTY:number, REJECTED_REMARK:string) => {
  try {
        if (!REJECTED_QTY || REJECTED_QTY <= 0) {
          message.warning('Please enter a valid rejected quantity.');
          return;
        }

        // if (!REJECTED_REMARK.trim()) {
        //   message.warning('Please enter a rejection remark.');
        //   return;
        // }

        // Close the modal
        setIsRejectModalOpen(false);

        // Call your API to submit the rejected quantity    

    setSaving(true);
        try {
          const payload = {
            IU_FLAG: 'I',
            SCHEDULE_SRNO,
            SCHEDULE_DT_SRNO: item.SCHEDULE_DT_SRNO,
            REJECTED_QTY: REJECTED_QTY,
            REJECTED_REMARK: REJECTED_REMARK,
            USER_SRNO,
            UT_SRNO,
          };
          const res = await apiClient(`${API_BASE_URL}IuPoItemsReject`, 'POST', payload);

          if (res.msgId === 200) {
                message.success('Rejected quantity recorded.');

            fetchDispatchSchedule();
          } else {
            message.error(res.msg || 'Failed to Add Rejected Quantity.');
          }
        } catch (err) {
          console.error(err);
          message.error('Error in rejected Quantity.');
        } finally {
          setSaving(false);
        }

    // 🔁 Replace this with your actual API call
  //  await apiClient.post('/api/reject-qty', payload);

    // Optionally refresh data here
  } catch (err) {
    message.error('Failed to submit rejected quantity.');
  }
};

// Opens the edit mode for adding rejected quantity for the latest dispatch entry (if any)
// function handleAddRejectedQty(item: DispatchItem): void {
//   if (!item.DISPATCH_HISTORY || item.DISPATCH_HISTORY.length === 0) {
//     message.warning('No dispatch history found to add rejected quantity.');
//     return;
//   }
//   // Edit the latest dispatch entry
//   const latestIndex = item.DISPATCH_HISTORY.length - 1;
//   const latestDispatch = item.DISPATCH_HISTORY[latestIndex];
//   const rowKey = `${item.SCHEDULE_DT_SRNO}-dispatch-${latestIndex}`;
//   setEditingRow(rowKey);
//   setEditedQty(latestDispatch.DISPATCH_QTY);
//   //setrejectedQty(latestDispatch.REJECTED_QTY ?? 0);
//   setRejectionRemark(latestDispatch.REJECTED_REMARK ?? '');
// }

  // Handle closing the dispatch order
const handleDispatchClose = async (item: DispatchItem) => {
        setSaving(true);
        try {
          const payload = {
            IU_FLAG: 'U',
            STATUS_FLAG: item.IS_CLOSED === 'Y' ? 'P' : 'C', // Toggle status
            USER_SRNO,
            SCHEDULE_SRNO,
            SCHEDULE_DT_SRNO: item.SCHEDULE_DT_SRNO,
          };
          const res = await apiClient(`${API_BASE_URL}IUPOStatus`, 'POST', payload);

          if (res.msgId === 200) {
            message.success(`Dispatch order ${item.IS_CLOSED === 'Y' ? 'reopened' : 'closed'} successfully.`);
            fetchDispatchSchedule();
          } else {
            message.error(res.msg || `Failed to ${item.IS_CLOSED === 'Y' ? 'reopen' : 'close'} dispatch order.`);
          }
        } catch (err) {
          console.error(err);
          message.error(`Error while ${item.IS_CLOSED === 'Y' ? 'reopening' : 'closing'} dispatch order.`);
        } finally {
          setSaving(false);
        }
      };

  const itemColumns: ColumnsType<DispatchItem> = [
    { title: 'OD', dataIndex: 'OD' },
    { title: 'THICKNESS', dataIndex: 'THICKNESS' },
    { title: 'GRADE', dataIndex: 'GRADE' },
    { title: 'LENGTH', dataIndex: 'LENGTH' },
    // { title: 'WEIGHT', dataIndex: 'WEIGHT' },
  // Grouped: Ordered
  {
    title: 'Ordered',
    render: (_, item) => (
      <div>
        Qty: {item.ORDERED_QTY}<br />
        Wt : {item.ORDERED_WEIGHT} kg
      </div>
    ),
  },
  {
    title: 'Dispatched',
    render: (_, item) => (
      <div>
        Qty: {item.DISPATCHED_QTY}<br />
        Wt : {item.DISPATCHED_WEIGHT} kg
      </div>
    ),
  },
  {
    title: 'Rejected',
    render: (_, item) => (
      <div>
        Qty: {item.REJECTED_QTY}<br />
        Wt : {item.REJECTED_WEIGHT} kg
      </div>
    ),
  },
 


      {
      title: 'Remaining',
      render: (_, item) => {
        const remaining = item.REMAINING_QTY;
        // Status color logic
        let color = 'default';
        let label = "Pending";
        if (item.STATUS_FLAG === 'C') {
          color = 'green';
          label = 'Completed';
        } else if (item.STATUS_FLAG === 'P') {
          color = 'blue';
          label = `Pending`;
        } else if (item.STATUS_FLAG === 'E') {
          color = 'red';
          label = `Closed`;
        } else {
          color = 'orange';
          label = "Pending";
        }
        return <>
            <Tag color={color}>{label} ({remaining})</Tag> <br /> Wt : {item.REMAINING_WEIGHT} kg

        </>
      },
    },
    {
      title: 'Dispatch Qty',
      render: (_, item) => {
        const remaining = item.REMAINING_QTY;
        const isCompleted = remaining <= 0;
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <InputNumber
              min={1}
              value={dispatchQty[item.SCHEDULE_DT_SRNO] || undefined}
              onChange={(val) => handleQtyChange(item.SCHEDULE_DT_SRNO, val)}
              style={{ width: 80 }}
              disabled={saving}
              placeholder="Qty"
            />
            <Tooltip title={item.IS_CLOSED === 'Y' ? 'Cannot dispatch, Order is Closed' : undefined}>
              <Button
                type="primary"
                onClick={() => handleDispatch(item)}
                disabled={saving || item.IS_CLOSED === 'Y'}
                loading={saving}
              >
                Dispatch
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      render: (_, item) => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Close Order Button */}
          {item.IS_CLOSED === 'N' && (
            <Popconfirm
              title="Are you sure you want to close this order?"
              onConfirm={() => handleDispatchClose(item)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Close this Order">
                <Button
                  type="primary"
                  icon={<CloseCircleOutlined style={{ color: '#cf1322' }} />}
                  danger
                  disabled={saving}
                >
                  Close
                </Button>
              </Tooltip>
            </Popconfirm>
          )}

          {/* Reopen Order Button */}
          {item.IS_CLOSED === 'Y' && (
            <Popconfirm
              title="Are you sure you want to reopen this order?"
              onConfirm={() => handleDispatchClose(item)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Reopen this Order">
                <Button
                  type="dashed"
                  icon={<RedoOutlined style={{ color: '#52c41a' }} />}
                  disabled={saving}
                >
                  Reopen
                </Button>
              </Tooltip>
            </Popconfirm>
          )}

          {/* Add Rejected Quantity Button */}
          <Tooltip title="Add Rejected Quantity">
            <Button
              icon={<StopOutlined style={{ color: '#fa8c16' }} />}
              type="default"
              onClick={() => handleAddRejectedQty(item)}
              disabled={saving}
            >
              Reject
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

//  const expandedRowRender = (item: DispatchItem) => (
//   <Table
//     size="small"
//     columns={[
//       {
//         title: 'Dispatch Date',
//         dataIndex: 'DISPATCH_DATE',
//         key: 'DISPATCH_DATE',
//         render: (text) => new Date(text).toLocaleDateString(),
//       },
//       {
//         title: 'Dispatch Quantity',
//         dataIndex: 'DISPATCH_QTY',
//         key: 'DISPATCH_QTY',
//         render: (text, record, index) => {
//           const rowKey = `${item.SCHEDULE_DT_SRNO}-dispatch-${index}`;
//           return editingRow === rowKey ? (
//             <InputNumber
//               min={1}
//               value={editedQty ?? 0}
//               onChange={(value) => setEditedQty(value ?? 0)}
//               style={{ width: '100%' }}
//             />
//           ) : (
//             text
//           );
//         },
//       },
//       {
//         title: 'Actions',
//         key: 'actions',
//         render: (text, record, index) => {
//           const rowKey = `${item.SCHEDULE_DT_SRNO}-dispatch-${index}`;
//           return editingRow === rowKey ? (
//             <Button type="link" onClick={() => handleDispatchUpdate(record, item)}>
//               Update
//             </Button>
//           ) : (
//             <Button type="link" onClick={() => handleDispatchEdit(record, rowKey)}>
//               Edit
//             </Button>
//           );
//         },
//       },
//     ]}
//     dataSource={item.DISPATCH_HISTORY || []}
//     rowKey={(_, index) => `${item.SCHEDULE_DT_SRNO}-dispatch-${index}`}
//     pagination={false}
//   />
// );

const expandedRowRender = (item: DispatchItem) => (
  <Table
    size="small"
    columns={[
      {
        title: 'Dispatch Date',
        dataIndex: 'DISPATCH_DATE',
        key: 'DISPATCH_DATE',
        render: (text) => new Date(text).toLocaleDateString(),
      },
      {
        title: 'Dispatch Quantity',
        dataIndex: 'DISPATCH_QTY',
        key: 'DISPATCH_QTY',
        render: (text, record, index) => {
          const rowKey = `${item.SCHEDULE_DT_SRNO}-dispatch-${index}`;
          return editingRow === rowKey ? (
            <InputNumber
              min={1}
              value={editedQty ?? record.DISPATCH_QTY}
              onChange={(value) => setEditedQty(value ?? 0)}
              style={{ width: '100%' }}
            />
          ) : (
            text
          );
        },
      },
      // {
      //   title: 'Rejected Quantity',
      //   dataIndex: 'REJECTED_QTY',
      //   key: 'REJECTED_QTY',
      //   render: (text, record, index) => {
      //     const rowKey = `${item.SCHEDULE_DT_SRNO}-dispatch-${index}`;
      //     return editingRow === rowKey ? (
      //       <InputNumber
      //         min={0}
      //         value={rejectedQty ?? record.REJECTED_QTY}
      //         onChange={(value) => setrejectedQty(value ?? 0)}
      //         style={{ width: '100%' }}
      //         placeholder="Rejected Qty"
      //       />
      //     ) : (
      //       text || '-'
      //     );
      //   },
      // },
      // {
      //   title: 'Remark',
      //   dataIndex: 'REMARK',
      //   key: 'REMARK',
      //   render: (text, record, index) => {
      //     const rowKey = `${item.SCHEDULE_DT_SRNO}-dispatch-${index}`;
      //     return editingRow === rowKey ? (
      //       <Input
      //         value={rejectionRemark ?? record.REJECTED_REMARK}
      //         onChange={(e) => setRejectionRemark(e.target.value)}
      //         style={{ width: '100%' }}
      //         placeholder="Reason for rejection"
      //         maxLength={200}
      //       />
      //     ) : (
      //       text || '-'
      //     );
      //   },
      // },
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record, index) => {
          const rowKey = `${item.SCHEDULE_DT_SRNO}-dispatch-${index}`;
          return editingRow === rowKey ? (
            <Button type="link" onClick={() => handleDispatchUpdate(record, item)}>
              Update
            </Button>
          ) : (
            <Tooltip title={item.IS_CLOSED === 'Y' ? 'Cannot edit, Order is Closed' : undefined}>
            <Button type="link" 
            disabled={item.IS_CLOSED === 'Y'}
            onClick={() => handleDispatchEdit(record, rowKey)}>
              Edit
            </Button>
            </Tooltip>
          );
        },
      },
    ]}
    dataSource={item.DISPATCH_HISTORY || []}
    rowKey={(_, index) => `${item.SCHEDULE_DT_SRNO}-dispatch-${index}`}
    pagination={false}
  />
);

  return (
    <Modal
      title={`Dispatch for Schedule #${SCHEDULE_SRNO}`}
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={<Button onClick={() => setIsOpen(false)}>Close</Button>}
      width={1400}
      destroyOnClose
    >
      {loading || !poData ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Descriptions layout="horizontal" column={3} size="small" bordered>
              <Descriptions.Item label="PO Number">{poData.PO_NUMBER}</Descriptions.Item>
              <Descriptions.Item label="Party Name">{poData.PARTY_NAME}</Descriptions.Item>
              <Descriptions.Item label="Schedule Date">{poData.SCHEDULE_DATE}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Table
            columns={itemColumns}
            dataSource={poData.items}
            rowKey="SCHEDULE_DT_SRNO"
            expandable={{ expandedRowRender }}
            pagination={false}
            bordered
          />

          <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
            Note: Once full quantity is dispatched, the row will be marked as <Tag color="green">Completed</Tag>.
          </Text>
        </>
      )}

      <Modal
  title="Add Rejected Quantity"
  open={isRejectModalOpen}
  onCancel={() => setIsRejectModalOpen(false)}
  onOk={() => {
    if (!rejectedQty || rejectedQty <= 0) {
      message.warning('Please enter a valid rejected quantity.');
      return;
    }

    if (!rejectionRemark.trim()) {
      message.warning('Please enter a rejection remark.');
      return;
    }

    // Call your API or update logic here
    handleRejectQtySubmit(rejectItem, rejectedQty, rejectionRemark);
    setIsRejectModalOpen(false);
  }}
  okText="Submit"
  cancelText="Cancel"
>
  <p><strong>OD:</strong> {rejectItem?.OD}</p>
  <p><strong>Thickness:</strong> {rejectItem?.THICKNESS}</p>
  <p><strong>Grade:</strong> {rejectItem?.GRADE}</p>
  <InputNumber
    min={1}
    value={rejectedQty ?? undefined}
    onChange={(val) => setRejectedQty(val ?? null)}
    placeholder="Rejected Quantity"
    style={{ width: '100%', marginBottom: 12 }}
  />
  <Input.TextArea
    value={rejectionRemark}
    onChange={(e) => setRejectionRemark(e.target.value)}
    placeholder="Enter rejection reason"
    rows={4}
    maxLength={200}
  />
</Modal>

    </Modal>

    
  );
};

export default DispatchModal;
function handleAddRejectedQty(item: DispatchItem): void {
  throw new Error('Function not implemented.');
}




