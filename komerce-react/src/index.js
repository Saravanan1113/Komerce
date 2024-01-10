import React from "react";
import ReactDOM from 'react-dom';
import App from "./App";
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js";

export const stripepromise = loadStripe(
    "pk_test_51KrVTRSFU78KumVneUybUNG4EkbMH1O0kmvSdn4421Y1TWs6pbbYz2oRxVjSjgY8BqFLTWc47yk9nVY3cKYf5ae000H1JSiAwH"
)
ReactDOM.render(
    <Elements stripe={stripepromise}>
        <App/>
    </Elements>
    ,document.getElementById('root')
);