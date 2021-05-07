import React, { Fragment, useState } from 'react'
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '../index'

const Formulario = () => {

    const handleChange = (e) => {
        
        setRequest({
          ...request,
          [e.target.name]: e.target.value,
        });
       
    };

    const handleSubmit = (e) => {
        e.preventDefault();  
      
        console.log('entrando handleSubmit')
        apiRequest(`${request.method}`, `${request.endpoint}`, `${request.codigo}`, `${request.publico}`, `${request.privado}`, `${request.id}`)
        .then(axiosRes => setResult(JSON.stringify(axiosRes.data, null, 2)))
        .catch(res => console.error(res.response)) 
        
        if(!`${request.publico}`.trim()){
            console.log('objeto vacio');
            return
        }
    }

    const apiRequest = (method,path,sendData,publicToken,privateToken="",id="") => {
        // console.log(sendData)
      
        let sendDataCopy = '';
        if(method === 'post' || method === 'put') {
            try {

                sendDataCopy = sendData
                sendDataCopy = JSON.parse(sendDataCopy)         
            
            } catch (error) {

                if (error instanceof SyntaxError) {

                    let mensaje = error.message;
                    console.log('ERROR EN LA SINTAXIS:', mensaje); 

                } else {

                    throw error;
                }

            }            
        }

              
        const requestPath = encodeURIComponent(`${request.endpoint}`);
        const orderedData = {};
        Object.keys(sendDataCopy).sort().forEach(function(key) {
            orderedData[key] = sendDataCopy[key];
        })
      
        const arrayConcat = new URLSearchParams(orderedData).toString()
        const concat = requestPath + "&" + arrayConcat;
        // console.log(concat)
        const sign = CryptoJS.HmacSHA256(concat, `${privateToken}`).toString();
        console.log('firma:', sign)
        console.log('mostrando datos, url, id, firma', `${request.url}${path}${id}`)
    
        return axios({
          method: `${method}`,
          url: `${request.url}${path}${id}`,
          data: sendDataCopy,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicToken}`,
            'Sign': sign,  
          }
        })
    }

   
    const [request, setRequest] = useState('');
    const [result, setResult] = useState('');
    

    
    
    
    return (
        <Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <form className="form" >
                        
                            <div className="title mt-5">
                                <h2>Sistema Interno Payku</h2>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Identificador</label>
                                <input 
                                    defaultValue
                                    type="text" 
                                    className="form-control"
                                    name="id" 
                                    placeholder="Ingresa ID a Consultar"
                                    onChange={ handleChange }
                                />
                            </div>
                            
                            <div className="col-md-6">
                                <label>
                                    Seleciona metodo a Solicitar
                                    <select onChange={ handleChange } name="method" className="form-select mb-5 mt-2 text-color">
                                        <option defaultValue selected disabled>Solicitud</option>
                                        <option value="get">GET</option>
                                        <option value="post">POST</option>
                                        <option defaultValue="put">PUT</option>
                                        <option defaultValue="delete">DELETE</option>
                                    </select>
                                </label>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <label>
                                    Selecciona Plataforma
                                        <select onChange={ handleChange } name="url" className="form-select mb-5 mt-2 text-color">
                                            <option defaultValue selected disabled>Url</option>
                                            <option value="https://des.payku.cl/">Desarrollo</option>
                                            <option defaultValue="https://app.payku.cl/">Produccion</option>
                                            <option defaultValue="https://devqa.payku.cl/">QA</option>
                                        </select>
                                    </label>
                                </div>
                            
                                <div className="col-md-6">
                                    {/* <label>
                                        Escribe el Endpoint
                                        <input
                                            className="mt-2"
                                            type="text"
                                            name="endpoint"
                                            placeholder="Ingresa endpoint"
                                            onChange={ handleChange }
                                            />
                                    </label> */}
                            
                                    <label>
                                        Selecciona el Endpoint
                                        <select className="form-select mb-5 mt-2 text-color" onChange={ handleChange } name="endpoint">
                                            <option defaultValue selected disabled>Endpoint</option>
                                            <option value="api/transaction/">transaction</option>
                                            <option defaultValue="api/verificar/">verificar</option>
                                            <option defaultValue="api/maclient/">maClient</option>
                                            <option defaultValue="api/maaffiliation/">maAffiliation</option>
                                            <option value="/api/suclient">suClient</option>
                                            <option defaultValue="api/suclient/customers/">suClient/customers</option>
                                            <option defaultValue="api/sususcription/">suSuscription</option>
                                            <option defaultValue="api/sutransaction/">suTransaction</option>
                                            <option defaultValue="api/suinscriptionscards/">suInscriptionscards</option>
                                            <option defaultValue="api/suplan/">suPlan</option>
                                            <option defaultValue="api/suplan/plans/">suPlan/plans</option>
                                            <option defaultValue="urlnotifysuscription/">urlNotifySuscription</option>
                                            <option defaultValue="urlnotifypayment/">urlNotifyPayment</option>
                                            <option defaultValue="api/event/">event</option>
                                        </select>                                    
                                    </label>
                                </div>
                            
                                <div className="col-md-6">                                        
                                    <label>Token Publico</label>
                                        <input
                                            className="mt-1"
                                            type="text"
                                            name="publico"
                                            placeholder="Ingresa Token Publico"
                                            onChange={ handleChange }
                                        />
                                    
                                </div>
                            
                                <div className="col-md-6">
                                        {/* { errorLabel ? <span className="text-danger">{errorLabel}</span> : null } */}
                                    <label>
                                        Token Privado
                                        <input
                                            className="mt-2"
                                            type="text"
                                            name="privado"
                                            placeholder="Ingresa Token Privado"
                                            onChange={ handleChange }
                                            />
                                    </label>
                                </div>
                            
                                <div className="col-md-12">
                                    <textarea
                                        name="codigo"
                                        placeholder="Ingresa el Codigo aqui"
                                        onChange={ handleChange }
                                    />
                                </div>
                            
                                <div className="col-md-12">
                                        <textarea
                                            // value={ result }
                                            defaultValue= { result }
                                            name="respuesta"
                                        />
                                </div>
                            
                                <div className="col-md-12">
                                    <div className="contact-btn gap-2 d-md-flex justify-content-md-end pb-5">
                                        <button className="me-md-2" onClick={ handleSubmit } type="submit">Enviar Solicitud</button>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Formulario



 // datos a enviar sign
    // {
    //     "email": "support@youwebsite.cl",
    //     "name": "Joe Doe",
    //     "phone": "923122312",
    //     "address": "Moneda 101",
    //     "country": "Chile",
    //     "region": "Metropolitana",
    //     "city": "Santiago",
    //     "postal_code": "850000"
    // }
    //  registrar datos
    // {
    //     "email": "support@youwebsite.cl",
    //     "order": 98745,
    //     "subject": "test subject",
    //     "amount": 25000,
    //     "payment": 1,
    //     "urlreturn": "https://youwebsite.com/urlreturn?orderClient=123",
    //     "urlnotify": "https://youwebsite.com/urlnotify?orderClient=123"
    // }