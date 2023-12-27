import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";

import ProductPage from "./pages/ProductPage";
import VendorPage from "./pages/VendorPage";
import PurchaseRequisitionPage from "./pages/PurchaseRequisitionPage";

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
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/vendor" element={<VendorPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route
              path="/purchaserequisition"
              element={<PurchaseRequisitionPage />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
