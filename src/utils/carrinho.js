// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const valor = Number(produto?.price)
    return Number.isFinite(valor) ? total + valor : total
  }, 0)
}

export function produtoDisponivel(produto) {
  if (!produto) return false
  return Number.isFinite(Number(produto.price)) && Number(produto.estoque) > 0
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
