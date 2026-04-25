import React from "react";
import { Provider } from "react-redux";
import AppRoutes from "./routes/AppRouter";
import { store } from "./app/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;