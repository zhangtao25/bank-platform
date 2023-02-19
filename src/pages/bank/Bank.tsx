import { DownOutlined, ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import {ActionType, ProColumnType, ProFormInstance, ProTable, TableDropdown, useDebounceFn} from "@ant-design/pro-components"
import {Button, Modal} from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import BankCreateAndUpdate from "./BankCreateAndUpdate";
import {useNavigate} from "react-router-dom";
import Delete from "./Delete";
import request from "../../helper/request";
import BankCreateModal from "./BankCreateModal";

const confirm = Modal
// "card_id": "222222",
//     "card_image_path": "",
//     "card_owner": "340221199710315501",
//     "name": "许学勤小懒猪",
//     "bank_name": "徽商银行",
//     "remarks": "djtest",
//     "create_time": 1676103084846,
//     "update_time": 1676103084846,
//     "delete_time": 0


type DataType = {
    age: number;
    address: string;
    name: string;
    time: number;
    key: number;
    description: string;
};

const Bank = () => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumnType<DataType>[] = [
        {
            title: '银行卡号',
            dataIndex: 'card_id',
            search:false
        },
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
            width:'200px',
            render: (text, record, _, action) => [
                <Button type={'link'} onClick={()=>{
                    nav(`/bank/${record.card_id}`)
                }}>编辑</Button>,
                <Delete record={record} updateTable={actionRef?.current?.reload}/>,
            ],
        },
    ];
    const initData = {
        bordered: true,
        loading: false,
        columns,
        size: 'small',
        expandable: false,
        headerTitle: '银行卡列表',
        tooltip: '高级表格 tooltip',
        showHeader: true,
        footer: true,
        scroll: false,
        hasData: true,
        tableLayout: undefined,
        toolBarRender: true,
        search: {
            show: true,
            span: 6,
            collapseRender: false,
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
    const ref = useRef<ProFormInstance>();

    const [config, setConfig] = useState<any>(initData);
    const nav = useNavigate()
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
            actionRef={actionRef}
            {...config}
            formRef={ref}
            pagination={
                config.pagination?.show
                    ? config.pagination
                    : {
                        pageSize: 10,
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
                        <BankCreateModal></BankCreateModal>,
                        <Button key="refresh" type="primary">
                            刷新
                        </Button>,
                    ]
                    : false
            }
            footer={false}
            headerTitle={config.headerTitle}
            columns={tableColumns}
            scroll={config.scroll}
            request={
                (params)=>{
                    return request({
                        url:'/api/bank_card_ms/api_server/v1/bank_cards',
                        params:{
                            page_num:1,
                            page_size:100,
                            worker_name:params.name,
                            bank_name:params.bank_name
                        },
                    }).then(res=>{
                        const data = res.data
                        return {
                            data: data.bank_cards,
                            // success 请返回 true，
                            // 不然 table 会停止解析数据，即使有数据
                            success: true,
                            // 不传会使用 data 的长度，如果是分页一定要传
                            total: data.list_count,
                        }
                    }).catch(err=>{
                        // console.log(err.response)
                        if (err.response.data.code === 154001){
                            localStorage.clear()
                            nav(`/login`)
                        }
                    })
                }
            }
        />



    </div>
}

export default Bank
