import { PlusOutlined } from '@ant-design/icons';
import {
    DrawerForm,
    ProForm,
    ProFormDateRangePicker,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import bankList from '../data/bankList';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
function genBankList(bl:any) {
    return Object.keys(bl).map(r=>{


        // console.log(bl[r],'bl[r]')
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
    const [form] = Form.useForm<{ name: string; company: string }>();

    return (
        <DrawerForm<{
            name: string;
            company: string;
        }>
            title="新建表单"
            form={form}
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建表单
                </Button>
            }
            autoFocusFirstInput
            drawerProps={{
                destroyOnClose: true,
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
                await waitTime(2000);
                console.log(values.name);
                message.success('提交成功');
                // 不返回不会关闭弹框
                return true;
            }}
        >
            <ProForm.Group>
                <ProFormText
                    name="name"
                    width="md"
                    label="所有人"
                />
                <ProFormText
                    width="md"
                    name="company234"
                    label="所有人身份证"
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormSelect
                    fieldProps={{showSearch:true}}
                    // formItemProps={{sear}}
                    options={genBankList(bankList)}
                    name="name"
                    width="md"
                    label="银行"
                    placeholder="请输入银行"
                />
                <ProFormText
                    width="md"
                    name="company1"
                    label="银行卡号"
                    placeholder="请输银行卡号"
                />
            </ProForm.Group>
        </DrawerForm>
    );
};

export default BankCreateAndUpdate