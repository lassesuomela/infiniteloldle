import React from 'react'

export default function About() {
  return (
    <div>
        <h3>How to play</h3>
        
        <p>After you have created your nickname, you will be assigned a champion that you are trying to guess.</p>
        <p>In the text box you can start typing your champions name and press enter or click the champion you want, to select it as your guess. After that click Guess button to send your guess.</p>
        <p>If your guess was actually correct or not will be determined by the colors below.</p>

        <p>After you guess correctly, the champion will be removed from your champion pool and you will not get the same champion again. Only after you have guessed every single champion will your champion pool reset.</p>
        
        <h4 className="pb-3">Meaning of the colors</h4>

        <div className="d-flex pb-2 align-items-center">
            <div className="demo demoCorrect"></div>
            <p className="my-auto mx-auto">Correct guess</p>
        </div>

        <div className="d-flex pb-2 align-items-center">
            <div className="demo demoInoccrectGreater"></div>
            <p className="my-auto mx-auto">Correct value is higher</p>
        </div>

        <div className="d-flex pb-2 align-items-center">
            <div className="demo demoPartial"></div>
            <p className="my-auto mx-auto">Value is partially correct</p>
        </div>

        <div className="d-flex pb-2 align-items-center">
            <div className="demo demoInoccrectLess"></div>
            <p className="my-auto mx-auto">Correct value is lower</p>
        </div>

        <div className="d-flex">
            <div className="demo demoIncorrect"></div>
            <p className="my-auto mx-auto">Incorrect guess</p>
        </div>

        <h4 className="pb-3 pt-4">Scoring system</h4>

        <p>You will be rewarded one point for each correct guess you make. After you have guessed every single champion in the game your prestige will increase. After that your champion pool is reset and every single champion in the game will be available in your champion pool.</p>
    </div>
  )
}
