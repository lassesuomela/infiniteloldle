import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Tooltip } from "react-tooltip";
import { useSelector, useDispatch } from "react-redux";

export default function Modifications() {
  const [isShown, setIsShown] = useState(false);

  const blurMode = useSelector((state) => state.blurModeReducer.blurMode);
  const isColorBlindMode = useSelector(
    (state) => state.colorBlindReducer.isColorBlindMode
  );
  const hideResource = useSelector(
    (state) => state.hideResourceReducer.hideResource
  );
  const dispatch = useDispatch();
  const toggleColorBlindMode = () => {
    dispatch({ type: "TOGGLE_COLOR_BLIND" });
    localStorage.setItem("isColorBlindMode", !isColorBlindMode);
  };
  const toggleHideResource = () => {
    dispatch({ type: "TOGGLE_HIDE_RESOURCE" });
    localStorage.setItem("hideResource", !hideResource);
  };
  const changeBlurMode = (type) => {
    dispatch({ type: type });
    localStorage.setItem("blurMode", type === "DEFAULT" ? "default" : "blocky");
  };

  return (
    <>
      <button
        onClick={() => setIsShown(!isShown)}
        className="btn btn-dark darkBtn p-2 pb-0"
        data-tooltip-id="modifications-tooltip"
        data-tooltip-content="Modifications"
      >
        <span className="material-symbols-outlined">build</span>
        <Tooltip id="modifications-tooltip" />
      </button>

      <Modal
        show={isShown}
        onHide={() => setIsShown(!isShown)}
        size="lg"
        centered
        className="transparentModal"
      >
        <Modal.Body>
          <div className="container d-flex justify-content-center">
            <div className="card text-center">
              <Modal.Header closeButton></Modal.Header>

              <h3 className="pb-4">Modifications</h3>

              <h5>Blur mode</h5>
              <div className="pt-2 pb-4 d-flex justify-content-center gap-2">
                <button
                  className={
                    blurMode === "default"
                      ? "btn btn-dark"
                      : "btn btn-outline-dark"
                  }
                  onClick={() => changeBlurMode("DEFAULT")}
                >
                  Default
                </button>
                <button
                  className={
                    blurMode === "blocky"
                      ? "btn btn-dark"
                      : "btn btn-outline-dark"
                  }
                  onClick={() => changeBlurMode("BLOCKY")}
                >
                  Blocky
                </button>
              </div>
              <h5>Difficulty</h5>
              <div className="pt-2 pb-4 d-flex justify-content-center gap-2">
                <button className="btn btn-dark">Monochrome</button>
                <button className="btn btn-dark">Random rotate</button>
                <button className="btn btn-dark">Zoom</button>
                <button
                  className="btn btn-dark"
                  onClick={() => toggleHideResource()}
                >
                  {hideResource ? "Show resource" : "Hide resource"}
                </button>
              </div>
              <div className="pt-2 pb-3">
                <h5>Colorblind mode</h5>
                <button
                  className={
                    isColorBlindMode ? "btn btn-dark" : "btn btn-outline-dark"
                  }
                  onClick={toggleColorBlindMode}
                >
                  {isColorBlindMode ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}