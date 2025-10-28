import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ isAuthenticated, userInfo, setUserInfo, onLogout }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header 
        isAuthenticated={isAuthenticated} 
        userInfo={userInfo} 
        setUserInfo={setUserInfo}
        onLogout={onLogout} 
      />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
