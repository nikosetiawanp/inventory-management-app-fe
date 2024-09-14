import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

import { QueryClient, QueryClientProvider } from "react-query";
import DebtPage from "./pages/Debt/DebtPage";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/Contact/ContactPage";
import InvoicePage from "./pages/Invoice/InvoicePage";
import CashPage from "./pages/Cash/CashPage";
import AccountPage from "./pages/Account/AccountPage";
import ProductPage from "./pages/Product/ProductPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import TransactionPage from "./pages/Transaction/TransactionPage";
import CompletedTransactionPage from "./pages/Transaction/CompletedTransactionPage";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createContext, useContext, useState } from "react";
import { IconButton, Snackbar } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

// Define material theme
const materialTheme = materialExtendTheme();
const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    mode: "light",
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
    },
  },
});

// Notification context setup
interface Notification {
  open: boolean;
  message: string;
  color: "primary" | "neutral" | "danger" | "success" | "warning";
}

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [alert, setAlert] = useState<Notification>({
    open: false,
    message: "",
    color: "neutral",
  });

  const closeAlert = () => setAlert({ ...alert, open: false });

  const triggerAlert = ({ message, color }: Notification) => {
    setAlert({
      open: true,
      message: message || "No message provided",
      color: color || "neutral",
    });
  };

  return (
    <NotificationContext.Provider value={{ alert, setAlert, triggerAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        color={alert.color}
        variant="soft"
        endDecorator={
          <IconButton
            onClick={closeAlert}
            size="sm"
            variant="soft"
            color={alert.color}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {alert.message}
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context; // Return alert, setAlert, and triggerAlert
};

// App component setup
function App() {
  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Router>
              <NotificationProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/product" element={<ProductPage />} />
                  <Route
                    path="/purchase-order"
                    element={<TransactionPage type="P" />}
                  />
                  <Route
                    path="/purchase-invoice"
                    element={<InvoicePage type="P" />}
                  />
                  <Route
                    path="/purchase"
                    element={<CompletedTransactionPage type="P" />}
                  />
                  <Route
                    path="/sales-order"
                    element={<TransactionPage type="S" />}
                  />
                  <Route
                    path="/sales-invoice"
                    element={<InvoicePage type="S" />}
                  />
                  <Route
                    path="/sales"
                    element={<CompletedTransactionPage type="S" />}
                  />
                  <Route path="/debt" element={<DebtPage type="D" />} />
                  <Route path="/receivable" element={<DebtPage type="R" />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/cash" element={<CashPage />} />
                  <Route path="/account" element={<AccountPage />} />
                </Routes>
              </NotificationProvider>
            </Router>
          </ThemeProvider>
        </QueryClientProvider>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

export default App;
