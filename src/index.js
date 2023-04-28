import * as React from "react";
import { render } from "react-dom";
import { oauth2 as SMART } from "fhirclient";
import {Home} from "./App";

const rootElement = document.getElementById("root");

SMART.init({
      iss:"https://r4.smarthealthit.org",      
      redirectUri: "http://localhost:3000/",
      clientId: "yranchan",
      scope: "patient/*.read",
      completeInTarget: true
  }).then(
    (client)=>  {render(<Home client = {client} />, rootElement);}
  )
  