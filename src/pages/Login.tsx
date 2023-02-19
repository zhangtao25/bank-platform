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
                    nav(`/bank`)
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
              <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
            </Tabs>
            {loginType === 'account' && (
                <>
                  <ProFormText
                      name="username"
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'用户名: admin or user'}
                      rules={[
                        {
                          required: true,
                          message: '请输入用户名!',
                        },
                      ]}
                  />
                  <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                      }}
                      placeholder={'密码: ant.design'}
                      rules={[
                        {
                          required: true,
                          message: '请输入密码！',
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
                      placeholder={'手机号'}
                      rules={[
                        {
                          required: true,
                          message: '请输入手机号！',
                        },
                        {
                          pattern: /^1\d{10}$/,
                          message: '手机号格式错误！',
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
                      placeholder={'请输入验证码'}
                      captchaTextRender={(timing, count) => {
                        if (timing) {
                          return `${count} ${'获取验证码'}`;
                        }
                        return '获取验证码';
                      }}
                      name="captcha"
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ]}
                      onGetCaptcha={async () => {
                        message.success('获取验证码成功！验证码为：1234');
                      }}
                  />
                </>
            )}
          </LoginForm>
        </div>
      </ProConfigProvider>
  );
};
