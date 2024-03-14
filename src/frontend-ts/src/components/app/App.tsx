import Map from "../map/map";
import NavigationHeader from "../navigation_header/navigation-header";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <NavigationHeader />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Map />} />
          <Route path="/nothome" element={<h1>Goodbye World</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
