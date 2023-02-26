import { DownOutlined, ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import {ActionType, ProColumnType, ProFormInstance, ProTable, TableDropdown, useDebounceFn} from "@ant-design/pro-components"
import {Button, Modal} from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import WorkerCreateAndUpdate from "./WorkerCreateAndUpdate";
import {useNavigate} from "react-router-dom";
import Delete from "./Delete";
import request from "../../helper/request";
import WorkCreateModal from "./WorkCreateModal";

const confirm = Modal
type DataType = {
    age: number;
    address: string;
    name: string;
    time: number;
    key: number;
    description: string;
};

const Worker = () => {


    // "worker_id": "340203199606121819",
    //     "name": "代军",
    //     "address": "shanghai",
    //     "sex": 1,
    //     "create_time": 1674981290965,
    //     "update_time": 1674991671843,
    //     "delete_time": 0,
    //     "remarks": ""
    //
    const actionRef = useRef<ActionType>();
    const columns: ProColumnType<DataType>[] = [

        {
            title: '身份证号',
            dataIndex: 'worker_id'
        },
        {
            title: '姓名',
            dataIndex: 'name'
        },
        {
            title: '地址',
            dataIndex: 'address',
            search:false
        },
        {
            title: '性别',
            dataIndex: 'sex',
            valueEnum:new Map([[1,'男'],[0,'女']]),
            search:false
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
                    nav(`/worker/${record.worker_id}`)
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
        headerTitle: '工人列表',
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
                        <WorkCreateModal/>,
                        <Button key="refresh" type="primary">
                            刷新
                        </Button>,
                    ]
                    : false
            }
            footer={false}
            headerTitle={config.headerTitle}
            columns={tableColumns}
            // dataSource={genData(config.pagination?.total || 10)}


            scroll={config.scroll}
            request={
                (params, sort, filter)=>{
                    return request({
                        url:'/api/bank_card_ms/api_server/v1/workers',
                        params:{
                            page_num:1,
                            page_size:100,
                            worker_name:params.name,
                            worker_id:params.worker_id
                        },
                    }).then(res=>{
                        // console.log(res.data)

                        const data = res.data
                        return {
                            data: data.workers,
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

export default Worker
