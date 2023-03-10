import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProConfigProvider,
} from '@ant-design/pro-components';
import { message, Space, Tabs } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
  marginInlineStart: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const nav = useNavigate()
  return (
      <ProConfigProvider hashed={false}>
        <div style={{ backgroundColor: 'white' }}>
          <LoginForm
              logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
              title="Blank platform"
              subTitle=""
              onFinish={(values)=>{
                console.log(values)


                axios.post(`/api/bank_card_ms/api_server/v1/users/user/login`,{user_name:values.username,password:values.password}).then(res=>{
                  console.log(res.data)
                  if (res.data.code === 0){
                    localStorage.setItem('token',res.data.data.token)
                      localStorage.setItem('display_name',res.data.data.display_name)
                    nav(`/worker`)
                  } else {
                    message.error(JSON.stringify(res.data))
                  }
                })

                return new Promise(resolve => {
                  resolve(true)
                })
              }}
          >
            <Tabs
                centered
                activeKey={loginType}
                onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            >
              <Tabs.TabPane key={'account'} tab={'??????????????????'} />
            </Tabs>
            {loginType === 'account' && (
                <>
                  <ProFormText
                      name="username"
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'?????????: admin or user'}
                      rules={[
                        {
                          required: true,
                          message: '??????????????????!',
                        },
                      ]}
                  />
                  <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'??????: ant.design'}
                      rules={[
                        {
                          required: true,
                          message: '??????????????????',
                        },
                      ]}
                  />
                </>
            )}
            {loginType === 'phone' && (
                <>
                  <ProFormText
                      fieldProps={{
                        size: 'large',
                        prefix: <MobileOutlined className={'prefixIcon'} />,
                      }}
                      name="mobile"
                      placeholder={'?????????'}
                      rules={[
                        {
                          required: true,
                          message: '?????????????????????',
                        },
                        {
                          pattern: /^1\d{10}$/,
                          message: '????????????????????????',
                        },
                      ]}
                  />
                  <ProFormCaptcha
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      captchaProps={{
                        size: 'large',
                      }}
                      placeholder={'??????????????????'}
                      captchaTextRender={(timing, count) => {
                        if (timing) {
                          return `${count} ${'???????????????'}`;
                        }
                        return '???????????????';
                      }}
                      name="captcha"
                      rules={[
                        {
                          required: true,
                          message: '?????????????????????',
                        },
                      ]}
                      onGetCaptcha={async () => {
                        message.success('???????????????????????????????????????1234');
                      }}
                  />
                </>
            )}
          </LoginForm>
        </div>
      </ProConfigProvider>
  );
};
