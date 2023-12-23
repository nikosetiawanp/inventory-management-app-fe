import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import PurchasePage from "./pages/PurchasePage";
import VendorPage from "./pages/VendorPage";
import { createTheme, ThemeProvider } from "@mui/material";

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
            <Route path="/purchase" element={<PurchasePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
