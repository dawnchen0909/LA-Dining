import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import RestaurantListPage from "./pages/RestaurantListPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import Login from "./pages/Login";
import Favorite from "./pages/Favorite";
import { UserProvider } from './pages/UserContext';
import History from "./pages/History";
import Recommend from "./pages/Recommend";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route index element={<LoginPage />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/restaurants" element={<RestaurantListPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/history" element={<History />} />
          <Route path="/recommend" element={<Recommend />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
