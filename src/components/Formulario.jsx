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
        .then(axiosRes => setResult(JSON.stringify(axiosRes.data)))
        .catch(res => console.error(res.response))
    }
    
    const apiRequest = (method,path,sendData,publicToken,privateToken="",id="") => {
        console.log(sendData)
        let sendDataCopy = '';
        if(method === 'post' || method === 'put') {
            sendDataCopy = sendData
            sendDataCopy = JSON.parse(sendDataCopy)        
        }
        const requestPath = encodeURIComponent(`${request.endpoint}`);
        const orderedData = {};
        Object.keys(sendDataCopy).sort().forEach(function(key) {
            orderedData[key] = sendDataCopy[key];
        })
        const arrayConcat = new URLSearchParams(orderedData).toString()
        const concat = requestPath + "&" + arrayConcat;
        console.log(concat)
        const sign = CryptoJS.HmacSHA256(concat, 'fe551abcef62fcf002dc598922e68f0a').toString();
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
// console.clear()
    
    const [request, setRequest] = useState('');
    const [result, setResult] = useState('');
    // const [modoEdicion, setModoEdicion] = useState(false);
    
       
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

                            {/* <fieldset disabled>
                                <div className="mb-3">
                                    <label className="form-label">Identificador</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        name="id" 
                                        placeholder="Ingresa ID a Consultar"
                                        onChange={ handleChange }
                                    />
                                </div>
                            </fieldset> */}

                               
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
                                            <option value="https://des.payku.cl/">https://des.payku.cl/</option>
                                            <option defaultValue="https://app.payku.cl/">https://app.payku.cl/</option>
                                        </select>
                                    </label>
                                </div>
                          
                                <div className="col-md-6">
                                    <label>
                                        Selecciona el Endpoint
                                        <select className="form-select mb-5 mt-2 text-color" onChange={ handleChange } name="endpoint">
                                            <option defaultValue selected disabled>Endpoint</option>
                                            <option value="api/transaction/">api/transaction/</option>
                                            <option defaultValue="api/verificar/">api/verificar/</option>
                                            <option defaultValue="api/maclient/">api/maclient/</option>
                                            <option defaultValue="api/maaffiliation/">api/maaffiliation/</option>
                                            <option value="/api/suclient">api/suclient/</option>
                                            <option defaultValue="api/suclient/customers/">api/suclient/customers/</option>
                                            <option defaultValue="api/sususcription/">api/sususcription/</option>
                                            <option defaultValue="api/sutransaction/">api/sutransaction/</option>
                                            <option defaultValue="api/suinscriptionscards/">api/suinscriptionscards/</option>
                                            <option defaultValue="api/suplan/">api/suplan/</option>
                                            <option defaultValue="api/suplan/plans/">api/suplan/plans/</option>
                                            <option defaultValue="urlnotifysuscription/">urlnotifysuscription/</option>
                                            <option defaultValue="urlnotifypayment/">urlnotifypayment/</option>
                                            <option defaultValue="api/event/">api/event/</option>
                                        </select>                                    
                                    </label>
                                </div>
                          
                                <div className="col-md-6">
                                    <label>
                                        Token Publico
                                        <input
                                            className="mt-2"
                                            type="text"
                                            name="publico"
                                            placeholder="Ingresa Token Publico"
                                            onChange={ handleChange }
                                            />
                                    </label>
                                </div>
                          
                                <div className="col-md-6">
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
                        <ul>
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default Formulario


