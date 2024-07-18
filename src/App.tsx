import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

import { QueryClient, QueryClientProvider } from "react-query";
import PurchaseOrderPage from "./pages/Transaction/PurchaseOrderPage";
import DebtPage from "./pages/Debt/DebtPage";
import DebtPaymentPage from "./pages/DebtPaymentPage";
import HomePage from "./pages/HomePage";

import SalesOrderPage from "./pages/SalesOrderPage";
import ContactPage from "./pages/Contact/ContactPage";
import InvoicePage from "./pages/Invoice/InvoicePage";
import InventoryArrivalPage from "./pages/Inventory/InventoryArrivalPage";
import InventoryDeparturePage from "./pages/Inventory/InventoryDeparturePage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import CashPage from "./pages/Cash/CashPage";
import AccountPage from "./pages/Account/AccountPage";
import ProductPage from "./pages/Product/ProductPage";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

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

function App() {
  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Router>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/purchase-order" element={<PurchaseOrderPage />} />
                <Route path="/purchase-invoice" element={<InvoicePage />} />
                <Route path="/sales-order" element={<SalesOrderPage />} />

                <Route path="/debt" element={<DebtPage />} />
                <Route path="/debt-payment" element={<DebtPaymentPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route
                  path="/inventory-arrival"
                  element={<InventoryArrivalPage />}
                />
                <Route
                  path="/inventory-departure"
                  element={<InventoryDeparturePage />}
                />

                <Route path="/cash" element={<CashPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </QueryClientProvider>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

export default App;
