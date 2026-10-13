import { useState } from 'react'
import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = ['roupas', 'eletronicos', 'acessorios', 'casa']

export default function Estoque({
  produtos,
  listaEspera = [],
  painelLiberado = false,
  onLiberarPainel,
}) {
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState('')

  function validarSenha(evento) {
    evento.preventDefault()
    if (!onLiberarPainel) {
      setErroSenha('Acesso restrito ao painel do lojista.')
      return
    }

    const liberado = onLiberarPainel(senha)
    if (liberado) {
      setErroSenha('')
      return
    }

    setErroSenha('Senha inválida. Tente novamente.')
  }

  if (!painelLiberado) {
    return (
      <section>
        <p className="sobretitulo">Acesso restrito</p>
        <h1>Painel do lojista</h1>

        <div className="estado-vazio" style={{ maxWidth: 520 }}>
          <p>Digite a senha para acessar os dados internos da loja.</p>

          <form onSubmit={validarSenha} className="form-acesso">
            <input
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="Senha do lojista"
              aria-label="Senha do lojista"
            />
            <button type="submit" className="botao botao-grande">
              Entrar
            </button>
          </form>

          {erroSenha && <p className="aviso aviso-erro">{erroSenha}</p>}
        </div>
      </section>
    )
  }

  const ordenados = produtos.slice().sort((a, b) => Number(a.estoque || 0) - Number(b.estoque || 0))

  const valorEmEstoque = produtos.reduce((total, produto) => {
    if (!Number.isFinite(Number(produto.price))) return total
    return total + Number(produto.price) * Number(produto.estoque || 0)
  }, 0)

  const produtosSemPreco = produtos.filter((produto) => !Number.isFinite(Number(produto.price)))
  const clientesEsperando = new Set(
    listaEspera.map((item) => String(item.email).trim().toLowerCase())
  ).size

  const esperaPorProduto = listaEspera.reduce((acumulador, item) => {
    acumulador[item.produtoId] = acumulador[item.produtoId] || []
    acumulador[item.produtoId].push({ nome: item.nome, email: item.email })
    return acumulador
  }, {})

  const categoriaResumo = CATEGORIAS.map((categoria) => {
    const categoriaProdutos = produtos.filter((produto) => produto.category === categoria)
    const valorCategoria = categoriaProdutos.reduce((total, produto) => {
      if (!Number.isFinite(Number(produto.price))) return total
      return total + Number(produto.price) * Number(produto.estoque || 0)
    }, 0)

    const itensSemPreco = categoriaProdutos.filter(
      (produto) => !Number.isFinite(Number(produto.price))
    ).length

    const clientesCategoria = new Set(
      listaEspera
        .filter((item) => categoriaProdutos.some((produto) => produto.id === item.produtoId))
        .map((item) => String(item.email).trim().toLowerCase())
    ).size

    const lucroPotencial = categoriaProdutos.reduce((total, produto) => {
      const estoque = Number(produto.estoque || 0)
      const preco = Number(produto.price)
      const margem = Number(produto.precoOriginal) > 0 ? 0.35 : 0.4
      if (!Number.isFinite(preco)) return total
      return total + preco * estoque * margem
    }, 0)

    return {
      categoria,
      valorCategoria,
      itensSemPreco,
      clientesCategoria,
      lucroPotencial,
      unidades: categoriaProdutos.reduce((total, produto) => total + Number(produto.estoque || 0), 0),
    }
  })

  return (
    <section>
      <p className="sobretitulo">Painel do lojista</p>
      <h1>Visão geral da loja</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="painel-estoque">
        <div className="painel-card">
          <span>Valor em estoque</span>
          <strong>{formatarPreco(valorEmEstoque)}</strong>
        </div>
        <div className="painel-card">
          <span>Esperando preço</span>
          <strong>{produtosSemPreco.length}</strong>
        </div>
        <div className="painel-card">
          <span>Clientes na fila</span>
          <strong>{clientesEsperando}</strong>
        </div>
        <div className="painel-card">
          <span>Lucro potencial</span>
          <strong>{formatarPreco(valorEmEstoque * 0.38)}</strong>
        </div>
      </div>

      <h2>Resumo por categoria</h2>
      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Valor em estoque</th>
              <th>Unidades</th>
              <th>Esperando preço</th>
              <th>Clientes esperando</th>
              <th>Lucro potencial</th>
            </tr>
          </thead>
          <tbody>
            {categoriaResumo.map((item) => (
              <tr key={item.categoria}>
                <td>{item.categoria}</td>
                <td>{formatarPreco(item.valorCategoria)}</td>
                <td>{item.unidades}</td>
                <td>{item.itensSemPreco}</td>
                <td>{item.clientesCategoria}</td>
                <td>{formatarPreco(item.lucroPotencial)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Produtos em estoque</h2>
      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Lista de espera</h2>
      {listaEspera.length === 0 ? (
        <div className="estado-vazio">
          <p>Nenhum cliente aguardando a reposição dos produtos.</p>
        </div>
      ) : (
        <div className="tabela-moldura">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Nome</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(esperaPorProduto).map(([produtoId, clientes]) => {
                const produto = produtos.find((item) => item.id === produtoId)
                return clientes.map((cliente, index) => (
                  <tr key={`${produtoId}-${cliente.email}-${index}`}>
                    <td>{produto?.title || 'Produto removido'}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
