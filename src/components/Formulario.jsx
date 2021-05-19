import React, { Fragment, useState, useRef } from 'react'
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '../index'
import ReCAPTCHA from "react-google-recaptcha";




const Formulario = (props) => {
    


    const [request, setRequest] = useState({id:''});
    const [result, setResult] = useState('');
    const [active, setActive] = useState(0);
    const [filtered, setFiltered] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [input, setInput] = useState("");

    const [firma, setFirma] = useState('')
    //patron flux

    //probando captcha
    const captcha = useRef(null)
    const [captchaValido, setCaptchaValido] = useState(null)


    
        
    const handleChange = (e) => {
        
        setRequest({
          ...request,
          [e.target.name]: e.target.value,
        });
        
        const { suggestions } = props;
        const input = e.currentTarget.value;
        const newFilteredSuggestions = suggestions.filter(
            suggestion =>
            suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
            );
        console.log("este es el input ",input)
        setActive(0);
        setFiltered(newFilteredSuggestions);
        setIsShow(true);
        setInput(e.currentTarget.value)
       

        
    };

   
    const handleSubmit = (e) => {
        e.preventDefault();  
        setCaptchaValido(true)
        //probando captcha
        // console.log('valor captcha handle', captcha.current.getValue() )

        if (captcha.current.getValue()) {

            // console.log('no es un robot');
            // console.log('entrando handleSubmit')
            apiRequest(`${request.method}`, `${request.endpoint}`, `${request.codigo}`, `${request.publico}`, `${request.privado}`, `${request.id}`)
            .then(axiosRes => setResult(JSON.stringify(axiosRes.data, null, 2)))
            .catch(res => console.error(res.response))
            setCaptchaValido(true)

        } else {

            console.log('acepta el captcha')
            setCaptchaValido(false)
        }
        
    }

    const apiRequest = (method,path,sendData,publicToken,privateToken="",id="",sign="") => {
       
        let dataExample = '{"email": "support@youwebsite.cl","name": "Joe Doe","phone": "923122312","address":"Moneda101","country": "Chile","region": "Metropolitana","city": "Santiago","postal_code": "850000"}'
       
        let exampleJson = JSON.parse(dataExample)
      
        let sendDataCopy = '';

        // const sign = '';

        if(method === 'post' || method === 'put') {
            try {

                sendDataCopy = sendData
                sendDataCopy = JSON.parse(sendDataCopy)         
            
            } catch (error) {

                setResult(`Ha habido un error en el formato de los datos enviados por favor revisa que este escrito de la siguiente manera:  \n ${JSON.stringify(exampleJson, null, 2)} \n y rectifica que la ultima linea de los valores NO lleve una coma(,)` )

                
            }            
        }
        
               
        if (`${request.endpoint}` === '/api/suclient/') {

            const requestPath = encodeURIComponent(`${request.endpoint}`);
            const orderedData = {};
            Object.keys(sendDataCopy).sort().forEach(function(key) {
                orderedData[key] = sendDataCopy[key];
            })
          
            const arrayConcat = new URLSearchParams(orderedData).toString()
            const concat = requestPath + "&" + arrayConcat;
            const sign = CryptoJS.HmacSHA256(concat, `${privateToken}`).toString();
            setFirma(sign)
            
            console.log('firma:', sign)
            // console.log('mostrando datos, url, id, firma', `${request.url}${path}${id}`)
            
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
        else {
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
        
    }


    const click = e => {

        // setActive(0);
        const apiendpoint = e.currentTarget.innerText;
        setRequest({
            ...request,
            endpoint:apiendpoint
        })
        setFiltered([]);
        setIsShow(false);
        // setInput(apiendpoint)
    };
    
    const onKeyDown = e => {
        
        if (e.keyCode === 13) { // enter key
            
            setActive(0);
            setIsShow(false);
            // setInput(filtered[active])
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

            } 
            else {
                  return (
                <div className="no-autocomplete mb-4">
                  El EndPoint Seleccionado no coincide con ninguna busqueda
                </div>
              );
            }
        }
                    
            return <></>;
    }
    
    
    
    
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
                                                        <option value="https://app.payku.cl/">Produccion</option>
                                                        <option value="https://devqa.payku.cl/">QA</option>
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
                                                    <option value="put">PUT</option>
                                                    <option value="delete">DELETE</option>
                                            </select> 
                                        </div>
                                    </div>

                                    {/* Cuadro de texto del endpoint */}
                                    
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Escribe el EndPoint</label>
                                                    <input
                                                        type="text" 
                                                        name="endpoint"
                                                        className="form-control mt-2 text-color" 
                                                        placeholder="EndPoint"
                                                        onChange={ handleChange }
                                                        onKeyDown={ onKeyDown }
                                                        value={ request.endpoint } 
                                                        onClick={click}
                                                    /> 
                                                    {renderAutocomplete()}
                                            </div>
                                        </div>
                                    

                                </div>
                                   
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label>Identificador</label>
                                                
                                                    <input
                                                        type="text" 
                                                        name="id"
                                                        className="form-control mb-5" 
                                                        placeholder="Ingresar el ID a Consultar"
                                                        onChange={ handleChange } 
                                                        
                                                    /> 
                                            </div>
                                        </div>
                                    
                                        <div className="col-md-4">
                                            <div className="form-group"> 
                                                <label>Token Público</label> 
                                                    <input 
                                                        type="text" 
                                                        name="publico" 
                                                        className="form-control" 
                                                        placeholder="Ingresa Token Público" 
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
                                    <label>Ingreso de Datos </label>
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
                                            className="form-control x-large-textarea mb-5" 
                                            defaultValue= { result }
                                            name="respuesta"
                                        />
                                </div>
                                
                                { result && <div><label>Este es el Path Generado:<p>{request.url}{request.endpoint}{request.id}</p></label></div>}

                                { firma && <div><label>Esta transacción  genero la siguiente Firma:<p>{firma}</p></label></div>}                                         
                               
                                <div className="col-md-12">
                                     <div className="recaptcha">
                                        <ReCAPTCHA 
                                            ref = {captcha}
                                            sitekey = "6LeU9NQaAAAAADraJAOsjgwjsStGWlp6zm_Td2Ka"
                                            onChange={ handleSubmit }
                                        />    
                                    </div>   
                                    { captchaValido === false && <div className="error-captcha">Por favor acepta el captcha</div>}                                         
                                    
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

                                                        