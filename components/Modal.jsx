import { useState } from "react";

/**
 * STYLES
 */
/* 
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 20px);
  max-width: 500px;
  max-height: calc(100% - 20px);
  padding: 20px;
  background: #fff;
  overflow: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0001;
}

.modal, .modal-overlay {
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.modal.show, .modal-overlay.show {
  opacity: 1;
  pointer-events: auto;
}
*/

export default function Modal({ children, showModal, setShowModal }) {
  // const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={showModal ? "modal-overlay show" : "modal-overlay"}
        onClick={() => setShowModal(false)}
      ></div>
      <div className={showModal ? "modal show" : "modal"}>
        <div className="modal-body">{children}</div>
      </div>
    </>
  );
}
