import "@/styles/global.scss";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { QueryParamProvider } from "use-query-params";
import NextAdapterPages from "next-query-params/pages";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      {" "}
      <ToastContainer />
      <QueryParamProvider adapter={NextAdapterPages}>
        <Component {...pageProps} />
      </QueryParamProvider>{" "}
    </Provider>
  );
}
