import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';

const url = "http://localhost:8081/api";

const token = localStorage.getItem("token");
axios.defaults.headers.common['authorization'] = "Bearer " + token;

export default function NewUser() {

    const [nickname, setNickname] = useState("");
    const [isShown, setIsShown] = useState(true);
    
    const navigate = useNavigate();

    const createToken = (e) => {
        e.preventDefault();

        axios.post(url + "/user", {nickname}).then(response => {

            console.log(response);
            localStorage.setItem("token", response.data.token)

            setIsShown(false)
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {

        axios.get(url + "/user").then(response => {
            if(response.data.status === "success") {
                navigate("/");
            }
        }).catch(error => {
            console.log(error);
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Modal
                show={isShown}
                centered
                backdrop="static"
                keyboard={false}
            >
            <Modal.Body>
                <div className="container text-center">
                    <h4 className="p-2">Please enter your nickname</h4>
                    <small>Or leave it blank</small>
                </div>

                <div className="pt-2 d-flex justify-content-center">
                    <form className="row g-3 p-1 w-50" onSubmit={createToken}>
                        <input type="text" className="form-control" id="nickname" placeholder="Anonymous" onChange={e => setNickname(e.target.value)}/>
                        <div className="text-center">
                            <button className="btn btn-dark mb-2">Save</button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
            </Modal>
        </>
    );
}
