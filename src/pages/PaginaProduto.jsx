import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({
  produtos,
  clienteAtual,
  listaEspera = [],
  onAdicionar,
  onAvisarQuandoDisponivel,
}) {
  const { id } = useParams()
  const [avisoEnviado, setAvisoEnviado] = useState(false)
  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoValido = Number.isFinite(Number(produto.price))
  const produtoDisponivel = precoValido && Number(produto.estoque) > 0
  const jaNaFila = Boolean(
    clienteAtual &&
    listaEspera.some(
      (item) => item.produtoId === produto.id && item.email === clienteAtual.email
    )
  )
  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        Number.isFinite(Number(item.price)) &&
        Number(item.estoque) > 0
    )
    .slice(0, 4)

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {precoValido ? `R$ ${Number(produto.price).toFixed(2).replace('.', ',')}` : 'Preço em revisão'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {produtoDisponivel ? `${produto.estoque} unidades disponíveis` : 'Produto indisponível no momento'}
          </p>

          {produtoDisponivel ? (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={produto.estoque === 0 || !precoValido}
            >
              Adicionar ao carrinho
            </button>
          ) : (
            <>
              <button
                className="botao botao-secundario botao-grande"
                onClick={() => {
                  onAvisarQuandoDisponivel?.(produto, clienteAtual)
                  setAvisoEnviado(true)
                }}
                disabled={!clienteAtual || avisoEnviado || jaNaFila}
              >
                {jaNaFila
                  ? 'Já está na fila'
                  : avisoEnviado
                    ? 'Avisado!'
                    : clienteAtual
                      ? !precoValido
                        ? 'Quero esperar o preço'
                        : 'Aguardar na fila para comprar'
                      : 'Selecione um cliente de teste'}
              </button>
              {clienteAtual && (
                <p className="aviso">
                  {jaNaFila
                    ? 'Você já está na lista de espera para este produto.'
                    : !precoValido
                      ? 'Receba um aviso quando o preço voltar e o produto ficar disponível.'
                      : 'Você será avisado quando o produto voltar ao estoque.'}
                </p>
              )}
            </>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)} disabled={Number(item.estoque) === 0}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
