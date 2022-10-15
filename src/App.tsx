import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./authentication/identity";
import Routes from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
