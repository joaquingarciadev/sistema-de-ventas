import { useState, useRef, useEffect } from "react";

/**
 * STYLES
 */
/*
.dropdown {
  position: relative;
  z-index: 1;
}

.dropdown-button {
  cursor: pointer;
}

.dropdown-items {
  position: absolute;
  width: 200px;
  opacity: 0;
  pointer-events: none;
  transition: .3s;
}

.dropdown-items.show {
  opacity: 1;
  pointer-events: auto;
}

.dropdown-item {
  background: #fff;
  cursor: pointer;
}
*/

export default function Dropdown({ button, items }) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {button}
      </div>
      <ul className={isOpen ? "dropdown-items show" : "dropdown-items"}>
        {items.map((item, index) => (
          <li
            key={index}
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
