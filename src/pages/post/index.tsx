import MyButton from "@/components/basic/button";
import Page from "@/layout/Page";
import formatDate from "@/utils/convertDate";
import { Image, Modal, Space } from "antd";
import cookie from "cookie";
import useWebSocket from "react-use-websocket";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import { acceptCensorship, deletePost, getPostsCMS, refuseCensorship } from "@/services/accountList";
const { confirm } = Modal;

const Table = dynamic(async () => await import("antd/es/table"), {
  ssr: false,
});
const Home = () => {
  const [data, setData] = useState([]);
  const { lastJsonMessage }: any = useWebSocket("ws://localhost:443");
  useEffect(() => {
    getDataPosts();
  }, []);

  useEffect(() => {
    if (lastJsonMessage) {
      if (lastJsonMessage.action === "post-form" || lastJsonMessage.action === "post-form-edit") {
        getDataPosts();
      }
    }
  }, [lastJsonMessage]);
  const getDataPosts = async () => {
    const token = localStorage.getItem("access_token_cms");

    const response = await getPostsCMS(String(token));

    if (response?.data?.status === "SUCCESS") {
      setData(response?.data?.data);
    }
  };
  const handleRefuse = async (item: any) => {
    const token = localStorage.getItem("access_token_cms");
    const data = { postId: item?.postId };
    const response = await refuseCensorship(String(token), data);

    if (response?.data?.status === "SUCCESS") {
      getDataPosts();
    }
  };
  const handleAccept = async (item: any) => {
    const token = localStorage.getItem("access_token_cms");
    const data = { postId: item?.postId };
    const response = await acceptCensorship(String(token), data);

    if (response?.data?.status === "SUCCESS") {
      getDataPosts();
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
        const data = { postId: item?.postId };
        const response = await deletePost(String(token), data);

        if (response?.data?.status === "SUCCESS") {
          getDataPosts();
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const tableColums = [
    {
      title: "Id",
      key: "postId",
      dataIndex: "postId",
    },
    {
      title: "Đã bán/ Ẩn",
      key: "hidden",
      dataIndex: "hidden",
      width: 110,
      render: (_: any, record: any) => <>{record?.hidden ? "Đã bán/ Ẩn" : "Đang hiển thị"}</>,
    },
    { title: "User Id", dataIndex: "userId", key: "userId" },

    {
      title: "Duyệt",
      dataIndex: "censorship",
      key: "censorship",
      render: (_: any, record: any) => <>{record?.censorship === true ? "Duyệt" : record?.censorship === false ? "Không" : "Chưa duyệt"}</>,
    },

    {
      title: "Ngày đăng",
      dataIndex: "date",
      key: "date",
      render: (_: any, record: any) => <>{formatDate(record?.date)}</>,
    },
    { title: "Tựa đề", dataIndex: "title", key: "title", render: (_: any, record: any) => <>{record?.post?.title}</> },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", width: "600px" }}>
          {record?.post?.image.map((item: any, index: number) => {
            return (
              <Image key={index} src={item?.img} width={50} height={50} style={{ borderRadius: "100%", objectFit: "cover" }} alt=""></Image>
            );
          })}
        </div>
      ),
    },
    {
      title: "Số hình",
      dataIndex: "imagesLength",
      width: 50,
      key: "imagesLength",
      render: (_: any, record: any) => (
        <a target="_blank" href={`http://localhost:3000/${record?.post?.slug}/${record?.postId}`}>
          {record?.post?.image?.length}
        </a>
      ),
    },
    {
      title: "Hãng xe",
      dataIndex: "value",
      key: "value",
      width: 70,
      render: (_: any, record: any) => <>{record?.post?.value}</>,
    },

    {
      title: "Năm sản xuất",
      dataIndex: "dateCar",
      key: "dateCar",
      width: 105,
      render: (_: any, record: any) => <>{record?.post?.dateCar}</>,
    },
    {
      title: "Hộp số",
      dataIndex: "numberBox",
      key: "numberBox",
      render: (_: any, record: any) => <>{record?.post?.numberBox}</>,
    },

    { title: "Xuất xứ", dataIndex: "country", key: "country", render: (_: any, record: any) => <>{record?.post?.country}</> },
    { title: "Số chỗ", dataIndex: "sit", width: 65, key: "sit", render: (_: any, record: any) => <>{record?.post?.sit}</> },
    {
      title: "Biển số xe",
      dataIndex: "carNumber",
      key: "carNumber",
      render: (_: any, record: any) => <>{record?.post?.carNumber}</>,
    },
    {
      title: "Kiểu dáng",
      width: 80,
      dataIndex: "model",
      key: "model",
      render: (_: any, record: any) => <>{record?.post?.model}</>,
    },
    {
      title: "Màu sắc",
      width: 70,
      dataIndex: "color",
      key: "color",
      render: (_: any, record: any) => <>{record?.post?.color}</>,
    },
    {
      title: "Số đời chủ",
      width: 85,
      dataIndex: "owner",
      key: "owner",
      render: (_: any, record: any) => <>{record?.post?.owner}</>,
    },
    {
      title: "Có phụ kiện đi kèm",
      dataIndex: "accessories",
      width: 140,

      key: "accessories",
      render: (_: any, record: any) => <>{record?.post?.accessories}</>,
    },
    {
      title: "Hạn đăng kiểm",
      width: 115,

      dataIndex: "registry",
      key: "registry",
      render: (_: any, record: any) => <>{record?.post?.registry}</>,
    },
    { title: "Số Km", width: 60, dataIndex: "km", key: "km", render: (_: any, record: any) => <>{record?.post?.km}</> },
    {
      title: "Giá bán",
      width: 65,
      dataIndex: "price",
      key: "price",
      render: (_: any, record: any) => <>{record?.post?.price}</>,
    },
    {
      title: "Username",
      dataIndex: "fullName",
      key: "fullName",
      render: (_: any, record: any) => <>{record?.userInfo?.fullName}</>,
    },
    {
      title: "Mô tả chi tiết",
      dataIndex: "introducing",
      width: 200,
      key: "introducing",
      render: (_: any, record: any) => (
        <span
          style={{
            whiteSpace: "nowrap",
            width: "200px",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {record?.post?.introducing}
        </span>
      ),
    },
    { title: "Bạn là", dataIndex: "person", key: "person", render: (_: any, record: any) => <>{record?.post?.person}</> },
    {
      title: "Địa chỉ",
      dataIndex: "fullAddress",
      key: "fullAddress",
      render: (_: any, record: any) => <>{record?.post?.fullAddress}</>,
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="small">
          <>
            {record?.censorship === true ? (
              <MyButton type="text" onClick={(): any => handleRefuse(record)}>
                Từ chối
              </MyButton>
            ) : record?.censorship === false ? (
              <MyButton type="text" onClick={(): any => handleAccept(record)}>
                Duyệt
              </MyButton>
            ) : (
              <MyButton type="text" onClick={(): any => handleAccept(record)}>
                Duyệt
              </MyButton>
            )}
          </>

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
export default Home;
