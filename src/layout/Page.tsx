import React, { useEffect, useMemo, useState } from "react";
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, Space, Spin, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDataCMS } from "@/redux/reducers/auth";
import { MenuProps } from "rc-menu";
import { useRouter } from "next/router";
import { logout } from "@/services/auth";
import Link from "next/link";
import Head from "next/head";
interface PropsPage {
  children: React.ReactNode;
  style?: any;
}

const Page = (props: PropsPage) => {
  const { Header, Sider, Content } = Layout;
  const { children, style } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [ske, setSke] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const content = useMemo(() => {
    return <>{children}</>;
  }, [children]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const token = localStorage.getItem("access_token_cms");
    try {
      if (token) {
        dispatch(fetchDataCMS({ setSke }));
      } else {
        setSke(false);
      }
    } catch {
      console.log("error");
    }
  };
  const handleLogOut = () => {
    router.push("/login");
    logout(dispatch);
  };
  const items: MenuProps["items"] = [
    {
      label: <span onClick={handleLogOut}>Đăng xuất</span>,
      key: "3",
    },
  ];
  return (
    <Layout className="page" id="page" style={style}>
      <Head>
        <title>Admin Chợ Tốt</title>
        <meta name="description" content="Admin Chợ Tốt" />
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <VideoCameraOutlined />,
              label: <Link href="/post">Quản lý bài đăng</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <Link href="/user">Quản lý người dùng</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />{" "}
          <div className="right-header">
            {isAuthenticated ? (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <div className="admin">Admin</div>
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <div className="login">Login</div>
            )}
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {content}
        </Content>
      </Layout>
      <Spin spinning={ske} fullscreen></Spin>
    </Layout>
  );
};

export default Page;
