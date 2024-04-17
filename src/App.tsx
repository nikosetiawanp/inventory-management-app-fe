import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

import ProductPage from "./pages/ProductPage";
import ContactPage from "./pages/ContactPage";
import { QueryClient, QueryClientProvider } from "react-query";
import PurchaseOrderPage from "./pages/PurchaseOrderPage";
import InventoryArrivalPage from "./pages/InventoryArrivalPage";
import InventoryPage from "./pages/InventoryPage";
import InventoryDeparturePage from "./pages/InventoryDeparturePage";
import InvoicePage from "./pages/InvoicePage";
import DebtPage from "./pages/DebtPage";
import DebtPaymentPage from "./pages/DebtPaymentPage";
import HomePage from "./pages/HomePage";
import CashPage from "./pages/CashPage";
import AccountPage from "./pages/AccountPage";
import SalesOrderPage from "./pages/SalesOrderPage";

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
    <>
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
    </>
  );
}

export default App;
