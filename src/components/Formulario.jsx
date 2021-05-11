
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
        
        // if(!`${request.publico}`.trim()){
        //     console.log('objeto vacio');
        //     return
        // }
    }

    const apiRequest = (method,path,sendData,publicToken,privateToken="",id="") => {
        // console.log(sendData)
       
        let dataExample = '{"email": "support@youwebsite.cl","name": "Joe Doe","phone": "923122312","address":"Moneda101","country": "Chile","region": "Metropolitana","city": "Santiago","postal_code": "850000"}'
       
        let exampleJson = JSON.parse(dataExample)
      
        let sendDataCopy = '';

        if(method === 'post' || method === 'put') {
            try {

                sendDataCopy = sendData
                sendDataCopy = JSON.parse(sendDataCopy)         
            
            } catch (error) {

                setResult(`Ha habido un error en el formato de los datos enviados por favor revisa que este escrito de la siguiente manera:  \n ${JSON.stringify(exampleJson, null, 2)} \n y rectifica que la ultima linea de los valores NO lleve una coma(,)` )

                
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
        setResult(sign)
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

   
    const [request, setRequest] = useState({id:''});
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

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group"> 
                                            <label>Selecciona Plataforma</label> 
                                                <select onChange={ handleChange } 
                                                    name="url" 
                                                    className="form-control form-control-lg mb-5 mt-2 text-color">
                                                        <option defaultValue selected disabled>Url</option>
                                                        <option value="https://des.payku.cl">Desarrollo</option>
                                                        <option defaultValue="https://app.payku.cl/">Produccion</option>
                                                        <option defaultValue="https://devqa.payku.cl/">QA</option>
                                                </select> 
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <div className="form-group"> 
                                            <label>Seleciona metodo a Solicitar</label> 
                                                <select onChange={ handleChange } 
                                                name="method" 
                                                className="form-control form-control-lg mb-5 mt-2 text-color">
                                                    <option defaultValue selected disabled>Solicitud</option>
                                                    <option value="get">GET</option>
                                                    <option value="post">POST</option>
                                                    <option defaultValue="put">PUT</option>
                                                    <option defaultValue="delete">DELETE</option>
                                            </select> 
                                        </div>
                                    </div>
                                
                                    <div className="col-md-4">
                                        <div className="form-group"> 
                                            <label>Selecciona el Endpoint</label> 
                                                <select onChange={ handleChange } 
                                                    name="endpoint" 
                                                    className="form-control form-control-lg mb-5 mt-2 text-color">
                                                        <option defaultValue selected disabled>Endpoint</option>
                                                        <option value="/api/transaction">transaction</option>
                                                        <option defaultValue="api/verificar/">verificar</option>
                                                        <option defaultValue="api/maclient/">maClient</option>
                                                        <option defaultValue="api/maaffiliation/">maAffiliation</option>
                                                        <option value="/api/suclient/">suClient</option>
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
                                        </div>
                                    </div>

                                    {/* Cuadro de texto del endpoint */}
                                        {/* <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Escribe el EndPoint</label>
                                                    <input
                                                        type="text" 
                                                        name="endpoint"
                                                        className="form-control mb-5 mt-2 text-color" 
                                                        placeholder="EndPoint"
                                                        onChange={ handleChange } 
                                                    /> 
                                            </div>
                                        </div> */}

                                </div>
                                   
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Identificador</label>
                                                
                                                    <input
                                                        type="text" 
                                                        name="id"
                                                        className="form-control mb-5" 
                                                        placeholder="Coloca un / antes de ingresar el ID a Consultar"
                                                        onChange={ handleChange } 
                                                        
                                                    /> 
                                            </div>
                                        </div>
                                    
                                        <div className="col-md-4">
                                            <div className="form-group"> 
                                                <label>Token Publico</label> 
                                                    <input 
                                                        type="text" 
                                                        name="publico" 
                                                        className="form-control" 
                                                        placeholder="Ingresa Token Publico" 
                                                        onChange={ handleChange }
                                                        /> 
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group"> 
                                                <label>Token Privado</label> 
                                                    <input 
                                                        type="text" 
                                                        name="privado" 
                                                        className="form-control mb-5" 
                                                        placeholder="Ingresa Token Privado"
                                                        onChange={ handleChange }
                                                        /> 
                                            </div>
                                            </div>
                                            </div>      
                                        
                            
                                <div className="col-md-12">
                                    <textarea
                                        name="codigo"
                                        className="form-control mb-5" 
                                        placeholder="Ingresa el Payload aqui"
                                        onChange={ handleChange }
                                    />
                                </div>
                            
                                <div className="col-md-12">
                                    <label>Campo de Respuesta </label>
                                        <textarea
                                            autoFocus={true}
                                            readOnly
                                            // value={ result }
                                            className="form-control x-large-textarea mb-5" 
                                            defaultValue= { result }
                                            name="respuesta"
                                        />
                                </div>
                            
                                <div className="col-md-12">
                                    <div className="contact-btn gap-2 d-md-flex justify-content-md-end pb-5">
                                        <button className="me-md-2" onClick={ handleSubmit } type="submit">Enviar Solicitud</button>
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



//  // datos a enviar sign
//     // {
//     //     "email": "support@youwebsite.cl",
//     //     "name": "Joe Doe",
//     //     "phone": "923122312",
//     //     "address": "Moneda 101",
//     //     "country": "Chile",
//     //     "region": "Metropolitana",
//     //     "city": "Santiago",
//     //     "postal_code": "850000"
//     // }
//     //  registrar datos
//     // {
//     //     "email": "support@youwebsite.cl",
//     //     "order": 98745,
//     //     "subject": "test subject",
//     //     "amount": 25000,
//     //     "payment": 1,
//     //     "urlreturn": "https://youwebsite.com/urlreturn?orderClient=123",
//     //     "urlnotify": "https://youwebsite.com/urlnotify?orderClient=123"
//     // }