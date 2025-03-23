import axios from "axios";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Config from "../configs/config";
import Cookies from "universal-cookie";
import { Tooltip } from "react-tooltip";
import { Reroll } from "../utils/reroll";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Settings() {
  const [isShown, setIsShown] = useState(false);
  const [exportMode, setExportMode] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [newToken, setNewToken] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);

  const ToggleState = () => {
    setIsCopied(false);
    setExportMode(false);
    setImportMode(false);
    setIsShown(!isShown);
  };

  const ChangeNickname = (e) => {
    e.preventDefault();

    if (!newNickname) {
      return;
    }

    axios
      .put(
        Config.url + "/user/nickname",
        { nickname: newNickname },
        {
          headers: { authorization: "Bearer " + localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          ToggleState();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeleteUser = () => {
    axios
      .delete(Config.url + "/user", {
        headers: { authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status === "success") {
          ToggleState();
          localStorage.removeItem("token");
          localStorage.removeItem("scorePerDay");
          localStorage.removeItem("firstTriesPerDay");
          localStorage.removeItem("triesPerDay");
          localStorage.removeItem("gamesPlayed");
          localStorage.setItem("userDeleted", true);
          const cookies = new Cookies();
          cookies.remove("isValidToken");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ChangeGuessChampion = () => {
    Reroll("champion");
  };

  const ChangeGuessSplash = () => {
    Reroll("splash");
  };

  const ChangeGuessItem = () => {
    Reroll("item");
  };

  const ChangeGuessOldItem = () => {
    Reroll("oldItem");
  };

  const CreateUser = () => {
    localStorage.setItem("createNewUser", true);
    window.location.reload();
  };

  const saveToken = () => {
    if (newToken.length !== 64) {
      setIsValidToken(false);
      return;
    }

    axios
      .get(Config.url + "/user", {
        headers: { authorization: "Bearer " + newToken },
      })
      .then((response) => {
        if (response.data.status === "success") {
          setIsValidToken(true);
          localStorage.setItem("token", newToken);
        }
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <button
        onClick={ToggleState}
        className="btn btn-dark darkBtn p-2 pb-0 ps-3 pe-3"
        data-tooltip-id="settings-tooltip"
        data-tooltip-content="Settings"
      >
        <span className="material-symbols-outlined">settings</span>
        <Tooltip id="settings-tooltip" />
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
              <Modal.Header
                closeButton
                className="btn-close-white"
              ></Modal.Header>

              <h3 className="pb-4">Settings</h3>

              {localStorage.getItem("token") ? (
                <>
                  <h4>Change your nickname</h4>

                  <div className="pt-2 d-flex justify-content-center">
                    <div className="pb-3">
                      <form className="row g-3 p-1" onSubmit={ChangeNickname}>
                        <input
                          type="text"
                          className="form-control"
                          id="nickname"
                          placeholder="New nickname"
                          maxLength="30"
                          onChange={(e) => setNewNickname(e.target.value)}
                        />
                        <div>
                          <button className="btn btn-dark mb-2">Save</button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <h4 className="p-2">Reroll</h4>
                  <div className="pb-4 d-flex justify-content-center gap-2">
                    <button
                      onClick={ChangeGuessChampion}
                      className="btn btn-dark mb-2"
                    >
                      Champion
                    </button>
                    <button
                      onClick={ChangeGuessSplash}
                      className="btn btn-dark mb-2"
                    >
                      Splash art
                    </button>
                    <button
                      onClick={ChangeGuessItem}
                      className="btn btn-dark mb-2"
                    >
                      Item
                    </button>
                    <button
                      onClick={ChangeGuessOldItem}
                      className="btn btn-dark mb-2"
                    >
                      Legacy item
                    </button>
                  </div>

                  <div className="p-3">
                    <h4>Export / import token</h4>
                    <p>
                      By exporting token you can move all progress over to the
                      other device and continue progressing on multiple devices.
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => {
                          setExportMode(!exportMode);
                          setImportMode(false);
                        }}
                        className="btn btn-dark mb-2"
                      >
                        Export
                      </button>
                      <button
                        onClick={() => {
                          setImportMode(!importMode);
                          setExportMode(false);
                        }}
                        className="btn btn-success mb-2"
                      >
                        Import
                      </button>
                    </div>

                    {exportMode ? (
                      <>
                        <p>Copy token</p>
                        <CopyToClipboard text={localStorage.getItem("token")}>
                          <button
                            className="btn btn-dark"
                            onClick={() => setIsCopied(true)}
                          >
                            {isCopied ? "Copied!" : "Copy"}
                          </button>
                        </CopyToClipboard>
                      </>
                    ) : (
                      ""
                    )}

                    {importMode ? (
                      <>
                        <p>Save exported token</p>
                        <input
                          value={newToken}
                          className="form-control"
                          placeholder="Token here"
                          onChange={(e) => {
                            setNewToken(e.target.value);
                            setIsValidToken(null);
                          }}
                        ></input>
                        <p className="pt-2">
                          {isValidToken === true
                            ? "Token is valid"
                            : isValidToken === false
                            ? "Token is not valid"
                            : ""}
                        </p>
                        <button
                          className="btn btn-outline-success mt-1"
                          onClick={() => saveToken()}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}

              {localStorage.getItem("token") ? (
                <>
                  <h4 className="p-2">Delete your account</h4>
                  <div className="pb-4">
                    <button
                      onClick={DeleteUser}
                      className="btn btn-danger mb-2"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="p-2">Create new account</h4>
                  <div className="pb-4">
                    <button
                      onClick={CreateUser}
                      className="btn btn-success mb-2"
                    >
                      Create
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
