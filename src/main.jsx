import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import { Provider } from "react-redux";
import store from "./store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </main>
    </NextUIProvider>
  </StrictMode>
);
