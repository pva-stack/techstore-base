const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function validarCupom(codigo, cliente) {
  const codigoNormalizado = codigo.trim().toUpperCase()
  const desconto = CUPONS[codigoNormalizado]

  if (!desconto) {
    return { valido: false }
  }

  const pedidosAnteriores = Number(cliente?.pedidosAnteriores ?? 0)

  if (codigoNormalizado === 'PRIMEIRACOMPRA' && pedidosAnteriores > 0) {
    return { valido: false }
  }

  return { valido: true, desconto }
}
