'use client';

import { useState, useEffect } from 'react';
import {
  Card, Table, Button, Form, Select, Input, Space, Spin, Tabs, Tag, Tooltip, Typography, Empty, Modal, DatePicker, Row, Col, message, Checkbox
} from 'antd';
import { SearchOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, MergeCellsOutlined } from '@ant-design/icons';
import { apiClient } from '@/utils/apiClient';
import { getCookieData } from '@/utils/common';
import RawInventoryDtl from '../components/RawInvetoryDtl';
import ScheduleAnalysis from '../schedule/page';

const { Title, Text } = Typography;
const { Option } = Select;

interface PoItem {
  SCHEDULE_SRNO: number;
  SCHEDULE_DT_SRNO: number;
  PARTY_NAME: string;
  PO_NUMBER: string;
  SCHEDULE_DATE: string;
  ITEM_TYPE: 'PIPE' | 'COIL' | 'SHEET';
  OD?: string;
  THICKNESS: string;
  GRADE: string;
  LENGTH?: string;
  WIDTH?: string;
  ORDERED_QTY: number;
  ORDERED_WEIGHT: number;
  REMAINING_QTY: number;
  REMAINING_WEIGHT: number;
  STATUS_NAME: string;
  GRADE_SRNO?: number;
  THICKNESS_SRNO?: number;
  OD_SRNO?: number;
}

interface RawMaterial {
  MATERIAL_SRNO: number;
  CHALLAN_NO: string;
  GRADE: string;
  THICKNESS: string;
  C_LOCATION: string;
  BALANCE_WIDTH: number;
  BALANCE_WEIGHT: number;
  STATUS_NAME: string;
  COIL_TYPE: string;
  MATERIAL_SRNOS: string;
  SLITTING_SRNOS: string;
  COIL_TYPE_FLAG: string;
  QUANTITY: number;
}


interface GroupedPoItem {
  GRADE: string;
  GRADE_SRNO: number;
  THICKNESS: string;
  THICKNESS_SRNO: number;
  OD?: string;
  OD_SRNO?: number;
  ITEM_TYPE: 'PIPE' | 'COIL' | 'SHEET';
  PIPE_QTY: number;
  COIL_SHEET_WEIGHT: number;
  PARTY_NAME: string;
  PO_NUMBER: string;
  SCHEDULE_SRNOS: number;
  SCHEDULE_DT_SRNOS: number;
}

const PoMaterialMapping = () => {
  const { USER_SRNO, API_BASE_URL, UT_SRNO } = getCookieData();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [poItems, setPoItems] = useState<PoItem[]>([]);  
  const [selectedPo, setSelectedPo] = useState<PoItem | null>(null);
  const [selectedPoItems, setSelectedPoItems] = useState<number[]>([]);
  const [groupedPoItems, setGroupedPoItems] = useState<GroupedPoItem[]>([]);
  const [showGrouped, setShowGrouped] = useState(false);
  
  // States for raw inventory detail modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterialSrnos, setSelectedMaterialSrnos] = useState<string | null>(null);
  const [selectedSlittingSrnos, setSelectedSlittingSrnos] = useState<string | null>(null);
  const [selectedCoilTypeFlag, setSelectedCoilTypeFlag] = useState<string | null>(null);
  
  // States for dropdown options
  const [optGrades, setOptGrades] = useState<{ label: string; value: string }[]>([]);
  const [optThickness, setOptThickness] = useState<{ label: string; value: string }[]>([]);
  const [optOD, setOptOD] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    fetchCommonData();
    fetchSchedules();
  }, []);

  // Clear selected material details when modal is closed
  useEffect(() => {
    if (!modalVisible) {
      setSelectedMaterialSrnos(null);
      setSelectedSlittingSrnos(null);
      setSelectedCoilTypeFlag(null);
    }
  }, [modalVisible]);

const fetchCommonData = async () => {
  try {
    const response = await apiClient<Record<string, any>>(
         `${API_BASE_URL}Pl_Common?USER_SRNO=${USER_SRNO}&UT_SRNO=${UT_SRNO}&TBL_SRNO=1,2,3`,
         "GET"
       );
       if (response.msgId === 200) {
         if (!response.data) return;
         const { Table1, Table2,Table3 } = response.data;
         setOptGrades(Table1)
         setOptOD(Table2)
         setOptThickness(Table3)
       } else {
         message.error(response.msg);
         console.error("API Error:", response.msg);
       }

   
  } catch (error) {
    console.error("Error:", error);
    message.error("Failed to fetch dropdown options");
  }
};

const handleSearch = async (type: 'POS' | 'POS_ITEM') => {
  // Clear previous search results and reset view state
  setSelectedPo(null);
  setSelectedPoItems([]);
  
  if (type === 'POS') {
    // Clear all previous data when searching for POs
    setPoItems([]);
    setGroupedPoItems([]);
    setShowGrouped(false);
    await fetchSchedules();
  } else if (type === 'POS_ITEM') {
    setPoItems([]);
    setGroupedPoItems([]);
    await handleGroupPOs();
  }
};

const fetchSchedules = async () => {
  setLoading(true);
  try {
    // Clear any existing data before fetching new data
    setPoItems([]);
    
    const values = searchForm.getFieldsValue();
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
    const res = await apiClient(`${API_BASE_URL}DtScheduleAnalysis?${queryParams}`, 'GET');
    setPoItems(res.data.Table || []);
  } catch (err) {
    message.error('Failed to load schedules.');
  } finally {
    setLoading(false);
  }
};

  
  
  const handleCheckboxChange = (checked: boolean, scheduleDtSrno: number) => {
    setSelectedPoItems(prev => {
      if (checked) {
        return [...prev, scheduleDtSrno];
      } else {
        return prev.filter(id => id !== scheduleDtSrno);
      }
    });
  };
  
  const handleGroupPOs = async () => {
    // Check if any PO items are selected
    if (selectedPoItems.length === 0) {
      // Get current form values
      const formValues = searchForm.getFieldsValue();
      const hasFilters = Object.values(formValues).some(value => 
        value !== undefined && value !== null && value !== '' && 
        (!Array.isArray(value) || value.length > 0)
      );
  
      // If no filters are selected either, show warning
      if (!hasFilters) {
        message.warning('Please either select PO items or specify search filters');
        return;
      }
    }
    
    setLoading(true);
    try {
      // e.g. SCHEDULE_SRNOS = '1,2,3'
      const SCHEDULE_SRNOS = poItems
        .filter(item => selectedPoItems.includes(item.SCHEDULE_SRNO))
        .map(item => item.SCHEDULE_SRNO)
        .join(',');
      
      const values = searchForm.getFieldsValue();
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
      const res = await apiClient(`${API_BASE_URL}DispPoAutoMap?SCHEDULE_SRNOS=${SCHEDULE_SRNOS}&${queryParams}`, 'GET');
     debugger
      setGroupedPoItems(res.data.Table || []);
      setShowGrouped(true);
      
      // Clear PO items when showing grouped view
      setPoItems([]);
      setLoading(false);
  
      message.success('POs Item fetch successfully');
    } catch (error) {
      console.error(error);
      message.error('Error grouping POs');
      setLoading(false);
    }
  };
  
  const handleGroupedPoSelect = async (record: GroupedPoItem) => {
    setLoading(true);
    try {
      // Create a virtual PO item to display in the UI
      const virtualPo: PoItem = {
        SCHEDULE_SRNO: record.SCHEDULE_SRNOS || 0,
        SCHEDULE_DT_SRNO: record.SCHEDULE_DT_SRNOS || 0,
        PARTY_NAME: record.PARTY_NAME,
        PO_NUMBER: record.PO_NUMBER,
        SCHEDULE_DATE: '',
        ITEM_TYPE: record.ITEM_TYPE,
        THICKNESS: record.THICKNESS,
        GRADE: record.GRADE,
        OD: record.OD,
        ORDERED_QTY: record.PIPE_QTY,
        ORDERED_WEIGHT: record.COIL_SHEET_WEIGHT,
        REMAINING_QTY: record.PIPE_QTY,
        REMAINING_WEIGHT: record.COIL_SHEET_WEIGHT,
        STATUS_NAME: 'Grouped',
        GRADE_SRNO: record.GRADE_SRNO,
        THICKNESS_SRNO: record.THICKNESS_SRNO,
        OD_SRNO: record.OD_SRNO
      };
        setSelectedPo(virtualPo);
        setLoading(false);
 
    } catch (error) {
      console.error('Error fetching materials:', error);
      message.error('Failed to fetch materials for grouped POs');
      setLoading(false);
    }
  };


  const handleQuantityClick = (record: RawMaterial) => {
    setModalVisible(true);
    setSelectedMaterialSrnos(record.MATERIAL_SRNOS);
    setSelectedSlittingSrnos(record.SLITTING_SRNOS);
    setSelectedCoilTypeFlag(record.COIL_TYPE_FLAG);
  };

  // PO Items table columns
  const poColumns = [
    {
      title: (
        <Tooltip title="Select POs to group items">
          <Checkbox 
            indeterminate={selectedPoItems.length > 0 && selectedPoItems.length < poItems.length}
            checked={selectedPoItems.length > 0 && selectedPoItems.length === poItems.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPoItems(poItems.map(item => item.SCHEDULE_SRNO));
              } else {
                setSelectedPoItems([]);
              }
            }}
          />
        </Tooltip>
      ),
      key: 'selection',
      width: 50,
      render: (_: any, record: PoItem) => (
        <Checkbox
          checked={selectedPoItems.includes(record.SCHEDULE_SRNO)}
          onChange={(e) => handleCheckboxChange(e.target.checked, record.SCHEDULE_SRNO)}
        />
      ),
    },
    {
      title: 'Party Name',
      dataIndex: 'PARTY_NAME',
      key: 'PARTY_NAME',
    },
    {
      title: 'PO Number',
      dataIndex: 'PO_NUMBER',
      key: 'PO_NUMBER',
    },
    {
      title: 'PO Date',
      dataIndex: 'SCHEDULE_DATE',
      key: 'SCHEDULE_DATE',
    },
    {
      title: 'Pending Ordered',
      children: [
        {
          title: 'Qty',
          dataIndex: 'T_ORDER_QTY',
          key: 'T_ORDER_QTY',
          align: 'center',
          width: 80,
        },
        {
          title: 'Wt (kg)',
          dataIndex: 'T_ORDER_WEIGHT',
          key: 'T_ORDER_WEIGHT',
          align: 'center',
          width: 100,
        },
      ],
    },
    // {
    //   title: 'Remaining',
    //   children: [
    //     {
    //       title: 'Qty',
    //       dataIndex: 'REMAINING_QTY',
    //       key: 'REMAINING_QTY',
    //       align: 'center',
    //       width: 80,
    //     },
    //     {
    //       title: 'Wt (kg)',
    //       dataIndex: 'REMAINING_WEIGHT',
    //       key: 'REMAINING_WEIGHT',
    //       align: 'center',
    //       width: 100,
    //     },
    //   ],
    // },
  
    
  ];

  // Grouped PO Items table columns
  const groupedPoColumns = [
    {
      title: 'Grade',
      dataIndex: 'GRADE',
      key: 'GRADE',
    },
    {
      title: 'Thickness',
      dataIndex: 'THICKNESS',
      key: 'THICKNESS',
    },
    {
      title: 'OD',
      dataIndex: 'OD',
      key: 'OD',
    },
    {
      title: 'Item Type',
      dataIndex: 'ITEM_TYPE',
      key: 'ITEM_TYPE',
    },
    {
      title: 'Total Quantity',
      dataIndex: 'PIPE_QTY',
      key: 'PIPE_QTY',
    },
    {
      title: 'Total Weight (kg)',
      dataIndex: 'COIL_SHEET_WEIGHT',
      key: 'COIL_SHEET_WEIGHT',
    },
    {
      title: 'Party Names',
      key: 'PARTY_NAME',
      render: (_: any, record: GroupedPoItem) => (
        <span>{record.PARTY_NAME}</span>
      ),
    },
    {
      title: 'PO Numbers',
      key: 'PO_NUMBER',
      render: (_: any, record: GroupedPoItem) => (
        <span>{record.PO_NUMBER}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: GroupedPoItem) => (
        <Button type="primary" onClick={() => handleGroupedPoSelect(record)}>
          Check Materials
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>PO Material Mapping</span>
            {showGrouped && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                Grouped View
              </Tag>
            )}
            {!showGrouped && poItems.length > 0 && (
              <Tag color="green" style={{ marginLeft: 8 }}>
                POs View
              </Tag>
            )}
          </div>
        } 
        variant="borderless"
      >
        {/* Search Filters */}
        <Form
          form={searchForm}
          layout="vertical"
          onFinish={fetchSchedules}
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col hidden>
              <Form.Item label="Item Type" name="ITEM_TYPE">
                <Select style={{ width: 150 }} defaultValue="PIPE">
                  <Option value="PIPE">PIPE</Option>
                  <Option value="COIL">COIL</Option>
                  <Option value="SHEET">SHEET</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Grade" name="GRADE_SRNO">
                <Select 
                  allowClear 
                  style={{ width: 150 }} 
                  placeholder="Select Grade"
                  options={optGrades}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Thickness" name="THICKNESS_SRNO">
                <Select 
                  allowClear 
                  style={{ width: 150 }} 
                  placeholder="Select Thickness"
                  options={optThickness}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="OD" name="OD_SRNO">
                <Select 
                  allowClear 
                  style={{ width: 150 }} 
                  placeholder="Select OD"
                  options={optOD}
                />
              </Form.Item>
            </Col>
                      
            <Col>
              <Form.Item label="Party Name" name="PARTY_NAME">
                <Input placeholder="Party Name" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="PO Number" name="PO_NUMBER">
                <Input placeholder="PO Number" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="PO Entry Date" name="ENTRY_DATE">
                <DatePicker.RangePicker />
              </Form.Item>
            </Col>
           
            <Col>
             <Space>
  <Button
    type="primary"
    icon={<SearchOutlined />}
    onClick={() => handleSearch('POS')}
    loading={loading && !showGrouped}
  >
    Search POs
  </Button>
  <Button
    type="primary"
    icon={<SearchOutlined />}
    onClick={() => handleSearch('POS_ITEM')}
    loading={loading && showGrouped}
  >
    Search POs Item
  </Button>
</Space>

            </Col>
            <Col>
              <Form.Item label=" " colon={false}>
                <Button
                  icon={<SyncOutlined />}
                  onClick={() => {
                    // Reset form fields
                    searchForm.resetFields();
                    searchForm.setFieldsValue({ ITEM_TYPE: 'PIPE' });
                    
                    // Clear all data
                    setPoItems([]);
                    setGroupedPoItems([]);
                    setSelectedPo(null);
                    setSelectedPoItems([]);
                    setShowGrouped(false);
                    
                    // Fetch fresh data
                    fetchSchedules();
                  }}
                  loading={loading}
                >
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        
        {/* Group POs Button */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Button 
              type="primary" 
              icon={<MergeCellsOutlined />} 
              onClick={handleGroupPOs}
              disabled={selectedPoItems.length === 0}
              loading={loading && !showGrouped}
            >
              Group Selected POs Item
            </Button>
           
          </div>
          <div>
            <Text>
              Selected: <Tag color="blue">{selectedPoItems.length}</Tag> PO items
              {selectedPoItems.length > 0 && (
                <Button 
                  type="link" 
                  size="small" 
                  onClick={() => setSelectedPoItems([])}
                  style={{ marginLeft: 8 }}
                >
                  Clear Selection
                </Button>
              )}
            </Text>
          </div>
        </div>

        {/* PO Items Table or Grouped PO Items Table */}
        {showGrouped ? (
          <Table
          title={() => (
             <div>
                <Title level={4}>Grouped POs</Title>
                <Text>Total Grouped POs: <strong>{groupedPoItems.length}</strong></Text>
                {/* {JSON.stringify(groupedPoItems)} */}
              </div>
            )}
            columns={groupedPoColumns}
            dataSource={groupedPoItems}
            rowKey={(record) => `${record.GRADE_SRNO}-${record.THICKNESS_SRNO}-${record.OD_SRNO || 0}`}
            loading={loading && showGrouped}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        ) : (
          <Table
            title={() => (
              <div>
                <Title level={4}>PO Material Mapping</Title>
                <Text>Total POs: <strong>{poItems.length}</strong></Text>
              </div>
            )}
            columns={poColumns}
            dataSource={poItems}
            rowKey="SCHEDULE_DT_SRNO"
            loading={loading && !showGrouped}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        )}

        {/* Material Mapping Section */}
        {selectedPo && (
            <Card
              title={
                <div>
                  <Title level={4}>Material Mapping for PO: {selectedPo.PO_NUMBER}</Title>
                  <Text>Party: {selectedPo.PARTY_NAME} | Material: {selectedPo.ITEM_TYPE === 'PIPE' ? 
                    `${selectedPo.OD} OD x ${selectedPo.THICKNESS} THK x ${selectedPo.GRADE} x ${selectedPo.LENGTH} L` : 
                    `${selectedPo.THICKNESS} THK x ${selectedPo.GRADE} x ${selectedPo.WIDTH} W`
                  }</Text>
                </div>
              }
            
            >
          <ScheduleAnalysis 
            GRADE_SRNO={selectedPo?.GRADE_SRNO?.toString()}
            OD_SRNO={selectedPo?.OD_SRNO?.toString()}
            THICKNESS_SRNO={selectedPo?.THICKNESS_SRNO?.toString()}
            PR_LENGTH={selectedPo?.LENGTH ? parseFloat(selectedPo.LENGTH) : undefined}
            PR_QUANTITY={selectedPo?.REMAINING_QTY}
            autoSearch={true}
          />
          </Card>
        )

        }
        

        {/* Raw Inventory Detail Modal */}
        {modalVisible && (
          <RawInventoryDtl
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            selectedMaterialSrnos={selectedMaterialSrnos || ''}
            selectedSlittingSrnos={selectedSlittingSrnos || ''}
            selectedCoilTypeFlag={selectedCoilTypeFlag || ''}
          />
        )}
      </Card>
    </div>
  );
};

export default PoMaterialMapping;