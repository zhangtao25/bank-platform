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
            title="新增工人👷"
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
                    name="work_id"
                    label="身份证号"
                >
                    <Input />
                </Form.Item>
                 <Form.Item
                  name="name"
                label="姓名"
                >
                   <Input />
                               </Form.Item>
                                               <Form.Item
                                                   name="address"
                                                   label="地址"
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
        const random_work_id = values.work_id
        request({
            method:'POST',
            url:'/api/bank_card_ms/api_server/v1/workers/worker',
            data:{
                "worker_id":random_work_id,
                "name":values.name,
                "address":values.address,
                "sex":1
            }
        }).then(res=>{
            nav(`/worker/${random_work_id}`)
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
                新增工人👷
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
