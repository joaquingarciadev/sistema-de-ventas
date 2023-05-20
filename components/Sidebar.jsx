import { useState } from "react";

/**
 * STYLES
 */
/* 
.sidebar {
  position: fixed;
  top: 0;
  left: -100%;
  max-width: 250px;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
  overflow: auto;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0001;
}

.sidebar, .sidebar-overlay {
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.sidebar.show, .sidebar-overlay.show {
  opacity: 1;
  pointer-events: auto;
}

.sidebar.show {
    left: 0;
}
*/

export default function Sidebar({ children, showSidebar, setShowSidebar }) {
  return (
    <>
      <div
        className={showSidebar ? "sidebar-overlay show" : "sidebar-overlay"}
        onClick={() => setShowSidebar(false)}
      ></div>
      <div className={showSidebar ? "sidebar-responsive show" : "sidebar-responsive"}>
        <div className="sidebar-body">{children}</div>
      </div>
    </>
  );
}
