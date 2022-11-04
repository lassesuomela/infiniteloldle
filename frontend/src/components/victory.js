import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

export default function Victory(props) {

    const [isShown, setIsShown] = useState(true);

    return (

        <>
            <Modal
                show={isShown}
                onHide={() => setIsShown(false)}
                size="lg"
                centered
                id="victoryModal"
            >

                <Modal.Body>
                    <div className="container victory">
                        <div className="card w-50 text-center">

                            <Modal.Header closeButton>
                            </Modal.Header>
                            
                            <div className="pb-5">
                                <h1 className="pb-3">Victory!</h1>

                                <img src={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} alt={props.championKey} className="pb-3"/>

                                <p className="mb-0">Champion was {props.champion}.</p>

                                <p className="mb-1 smaller">{props.title}</p>
                                <p className="smaller">It took {props.tries} tries</p>

                                <small>Want to play again?</small>
                            </div>
                        </div>
                    </div>
                    
                </Modal.Body>
            </Modal>
        </>
    )
}
