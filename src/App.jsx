import Formulario from "./components/Formulario";
import './index.css'


function App() {
  return (
    <div className="container">
      <Formulario 
        suggestions={[
          "/api/transaction", 
          "api/verificar/", 
          "api/maclient/", 
          "api/maaffiliation/",
          "/api/suclient/", 
          "api/suclient/customers/", 
          "/api/sususcription/", 
          "api/sutransaction/", 
          "api/suinscriptionscards/", 
          "api/suplan/",
          "api/suplan/plans/",
          "urlnotifysuscription/",
          "urlnotifypayment/",
          "api/event/"
        ]}
       /> 
    </div>
  );
}

export default App;
