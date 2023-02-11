import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import {ProColumnType, ProFormInstance, ProTable, TableDropdown, useDebounceFn} from "@ant-design/pro-components"
import { Button } from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import BankCreateAndUpdate from "./BankCreateAndUpdate";


// "card_id": "222222",
//     "card_image_path": "",
//     "card_owner": "340221199710315501",
//     "name": "许学勤小懒猪",
//     "bank_name": "徽商银行",
//     "remarks": "djtest",
//     "create_time": 1676103084846,
//     "update_time": 1676103084846,
//     "delete_time": 0

const columns: ProColumnType<DataType>[] = [
    {
        title: '银行卡号',
        dataIndex: 'card_id',
        search:false
    },
    // {
    //     title: '银行卡所有人',
    //     dataIndex: 'card_owner'
    // },
    {
        title: '所有人',
        dataIndex: 'name'
    },
    {
        title: '银行',
        dataIndex: 'bank_name'
    },

    {
        title: '备注',
        dataIndex: 'remarks',
        search:false
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        valueType: 'dateTime',
        search:false
    },
    {
        title: '更新时间',
        dataIndex: 'update_time',
        valueType: 'dateTime',
        search:false
    },
    {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    action?.startEditable?.(record.key);
                }}
            >
                编辑
            </a>,
            <TableDropdown
                key="actionGroup"
                onSelect={() => action?.reload()}
                menus={[
                    { key: 'copy', name: '复制' },
                    { key: 'delete', name: '删除' },
                ]}
            />,
        ],
    },
];
const initData = {
    bordered: true,
    loading: false,
    columns,
    size: 'small',
    expandable: false,
    headerTitle: '高级表格',
    tooltip: '高级表格 tooltip',
    showHeader: true,
    footer: true,
    rowSelection: {},
    scroll: false,
    hasData: true,
    tableLayout: undefined,
    toolBarRender: true,
    search: {
        show: true,
        span: 12,
        collapseRender: true,
        labelWidth: 80,
        filterType: 'query',
        layout: 'horizontal',
    },
    options: {
        show: true,
        density: true,
        fullScreen: true,
        setting: true,
    },
};
const genData = (total: number) => {
    if (total < 1) {
        return [];
    }
    const data: DataType[] = [];
    for (let i = 1; i <= total; i += 1) {
        data.push({
            key: i,
            name: 'John Brown',
            age: i + 10,
            time: 1661136793649 + i * 1000,
            address: i % 2 === 0 ? 'london' : 'New York',
            description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
        });
    }
    return data;
};
type DataType = {
    age: number;
    address: string;
    name: string;
    time: number;
    key: number;
    description: string;
};

const Bank = () => {

    const ref = useRef<ProFormInstance>();

    const [config, setConfig] = useState<any>(initData);

    /** 去抖配置 */
    const updateConfig = useDebounceFn(async (state) => {
        setConfig(state);
    }, 20);

    const tableColumns = (config.columns || columns)?.map((item: any) => ({
        ...item,
        ellipsis: config.ellipsis,
    }));

    return <div>


        <ProTable
            {...config}
            formRef={ref}
            pagination={
                config.pagination?.show
                    ? config.pagination
                    : {
                        pageSize: 5,
                    }
            }
            search={config.search?.show ? config.search : {}}
            expandable={
                config.expandable && {
                    expandedRowRender: (record: DataType) => <p>{record.description}</p>,
                }
            }
            options={config.options?.show ? config.options : false}
            toolBarRender={
                config?.toolBarRender
                    ? () => [
                        <BankCreateAndUpdate></BankCreateAndUpdate>,
                        <Button key="refresh" type="primary">
                            刷新
                        </Button>,
                    ]
                    : false
            }
            footer={config.footer ? () => 'Here is footer' : false}
            headerTitle={config.headerTitle}
            columns={tableColumns}
            // dataSource={genData(config.pagination?.total || 10)}


            scroll={config.scroll}
            request={
                ()=>{


                    // "card_id": "222222",
                    //     "card_image_path": "",
                    //     "card_owner": "340221199710315501",
                    //     "name": "许学勤小懒猪",
                    //     "bank_name": "徽商银行",
                    //     "remarks": "djtest",
                    //     "create_time": 1676103084846,
                    //     "update_time": 1676103084846,
                    //     "delete_time": 0


                    return                 axios('/api/bank_card_ms/api_server/v1/bank_cards?page_num=1&page_size=10',{
                        headers:{
                            'Authorization':`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJOYW1lIjoieHV4dWVxaW4iLCJleHAiOjE2NzYxMzIyNDIsImlzcyI6ImdlbWluaS11c2VyYXV0aCJ9.S9hU2n5JgFV_mRS2oy09LG1poBLpP6uGwlurBCopcHA`
                        }
                    }).then(res=>{
                        console.log(res,'res')
                        const data = res.data.data
                        return {
                            data: data.bank_cards,
                            // success 请返回 true，
                            // 不然 table 会停止解析数据，即使有数据
                            success: true,
                            // 不传会使用 data 的长度，如果是分页一定要传
                            total: data.list_count,
                        }
                    })
                }
            }
        />



    </div>
}

export default Bank