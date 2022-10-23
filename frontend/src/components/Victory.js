import React from 'react'

export default function Victory(props) {

    return (
        <div className="container victory pt-4">
            
            <div className="card w-50 text-center">

                <div className="p-5">
                    <h1 className="pb-3">Victory!</h1>

                    <img src={"https://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/" + props.championKey + ".png"} alt={props.championKey} className="pb-3"/>

                    <p className="mb-0">Champion was {props.champion}.</p>
                    <p className="smaller">It took {props.tries} tries</p>
                    <small>Scroll back up to play again</small>
                </div>

            </div>
                
        </div>
    )
}
