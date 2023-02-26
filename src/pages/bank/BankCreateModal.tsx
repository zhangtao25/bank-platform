import React, { useState } from 'react';
import {Button, Form, Input, Modal, Radio, Select} from 'antd';
import request from "../../helper/request";
import {useNavigate} from "react-router-dom";
import {ProFormSelect} from "@ant-design/pro-components";
import bankList, { genBankList } from "../../data/bankList";

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
    worker_id?:string
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onCancel,
    worker_id
                                                                   }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title="新增银行卡🏦"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ card_owner: worker_id ||''  }}
            >
                <Form.Item
                    name="card_id"
                    label="银行卡号"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                 name="card_owner"
                  label="银行卡所属人"
                >
                <Input />
                </Form.Item>
                <Form.Item
                 name="bank_name"
                  label="银行名称"
                >




                    <Select
                        showSearch={true}
                        filterOption={(input, option) =>{
                            try {
                                return input,option?.label.props.children[1].includes(input)
                            } catch (e) {
                                return false
                            }

                        }}
                        options={genBankList(bankList)}
                        placeholder="请输入银行"
                    />


                </Form.Item>
                <Form.Item
                 name="remarks"
                  label="备注"
                >
                <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const BankCreateModal: React.FC = ({worker_id}:any) => {
    const [open, setOpen] = useState(false);
    const nav = useNavigate()
    const onCreate = (values: any) => {
        console.log(values)
        const random_card_id = values.card_id
        request({
            method:'POST',
            url:'/api/bank_card_ms/api_server/v1/bank_cards/bank_card',
            data:{
                "card_owner":values.card_owner,
                "card_id": values.card_id,
                "bank_name":values.bank_name,
                "remarks":values.remarks
            }
        }).then(res=>{
            nav(`/bank/${random_card_id}`)
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                onClick={() => {
                    setOpen(true);
                }}
            >
                新增银行卡🏦
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false);
                }}
                worker_id={worker_id}
            />
        </div>
    );
};

export default BankCreateModal;
