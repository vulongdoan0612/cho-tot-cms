import cookie from "cookie";

const Home = () => {
  return <div></div>;
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
  } else {
    return {
      redirect: {
        destination: `/post`,
        permanent: false,
      },
    };
  }
};
export default Home;
