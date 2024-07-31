import React from "react";
import "./Banner.css";
import banner from './../../assets/learn.png'

function Banner(){
    const text = `Let's elevate education in Nigeria by creating an educational hub that democratizes access to educational resources, improves academic performance, and enriches the learning experience for every student.`;
    const upperCaseText = text;

    return(
        <div className="main_ban" id="Banner">
            <div className="ban1">
                <h1>{upperCaseText}</h1>
                <h2 className="ban_sec">Enhancing Engagement, Elevating Campus Life!</h2>

                <div className="btn">

                </div>
            </div>
            <div className="ban2">
                <img className="ban_img" src={banner} alt="banner"/>
            </div>
        </div>
    )
}

export default Banner;