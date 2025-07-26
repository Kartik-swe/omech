'use client';

import { useState, useEffect } from 'react';
import {
  Card, Table, Button, Form, Select, Input, Space, Spin, Tabs, Tag, Tooltip, Typography, Empty, Modal, DatePicker, Row, Col, message, Checkbox
} from 'antd';
import { SearchOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, MergeCellsOutlined } from '@ant-design/icons';
import { apiClient } from '@/utils/apiClient';
import { getCookieData } from '@/utils/common';
import RawInventoryDtl from '../components/RawInvetoryDtl';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
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
  STATUS_SRNO: number;
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

interface PipeInventory {
  PR_INV_SRNO: number;
  PR_SRNO: number;
  GRADE: string;
  THICKNESS: string;
  OD: string;
  PR_LENGTH: number;
  AVAILABLE_QUANTITY: number;
  T_PR_WEIGHT: number;
  C_LOCATION: string;
}

interface ProductionEstimate {
  GRADE_SRNO: number;
  THICKNESS_SRNO: number;
  OD_SRNO: number;
  GRADE: string;
  THICKNESS: string;
  OD: string;
  PIPE_QTY: number;
  PIPE_LENGTH: number;
  QUANTITY_PER_PIPE: number;
  TOTAL_QUANTITY_PER_PIPE: number;
  END_PIECE_QUANTITY_PER_PIPE: number;
  TOTAL_END_PIECE_QUANTITY_PER_PIPE: number;
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
  PARTY_NAMES: string[];
  PO_NUMBERS: string[];
  SCHEDULE_SRNOS: number[];
  SCHEDULE_DT_SRNOS: number[];
}

const PoMaterialMapping = () => {
  const { USER_SRNO, API_BASE_URL, UT_SRNO } = getCookieData();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [poItems, setPoItems] = useState<PoItem[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [pipeInventory, setPipeInventory] = useState<PipeInventory[]>([]);
  const [productionEstimates, setProductionEstimates] = useState<ProductionEstimate[]>([]);
  const [selectedPo, setSelectedPo] = useState<PoItem | null>(null);
  const [activeTab, setActiveTab] = useState('1');
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
      // Simulate API delay
      setTimeout(() => {
        // Dummy dropdown options
        const dummyGrades = [
          { label: 'API 5L X52', value: '1' },
          { label: 'API 5L X65', value: '2' },
          { label: 'IS 2062 E250', value: '3' },
          { label: 'IS 2062 E350', value: '4' },
          { label: 'IS 1239', value: '5' }
        ];
        
        const dummyOD = [
          { label: '114.3', value: '1' },
          { label: '168.3', value: '2' },
          { label: '219.1', value: '3' },
          { label: '273.0', value: '4' },
          { label: '323.9', value: '5' }
        ];
        
        const dummyThickness = [
          { label: '4.8', value: '1' },
          { label: '7.1', value: '2' },
          { label: '3.2', value: '3' },
          { label: '2.5', value: '4' },
          { label: '6.4', value: '5' }
        ];
        
        setOptGrades(dummyGrades);
        setOptOD(dummyOD);
        setOptThickness(dummyThickness);
      }, 300);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to fetch dropdown options");
    }
  };

  // Dummy data for PO items
  const dummyPoItems: PoItem[] = [
    {
      SCHEDULE_SRNO: 1,
      SCHEDULE_DT_SRNO: 101,
      PARTY_NAME: 'ABC Industries',
      PO_NUMBER: 'PO-2023-001',
      SCHEDULE_DATE: '2023-07-15',
      ITEM_TYPE: 'PIPE',
      OD: '114.3',
      THICKNESS: '4.8',
      GRADE: 'API 5L X52',
      LENGTH: '12',
      ORDERED_QTY: 100,
      ORDERED_WEIGHT: 1500,
      REMAINING_QTY: 50,
      REMAINING_WEIGHT: 750,
      STATUS_NAME: 'Pending',
      STATUS_SRNO: 11,
      GRADE_SRNO: 1,
      THICKNESS_SRNO: 1,
      OD_SRNO: 1
    },
    {
      SCHEDULE_SRNO: 2,
      SCHEDULE_DT_SRNO: 102,
      PARTY_NAME: 'XYZ Corporation',
      PO_NUMBER: 'PO-2023-002',
      SCHEDULE_DATE: '2023-07-20',
      ITEM_TYPE: 'PIPE',
      OD: '114.3',
      THICKNESS: '4.8',
      GRADE: 'API 5L X52',
      LENGTH: '12',
      ORDERED_QTY: 200,
      ORDERED_WEIGHT: 3000,
      REMAINING_QTY: 200,
      REMAINING_WEIGHT: 3000,
      STATUS_NAME: 'Pending',
      STATUS_SRNO: 11,
      GRADE_SRNO: 1,
      THICKNESS_SRNO: 1,
      OD_SRNO: 1
    },
    {
      SCHEDULE_SRNO: 3,
      SCHEDULE_DT_SRNO: 103,
      PARTY_NAME: 'PQR Limited',
      PO_NUMBER: 'PO-2023-003',
      SCHEDULE_DATE: '2023-07-25',
      ITEM_TYPE: 'PIPE',
      OD: '168.3',
      THICKNESS: '7.1',
      GRADE: 'API 5L X65',
      LENGTH: '12',
      ORDERED_QTY: 150,
      ORDERED_WEIGHT: 4500,
      REMAINING_QTY: 150,
      REMAINING_WEIGHT: 4500,
      STATUS_NAME: 'Pending',
      STATUS_SRNO: 11,
      GRADE_SRNO: 2,
      THICKNESS_SRNO: 2,
      OD_SRNO: 2
    },
    {
      SCHEDULE_SRNO: 4,
      SCHEDULE_DT_SRNO: 104,
      PARTY_NAME: 'LMN Enterprises',
      PO_NUMBER: 'PO-2023-004',
      SCHEDULE_DATE: '2023-08-01',
      ITEM_TYPE: 'COIL',
      THICKNESS: '3.2',
      GRADE: 'IS 2062 E250',
      WIDTH: '1250',
      ORDERED_QTY: 5,
      ORDERED_WEIGHT: 10000,
      REMAINING_QTY: 5,
      REMAINING_WEIGHT: 10000,
      STATUS_NAME: 'Pending',
      STATUS_SRNO: 11,
      GRADE_SRNO: 3,
      THICKNESS_SRNO: 3
    },
    {
      SCHEDULE_SRNO: 5,
      SCHEDULE_DT_SRNO: 105,
      PARTY_NAME: 'RST Manufacturing',
      PO_NUMBER: 'PO-2023-005',
      SCHEDULE_DATE: '2023-08-05',
      ITEM_TYPE: 'SHEET',
      THICKNESS: '2.5',
      GRADE: 'IS 2062 E350',
      LENGTH: '2500',
      WIDTH: '1250',
      ORDERED_QTY: 20,
      ORDERED_WEIGHT: 1200,
      REMAINING_QTY: 20,
      REMAINING_WEIGHT: 1200,
      STATUS_NAME: 'Pending',
      STATUS_SRNO: 11,
      GRADE_SRNO: 4,
      THICKNESS_SRNO: 4
    }
  ];

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const values = searchForm.getFieldsValue();
      
      // Filter dummy data based on search criteria
      let filteredItems = [...dummyPoItems];
      
      if (values.ITEM_TYPE) {
        filteredItems = filteredItems.filter(item => item.ITEM_TYPE === values.ITEM_TYPE);
      }
      
      if (values.PARTY_NAME) {
        filteredItems = filteredItems.filter(item => 
          item.PARTY_NAME.toLowerCase().includes(values.PARTY_NAME.toLowerCase())
        );
      }
      
      if (values.PO_NUMBER) {
        filteredItems = filteredItems.filter(item => 
          item.PO_NUMBER.toLowerCase().includes(values.PO_NUMBER.toLowerCase())
        );
      }
      
      if (values.STATUS_SRNO) {
        filteredItems = filteredItems.filter(item => 
          item.STATUS_SRNO === parseInt(values.STATUS_SRNO)
        );
      }
      
      // Simulate API delay
      setTimeout(() => {
        setPoItems(filteredItems);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error(err);
      message.error('Failed to load schedules.');
      setLoading(false);
    }
  };

  const handlePoSelect = async (record: PoItem) => {
    setSelectedPo(record);
    setActiveTab('1'); // Reset to first tab
    await fetchMaterialsForPo(record);
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
    if (selectedPoItems.length === 0) {
      message.warning('Please select at least one PO item to group');
      return;
    }
    
    setLoading(true);
    try {
      // Get the selected PO items details
      const selectedPOs = poItems.filter(item => selectedPoItems.includes(item.SCHEDULE_DT_SRNO));
      
      // Group POs by thickness, grade, and OD
      const groupedMap = new Map();
      
      selectedPOs.forEach(po => {
        // Create a key based on thickness, grade, and OD
        const key = `${po.THICKNESS_SRNO}-${po.GRADE_SRNO}-${po.OD_SRNO || 'null'}-${po.ITEM_TYPE}`;
        
        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            GRADE: po.GRADE,
            GRADE_SRNO: po.GRADE_SRNO || 0,
            THICKNESS: po.THICKNESS,
            THICKNESS_SRNO: po.THICKNESS_SRNO || 0,
            OD: po.OD,
            OD_SRNO: po.OD_SRNO,
            ITEM_TYPE: po.ITEM_TYPE,
            PIPE_QTY: 0,
            COIL_SHEET_WEIGHT: 0,
            PARTY_NAMES: [],
            PO_NUMBERS: [],
            SCHEDULE_SRNOS: [],
            SCHEDULE_DT_SRNOS: []
          });
        }
        
        const group = groupedMap.get(key);
        
        // Add quantities
        if (po.ITEM_TYPE === 'PIPE') {
          group.PIPE_QTY += po.REMAINING_QTY;
        } else {
          group.COIL_SHEET_WEIGHT += po.REMAINING_WEIGHT;
        }
        
        // Add party name if not already in the list
        if (!group.PARTY_NAMES.includes(po.PARTY_NAME)) {
          group.PARTY_NAMES.push(po.PARTY_NAME);
        }
        
        // Add PO number if not already in the list
        if (!group.PO_NUMBERS.includes(po.PO_NUMBER)) {
          group.PO_NUMBERS.push(po.PO_NUMBER);
        }
        
        // Add schedule SRNO
        group.SCHEDULE_SRNOS.push(po.SCHEDULE_SRNO);
        
        // Add schedule detail SRNO
        group.SCHEDULE_DT_SRNOS.push(po.SCHEDULE_DT_SRNO);
      });
      
      // Convert map to array
      const groupedData = Array.from(groupedMap.values());
      
      // Simulate API delay
      setTimeout(() => {
        setGroupedPoItems(groupedData);
        setShowGrouped(true);
        setLoading(false);
        message.success('POs grouped successfully by thickness and grade');
      }, 800);
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
        SCHEDULE_SRNO: record.SCHEDULE_SRNOS[0] || 0,
        SCHEDULE_DT_SRNO: record.SCHEDULE_DT_SRNOS[0] || 0,
        PARTY_NAME: record.PARTY_NAMES.join(', '),
        PO_NUMBER: record.PO_NUMBERS.join(', '),
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
        STATUS_SRNO: 11,
        GRADE_SRNO: record.GRADE_SRNO,
        THICKNESS_SRNO: record.THICKNESS_SRNO,
        OD_SRNO: record.OD_SRNO
      };
      
      // Simulate API delay
      setTimeout(() => {
        // Dummy raw materials data
        const dummyRawMaterials = [
          {
            MATERIAL_SRNO: 1,
            CHALLAN_NO: 'CH001',
            GRADE: record.GRADE,
            THICKNESS: record.THICKNESS,
            C_LOCATION: 'LOC-A',
            BALANCE_WIDTH: 1250,
            BALANCE_WEIGHT: 5000,
            STATUS_NAME: 'Available',
            COIL_TYPE: 'Mother Coil',
            MATERIAL_SRNOS: '1,2,3',
            SLITTING_SRNOS: '',
            COIL_TYPE_FLAG: 'M',
            QUANTITY: 3
          },
          {
            MATERIAL_SRNO: 2,
            CHALLAN_NO: 'CH002',
            GRADE: record.GRADE,
            THICKNESS: record.THICKNESS,
            C_LOCATION: 'LOC-B',
            BALANCE_WIDTH: 1000,
            BALANCE_WEIGHT: 3500,
            STATUS_NAME: 'Available',
            COIL_TYPE: 'Slitted Coil',
            MATERIAL_SRNOS: '4,5',
            SLITTING_SRNOS: '1,2',
            COIL_TYPE_FLAG: 'S',
            QUANTITY: 2
          }
        ];
        
        // Dummy pipe inventory data
        const dummyPipeInventory = [
          {
            PR_INV_SRNO: 1,
            PR_SRNO: 101,
            GRADE: record.GRADE,
            THICKNESS: record.THICKNESS,
            OD: record.OD || '',
            PR_LENGTH: 12,
            AVAILABLE_QUANTITY: 50,
            T_PR_WEIGHT: 2500,
            C_LOCATION: 'YARD-1'
          },
          {
            PR_INV_SRNO: 2,
            PR_SRNO: 102,
            GRADE: record.GRADE,
            THICKNESS: record.THICKNESS,
            OD: record.OD || '',
            PR_LENGTH: 12,
            AVAILABLE_QUANTITY: 30,
            T_PR_WEIGHT: 1500,
            C_LOCATION: 'YARD-2'
          }
        ];
        
        // Dummy production estimates
        const dummyProductionEstimates = [
          {
            GRADE_SRNO: record.GRADE_SRNO || 1,
            THICKNESS_SRNO: record.THICKNESS_SRNO || 1,
            OD_SRNO: record.OD_SRNO || 1,
            GRADE: record.GRADE,
            THICKNESS: record.THICKNESS,
            OD: record.OD || '',
            PIPE_QTY: record.PIPE_QTY || 100,
            PIPE_LENGTH: 12,
            QUANTITY_PER_PIPE: 8,
            TOTAL_QUANTITY_PER_PIPE: record.PIPE_QTY * 8 || 800,
            END_PIECE_QUANTITY_PER_PIPE: 0.5,
            TOTAL_END_PIECE_QUANTITY_PER_PIPE: 50
          }
        ];
        
        setRawMaterials(dummyRawMaterials);
        setPipeInventory(dummyPipeInventory);
        setProductionEstimates(dummyProductionEstimates);
        setSelectedPo(virtualPo);
        setActiveTab('1'); // Reset to first tab
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching materials:', error);
      message.error('Failed to fetch materials for grouped POs');
      setLoading(false);
    }
  };

  const fetchMaterialsForPo = async (poItem: PoItem) => {
    setLoading(true);
    try {
      // Simulate API delay
      setTimeout(() => {
        // Dummy raw materials data
        const dummyRawMaterials = [
          {
            MATERIAL_SRNO: 1,
            CHALLAN_NO: 'CH001',
            GRADE: poItem.GRADE,
            THICKNESS: poItem.THICKNESS,
            C_LOCATION: 'LOC-A',
            BALANCE_WIDTH: 1250,
            BALANCE_WEIGHT: 5000,
            STATUS_NAME: 'Available',
            COIL_TYPE: 'Mother Coil',
            MATERIAL_SRNOS: '1,2,3',
            SLITTING_SRNOS: '',
            COIL_TYPE_FLAG: 'M',
            QUANTITY: 3
          },
          {
            MATERIAL_SRNO: 2,
            CHALLAN_NO: 'CH002',
            GRADE: poItem.GRADE,
            THICKNESS: poItem.THICKNESS,
            C_LOCATION: 'LOC-B',
            BALANCE_WIDTH: 1000,
            BALANCE_WEIGHT: 3500,
            STATUS_NAME: 'Available',
            COIL_TYPE: 'Slitted Coil',
            MATERIAL_SRNOS: '4,5',
            SLITTING_SRNOS: '1,2',
            COIL_TYPE_FLAG: 'S',
            QUANTITY: 2
          }
        ];
        
        // Dummy pipe inventory data
        const dummyPipeInventory = [
          {
            PR_INV_SRNO: 1,
            PR_SRNO: 101,
            GRADE: poItem.GRADE,
            THICKNESS: poItem.THICKNESS,
            OD: poItem.OD || '',
            PR_LENGTH: poItem.LENGTH ? parseFloat(poItem.LENGTH) : 12,
            AVAILABLE_QUANTITY: 50,
            T_PR_WEIGHT: 2500,
            C_LOCATION: 'YARD-1'
          },
          {
            PR_INV_SRNO: 2,
            PR_SRNO: 102,
            GRADE: poItem.GRADE,
            THICKNESS: poItem.THICKNESS,
            OD: poItem.OD || '',
            PR_LENGTH: poItem.LENGTH ? parseFloat(poItem.LENGTH) : 12,
            AVAILABLE_QUANTITY: 30,
            T_PR_WEIGHT: 1500,
            C_LOCATION: 'YARD-2'
          }
        ];
        
        // Dummy production estimates
        const dummyProductionEstimates = [
          {
            GRADE_SRNO: poItem.GRADE_SRNO || 1,
            THICKNESS_SRNO: poItem.THICKNESS_SRNO || 1,
            OD_SRNO: poItem.OD_SRNO || 1,
            GRADE: poItem.GRADE,
            THICKNESS: poItem.THICKNESS,
            OD: poItem.OD || '',
            PIPE_QTY: poItem.REMAINING_QTY || 100,
            PIPE_LENGTH: poItem.LENGTH ? parseFloat(poItem.LENGTH) : 12,
            QUANTITY_PER_PIPE: 5,
            TOTAL_QUANTITY_PER_PIPE: (poItem.REMAINING_QTY || 100) * 5,
            END_PIECE_QUANTITY_PER_PIPE: 0.5,
            TOTAL_END_PIECE_QUANTITY_PER_PIPE: 50
          }
        ];
        
        setRawMaterials(dummyRawMaterials);
        setPipeInventory(dummyPipeInventory);
        setProductionEstimates(dummyProductionEstimates);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching materials:', error);
      message.error('Failed to fetch materials for PO');
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
        <Tooltip title="Select POs to group by thickness and grade">
          <Checkbox 
            indeterminate={selectedPoItems.length > 0 && selectedPoItems.length < poItems.length}
            checked={selectedPoItems.length > 0 && selectedPoItems.length === poItems.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPoItems(poItems.map(item => item.SCHEDULE_DT_SRNO));
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
          checked={selectedPoItems.includes(record.SCHEDULE_DT_SRNO)}
          onChange={(e) => handleCheckboxChange(e.target.checked, record.SCHEDULE_DT_SRNO)}
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
      title: 'Item Type',
      dataIndex: 'ITEM_TYPE',
      key: 'ITEM_TYPE',
    },
    {
      title: 'Material',
      key: 'material',
      render: (_: any, record: PoItem) => {
        if (record.ITEM_TYPE === 'PIPE') {
          return (
            <span>
              {record.OD} OD x {record.THICKNESS} THK x {record.GRADE} x {record.LENGTH} L
            </span>
          );
        } else if (record.ITEM_TYPE === 'COIL') {
          return (
            <span>
              {record.THICKNESS} THK x {record.GRADE} x {record.WIDTH} W
            </span>
          );
        } else {
          return (
            <span>
              {record.THICKNESS} THK x {record.GRADE} x {record.LENGTH} L x {record.WIDTH} W
            </span>
          );
        }
      },
    },
    {
      title: 'Ordered',
      children: [
        {
          title: 'Qty',
          dataIndex: 'ORDERED_QTY',
          key: 'ORDERED_QTY',
          align: 'center',
          width: 80,
        },
        {
          title: 'Wt (kg)',
          dataIndex: 'ORDERED_WEIGHT',
          key: 'ORDERED_WEIGHT',
          align: 'center',
          width: 100,
        },
      ],
    },
    {
      title: 'Remaining',
      children: [
        {
          title: 'Qty',
          dataIndex: 'REMAINING_QTY',
          key: 'REMAINING_QTY',
          align: 'center',
          width: 80,
        },
        {
          title: 'Wt (kg)',
          dataIndex: 'REMAINING_WEIGHT',
          key: 'REMAINING_WEIGHT',
          align: 'center',
          width: 100,
        },
      ],
    },
    {
      title: 'Status',
      dataIndex: 'STATUS_NAME',
      key: 'STATUS_NAME',
      render: (text: string, record: PoItem) => {
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
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: PoItem) => (
        <Button type="primary" onClick={() => handlePoSelect(record)}>
          Check Materials
        </Button>
      ),
    },
  ];

  // Raw Materials table columns
  const rawMaterialsColumns = [
    {
      title: 'Location',
      dataIndex: 'C_LOCATION',
      key: 'C_LOCATION',
    },
    {
      title: 'Width',
      dataIndex: 'BALANCE_WIDTH',
      key: 'BALANCE_WIDTH',
    },  
    {
      title: 'Weight',
      dataIndex: 'BALANCE_WEIGHT',
      key: 'BALANCE_WEIGHT',
    },  
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
      title: 'Status',
      dataIndex: 'STATUS_NAME',
      key: 'STATUS_NAME',
    },
    {
      title: 'Source',
      dataIndex: 'COIL_TYPE',
      key: 'COIL_TYPE',
    },
    {
      title: 'Quantity',
      key: 'QUANTITY',
      render: (_: any, record: RawMaterial) => (
        <Space size="middle">
          <a onClick={() => handleQuantityClick(record)}>{record.QUANTITY}</a>
        </Space>
      ),
    }
  ];

  // Pipe Inventory table columns
  const pipeInventoryColumns = [
    {
      title: 'Location',
      dataIndex: 'C_LOCATION',
      key: 'C_LOCATION',
    },
    {
      title: 'Pipe Length',
      dataIndex: 'PR_LENGTH',
      key: 'PR_LENGTH',
    },
    {
      title: 'Available Quantity',
      dataIndex: 'AVAILABLE_QUANTITY',
      key: 'AVAILABLE_QUANTITY',
    },
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
      title: 'Total Weight (kg)',
      dataIndex: 'T_PR_WEIGHT',
      key: 'T_PR_WEIGHT',
    },
  ];

  // Production Estimates table columns
  const productionEstimatesColumns = [
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
      title: 'Pipe Length',
      dataIndex: 'PIPE_LENGTH',
      key: 'PIPE_LENGTH',
    },
    {
      title: 'Pipe Can Be Produced',
      key: 'production',
      render: (_: any, record: ProductionEstimate) => (
        <Space size="middle">
          <span>
            <Tooltip title={`Quantity per pipe: ${record.QUANTITY_PER_PIPE}`}>
              <span>{record.QUANTITY_PER_PIPE}</span>
            </Tooltip>
            {' * '}
            <Tooltip title={`Available quantity: ${record.PIPE_QTY}`}>
              <span>{record.PIPE_QTY}</span>
            </Tooltip>
            {' = '}
            <Tooltip title={`Total Pipe Can Be Produced: ${record.TOTAL_QUANTITY_PER_PIPE}`}>
              <span>{record.TOTAL_QUANTITY_PER_PIPE}</span>
            </Tooltip>
          </span>
        </Space>
      ),
    },
    {
      title: 'End Piece Calculation',
      key: 'end_piece',
      render: (_: any, record: ProductionEstimate) => (
        <Space size="middle">
          <span>
            <Tooltip title={`End Piece Length: ${record.END_PIECE_QUANTITY_PER_PIPE}`}>
              <span>{record.END_PIECE_QUANTITY_PER_PIPE}</span>
            </Tooltip>
            {' * '}
            <Tooltip title={`Available quantity: ${record.PIPE_QTY}`}>
              <span>{record.PIPE_QTY}</span>
            </Tooltip>
            {' = '}
            <Tooltip title={`Total End Piece Length: ${record.TOTAL_END_PIECE_QUANTITY_PER_PIPE}`}>
              <span>{record.TOTAL_END_PIECE_QUANTITY_PER_PIPE}</span>
            </Tooltip>
          </span>
        </Space>
      ),
    },
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
      key: 'PARTY_NAMES',
      render: (_: any, record: GroupedPoItem) => (
        <span>{record.PARTY_NAMES.join(', ')}</span>
      ),
    },
    {
      title: 'PO Numbers',
      key: 'PO_NUMBERS',
      render: (_: any, record: GroupedPoItem) => (
        <span>{record.PO_NUMBERS.join(', ')}</span>
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
      <Card title="PO Material Mapping" bordered={false}>
        {/* Search Filters */}
        <Form
          form={searchForm}
          layout="vertical"
          onFinish={fetchSchedules}
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col>
              <Form.Item label="Item Type" name="ITEM_TYPE">
                <Select style={{ width: 150 }} defaultValue="PIPE">
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
                    searchForm.resetFields();
                    searchForm.setFieldsValue({ ITEM_TYPE: 'PIPE' });
                    fetchSchedules();
                  }}
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
              loading={loading}
            >
              Group Selected POs by Thickness & Grade
            </Button>
            {showGrouped && (
              <Button 
                style={{ marginLeft: 8 }}
                onClick={() => setShowGrouped(false)}
              >
                Show Original POs
              </Button>
            )}
          </div>
          <div>
            <Text>Selected: {selectedPoItems.length} PO items</Text>
          </div>
        </div>

        {/* PO Items Table or Grouped PO Items Table */}
        {showGrouped ? (
          <Table
            columns={groupedPoColumns}
            dataSource={groupedPoItems}
            rowKey={(record) => `${record.GRADE_SRNO}-${record.THICKNESS_SRNO}-${record.OD_SRNO || 0}`}
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        ) : (
          <Table
            columns={poColumns}
            dataSource={poItems}
            rowKey="SCHEDULE_DT_SRNO"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        )}

        {/* Material Mapping Section */}
        {selectedPo && (
          <div className="mt-8">
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
              extra={
                <Button icon={<SyncOutlined />} onClick={() => fetchMaterialsForPo(selectedPo)}>
                  Refresh
                </Button>
              }
            >
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Available Inventory" key="1">
                  <Table
                    columns={pipeInventoryColumns}
                    dataSource={pipeInventory}
                    rowKey="PR_INV_SRNO"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: <Empty description="No matching inventory found" /> }}
                  />
                </TabPane>
                <TabPane tab="Convertible Raw Materials" key="2">
                  <Table
                    columns={rawMaterialsColumns}
                    dataSource={rawMaterials}
                    rowKey="MATERIAL_SRNO"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: <Empty description="No convertible raw materials found" /> }}
                  />
                </TabPane>
                <TabPane tab="Production Estimates" key="3">
                  <Table
                    columns={productionEstimatesColumns}
                    dataSource={productionEstimates}
                    rowKey={(record) => `${record.GRADE_SRNO}-${record.THICKNESS_SRNO}-${record.OD_SRNO}`}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: <Empty description="No production estimates available" /> }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </div>
        )}

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