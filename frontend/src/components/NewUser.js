import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:8081/api";

const token = localStorage.getItem("token");
axios.defaults.headers.common['authorization'] = "Bearer " + token;

export default function NewUser() {

    const [nickname, setNickname] = useState("");
    
    const navigate = useNavigate();

    const createToken = (e) => {
        e.preventDefault();

        axios.post(url + "/user", {nickname}).then(response => {
            localStorage.setItem("token", response.data.token)

            navigate("/");
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
        <div className="container ">
            <h4 className="text-center pb-4">Please enter your nickname</h4>
            <div className="searchBox">
                <form className="form-control row g-3 mb-4 w-25" onSubmit={createToken}>
                    <input type="text" className="form-control" id="nickname" placeholder="Nickname" onChange={e => setNickname(e.target.value)}/>
                    <div className="text-center">
                        <button className="btn btn-primary mb-3 mt-1 w-25">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
