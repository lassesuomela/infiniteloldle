import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const url = "http://localhost:8081/api";
const token = localStorage.getItem("token");

axios.defaults.headers.common['authorization'] = "Bearer " + token;
export default function NewUser() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState("");

    const checkToken = () => {

        if(!token) {
            setIsLoggedIn(false);
            console.log("user not logged in");
            return;
        }

        axios.get(url + "/user").then(response => {
            response.data.status === "success" ? setIsLoggedIn(true) : setIsLoggedIn(false)
        }).catch(error => {
            console.log(error);
            setIsLoggedIn(false);
        })
    }

    const createToken = () => {

        axios.post(url + "/user", {nickname}).then(response => {
            console.log(response.data);
            localStorage.setItem("token", response.data.token)
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {

        checkToken();

    }, [])


    const newUser = (e) => {
        e.preventDefault();
        
        setNickname(e.target[0].value);

        createToken();
    }

    if(!isLoggedIn) {
        return (
            <div className="container searchBox">
                <form className="form-control row g-3 mb-4 w-25" onSubmit={newUser}>
                    <input type="text" className="form-control" id="nickname" placeholder="Nickname" />
    
                    <div className="text-center">
                        <button className="btn btn-primary mb-3 mt-1 w-25">Save</button>
                    </div>
                </form>
            </div>
        );
    }
    
}
