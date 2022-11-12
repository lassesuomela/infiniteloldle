import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

export default function Victory(props) {

    const [isShown, setIsShown] = useState(true);

    const Close = () => {
        setIsShown(false);
    }

    return (

        <>
            <Modal
                show={isShown}
                onHide={() => setIsShown(false)}
                size="lg"
                centered
                className="transparentModal"
            >

                <Modal.Body>
                    <div className="container victory">
                        <div className="card w-50 text-center">

                            <Modal.Header closeButton>
                            </Modal.Header>
                            
                            <div className="pb-5">
                                <h1 className="pb-3">Victory!</h1>

                                <img src={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} alt={props.championKey} className="pb-3"/>

                                <h2>{props.champion}</h2>

                                <p className="mb-1 smaller">{props.title}</p>
                                <p className="smaller">It took {props.tries} tries</p>

                                <button type="button" class="btn btn-dark" onClick={Close}>Play again</button>
                            </div>
                        </div>
                    </div>
                    
                </Modal.Body>
            </Modal>
        </>
    )
}
