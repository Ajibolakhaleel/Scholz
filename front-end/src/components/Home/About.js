import React from "react";
import "./About.css";

function About(){
    return(
        <div className="about" id="About">
            <h1 className="about_title">About</h1>
            <p>As a committed collective, we form scholz to propel education in Nigeria. Our mission is to establish equitable access to educational resources, improve our academic journeys and enrich our learning experience. Together we are shaping the educational future of our community
            </p>
            <div className="btn">
                <button className="try_out btn_abt"><a href="https://front-end-pi-lilac.vercel.app/imtihani">Check it out</a></button>
            </div>
        </div>
    )
}

export default About;