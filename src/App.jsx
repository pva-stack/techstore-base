import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'

const LOJISTA_ID = 'lojista'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinhosPorCliente, setCarrinhosPorCliente] = useState({})
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState([])
  const [painelLiberado, setPainelLiberado] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('techstore-painel-lojista') === 'true'
  })
  const localizacao = useLocation()

  const carrinho = clienteAtualId ? carrinhosPorCliente[clienteAtualId] ?? [] : []

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('techstore-painel-lojista', String(painelLiberado))
    }
  }, [painelLiberado])

  useEffect(() => {
    if (localizacao.pathname !== '/estoque') {
      setPainelLiberado(false)
    }
  }, [localizacao.pathname])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!clienteAtualId) return
    if (!produto || !Number.isFinite(Number(produto.price)) || Number(produto.estoque) === 0) {
      return
    }

    setCarrinhosPorCliente((carrinhosAtuais) => ({
      ...carrinhosAtuais,
      [clienteAtualId]: [...(carrinhosAtuais[clienteAtualId] ?? []), produto],
    }))
  }

  function removerUmaUnidade(produtoId) {
    if (!clienteAtualId) return

    setCarrinhosPorCliente((carrinhosAtuais) => {
      const atual = carrinhosAtuais[clienteAtualId] ?? []
      let removido = false

      return {
        ...carrinhosAtuais,
        [clienteAtualId]: atual.filter((produto) => {
          if (!removido && produto.id === produtoId) {
            removido = true
            return false
          }
          return true
        }),
      }
    })
  }

  function registrarInteresse(produto, cliente) {
    if (!produto || !cliente || !cliente.email) return

    setListaEspera((interessados) => {
      const existe = interessados.some(
        (item) => item.produtoId === produto.id && item.email === cliente.email
      )

      if (existe) return interessados

      return [
        ...interessados,
        {
          id: `${produto.id}-${cliente.email}`,
          produtoId: produto.id,
          produtoTitulo: produto.title,
          nome: cliente.nome,
          email: cliente.email,
        },
      ]
    })
  }

  const clientesCompletos = [
    ...clientes,
    {
      id: LOJISTA_ID,
      nome: 'Lojista',
      email: 'lojista@techstore.com.br',
      tipo: 'lojista',
    },
  ]

  const clienteAtual = clientesCompletos.find((cliente) => cliente.id === clienteAtualId)
  const clienteAtualEhLojista = clienteAtual?.id === LOJISTA_ID
  const painelDisponivel = clienteAtualEhLojista || painelLiberado

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  listaEspera={listaEspera}
                  onAdicionar={adicionarAoCarrinho}
                  onAvisarQuandoDisponivel={registrarInteresse}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/estoque"
              element={
                <Estoque
                  produtos={produtos}
                  listaEspera={listaEspera}
                  painelLiberado={painelDisponivel}
                  onLiberarPainel={(senha) => {
                    const senhaCorreta = senha === 'techstore2026'
                    setPainelLiberado(senhaCorreta)
                    return senhaCorreta
                  }}
                />
              }
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientesCompletos}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={(novoClienteId) => {
          if (novoClienteId === LOJISTA_ID) {
            const senha = typeof window !== 'undefined' ? window.prompt('Digite a senha do lojista:') : null
            if (senha !== 'techstore2026') {
              return
            }
          }

          setClienteAtualId(novoClienteId)
          if (novoClienteId !== LOJISTA_ID) {
            setPainelLiberado(false)
          }
        }}
      />
    </div>
  )
}
