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
  const isMonochrome = useSelector(
    (state) => state.monochromeReducer.isMonochrome
  );
  const randomRotate = useSelector(
    (state) => state.randomRotateReducer.randomRotate
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
    localStorage.setItem(
      "blurMode",
      type === "DEFAULT_BLUR" ? "default" : "blocky"
    );
  };
  const toggleMonochrome = () => {
    dispatch({ type: "TOGGLE_MONOCHROME" });
    localStorage.setItem("isMonochrome", !isMonochrome);
  };
  const toggleRandomRotate = () => {
    dispatch({ type: "TOGGLE_RANDOM_ROTATE" });
    localStorage.setItem("randomRotate", !randomRotate);
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
                  onClick={() => changeBlurMode("DEFAULT_BLUR")}
                  data-tooltip-id="blur-tooltip"
                  data-tooltip-content="Change blur mode of splash art games"
                >
                  Default
                  <Tooltip id="blur-tooltip" />
                </button>
                <button
                  className={
                    blurMode === "blocky"
                      ? "btn btn-dark"
                      : "btn btn-outline-dark"
                  }
                  onClick={() => changeBlurMode("BLOCKY_BLUR")}
                  data-tooltip-id="blur-tooltip"
                  data-tooltip-content="Change blur mode of splash art games"
                >
                  Blocky
                  <Tooltip id="blur-tooltip" />
                </button>
              </div>
              <h5>Difficulty</h5>
              <div className="pt-2 pb-4 d-flex justify-content-center gap-2">
                <button
                  className={
                    isMonochrome ? "btn btn-dark" : "btn btn-outline-dark"
                  }
                  onClick={() => toggleMonochrome()}
                  data-tooltip-id="monochrome-tooltip"
                  data-tooltip-content="Splash art, item and legacy item games icons are black and white"
                >
                  Monochrome
                  <Tooltip id="monochrome-tooltip" />
                </button>
                <button
                  className={
                    randomRotate ? "btn btn-dark" : "btn btn-outline-dark"
                  }
                  onClick={() => toggleRandomRotate()}
                  data-tooltip-id="rotate-tooltip"
                  data-tooltip-content="Splash art, item and legacy item games icons are rotated"
                >
                  Random rotate
                  <Tooltip id="rotate-tooltip" />
                </button>
                <button
                  className={
                    hideResource ? "btn btn-dark" : "btn btn-outline-dark"
                  }
                  onClick={() => toggleHideResource()}
                  data-tooltip-id="resource-tooltip"
                  data-tooltip-content="Champions game resource is limited to mana or manaless"
                >
                  Simplify resource
                  <Tooltip id="resource-tooltip" />
                </button>
              </div>
              <div className="pt-2 pb-3">
                <h5>Colorblind mode</h5>
                <button
                  className={
                    isColorBlindMode ? "btn btn-dark" : "btn btn-outline-dark"
                  }
                  onClick={toggleColorBlindMode}
                  data-tooltip-id="cb-tooltip"
                  data-tooltip-content="Toggle colorblind mode to help differientiate colors"
                >
                  {isColorBlindMode ? "On" : "Off"}
                  <Tooltip id="cb-tooltip" />
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
