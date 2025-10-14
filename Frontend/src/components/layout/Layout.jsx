import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ isAuthenticated, userInfo, setUserInfo, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        isAuthenticated={isAuthenticated} 
        userInfo={userInfo} 
        setUserInfo={setUserInfo}
        onLogout={onLogout} 
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
