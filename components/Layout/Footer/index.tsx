import * as React from "react";
import style from './styles.scss';

export interface FooterProps {
    show?: string;
}

const Footer: React.FC<FooterProps> = () => (
    <footer className={style.footer}>
        <div className={style.footerContainer}>
            <i className="mdi mdi-chevron-double-up page-link"/>
            <div className="icon-wrap flex row">
                <a href="https://www.linkedin.com/in/mattwilliams85">
                    <div className="flex icon" id="icon-2">
                        <i className="mdi mdi-linkedin"/>
                    </div>
                </a>
                <a href="https://www.facebook.com/matthew.williams.351">
                    <div className="flex icon" id="icon-3">
                        <i className="mdi mdi-facebook"/>
                    </div>
                </a>
                <a href="https://instagram.com/infinite_edge/">
                    <div className="flex icon" id="icon-4">
                        <i className="mdi mdi-instagram"/>
                    </div>
                </a>
                <a href="http://codepen.io/matthewwilliams/">
                    <div className="flex icon" id="icon-5">
                        <i className="mdi mdi-codepen"/>
                    </div>
                </a>
            </div>
            <div className="info-box">
                <div className="footnote">MATTHEW WILLIAMS <span className="highlight">©2015</span></div>
            </div>
        </div>
    </footer>
);

export default Footer;
