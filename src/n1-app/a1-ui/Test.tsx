import React from 'react';
import {Button} from "n1-app/a1-ui/common/button/Button";
import {InputText} from "n1-app/a1-ui/common/input/InputText";
import {Checkbox} from "n1-app/a1-ui/common/checkbox/Checkbox";

export const Test = () => {
    return (
        <div className={'container'}>
            <br/>
            <Button>Кнопка</Button><br/><br/>
            <InputText/><br/><br/>
            <Checkbox>Checkbox</Checkbox>
        </div>
    );
};