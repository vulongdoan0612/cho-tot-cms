import MyButton from "@/components/basic/button";
import Page from "@/layout/Page";
import { Image, Modal, Space } from "antd";
import cookie from "cookie";
import useWebSocket from "react-use-websocket";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import { deleteUser, getUsersCMS } from "@/services/accountList";
const { confirm } = Modal;

const Table = dynamic(async () => await import("antd/es/table"), {
  ssr: false,
});
const User = () => {
  const [data, setData] = useState([]);
  const { lastJsonMessage }: any = useWebSocket("wss://cho-tot-be.onrender.com:443");
  useEffect(() => {
    getDataUsers();
  }, []);

  useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage.action === "new-account") {
        getDataUsers();
      }
    }
  }, [lastJsonMessage]);
  const getDataUsers = async () => {
    const token = localStorage.getItem("access_token_cms");

    const response = await getUsersCMS(String(token));

    if (response?.data?.status === "SUCCESS") {
      setData(response?.data?.data);
    }
  };

  const showPropsConfirm = (item: any) => {
    confirm({
      title: "Bạn có chắc sẽ xóa bài viết này và không bao giờ tồn tại chứ?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      async onOk() {
        const token = localStorage.getItem("access_token_cms");
        const data = {
          _id: item,
        };
        const response = await deleteUser(String(token), data);

        if (response?.data?.status === "SUCCESS") {
          getDataUsers();
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const tableColums: any = [
    {
      title: "Id",
      key: "id",
      render: (_: any, record: any) => <div>{record?._id}</div>,
    },
    {
      title: "Avatar",
      key: "avatar",
      render: (_: any, record: any) => {
        return (
          <div>
            <Image
              src={record?.avatar === null ? "/images/empty-avatar.jpg" : record?.avatar}
              width={42}
              height={42}
              alt=""
              preview={false}
              style={{ borderRadius: "100%", objectFit: "cover" }}
            ></Image>
          </div>
        );
      },
    },
    { title: "Họ tên", dataIndex: "fullname", key: "fullname" },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 52,
      render: (text: string, record: any) => {
        return <>{record?.email === "" ? "Chưa cập nhật" : record?.email}</>;
      },
    },
    { title: "Giới tính", dataIndex: "sex", key: "sex", width: 74 },

    { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 100 },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text: string, record: any) => {
        return <>{record?.address?.fullAddress}</>;
      },
    },
    {
      title: "Căn cước công dân",
      dataIndex: "cccd",
      key: "cccd",
      width: 140,
      render: (text: string, record: any) => {
        return <>{record?.identifyCard?.fullCMND}</>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <MyButton type="text" onClick={() => showPropsConfirm(record)}>
            Xóa
          </MyButton>
        </Space>
      ),
    },
  ];

  return (
    <Page>
      <Table dataSource={data} columns={tableColums} scroll={{ x: 1500 }} />
    </Page>
  );
};
export const getServerSideProps = async (context: any) => {
  const cookies = context.req.headers.cookie;
  const parsedCookies = cookies ? cookie.parse(cookies) : {};
  const token = parsedCookies["access_token_cms"];

  if (!token) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
export default User;
