import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

export default function ProdutoCard({ produto, onAdicionar }) {
  const precoValido = Number.isFinite(Number(produto.price))
  const esgotado = Number(produto.estoque) === 0
  const semPreco = !precoValido
  const temFreteGratis = precoValido && Number(produto.price) > 100

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        {precoValido ? (
          <span className="preco">{formatarPreco(produto.price)}</span>
        ) : (
          <span className="preco preco-pequeno">Preço em revisão</span>
        )}
      </div>

      <div className="card-selos">
        {temFreteGratis && <span className="selo selo-frete">Frete grátis</span>}
        {semPreco && <span className="selo selo-alerta">Sem preço</span>}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button
        className="botao"
        onClick={() => onAdicionar(produto)}
        disabled={esgotado || semPreco}
      >
        {semPreco ? 'Indisponível' : 'Adicionar ao carrinho'}
      </button>
    </article>
  )
}
