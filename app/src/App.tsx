import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Radio from "./pages/Radio";
import Training from "./pages/Training";
import Backpack from "./pages/Backpack";
import Showcase from "./pages/Showcase";
import Egg from "./pages/Egg";
import Guide from "./pages/Guide";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/radio" element={<Radio />} />
            <Route path="/training" element={<Training />} />
            <Route path="/backpack" element={<Backpack />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/egg" element={<Egg />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
