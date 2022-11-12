import axios from 'axios';
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';

const url = "https://www.infiniteloldle.com/api";

export default function Settings() {

    const [isShown, setIsShown] = useState(false);
    const [newNickname, setNewNickname] = useState("");

    const ToggleState = () => {
        setIsShown(!isShown);
    }

    const ChangeNickname = (e) => {

        e.preventDefault();

        if(!newNickname){
            return;
        }

        axios.put(url + "/user/nickname", {nickname: newNickname}, {headers: {'authorization': 'Bearer ' + localStorage.getItem("token")}})
        .then((response) => {

            console.log(response.data);

            if(response.data.status === "success"){
                ToggleState()
            }

        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <>
            <div className="d-flex justify-content-end">
                <button onClick={ToggleState} className="btn btn-dark darkBtn p-2 pb-0">
                    <span className="material-symbols-outlined ">
                    settings
                    </span>
                </button>
            </div>

            <Modal
                show={isShown}
                onHide={ToggleState}
                size="lg"
                centered
                className="transparentModal"
            >

                <Modal.Body>
                    <div className="container d-flex justify-content-center">
                        <div className="card w-50 text-center">
                            <Modal.Header closeButton>
                            </Modal.Header>

                            <h4 className="p-2">Change your nickname</h4>
                            
                            <div className="pt-2 d-flex justify-content-center border-dark">

                                <div className="pb-2">
                                    <form className="row g-3 p-1" onSubmit={ChangeNickname}>
                                        <input type="text" className="form-control" id="nickname" placeholder="New nickname" maxLength="30" onChange={e => setNewNickname(e.target.value)}/>
                                        <div className="text-center">
                                            <button className="btn btn-dark mb-2">Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <h4 className="p-2">Delete your account</h4>
                            <div className="pb-4">
                                <button className="btn btn-danger mb-2">Delete</button>
                            </div>
                        </div>
                    </div>
                    
                </Modal.Body>
            </Modal>
        </>
    )
}
