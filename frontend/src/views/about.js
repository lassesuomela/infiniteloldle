import React from 'react';
import AboutComponent from "../components/about";

export default function About() {

    return (
        <div className="container mb-5 pb-4">
            <h3 className="text-center pb-3 pt-4">About</h3>

            <div className="d-flex justify-content-center">
                <div className="card p-5 w-75 text-start">
                    <AboutComponent />
                </div>
            </div>
        </div>
    )
}
