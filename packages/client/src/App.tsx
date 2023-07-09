import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import Canvas from "./pages/canvas";
import { trpc } from "./utils/trpc";
import { useState } from "react";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import AuthPage from "./pages/auth";
import Home from "./pages/home";
import { API_URL } from "./constants";
import NavBar from "./components/NavBar";
import "./App.scss";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${API_URL}/trpc`,
        }),
      ],
    });
  });

  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="main-container">
            <NavBar />
            <div className="main-content-container">
              <Routes>
                <Route path="/" element={<Navigate to={`user/login`} />}></Route>
                <Route path="/home" element={<Home />} />
                <Route path="/room/:id" element={<Canvas />} />
                <Route path="/user" element={<AuthLayout />}>
                  <Route path="register" element={<Register />} />
                  <Route path="login" element={<Login />} />
                </Route>

                <Route path="*" element={<Navigate to="" />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const AuthLayout = () => {
  return (
    <AuthPage>
      <Outlet />
    </AuthPage>
  );
};

export default App;
