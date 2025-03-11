import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import AuthProvider

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
