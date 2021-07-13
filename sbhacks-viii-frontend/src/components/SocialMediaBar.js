import "../styles/SocialMediaBar.css";
import React from "react";

function SocialMediaButton(props) {
    return (<a href = {props.url}>
            <img src = {"icons/" + props.name +
                        ".png"} alt = { props.name }/>
    </a>);
}

function SocialMediaBar() {
    return (<div class = "sidebar"><div>
            <SocialMediaButton name = "email" url = "mailto:team@sbhacks.com" />
            <SocialMediaButton
                 name = "facebook" url = "https://facebook.com/ucsbhacks" />
            <SocialMediaButton
                 name = "instagram" url = "https://instagram.com/sbhacks" />
            <SocialMediaButton
                 name = "twitter" url = "https://twitter.com/sb_hacks" />
            <SocialMediaButton
                 name = "medium" url = "https://medium.com/@ucsbhacks" />
            </div>
    </div>);
}

export default SocialMediaBar;
