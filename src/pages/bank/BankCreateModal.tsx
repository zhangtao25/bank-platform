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
            </Form>
        </Modal>
    );
};

const BankCreateModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const nav = useNavigate()
    const onCreate = (values: any) => {
        // console.log(values.card_id)
        const random_card_id = values.card_id
        request({
            method:'POST',
            url:'/api/bank_card_ms/api_server/v1/bank_cards/bank_card',
            data:{
                "card_owner":"340203199606121819",
                "card_id": random_card_id,
                "bank_name":"1",
                "remarks":"1"
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
