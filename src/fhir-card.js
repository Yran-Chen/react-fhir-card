import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Row } from 'antd';
import { Button, Form, Input } from 'antd';
import React  from 'react';

import { useEffect, useState } from 'react';

const {Meta} = Card;

export function FHIRCard (props) {

    const hoverable = props.hoverable || false;
    const size = props.size || "default";
    const bordered =  props.bordered || true;
    // console.log(hoverable,size);

    const patient = props.patient;
    const client = props.FHIRClient;
    const dob = patient.birthDate;

    const [showCard,setshowcard] = useState(true); 
    const [first, setfirst] = useState();
    const [last, setlast] = useState();

    useEffect(()=>{
      if (patient===undefined || patient.length == 0){
        return(<></>);
      }
      else{
        setfirst(patient.name[0].given[0]);
        setlast(patient.name[0].family);
      }

      },[])

    // console.log(patient);
    // console.log(first,last);
    // if (patient===undefined || patient.length == 0){
    //   return(<></>);
    // }
    // console.log(patient);

    const family = patient.name[0].family;
    const given = patient.name[0].given[0];


    const showUserModal = async()=>{
      var firstname = prompt("First name?", given);
      if (!firstname) { return; }
      var lastname = prompt("Last name?", family);
      if (!lastname) { return; }
      await client.patch("Patient/"+ patient.id, [
        { op: "replace", path: "/name/0/given/0", value: firstname}
        ,
        { op: "replace", path: "/name/0/family", value: lastname}
      ])
      setfirst(firstname);
      setlast(lastname);
    }

    const deleteUser = async()=>{
        await client.delete("Patient/"+patient.id);
        setshowcard(false);
    }
      

    // const name = props.patientName;
    if (showCard == true){
      return(
        <Card hoverable={hoverable} size={size} bordered={bordered}
          style={{
            width: 300,
          }}
          actions={[
            <EditOutlined key="edit"  onClick={showUserModal}/>,
            <DeleteOutlined key="ellipsis"  onClick={deleteUser}/>

          ]}
        >
          <Meta
            avatar={<Avatar src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png" />}
            title={first+"  "+last}
            description={dob}
          />
        </Card>
      );
    }
    else{
      return null;
    }

}



export function PersonOpt(props) {
    
  const [form] = Form.useForm();
    const client = props.CHIRClient;

    useEffect(async () => {
      let patients = await client.request("Patient",{flat:true ,pageLimit:1});
      console.log(patients);
      props.recordPatient(patients);
    }, []);

    const onFinish = async (values) => {
      console.log('Success:', values);
      let patient = await client.request("Patient?family="+values.lastname,{flat:true});
      // console.log(patient)
      await props.recordPatient([]);
      await props.recordPatient(patient);
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    const addPatient = async (values) =>{
      let patientinfo = form.getFieldsValue();
      let patient = {
        "resourceType": "Patient",
        "name": {
          "given": [patientinfo.firstname],
          "family": patientinfo.lastname,
          "birthDate":patientinfo.birthdate,
        },
      }
      console.log(patient);
      await client.create(patient);



      // const firstname = document.querySelector("#firstname").value;
      // const lastname  = document.querySelector("#firstname").value;
      // console.log(firstname,lastname)
      // request("Patient?name="+lastname);
      // props.recordPatient(patient);
    }


    return (
        <>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="First Name"
            name="firstname"
            id = "firstname"
            rules={[
              {
                required: false,
                message: 'Please input your first name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
      
          <Form.Item
            label="Last Name"
            name="lastname"
            id = "lastname"
            rules={[
              {
                required: true,
                message: 'Please input your last name!',
              },
            ]}
          >
            <Input />
            {/* <Input.Password /> */}
          </Form.Item>

          <Form.Item
            label="Birth Date"
            name="birthdate"
            id = "birthdate"
            rules={[
              {
                required: false,
                message: 'Please input your birth date!',
              },
            ]}
          >
            <Input />
            {/* <Input.Password /> */}
          </Form.Item>
      
          {/* <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Row gutter={12} justify={"center"} >
                <Col>
                    <Button type="primary" htmlType="submit" >
                      Submit
                    </Button>
                </Col>
                <Col>
                    <Button htmlType="submit" onClick={addPatient}>
                      Create
                    </Button>
                </Col>
            </Row>
          </Form.Item>
        </Form>

    </>
    );
}

