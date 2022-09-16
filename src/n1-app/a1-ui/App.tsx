import React from 'react';
import 'assets/general-css/reset.css'
import 'assets/general-css/App.css';
import {Header} from "./header/Header";
import {Pages} from "n1-app/a1-ui/routes/Pages";

const App = () => {
    return (
        <div className="App">
            <Header/>
            <Pages/>
        </div>
    );
}

export default App;
