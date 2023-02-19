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


async function updateBanDeal(card_id,values) {
    const filterList = values.bank_card_trades
    for (let i = 0; i <filterList.length ; i++) {
        const d = filterList[i]
        if (d.is_new){
            await request({
                method:'POST',
                url:`/api/bank_card_ms/api_server/v1/bank_cards/bank_card/${card_id}/trades`,
                data:{
                    ...d,
                    card_id,
                    trade_time:new Date(d.trade_time).getTime(),
                }
            }).then(res=>{
                return res
            })
        } else {
            await request({
                method:'PUT',
                url:`/api/bank_card_ms/api_server/v1/bank_cards/bank_card/${card_id}/trades/${d.trade_id}`,
                data:{
                    ...d,
                    card_id,
                    trade_time:new Date(d.trade_time).getTime(),
                }
            }).then(res=>{
                return res
            })
        }
    }



    await request({
        method:'PUT',
        url:`/api/bank_card_ms/api_server/v1/bank_cards/bank_card/${card_id}`,
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
const BankCreateAndUpdate = () => {
    const params = useParams()
    const record = {}

    const [form] = Form.useForm<{ name: string; company: string }>();
    const {data:data1} = useRequest(()=>{
        return request({
            method:'GET',
            url:`/api/bank_card_ms/api_server/v1/bank_cards/bank_card/${params.card_id}?page_num=1&page_size=100`
        }).then(res=>{
            return res.data
        })
    },{
        onSuccess(res){
            const item = res.bank_card_info
            form.setFieldsValue({
                bank_name:item.bank_name,
                card_owner:item.card_owner,
                card_id:item.card_id,
                remarks:item.remarks,
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


    const {data:workersOptions} = useRequest(()=>{
        return request({
            method:'GET',
            url:`/api/bank_card_ms/api_server/v1/workers?page_num=1&page_size=100`
        }).then(res=>{
            return res.data.workers.map(i=>({
                value:i.worker_id,
                label:i.name
            }))
        })
    },{
        onSuccess(res){
        }
    })


    return (
        <ProForm
            form={form}
            formKey="base-form-use-demo"
            onFinish={(values)=>{
                return new Promise(resolve => {
                    updateBanDeal(params.card_id,values)
                    resolve(true)
                })
            }}
        >
            <ProForm.Group>
                <ProFormSelect
                    fieldProps={{showSearch:true,filterOption:(input, option) =>{
                        console.log(input,option)
                            try {
                                return input,option?.label.includes(input)
                            } catch (e) {
                                return false
                            }

                        }
                    }}
                    name={'card_owner'}
                    options={workersOptions}
                    width="md"
                    label="所有人"
                />
                <ProFormText
                    readonly={true}
                    name={'card_owner'}
                    width="md"
                    label="身份证"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormSelect
                    fieldProps={{showSearch:true,filterOption:(input, option) =>{
                        try {
                            return input,option?.label.props.children[1].includes(input)
                        } catch (e) {
                            return false
                        }

                        }
                    }}
                    options={genBankList(bankList)}
                    name="bank_name"
                    width="md"
                    label="银行"
                    placeholder="请输入银行"
                />
                <ProFormText
                    readonly={record?true:false}
                    width="md"
                    name="card_id"
                    label="银行卡号"
                    placeholder="请输银行卡号"
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

export default BankCreateAndUpdate
