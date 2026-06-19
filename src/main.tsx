import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "antd/dist/reset.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import router from "./routes/routes";
import ptBR from "antd/es/locale/pt_BR";
import { ConfigProvider ,theme } from "antd";
import "./styles/global.css";
import App from "./App";


const queryClient = new QueryClient();

const customTheme = {
  
  token: {
    colorButton: "#001529",
    colorPrimary: "#005bac",
    borderRadius: 0,
    fontFamily: "'Segoe UI', sans-serif",
    colorBgLayout: "#f5f6fa",
  },
  components: {
    Skeleton: {
      gradientFromColor: "rgba(0,0,0,0.06)",
      gradientToColor: "rgba(0,0,0,0.11)",
    },
    Button: {
      colorPrimary: "#005bac",
    },
    Layout: {
      headerBg: "#001529",
      siderBg: "#001529",
    },
  },
};

async function bootstrap() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <ConfigProvider 
      //   theme={{
      //   algorithm: theme.darkAlgorithm,
      // }}
    
    theme={customTheme} 
    locale={ptBR}>
      {/* <React.StrictMode> */}
      {/* <AuthProvider> */}
        <QueryClientProvider client={queryClient}>
       
            {/* <RouterProvider router={router} /> */}
         <App/>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      {/* </AuthProvider> */}
      {/* </React.StrictMode> */}
    </ConfigProvider>
  );
}

bootstrap();