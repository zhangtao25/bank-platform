import { ExclamationCircleFilled } from "@ant-design/icons";
import {Modal} from "antd";
import axios from "axios";

const { confirm } = Modal;

const Delete = ({record,updateTable}) => {
    const showPropsConfirm = () => {
        confirm({
            title: '确认删除？',
            icon: <ExclamationCircleFilled />,
            content: '真的删除？',
            okText: 'Yes',
            okType: 'danger',
            okButtonProps: {
                // disabled: true,
            },
            cancelText: 'No',
            onOk() {
                axios.delete(`/api/bank_card_ms/api_server/v1/bank_cards/bank_card/${record.card_id}`,{
                    headers:{
                        'Authorization':`Bearer ${localStorage.getItem('token')||''}`
                    }
                }).then(r=>{
                    updateTable()
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
  return <a onClick={showPropsConfirm} style={{color:'red'}}>删除</a>
}

export default Delete
