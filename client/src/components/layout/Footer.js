import React from 'react';

const Footer = () => {
  return (
    <footer className="sw-footer">
      <div className="sw-footer-inner">
        <div className="sw-footer-confidential">
          <h4>Conteúdo confidencial do SENAI</h4>
          <p>
            Esta página de acesso restrito contém informações confidenciais do SENAI/SESI.
            Você precisa ter um contrato de confidencialidade e/ou licenciamento que cubra
            informações confidenciais do SENAI para usar ou acessar esta página.
          </p>
        </div>
        <div className="sw-footer-top" style={{ marginTop: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#8f98a0' }}>SENAI</span>
              <span style={{ fontSize: '16px', fontWeight: 300, color: '#556772' }}>WORKS</span>
              <span style={{ display: 'inline-block', width: 6, height: 6, background: '#556772', marginLeft: 1, marginBottom: 6 }}></span>
              <span style={{ display: 'inline-block', width: 6, height: 6, background: '#2a475e', marginBottom: 0 }}></span>
            </div>
            <p className="sw-footer-desc">
              O SenaiWorks é o conjunto de ferramentas e serviços criados pelo SENAI que ajudam você a
              configurar, gerenciar e operar o seu jogo na plataforma.
            </p>
          </div>
          <div className="sw-footer-col">
            <h4>Documentação</h4>
            <a href="/#">Início</a>
            <a href="/#">Primeiros passos</a>
            <a href="/#">Presença na loja</a>
            <a href="/#">Recursos</a>
            <a href="/#">Finanças</a>
          </div>
          <div className="sw-footer-col">
            <h4>Recursos</h4>
            <a href="/#">Discussões do SenaiWorks</a>
            <a href="/#">Videotutoriais</a>
          </div>
          <div className="sw-footer-col">
            <h4>Notícias e Atualizações</h4>
            <a href="/#">Blog do SenaiWorks</a>
            <a href="/#">Blog do SENAI</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
