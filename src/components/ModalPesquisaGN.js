import React, { useState, useEffect } from 'react';
import { getProdutos } from '../services/api'; // Importa a função que busca fornecedores
import '../styles/ModalPesquisaGN.css'; // Certifique-se de criar este CSS também
import Toast from '../components/Toast';


const ModalPesquisaGN = ({ isOpen, onClose, onSelectProduto }) => {
  const [produtos, setProdutos] = useState([]);
  const [cEAN, setcEAN] = useState(''); // Estado para filtro por CPF/CNPJ
  const [id, setId] = useState(''); // Estado para filtro por CPF/CNPJ
  const [nome, setNome] = useState(''); // Estado para filtro por nome
  const [toastMessage, setToastMessage] = useState(''); // Estado para mensagem do Toast



  useEffect(() => {
    handleClear()
  }, [isOpen]);

  const fetchProdutos = async () => {
    try {
      const response = await getProdutos({ cEAN, nome, id });
      setProdutos(response.data);

      if (response.data.length === 0) {
        setToastMessage('Nenhum produto encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setToastMessage('Erro ao buscar produtos.');
    }
  };

  const handleSelectProduto = (produto) => {
    onSelectProduto(produto); // Envia o produto selecionado para o modal principal
    onClose(); // Fecha o modal de pesquisa
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setToastMessage(''); // Limpa o toast antes da busca
    fetchProdutos();
  };

  const handleClear = () => {
    setProdutos([]);
    setcEAN('');
    setNome('');
    setId('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>Pesquisar Produtos</h2>
        <div id='vincula-produto'>
          <div>
            <label htmlFor="cEAN">Código de Barras</label>
            <input
              className="input-pesquisa-produto"
              type="text"
              id="cEAN"
              value={cEAN}
              onChange={(e) => setcEAN(e.target.value)} // Atualiza o estado de CPF/CNPJ
              placeholder="Digite o Código de Barras"
            />
          </div>
          <div>
            <label htmlFor="nome">Nome:</label>
            <input
              className="input-pesquisa-produto"
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)} // Atualiza o estado de nome
              placeholder="Digite o nome do produto"
            />
          </div>
          <div>
            <label htmlFor="id">Código Produto:</label>
            <input
              className="input-pesquisa-produto"
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)} // Atualiza o estado de nome
              placeholder="Digite código do produto"
            />
          </div>
          <button className="button" onClick={handleSearch}>Buscar</button> {/* Botão para acionar a busca */}
        </div>

        <ul className="produtos-list">
          {produtos.map((produto) => (
            <li
              key={produto.id}
              className="produto-item"
              onClick={() => handleSelectProduto(produto)}
            >
              {produto.id} - {produto.cEAN} - {produto.xProd}
            </li>
          ))}
        </ul>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      </div>
    </div>
  );
};

export default ModalPesquisaGN;
