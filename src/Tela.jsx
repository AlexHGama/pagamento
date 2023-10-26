import React, { useState, useEffect } from "react";
import axios from 'axios';
import  { cartoes }  from "./card";
import mask from "./mask";
import "./Modal.css";
import "./Componente.css";


 
export function Tela(props){

  const [listaItem, setListaItem] = useState([]);
  const [modal, setModalAberto] = useState(false);
  const [pagamento, setPagamento] = useState(null);
  const [aprovado, setAprovado] = useState(false);
  const [reprovado, setReprovado] = useState(false);


  useEffect(() => {
    axios.get("https://www.mocky.io/v2/5d531c4f2e0000620081ddce")
      .then((resp) => {
       setListaItem(resp.data)
       console.log(resp);
      }) 
      .catch(erro=> {
      console.log(erro);
      })
  } , []);
  
  


  //Função Modal de pagamento
 //Pagamento para o map "Usuario"
  function onClick(item) {
    setPagamento(item);
    setModalAberto(true);
  }  



  const dadosCartao = async (e) => 
  { e.preventDefault();

  const formData = new FormData(e.target);
  const value = formData.get("valorPago");
  const cartao = formData.get("selecionaCartao");
  const selecaoCartao = cartoes.find((cartaoObjeto) => cartaoObjeto.card_number === cartao);
   
  // Pega a informação e verifica no metodo POST 

  await (
    await fetch("https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989",
      {
        method: "POST",
        body: {
          card_number: cartao,
          cvv: selecaoCartao.cvv,
          expiry_date: selecaoCartao.expiry_date,

          destination_user_id: pagamento.id,

          value: value,
        },
      })
  ).json(); 

       //verificação do cartão selecionado 
       //Caso for true pagamento realizado com sucesso
       //Caso for false pagamento não realizado 

  if (cartao === "1111111111111111") {
    setAprovado(true);
  } else {
   setReprovado(true);
  }
   setModalAberto(false);

  };


  //Modal pagamento seleção cartão crédito
  return (   
  <> 
    {     
      modal && (
      
      <div className="modal">
        
        <div>
            <div className="textmodal">
              <p>Pagamento para: {pagamento.name}</p>
            </div>
                   
            <div onClick={() => setModalAberto(false)}>
              <p className="fechar">X</p>
            </div>
             
          <form onSubmit={dadosCartao}>
            <div>
              <input
                type="text"
                placeholder="R$: 0,00"
                onKeyUp={mask}
                maxLength={30}
                required
              />
            </div>
              {/*<Informe o cartão*/}
              <select name="selecionaCartao" defaultValue={"info_card"}>
                {cartoes.map((cartao) => {
                 return (
                 <option
                   value={cartao.card_number}
                  >
                    Cartão com final {cartao.card_number.substring(12)}
                  </option>
                  );
                })
                }
              </select>

              <button className="botaomodal"
                type="submit"
              >  
               Pagar 
              </button>
          </form>
            
        </div>
         
                     
      </div>
      
             
    )} 
      
    { 
      //Listagem usuários nome, ID e Username   
      <header className="listatodos">
      
        <div className="container1"></div> 
         {listaItem.map((item) => {
           return (
            
            <div className="usuario" key={item.id}>
              <div className="container">
                
                <div className="image">
                  <img id="imagem" src={item.img} />
                </div>

                <div className="dados">
                  <p className="nome">
                    <b>Usuário:</b> {item.name}
                  </p>
                  <p>
                    <b className="user">ID:</b> {item.id}
                    <b>-Username:</b> {item.username}
                  </p>
                </div>

                <div className="botao">
                  <button onClick={() => {onClick(item);}} id="botao1">
                    Pagar
                  </button>
                </div>
              </div>
            </div>
          )})}         
      </header>
    }
     
    {
      //Modal de pagamento sucesso no pagamento (true)
      
      aprovado && (
          
        <div className="modal">         
              
          <div onClick={() => setAprovado(false)}>
           <p className="fechar">X</p>              
          </div>
          <div  className="texmodal" >
            <span> Pagamento foi <strong> concluido</strong> com sucesso para : {pagamento.name} </span> 
          </div>
        </div>
      )
    }

    {
      //Modal de pagamento erro no pagamento (false)
      
      reprovado && (
          
        <div className="modal">
          <div onClick={() => setReprovado(false)}>
            <p className="fechar">X</p>              
          </div >
          <div  className="texmodal" >                     
            <span>O pagamento NÃO foi<strong> concluido.</strong> </span>
          </div>
        </div>
      )
    }  
    
    
  </>
)};

export default Tela;