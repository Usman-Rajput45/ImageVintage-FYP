import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/global.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "❌ Root element not found. Make sure <div id='root'></div> exists in index.html"
  );
}

createRoot(rootElement).render(<App />);
