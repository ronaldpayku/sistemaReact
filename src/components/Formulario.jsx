import React, { Fragment, useState } from 'react'
import axios from 'axios';
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
        console.log('entrando de nuevo')
        apiRequest(`${request.method}`, `${request.endpoint}`, `${request.codigo}`, `${request.publico}`, `${request.privado}`)
        .then(axiosRes => setResult(JSON.stringify(axiosRes.data)))
        .catch(res => console.error(res.response))
    }
    
    const apiRequest = (method,path,sendData,publicToken,sign="") => {
        console.log(sendData)
        let sendDataCopy = '';
        if(method === 'post' || method === 'put') {
            sendDataCopy = sendData
            sendDataCopy = JSON.parse(sendDataCopy)
        }
        return axios({
          method: `${method}`,
          url: `${request.url}${path}`, 
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
                          
                            <div className="col-md-6">
                                <label>
                                    Seleciona metodo de solicitud
                                    <select onChange={ handleChange } name="method" className="form-select mb-5 mt-2 text-color">
                                        <option selected disabled></option>
                                        <option value="get">GET</option>
                                        <option value="post">POST</option>
                                        <option value="put">PUT</option>
                                        <option value="delete">DELETE</option>
                                    </select>
                                </label>
                            </div>
                          
                            <div className="row">
                                <div className="col-md-6">
                                    <label>
                                    Selecciona Plataforma
                                        <select onChange={ handleChange } name="url" className="form-select mb-5 mt-2 text-color">
                                            <option selected disabled></option>
                                            <option value="https://des.payku.cl/">https://des.payku.cl/</option>
                                            <option value="https://app.payku.cl/">https://app.payku.cl/</option>
                                        </select>
                                    </label>
                                </div>
                          
                                <div className="col-md-6">
                                    <label>
                                        Selecciona el Endpoint
                                        <select className="form-select mb-5 mt-2 text-color" onChange={ handleChange } name="endpoint">
                                            <option selected disabled></option>
                                            <option value="api/transaction/">api/transaction/</option>
                                            <option value="api/transaction/">api/transaction/</option>
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
                                            value={ result }
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

