import * as React from "react";
import { useState } from "react";
import { Col, Row } from 'antd';

import {FHIRCard,PersonOpt} from "./fhir-card"

export function Home({ client }) {

  const [Patients, setPatients] = useState([]);

  function handlePatient(ppl) {
    setPatients((prevState) => [...ppl]); 
  }
  
  return (
    <main>
    <PersonOpt CHIRClient = {client} recordPatient={(ppl) => handlePatient(ppl)} />

    <Row gutter={16}>
        {Patients.map(
          (person)=>{
              return (
              <Col span={6}>
              <FHIRCard patient={person} FHIRClient={client} hoverable={true}/>
            </Col>
            )
          }
        )
      }
  </Row>
  </main>
  )

}