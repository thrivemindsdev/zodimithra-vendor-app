import { useLocation } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useGetUserDetailsQuery } from "../redux/api/authApi";

export default function MainLayout({ children }) {
  const location = useLocation();
  const bottomNavPaths = ["/", "/messages", "/live", "/tools", "/profile"];
  const hideFooter = !bottomNavPaths.includes(location.pathname);

  const token = localStorage.getItem('token');
  const { data, error, isLoading } = useGetUserDetailsQuery(undefined, {
    skip: !token,
  });
  const userData = data?.data || data;
  const role = userData?.role;

  return (
    <div className="flex justify-center items-start min-h-screen p-0 m-0 bg-linear-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF]">
      <div className="w-full min-h-screen bg-linear-to-b from-[#FFEEDE] via-[#FFF3E0] to-[#DEEBFF] shadow-[0px_10px_40px_rgba(0,0,0,0.12)] flex flex-col relative overflow-y-auto overflow-x-hidden">
        {children}
      </div>
      {role == "asramam" || isLoading ? null : <>{!hideFooter && <Footer />}</>}
    </div>
  );
}
