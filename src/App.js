import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [nome, setNome] = useState('');
  const [dataCheckIn, setDataCheckIn] = useState('');
  const [dataCheckOut, setDataCheckOut] = useState('');
  const [endereco, setEndereco] = useState('');
  const [enderecoAutoComplete, setEnderecoAutoComplete] = useState([]);

  useEffect(() => {
    const reservasSalvas = localStorage.getItem('reservas');
    if (reservasSalvas) {
      setReservas(JSON.parse(reservasSalvas));
    }
  }, []);

  const adicionarReserva = (event) => {
    event.preventDefault();

    if (modoEdicao) {
      const reservaEditada = {
        id: idEdicao,
        nome,
        dataCheckIn,
        dataCheckOut,
        endereco,
      };

      const reservasAtualizadas = reservas.map((reserva) =>
        reserva.id === idEdicao ? reservaEditada : reserva
      );

      setReservas(reservasAtualizadas);
      setModoEdicao(false);
      setIdEdicao(null);
    } else {
      const novaReserva = {
        id: new Date().getTime(),
        nome,
        dataCheckIn,
        dataCheckOut,
        endereco,
      };

      const novasReservas = [...reservas, novaReserva];
      setReservas(novasReservas);
    }

    localStorage.setItem('reservas', JSON.stringify(reservas));
    limparFormulario();
  };

  const excluirReserva = (id) => {
    const novasReservas = reservas.filter((reserva) => reserva.id !== id);
    setReservas(novasReservas);

    localStorage.setItem('reservas', JSON.stringify(novasReservas));
  };

  const editarReserva = (id) => {
    const reservaEditavel = reservas.find((reserva) => reserva.id === id);
    setNome(reservaEditavel.nome);
    setDataCheckIn(reservaEditavel.dataCheckIn);
    setDataCheckOut(reservaEditavel.dataCheckOut);
    setEndereco(reservaEditavel.endereco);
    setModoEdicao(true);
    setIdEdicao(id);
  };

  const limparFormulario = () => {
    setNome('');
    setDataCheckIn('');
    setDataCheckOut('');
    setEndereco('');
  };

  const buscarEndereco = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;
      setEndereco(`${logradouro}, ${bairro}, ${localidade} - ${uf}`);
    } catch (error) {
      console.log('Erro ao buscar endereço:', error);
    }
  };

  const handleCEPChange = (event) => {
    const cep = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) {
      buscarEndereco(cep);
    } else {
      setEndereco('');
    }
  };

  const handleEnderecoChange = (event) => {
    setEndereco(event.target.value);
    setEnderecoAutoComplete([]);
  };

  const handleEnderecoAutoComplete = async (event) => {
    const termoPesquisa = event.target.value;
    setEndereco(termoPesquisa);

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${termoPesquisa}/json/`
      );
      setEnderecoAutoComplete(response.data);
    } catch (error) {
      console.log('Erro ao buscar endereço:', error);
    }
  };



  return (
    <><div className="tab-content" id="pills-tabContent">
      <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
        <div id="contentAcomodacoes">
          <div id="titleTable" className="row">
            <div className="col-lg-5">Acomodação</div>
            <div className="col-lg-2">Hóspedes</div>
            <div className="col-lg-2">Check-in</div>
            <div className="col-lg-2">Check-out</div>
            <div className="col-lg-1"></div>
            <div className="col-lg-12">
              <div className="sepLine"></div>
            </div>
          </div>
          {reservas.length === 0 ? (
            <p>Nenhuma reserva cadastrada.</p>
          ) : (
            <div className="list-group">
              {reservas.map((reserva) => (
                <><div key={reserva.id} id="rowAcomodacao">
                  <div className="row">
                    <div className="col-lg-5">
                      <ul id="picAcomodacaoHlist">
                        <li>
                          <img src="accommodations/Duplo-Luxo.jpg" className="img-fluid" alt="" />
                        </li>
                        <li>
                          <span>#798419</span>
                          <strong>Quarto Duplo Luxo</strong>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-2">
                      <div className="hospedeName">
                        <strong>{reserva.nome}</strong>
                        <span>2 adultos - 1 criança</span>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="hospedeName">
                        <strong>{reserva.dataCheckIn}</strong>
                        <span>11:30</span>
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div className="hospedeName">
                        <strong>{reserva.dataCheckOut}</strong>
                        <span>11:30</span>
                      </div>
                    </div>
                    <div className="col-lg-1">
                      <div className="btn-group dropstart">
                        <button type="button" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="fa-solid fa-ellipsis"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>

                            <button onClick={() => editarReserva(reserva.id)} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                              Editar
                            </button>
                          </li>
                          <li>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => excluirReserva(reserva.id)}
                            >
                              Excluir
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div><div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Editando usuário <strong>{reserva.nome}</strong></h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <div id="contentAcomodacoes">
                            <form id="myForm" onSubmit={adicionarReserva} className="mt-4">
                              <div class="row">
                                <div class="col-lg-12">
                                  <h2>Dados da reserva</h2>
                                </div>
                              </div>
                              <div class="row">
                                <div className="col-lg-3">
                                  <label>Acomodação</label>
                                  <select name="" id="" className="inputForm">
                                    <option value="">Acomodação 01</option>
                                    <option value="">Acomodação 02</option>
                                    <option value="">Acomodação 03</option>
                                  </select>
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Check-in</label>
                                  <input
                                    type="date"
                                    className="inputForm"
                                    id="dataCheckIn"
                                    value={dataCheckIn}
                                    onChange={(e) => setDataCheckIn(e.target.value)}
                                    required />

                                </div>
                                <div class="col-lg-3">
                                  <label for="">Check-out</label>
                                  <input
                                    type="date"
                                    className="inputForm"
                                    id="dataCheckOut"
                                    value={dataCheckOut}
                                    onChange={(e) => setDataCheckOut(e.target.value)}
                                    required />
                                </div>
                                <div class="col-lg-3">
                                  <label for="">Hóspedes</label>
                                  <input type="text" className="inputForm" />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-12">
                                  <h2 className="mrg1">Dados do responsável</h2>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-3">
                                  <label>Nome</label>
                                  <input
                                    type="text"
                                    className="inputForm"
                                    id="nome"
                                    placeholder="Digite o nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required />
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Sobrenome</label>
                                  <input type="text" className="inputForm" />
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Documento</label>
                                  <input type="text" className="inputForm" placeholder="CPF\Passaporte" />
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Data de Nascimento</label>
                                  <input type="text" className="inputForm" />
                                </div>
                              </div>
                              <div className="row twoLine">
                                <div className="col-lg-3">
                                  <label>Telefone</label>
                                  <input type="text" className="inputForm" />
                                </div>
                                <div className="col-lg-3">
                                  <label for="">E-mail</label>
                                  <input type="text" className="inputForm" />
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Sexo</label>
                                  <input type="text" className="inputForm" />
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Nacionalidade</label>
                                  <input type="text" className="inputForm" />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-12">
                                  <h2 className="mrg1">Endereço</h2>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-3">
                                  <label>CEP</label>
                                  <input
                                    type="text"
                                    className="inputForm"
                                    id="cep"
                                    placeholder="Digite o CEP"
                                    maxLength="8"
                                    onChange={handleCEPChange}
                                    required />
                                </div>
                                <div className="col-lg-5">
                                  <label for="">Rua</label>
                                  <input
                                    type="text"
                                    className="inputForm"
                                    id="endereco"
                                    placeholder="Digite o endereço"
                                    value={endereco}
                                    onChange={handleEnderecoChange}
                                    onKeyUp={handleEnderecoAutoComplete}
                                    required />
                                  {enderecoAutoComplete.length > 0 && (
                                    <ul className="list-group endereco-autocomplete">
                                      {enderecoAutoComplete.map((endereco) => (
                                        <li
                                          key={endereco.cep}
                                          className="list-group-item"
                                          onClick={() => setEndereco(endereco.logradouro)}
                                        >
                                          {`${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}`}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Bairro</label>
                                  <input type="text" className="inputForm" placeholder="CPF\Passaporte" />
                                </div>
                                <div className="col-lg-1">
                                  <label for="">Nº</label>
                                  <input type="text" className="inputForm" />
                                </div>
                              </div>
                              <div className="row twoLine">
                                <div className="col-lg-3">
                                  <label>Cidade</label>
                                  <input type="text" className="inputForm" />
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Estado</label>
                                  <select id="estado" className="inputForm" name="estado">
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="TO">Tocantins</option>
                                    <option value="EX">Estrangeiro</option>
                                  </select>
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Complemento</label>
                                  <input type="text" className="inputForm" />
                                </div>
                                <div className="col-lg-3">
                                  <label for="">Referência</label>
                                  <input type="text" className="inputForm" />
                                </div>
                              </div>
                              <div class="row">
                                <div className="col-lg-3 offset-lg-6">
                                  <button type="submit" class="submitButton" >
                                    {modoEdicao ? 'Atualizar' : 'Usuário alterado!'}
                                  </button>
                                </div>
                                <div className="col-lg-3">
                                  <button type="button" className="submitButton" data-bs-dismiss="modal">Fechar</button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div></>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
        <div id="contentAcomodacoes">
          <form onSubmit={adicionarReserva} className="mt-4">
            <div class="row">
              <div class="col-lg-12">
                <h2>Dados da reserva</h2>
              </div>
            </div>
            <div class="row">
              <div className="col-lg-3">
                <label>Acomodação</label>
                <select name="" id="" className="inputForm">
                  <option value="">Acomodação 01</option>
                  <option value="">Acomodação 02</option>
                  <option value="">Acomodação 03</option>
                </select>
              </div>
              <div className="col-lg-3">
                <label for="">Check-in</label>
                <input
                  type="date"
                  className="inputForm"
                  id="dataCheckIn"
                  value={dataCheckIn}
                  onChange={(e) => setDataCheckIn(e.target.value)}
                  required />

              </div>
              <div class="col-lg-3">
                <label for="">Check-out</label>
                <input
                  type="date"
                  className="inputForm"
                  id="dataCheckOut"
                  value={dataCheckOut}
                  onChange={(e) => setDataCheckOut(e.target.value)}
                  required />
              </div>
              <div class="col-lg-3">
                <label for="">Hóspedes</label>
                <input type="text" className="inputForm" />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <h2 className="mrg1">Dados do responsável</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <label>Nome</label>
                <input
                  type="text"
                  className="inputForm"
                  id="nome"
                  placeholder="Digite o nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required />
              </div>
              <div className="col-lg-3">
                <label for="">Sobrenome</label>
                <input type="text" className="inputForm" />
              </div>
              <div className="col-lg-3">
                <label for="">Documento</label>
                <input type="text" className="inputForm" placeholder="CPF\Passaporte" />
              </div>
              <div className="col-lg-3">
                <label for="">Data de Nascimento</label>
                <input type="text" className="inputForm" />
              </div>
            </div>
            <div className="row twoLine">
              <div className="col-lg-3">
                <label>Telefone</label>
                <input type="text" className="inputForm" />
              </div>
              <div className="col-lg-3">
                <label for="">E-mail</label>
                <input type="text" className="inputForm" />
              </div>
              <div className="col-lg-3">
                <label for="">Sexo</label>
                <input type="text" className="inputForm" />
              </div>
              <div className="col-lg-3">
                <label for="">Nacionalidade</label>
                <input type="text" className="inputForm" />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <h2 className="mrg1">Endereço</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <label>CEP</label>
                <input
                  type="text"
                  className="inputForm"
                  id="cep"
                  placeholder="Digite o CEP"
                  maxLength="8"
                  onChange={handleCEPChange}
                  required />
              </div>
              <div className="col-lg-5">
                <label for="">Rua</label>
                <input
                  type="text"
                  className="inputForm"
                  id="endereco"
                  placeholder="Digite o endereço"
                  value={endereco}
                  onChange={handleEnderecoChange}
                  onKeyUp={handleEnderecoAutoComplete}
                  required />
                {enderecoAutoComplete.length > 0 && (
                  <ul className="list-group endereco-autocomplete">
                    {enderecoAutoComplete.map((endereco) => (
                      <li
                        key={endereco.cep}
                        className="list-group-item"
                        onClick={() => setEndereco(endereco.logradouro)}
                      >
                        {`${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-lg-3">
                <label for="">Bairro</label>
                <input type="text" className="inputForm" placeholder="CPF\Passaporte" />
              </div>
              <div className="col-lg-1">
                <label for="">Nº</label>
                <input type="text" className="inputForm" />
              </div>
            </div>
            <div className="row twoLine">
              <div className="col-lg-3">
                <label>Cidade</label>
                <input type="text" className="inputForm" />
              </div>
              <div className="col-lg-3">
                <label for="">Estado</label>
                <select id="estado" className="inputForm" name="estado">
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                  <option value="EX">Estrangeiro</option>
                </select>
              </div>
              <div className="col-lg-3">
                <label for="">Complemento</label>
                <input type="text" className="inputForm" />
              </div>
              <div className="col-lg-3">
                <label for="">Referência</label>
                <input type="text" className="inputForm" />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-3 offset-lg-9">

                <button type="submit" class="submitButton" >
                  {modoEdicao ? 'Atualizar' : 'Adicionar Reserva'}
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
      <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
        <div id="contentAcomodacoes">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="mrg1">Configurações</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
