import { Link } from "react-router-dom";

export default function Page404() {
    return <div id="notfound">
        <div className="notfound">
            <div className="notfound-404">
                <h1>Oops!</h1>
            </div>
            <h2>404 - Page not found</h2>
            <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
            <Link to="/home" className="button" >Go to homepage</Link>

        </div>
    </div>
}