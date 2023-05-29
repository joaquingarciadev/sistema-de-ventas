import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "./Sidebar";
import Dropdown from "./Dropdown";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

const links = [
  {
    pathname: "/app/add-sale",
    label: "Agregar venta",
    icon: <i className="fa-solid fa-plus"></i>,
  },
  {
    pathname: "/app/sales",
    label: "Ventas",
    icon: <i className="fa-solid fa-chart-line"></i>,
  },
  {
    pathname: "/app/products",
    label: "Productos",
    icon: <i className="fa-solid fa-box"></i>,
  },
];

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const isActive = (path) => path === router.pathname;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="layout">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar}>
        <div className="sidebar">
          <ul>
            {links.map((link) => (
              <li
                key={link.label}
                className={isActive(link.pathname) ? "active" : ""}
              >
                <Link
                  href={link.pathname}
                  replace
                  onClick={() => setShowSidebar(false)}
                >
                  {link.icon}
                  &nbsp;&nbsp;&nbsp;
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Sidebar>
      <div className="sidebar">
        <ul>
          {links.map((link) => (
            <li
              key={link.label}
              className={isActive(link.pathname) ? "active" : ""}
            >
              <Link href={link.pathname} replace>
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="main">
        <div className="header">
          <h2>Sistema de ventas</h2>
          <div className="row">
            <Dropdown
              button={
                <img
                  src={
                    user?.photoURL ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="user"
                />
              }
              items={[
                <Link href="/app/user">Mi cuenta</Link>,
                <span onClick={handleLogout}>Cerrar sesión</span>,
              ]}
            />
            <button
              className="sidebar-toggle"
              onClick={() => setShowSidebar(true)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
