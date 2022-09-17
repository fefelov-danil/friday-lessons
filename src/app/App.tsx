import React from 'react';
import 'assets/general-css/reset.css'
import 'assets/general-css/App.css';
import {Header} from "common/header/Header";
import {Pages} from "app/Pages";

const App = () => {
    return (
        <div className="App">
            <Header/>
            <Pages/>
        </div>
    );
}

export default App;
