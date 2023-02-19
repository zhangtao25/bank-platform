import {
    CaretDownFilled,
    DoubleRightOutlined,
    ExclamationCircleFilled,
    GithubFilled,
    InfoCircleFilled, LogoutOutlined,
    PlusCircleFilled,
    QuestionCircleFilled,
    SearchOutlined,
} from '@ant-design/icons';
import platformLogo from '../assets/react.svg'
import type { ProSettings } from '@ant-design/pro-components';
import {
    PageContainer,
    ProCard,
    ProConfigProvider,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button, Divider, Dropdown, Input, Modal, Popover, theme } from 'antd';
import React, { useState } from 'react';
import defaultProps from './_defaultProps';
import {Outlet, useNavigate, useRoutes} from "react-router-dom";
import routerConfig from "../router";
const { confirm } = Modal;

const showPromiseConfirm = () => {
    confirm({
        title: 'Do you want to delete these items?',
        icon: <ExclamationCircleFilled />,
        content: 'When clicked the OK button, this dialog will be closed after 1 second',
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {},
    });
};
const Item: React.FC<{ children: React.ReactNode }> = (props) => {
    const { token } = theme.useToken();
    return (
        <div
            className={css`
        color: ${token.colorTextSecondary};
        font-size: 14px;
        cursor: pointer;
        line-height: 22px;
        margin-bottom: 8px;
        &:hover {
          color: ${token.colorPrimary};
        }
      `}
            style={{
                width: '33.33%',
            }}
        >
            {props.children}
            <DoubleRightOutlined
                style={{
                    marginInlineStart: 4,
                }}
            />
        </div>
    );
};

const List: React.FC<{ title: string; style?: React.CSSProperties }> = (props) => {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                width: '100%',
                ...props.style,
            }}
        >
            <div
                style={{
                    fontSize: 16,
                    color: token.colorTextHeading,
                    lineHeight: '24px',
                    fontWeight: 500,
                    marginBlockEnd: 16,
                }}
            >
                {props.title}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                {new Array(6).fill(1).map((_, index) => {
                    return <Item key={index}>具体的解决方案-{index}</Item>;
                })}
            </div>
        </div>
    );
};

const MenuCard = () => {
    const { token } = theme.useToken();
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
        </div>
    );
};

const SearchInput = () => {
    const { token } = theme.useToken();
    return (
        <div
            key="SearchOutlined"
            aria-hidden
            style={{
                display: 'flex',
                alignItems: 'center',
                marginInlineEnd: 24,
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            <Input
                style={{
                    borderRadius: 4,
                    marginInlineEnd: 12,
                    backgroundColor: token.colorBgTextHover,
                }}
                prefix={
                    <SearchOutlined
                        style={{
                            color: token.colorTextLightSolid,
                        }}
                    />
                }
                placeholder="搜索方案"
                bordered={false}
            />
            <PlusCircleFilled
                style={{
                    color: token.colorPrimary,
                    fontSize: 24,
                }}
            />
        </div>
    );
};

export default () => {
    const nav = useNavigate()
    const routesContent = useRoutes(routerConfig)

    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
        layout: 'mix',
        splitMenus: true,
    });

    const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');
    const [num, setNum] = useState(40);
    return (
        <div
            id="test-pro-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProConfigProvider hashed={false}>
                <ProLayout
                    onPageChange={(v)=>{
                        console.log(v)

                        // nav(`/${v?.pathname}`)

                    }}
                    prefixCls="my-prefix"
                    bgLayoutImgList={[
                        {
                            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                            left: 85,
                            bottom: 100,
                            height: '303px',
                        },
                        {
                            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
                            bottom: -68,
                            right: -45,
                            height: '303px',
                        },
                        {
                            src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
                            bottom: 0,
                            left: 0,
                            width: '331px',
                        },
                    ]}
                    {...defaultProps}
                    location={{
                        pathname,
                    }}
                    siderMenuType="group"
                    menu={{
                        collapsedShowGroupTitle: true,
                    }}
                    avatarProps={{
                        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                        size: 'small',
                        title: localStorage.getItem('display_name'),
                        render: (props, dom) => {
                            return (
                                <Dropdown
                                    menu={{
                                        onClick(e){
                                            console.log(123)
                                            localStorage.clear()
                                            window.location.href = '/login'
                                        },
                                        items: [
                                            {
                                                key: 'logout',
                                                icon: <LogoutOutlined />,
                                                label: '退出登录',
                                            },
                                        ],
                                    }}
                                >
                                    {dom}
                                </Dropdown>
                            );
                        },
                    }}
                    actionsRender={(props) => {
                        if (props.isMobile) return [];
                        return [
                        ];
                    }}
                    headerTitleRender={(logo, title, _) => {
                        const defaultDom = (
                            <a>
                                <img src={platformLogo} alt=""/>
                                {'银行卡流水管理系统'}
                            </a>
                        );
                        if (document.body.clientWidth < 1400) {
                            return defaultDom;
                        }
                        if (_.isMobile) return defaultDom;
                        return (
                            <>
                                {defaultDom}
                                <MenuCard />
                            </>
                        );
                    }}
                    menuFooterRender={(props) => {
                        if (props?.collapsed) return undefined;
                        return (
                            <div
                                style={{
                                    textAlign: 'center',
                                    paddingBlockStart: 12,
                                }}
                            >
                            </div>
                        );
                    }}
                    onMenuHeaderClick={(e) => console.log(e)}
                    menuItemRender={(item, dom) => (
                        <div
                            onClick={() => {
                                console.log(item)
                                nav(item.path || '/welcome')
                                // setPathname(item.path || '/welcome');
                            }}
                        >
                            {dom}
                        </div>
                    )}
                    {...settings}
                >
                    <PageContainer
                        token={{
                            paddingInlinePageContainerContent: num,
                        }}
                    >
                        <ProCard
                            style={{
                                height: '200vh',
                                minHeight: 800,
                            }}
                        >
                            {routesContent}
                        </ProCard>
                    </PageContainer>

                    <SettingDrawer
                        pathname={pathname}
                        enableDarkTheme
                        getContainer={() => document.getElementById('test-pro-layout')}
                        settings={settings}
                        onSettingChange={(changeSetting) => {
                            setSetting(changeSetting);
                        }}
                        disableUrlParams={false}
                    />
                </ProLayout>
            </ProConfigProvider>
        </div>
    );
};
