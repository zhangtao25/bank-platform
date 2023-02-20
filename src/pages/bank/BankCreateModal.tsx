import React, { useState } from 'react';
import { Button, Form, Input, Modal, Radio } from 'antd';
import request from "../../helper/request";
import {useNavigate} from "react-router-dom";

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onCancel,
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
                initialValues={{ modifier: 'public' }}
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
                <Input />
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

const BankCreateModal: React.FC = () => {
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
            />
        </div>
    );
};

export default BankCreateModal;
