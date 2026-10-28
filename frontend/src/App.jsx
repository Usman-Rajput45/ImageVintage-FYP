import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./router.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import store, { persistor } from "./store";

const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ErrorBoundary>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <AppRouter />
              <ToastContainer position="top-right" />
            </BrowserRouter>
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
};

export default App;
