import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

import ProductPage from "./pages/ProductPage";
import VendorPage from "./pages/VendorPage";
import PurchaseRequisitionPage from "./pages/PurchaseRequisitionPage";
import { QueryClient, QueryClientProvider } from "react-query";
import PurchaseOrderPage from "./pages/PurchaseOrderPage";
import InventoryArrivalPage from "./pages/InventoryArrivalPage";
import InventoryPage from "./pages/InventoryPage";
import InventoryDeparturePage from "./pages/InventoryDeparturePage";

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
              <Route path="/vendor" element={<VendorPage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route
                path="/purchase-requisition"
                element={<PurchaseRequisitionPage />}
              />
              <Route path="/purchase-order" element={<PurchaseOrderPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route
                path="/inventory-arrival"
                element={<InventoryArrivalPage />}
              />
              <Route
                path="/inventory-departure"
                element={<InventoryDeparturePage />}
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
