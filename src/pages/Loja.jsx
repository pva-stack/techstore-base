import { useEffect, useState } from 'react'
import ProdutoCard from '../components/ProdutoCard'

const CATEGORIAS = [
  { id: 'todas', nome: 'Todas' },
  { id: 'roupas', nome: 'Roupas' },
  { id: 'eletronicos', nome: 'Eletrônicos' },
  { id: 'acessorios', nome: 'Acessórios' },
  { id: 'casa', nome: 'Casa' },
  { id: 'esgotados', nome: 'Esgotados' },
]

export default function Loja({ produtos, onAdicionar }) {
  const [categoria, setCategoria] = useState('todas')
  const [produtosVisiveis, setProdutosVisiveis] = useState([])

  useEffect(() => {
    const lista =
      categoria === 'esgotados'
        ? produtos.filter((produto) => Number(produto.estoque) === 0)
        : categoria === 'todas'
          ? produtos.filter(
            (produto) => Number(produto.estoque) > 0 && Number.isFinite(Number(produto.price))
          )
          : produtos.filter(
            (produto) =>
              Number(produto.estoque) > 0 &&
              Number.isFinite(Number(produto.price)) &&
              produto.category === categoria
          )

    setProdutosVisiveis(lista)
  }, [categoria, produtos])

  return (
    <section>
      <div className="vitrine-topo">
        <p className="sobretitulo">Coleção de outubro</p>
        <h1>Produtos</h1>
      </div>

      <div className="filtros" role="group" aria-label="Filtrar por categoria">
        {CATEGORIAS.map((item) => (
          <button
            key={item.id}
            className={item.id === categoria ? 'filtro filtro-ativo' : 'filtro'}
            aria-pressed={item.id === categoria}
            onClick={() => setCategoria(item.id)}
          >
            {item.nome}
          </button>
        ))}
      </div>

      {produtosVisiveis.length === 0 ? (
        <div className="estado-vazio">
          <p>Nenhum produto disponível para esta categoria.</p>
        </div>
      ) : (
        <div className="grade">
          {produtosVisiveis.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} onAdicionar={onAdicionar} />
          ))}
        </div>
      )}
    </section>
  )
}
