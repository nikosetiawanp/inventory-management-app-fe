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

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
import InventoryPage from "./pages/Inventory/InventoryPage";
import TransactionPage from "./pages/Transaction/TransactionPage";
import CompletedTransactionPage from "./pages/Transaction/CompletedTransactionPage";

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
            </Router>
          </ThemeProvider>
        </QueryClientProvider>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

export default App;
