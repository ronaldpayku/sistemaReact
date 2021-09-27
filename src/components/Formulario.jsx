import React, { Fragment, useState, useRef } from 'react'
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '../index';
import ReCAPTCHA from "react-google-recaptcha";


const Formulario = (props) => {

    const [request, setRequest] = useState({url: 'https://des.payku.cl', publico: '', privado:'', id:'', endpoint: '', method: 'get'});
    const [result, setResult] = useState('');
    const [active, setActive] = useState(0);
    const [filtered, setFiltered] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [input, setInput] = useState("");
    const [firma, setFirma] = useState('')
    const [errors, setErrors] = useState('')
    const [errorPrivado, setErrorPrivado] = useState('')
    const captcha = useRef(null)
    const [captchaValido, setCaptchaValido] = useState(null)
        
    const handleChange = (e) => {
        
        setRequest({
          ...request,
          [e.target.name]: e.target.value,
        });
    };

    const submitHandler = (e) => {        

        setRequest({
            ...request,
            [e.target.name]: e.target.value,
          });
  
        const { suggestions } = props;
        const input = e.target.value;
        const newFilteredSuggestions = suggestions.filter(
            suggestion =>
            suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
        );
        setActive(0);
        setFiltered(newFilteredSuggestions);
        setIsShow(true);
        setInput(e.target.value)
        setCaptchaValido(true)
    }

    const click = e => {

        setActive(0);
        const apiendpoint = e.target.innerText;
        setRequest({
            ...request,
            endpoint:apiendpoint
        })
        setFiltered([]);
        setIsShow(false);
        setInput(apiendpoint)
    };
    
    const onKeyDown = e => {
        
        if (e.keyCode === 13) { // enter key
            
            setActive(0);
            setIsShow(false);
            setInput(filtered[active])
        }
        
        else if (e.keyCode === 38) { // flecha arriba
          return (active === 0) ? null : setActive(active - 1);
        }
  
        else if (e.keyCode === 40) { // flecha abajo
            return (active - 1 === filtered.length) ? null : setActive(active + 1);
        }
    };
    
    const renderAutocomplete = () => {
        if (isShow && input) {
            if (filtered.length) {
                return (
                    <ul className="autocomplete">
                        { filtered.map (( suggestion, index ) => {
                            
                            let className;
                            if (index === active) {
                            className = "active";
                            }
                            
                            return (
                            <li className={className} key={suggestion} onClick={click}>
                                {suggestion}
                            </li>
                            );
                        })}
                    </ul>
                );

            } else {
                return (
                    <div className="no-autocomplete mb-4">
                        El EndPoint Seleccionado no coincide con ninguna busqueda
                    </div>
                );
            }
        }
            return <></>;
    }
    
   
    const handleSubmit = (e) => {
        e.preventDefault();  

        let errores = ''
        let dataParse = ''
        let dataExample = '{"email": "support@youwebsite.cl","name": "Joe Doe","rut": "11111111","phone": "923122312","address":"Moneda101","country": "Chile","region": "Metropolitana","city": "Santiago","postal_code": "850000"}'
        let exampleJson = JSON.parse(dataExample)

        setCaptchaValido(true)
        setErrors('')
        setErrorPrivado('')
        setFirma('')
       
        if (!`${request.publico}`.trim()){
            errores = "Debes ingresar un token Público valido"
            setErrors(errores)
        
        } else if (`${request.publico}`.length !== 32) {
            errores = "Token Público debe contener 32 caracteres"
            setErrors(errores)
        
        } else if (!`${request.publico}`.match(/^[a-zA-Z0-9]+$/) ){
            errores = "Token  Público no debe contener caracteres especiales"
            setErrors(errores)   
        }
        
        if (`${request.endpoint}` !== '/api/transaction/' ){

            if (!`${request.privado}`.trim()){

                errores = "Debes ingresar un token Privado valido"
                setErrorPrivado(errores)
        
            } else if (`${request.privado}`.length !== 32) {
                errores = "Token Privado debe contener 32 caracteres"
                setErrorPrivado(errores)
        
            } else if (!`${request.privado}`.match(/^[a-zA-Z0-9]+$/) ){
                errores = "Token Privado no debe contener caracteres especiales"
                setErrorPrivado(errores)   
        
            }
        }        
        if(request.method === 'post' || request.method === 'put'){

            try {
                dataParse = JSON.parse(request.codigo)         
            } catch (error) {
    
                errores = 'errorParse'
                setResult(`Ha habido un error en el formato de los datos enviados por favor revisa que este escrito de la siguiente manera:  \n ${JSON.stringify(exampleJson, null, 2)} \n y rectifica que la ultima linea de los valores NO lleve una coma(,)` )
            }            
            console.log(dataParse);
        }
        
        if ( captcha.current.getValue() && errores === '') {

            apiRequest(`${request.method}`, `${request.endpoint}`, `${request.codigo}`, `${request.publico}`, `${request.privado}`, `${request.id}`)
            .then(axiosRes => setResult(JSON.stringify(axiosRes.data, null, 2)))
            .catch(res => setResult(JSON.stringify(res.response, null, 2)))
            setCaptchaValido(true)
    
        } else {
    
           setCaptchaValido(false)
       }
        captcha.current.reset()
        
    }
    
    const apiRequest = (method,path,sendData,publicToken,privateToken="",id="",sign="") => {
        
        let dataExample = '{"email": "support@youwebsite.cl","name": "Joe Doe","rut": "11111111","phone": "923122312","address":"Moneda101","country": "Chile","region": "Metropolitana","city": "Santiago","postal_code": "850000"}'
       
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
               
        if (`${request.endpoint}` !== '/api/transaction/') {

            const requestPath = encodeURIComponent(`${request.endpoint}${request.id}`);
            const orderedData = {};
            Object.keys(sendDataCopy).sort().forEach(function(key) {
                orderedData[key] = sendDataCopy[key];
            })
          
            const arrayConcat = new URLSearchParams(orderedData).toString()
            const concat = requestPath + "&" + arrayConcat;
            sign = CryptoJS.HmacSHA256(concat, `${privateToken}`).toString();
            setFirma(sign)
        }
            
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
    
    return (
        <Fragment>           
            <div className="container"> 
                <div className="card card-styles">
                    <nav className="navbar" >
                        <div className="navbar-brand">
                            <img src="https://storage.googleapis.com/storage-payku-prd/public/img/payku2020_2.svg" width="156" height="80" alt="payku"/>
                        </div>
                    </nav>

                    <div className="row">
                        <div className="col-md-10 offset-md-1">                        
                            <form className="form" >
                                <div className="title text-color">
                                    <h2>Consultas Api Payku</h2>
                                </div>

                                    <div className="row">
                                        <div className="col-xl-4">
                                            <div className="form-group"> 
                                                <label>Plataforma</label> 
                                                    <select onChange={ handleChange } 
                                                        name="url" 
                                                        className="form-control form-control-lg mb-5 mt-2 text-color">
                                                            <option value="https://des.payku.cl">Desarrollo</option>
                                                            <option value="https://app.payku.cl">Produccion</option>
                                                            <option value="https://devqa.payku.cl">QA</option>
                                                    </select> 
                                            </div>
                                        </div>
                                        
                                        <div className="col-xl-4">
                                            <div className="form-group"> 
                                                <label>Metodo</label> 
                                                    <select onChange={ handleChange } 
                                                    name="method" 
                                                    className="form-control form-control-lg mb-5 mt-2 text-color">
                                                        <option value="get">GET</option>
                                                        <option value="post">POST</option>
                                                        <option value="put">PUT</option>
                                                        <option value="delete">DELETE</option>
                                                </select> 
                                            </div>
                                        </div>

                                        <div className="col-xl-4">
                                                <div className="form-group ">
                                                    <label>EndPoint</label>
                                                        <input
                                                            type="text" 
                                                            name="endpoint"
                                                            className="form-control form-select mt-2 mb-5 letras" 
                                                            placeholder="Escribe el EndPoint"
                                                            onChange={ submitHandler }
                                                            onKeyDown={ onKeyDown }
                                                            value={ request.endpoint } 
                                                            onClick={click}
                                                        /> 
                                                        {renderAutocomplete()}
                                                </div>
                                            </div>
                                    </div>
                                    
                                        <div className="row">
                                            <div className="col-xl-4">
                                                <div className="form-group">
                                                    <label>Parámetros Get</label>
                                                        <input
                                                            type="text" 
                                                            name="id"
                                                            className="form-control mb-5 letras" 
                                                            placeholder="Ingresa Parámetros a Consultar"
                                                            onChange={ handleChange } 
                                                            /> 
                                                </div>
                                            </div>
                                        
                                            <div className="col-xl-4">
                                                <div className="form-group"> 
                                                    <label>Token Público</label> 
                                                    <div className="error-token">
                                                        { errors && <p>{errors}</p>}
                                                    </div>
                                                        <input 
                                                            type="text" 
                                                            name="publico" 
                                                            className="form-control mb-5 letras" 
                                                            placeholder="Ingresa Token Público" 
                                                            onChange={ handleChange }
                                                            /> 
                                                </div>
                                            </div>

                                            <div className="col-xl-4">
                                                <div className="form-group"> 
                                                    <label>Token Privado</label> 
                                                    <div className="error-token">
                                                        { errorPrivado && <p>{errorPrivado}</p>}
                                                    </div>
                                                        <input 
                                                            type="text" 
                                                            name="privado" 
                                                            className="form-control mb-5 letras" 
                                                            placeholder="Ingresa Token Privado"
                                                            onChange={ handleChange }
                                                            /> 
                                                </div>
                                            </div>
                                        </div>      
                                
                                    <div className="col--12">
                                        <label>Ingreso de Datos </label>
                                            <textarea
                                                name="codigo"
                                                className="form-control mb-5 letras" 
                                                placeholder="Ingresa el Payload aqui"
                                                onChange={ handleChange }
                                                />
                                    </div>
                                
                                    <div className="col-md-12">
                                        <label>Campo de Respuesta </label>
                                            <textarea
                                                autoFocus={true}
                                                readOnly
                                                className="form-control x-large-textarea mb-5" 
                                                defaultValue= { result }
                                                name="respuesta"
                                                />
                                    </div>
                                    
                                    { result && <div><label>Este es el Path Generado:<p>{request.url}{request.endpoint}{request.id}</p></label></div>}

                                    { firma  && <div><label>Esta transacción  genero la siguiente Firma:<p>{firma}</p></label></div>}                                         
                                
                                    <div className="col-md-12"> 
                                        <div className="recaptcha">
                                            <ReCAPTCHA 
                                                ref = {captcha}
                                                sitekey = "6LeU9NQaAAAAADraJAOsjgwjsStGWlp6zm_Td2Ka"
                                                onChange={ handleSubmit }
                                                onExpired={ handleChange}
                                                />     
                                        </div>  
                                        { captchaValido === false && <div className="error-captcha">Por favor acepta el captcha</div>}                                         
                                        
                                        <div className="contact-btn gap-2 d-md-flex justify-content-md-end pb-5">
                                            <button className="me-md-2 mt-3" onClick={ handleSubmit } type="submit">Enviar Solicitud</button>
                                        </div>
                                    </div>         
                            </form>
                            <footer className="text-color mb-5">
                                &copy; 2016-2021 | Payku Spa
                            </footer>
                        </div>
                    </div>
                </div>               
            </div>  
        </Fragment>
    )
}

export default Formulario
