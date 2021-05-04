import React, { Fragment } from 'react'
import '../index'

const Formulario = () => {
    return (
        <Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <form className="form">
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
                                            />
                                    </label>
                                </div>
                                <div className="col-md-12">
                                    <textarea
                                        name="codigo"
                                        placeholder="Ingresa el Codigo aqui"
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
                    </div>
                </div>
            </div>
            
        </Fragment>
    )
}

export default Formulario
