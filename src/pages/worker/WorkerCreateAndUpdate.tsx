import {
     EditableProTable,
    ProColumns,
    ProForm,
    ProFormSelect,
    ProFormText, ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import bankList from '../../data/bankList';
import {useEffect, useMemo, useState} from "react";
import { useRequest } from 'ahooks';
import {useParams} from "react-router-dom";
import request from '../../helper/request';
import WarningLine from "./WarningLine";


async function updateBanDeal(worker_id,values) {
    // console.log({values})
    // const filterList = values.bank_card_trades
    await request({
        method:'PUT',
        url:`/api/bank_card_ms/api_server/v1/workers/worker/${worker_id}`,
        data:{
            ...values
        }
    }).then(res=>{
        return res
    })

    message.success('update')
}


const columns: ProColumns<DataSourceType>[] = [
    {
        title: '金额',
        key: 'trade_amount',
        dataIndex: 'trade_amount',
        valueType:'digit'
    },
    {
        title: '备注',
        key:'remarks',
        dataIndex: 'remarks',
    },
    {
        title: '交易时间',
        key: 'trade_time',
        dataIndex: 'trade_time',
        valueType:'dateTime',
    },
    {
        title: '操作',
        valueType: 'option',
        width: 200,
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    action?.startEditable?.(record.trade_id);
                }}
            >
                编辑
            </a>,
            <a
                key="delete"
                onClick={() => {
                    console.log('sss')
                }}
            >
                删除
            </a>,
        ],
    },
];

type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
};

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
function genBankList(bl:any) {
    return Object.keys(bl).map(r=>{
        const item = bl[r][0]
        return {
            label:<div style={{display:'flex',alignItems:'center'}}>
                <img src={item.logo} style={{width:'20px',marginRight:'6px'}} alt=""/>
                {item.name}</div>,
            value:r
        }

    })
}
const WorkerCreateAndUpdate = () => {
    const params = useParams()
    const record = {}

    const [form] = Form.useForm<{ name: string; company: string }>();
    const {data:data1} = useRequest(()=>{
        return request({
            method:'GET',
            url:`/api/bank_card_ms/api_server/v1/workers/worker/${params.worker_id}?page_num=1&page_size=10`
        }).then(res=>{
            return res.data
        })
    },{
        onSuccess(res){
            const item = res.worker_info
            form.setFieldsValue({
                name:item.name,
                worker_id:item.worker_id,
                remarks:item.remarks,
                address:item.address,
                sex:item.sex
            })
        }
    })
    const data = useMemo(()=>{
        if (data1?.trade_list?.bank_card_trades === null){
            return []
        } else {
            return data1?.trade_list?.bank_card_trades|| undefined
        }

    },[data1])
    useEffect(()=>{
        // if (record){
        //     form.setFieldsValue({
        //         name:record.name,
        //         card_owner:record.card_owner,
        //         bank_name:record.bank_name,
        //         card_id:record.card_id,
        //         remarks:record.remarks
        //     })
        // }

    },[record])

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
        (data||[]).map((item) => item.trade_id),
    );

    return (
        <ProForm
            form={form}
            formKey="base-form-use-demo"
            onFinish={(values)=>{
                return new Promise(resolve => {
                    updateBanDeal(params.worker_id,values)
                    resolve(true)
                })
            }}
        >
            <ProForm.Group>
                <ProFormText
                    name="name"
                    width="md"
                    label="姓名"
                />
                <ProFormText
                    width="md"
                    name="worker_id"
                    label="身份证"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormSelect
                    options={[
                        {
                            label: '男',
                            value: 1
                        },
                        {
                            label:'女',
                            value: 2
                        }
                    ]}
                    name="sex"
                    width="md"
                    label="性别"
                />
                <ProFormText
                    width="md"
                    name="address"
                    label="地址"
                />
            </ProForm.Group>

            <ProForm.Group>
                <ProFormTextArea
                    width="md"
                    name="remarks"
                    label="备注"
                    placeholder="请填写备注"
                />
            </ProForm.Group>
            <ProForm.Group>
                {
                    data!==undefined?(                <ProForm.Item
                        label={<WarningLine record={data}></WarningLine>}
                        name="bank_card_trades"
                        initialValue={data||[]}
                        trigger="onValuesChange"
                    >
                        <EditableProTable<DataSourceType>
                            rowKey="trade_id"
                            toolBarRender={false}
                            columns={columns}
                            recordCreatorProps={{
                                newRecordType: 'dataSource',
                                position: 'top',
                                record: () => ({
                                    is_new: true,
                                    trade_id: String(Math.random())
                                }),
                            }}
                            editable={{
                                type: 'multiple',
                                editableKeys,
                                onChange: setEditableRowKeys,
                                actionRender: (row, config, defaultDom) => {
                                    return [
                                        defaultDom.save,
                                        defaultDom.delete || defaultDom.cancel,
                                    ];
                                },
                            }}
                        />
                    </ProForm.Item>):null
                }

            </ProForm.Group>
        </ProForm>
    );
};

export default WorkerCreateAndUpdate
