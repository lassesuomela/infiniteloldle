import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Tooltip } from "react-tooltip";

export default function Modifications() {
  const [isShown, setIsShown] = useState(false);
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);

  // Todo: use effect read states from local storage
  useEffect(() => {
    const _colorMode = localStorage.getItem("isColorBlindMode", false);
    if (_colorMode !== null) {
      setIsColorBlindMode(_colorMode);
    }
  }, []);

  const ToggleState = () => {
    setIsShown(!isShown);
  };

  const ToggleColorBlindMode = () => {
    setIsColorBlindMode(!isColorBlindMode);
    localStorage.setItem("isColorBlindMode", !isColorBlindMode);
  };

  return (
    <>
      <button
        onClick={ToggleState}
        className="btn btn-dark darkBtn p-2 pb-0"
        data-tooltip-id="modifications-tooltip"
        data-tooltip-content="Modifications"
      >
        <span className="material-symbols-outlined">build</span>
        <Tooltip id="modifications-tooltip" />
      </button>

      <Modal
        show={isShown}
        onHide={ToggleState}
        size="lg"
        centered
        className="transparentModal"
      >
        <Modal.Body>
          <div className="container d-flex justify-content-center">
            <div className="card text-center">
              <Modal.Header closeButton></Modal.Header>

              <h3 className="pb-4">Modifications</h3>

              <h5>Blur options</h5>
              <div className="pt-2 pb-4 d-flex justify-content-center gap-2">
                <button className="btn btn-dark">Default</button>
                <button className="btn btn-dark">Blocky</button>
              </div>
              <h5>Difficulty</h5>
              <div className="pt-2 pb-4 d-flex justify-content-center gap-2">
                <button className="btn btn-dark">Monochrome</button>
                <button className="btn btn-dark">Random rotate</button>
                <button className="btn btn-dark">Zoom</button>
                <button className="btn btn-dark">Hide resource</button>
              </div>
              <div className="pt-2 pb-3">
                <h5>Colorblind mode</h5>
                <div class="form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    onClick={() => ToggleColorBlindMode()}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
