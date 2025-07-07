import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home"; 
import NotFound from "./pages/NotFound"; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/home" element={<Home />} />
         <Route path="*" element={<NotFound />} /> {/* หน้าสำหรับ path อื่น ๆ */}
      </Routes>
    </Router>
  );
}

export default App;
