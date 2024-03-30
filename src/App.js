import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Home />
      <Toaster />
    </>
  );
}

export default App;
