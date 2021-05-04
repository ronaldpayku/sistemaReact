import React, { Fragment, useState } from 'react'
import '../index'

const Formulario = () => {

    const [tokenPublico, setTokenPublico] = useState('');
    const [tokenPrivado, setTokenPrivado] = useState('');
    const [codigo, setCodigo] = useState('');

    const [descripcion, setDescripcion] = useState([])

    const enviarSolicitud = (e) => {
        e.preventDefault();
        
        if(!tokenPublico.trim()){
            console.log('Ingresa el token publico')
            return
        }
        
        if(!tokenPrivado.trim()){
            console.log('Ingresa el token privado')
            return
        }
        
        if(!codigo.trim()){
            console.log('Ingresa codigo de consulta')
            return
        }
        console.log('procesando datos....')

        setDescripcion([
            ...descripcion,
            {
                campoPublico: tokenPublico,
                campoPrivado: tokenPrivado,
                campoCodigo: codigo
            }
        ])

        //para limpiar los campos
        e.target.reset() 

        //para que vuelvan a estar vacios en los hooks
        setTokenPublico('')
        setTokenPrivado('') 
        setCodigo('')
    }


    return (
        <Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <form className="form" onSubmit={ enviarSolicitud}>
                            <div className="title mt-5">
                                <h2>Sistema Interno Payku</h2>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <select className="form-select mb-5 text-color" aria-label="Default select example">
                                        <option selected>Selecciona Plataforma</option>
                                        <option value="1">https://des.payku.cl/</option>
                                        <option value="2">https://app.payku.cl/</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                <select className="form-select mb-5 text-color" aria-label="Default select example">
                                    <option selected>Selecciona el Endpoint</option>
                                    <option value="1">api/transaction/</option>
                                    <option value="2">api/transaction/</option>
                                </select>
                                </div>
                                <div className="col-md-6">
                                    <label>
                                        Token Publico
                                        <input
                                            type="text"
                                            name="publico"
                                            placeholder="Ingresa Token Publico"
                                            onChange={ e => setTokenPublico(e.target.value) }
                                            />
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label>
                                        Token Privado
                                        <input
                                            type="text"
                                            name="privado"
                                            placeholder="Ingresa Token Privado"
                                            onChange={ e => setTokenPrivado(e.target.value) }
                                            />
                                    </label>
                                </div>
                                <div className="col-md-12">
                                    <textarea
                                        name="codigo"
                                        placeholder="Ingresa el Codigo aqui"
                                        onChange={ e => setCodigo(e.target.value) }
                                        />
                                </div>
                                <div className="col-md-12">
                                        <textarea
                                            name="respuesta"
                                        />

                                </div>
                                <div className="col-md-12">
                                    <div className="contact-btn gap-2 d-md-flex justify-content-md-end pb-5">
                                        <button className="me-md-2" type="submit">Enviar Solicitud</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <ul>
                            {
                                descripcion.map((item, index) => (
                                    <li key={index}>
                                        {item.campoPublico} - {item.campoPrivado} - {item.campoCodigo}

                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            
        </Fragment>
    )
}

export default Formulario
