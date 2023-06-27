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
       
      {reservas.length === 0 ? (
          <p>Nenhuma reserva cadastrada.</p>
        ) : (
          <ul className="list-group">
            {reservas.map((reserva) => (
              <li
                key={reserva.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {reserva.nome} - Check-in: {reserva.dataCheckIn} / Check-out: {reserva.dataCheckOut} / Endereço: {reserva.endereco}
                <div>
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={() => editarReserva(reserva.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => excluirReserva(reserva.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
      <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
      <h2 className="mt-4">Cadastro de Reservas</h2>
        <form onSubmit={adicionarReserva} className="mt-4">
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="dataCheckIn">Data de Check-in:</label>
            <input
              type="date"
              className="form-control"
              id="dataCheckIn"
              value={dataCheckIn}
              onChange={(e) => setDataCheckIn(e.target.value)}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="dataCheckOut">Data de Check-out:</label>
            <input
              type="date"
              className="form-control"
              id="dataCheckOut"
              value={dataCheckOut}
              onChange={(e) => setDataCheckOut(e.target.value)}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="cep">CEP:</label>
            <input
              type="text"
              className="form-control"
              id="cep"
              placeholder="Digite o CEP"
              maxLength="8"
              onChange={handleCEPChange}
              required />
          </div>
          <div className="form-group">
            <label htmlFor="endereco">Endereço:</label>
            <input
              type="text"
              className="form-control"
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
          <button type="submit" className="btn btn-primary">
            {modoEdicao ? 'Editar Reserva' : 'Adicionar Reserva'}
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={limparFormulario}
          >
            Limpar
          </button>
        </form>
      </div>
      <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
        tab3
      </div>
    </div>
    </>
  );
}

export default App;
