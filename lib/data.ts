// Mock data and types for the system
export type Turno = "geral" | "manha" | "tarde" | "integral"
export type StatusFuncionario = "ativo" | "ferias" | "afastamento"
export type Carteira = "CAIXA" | "BANCO_MERCANTIL" | "BMG" | "BTG" | "CARREFOUR"
export type StatusCapacitacao = "aplicado" | "pendente"
export type AssuntoCapacitacao = "Treinamento Inicial" | "Calibragem" | "Feedback" | "Sarb" | "Prevenção ao Assédio"
export type MotivoDesligamento =
  | "Pedido de Demissão"
  | "Justa Causa"
  | "Sem Justa Causa"
  | "Término de Contrato"
  | "Aposentadoria"

export interface EstatisticaCaixa {
  id: string
  data: string
  turno: Turno
  total: number
  ativos: number
  ferias: number
  afastamento: number
}

export interface EstatisticaCobranca {
  id: string
  data: string
  turno: Turno
  carteira: Carteira
  total: number
  presentes: number
  faltas: number
  abs: number // percentual de faltas
}

export interface EstatisticaCobrancaGeral {
  id: string
  data: string
  turno: Turno
  total: number
  ativos: number
  ferias: number
  afastamento: number
}

export interface CapacitacaoRecord {
  id: string
  quantidade: number
  turno: Turno
  carteira: Carteira
  data: string
  responsavel: string
  status: StatusCapacitacao
  assunto: AssuntoCapacitacao
}

export interface EstatisticaCapacitacao {
  totalTreinamentos: number
  aplicados: number
  pendentes: number
  taxaConclusao: number
}

export interface OperadorTreinado {
  id: string
  nome: string
  carteira: Carteira
  turno: Turno
  dataInicio: string
  dataConclusao: string
  assunto: AssuntoCapacitacao
  responsavel: string
  observacao: string
}

export interface DesligamentoRecord {
  id: string
  nome: string
  carteira: string
  turno: Turno
  data: string
  motivo: string // Mudado de MotivoDesligamento para string
  avisoPrevio: boolean
  responsavel: string
  veioDeAgencia: boolean
  observacao: string
}

export interface EstatisticaDesligamento {
  totalDesligamentos: number
  comAvisoPrevio: number
  semAvisoPrevio: number
  taxaRotatividade: number
}

// Mock data
export const mockEstatisticasCaixa: EstatisticaCaixa[] = [
  {
    id: "1",
    data: "2024-01-15",
    turno: "manha",
    total: 25,
    ativos: 20,
    ferias: 3,
    afastamento: 2,
  },
  {
    id: "2",
    data: "2024-01-15",
    turno: "tarde",
    total: 30,
    ativos: 25,
    ferias: 2,
    afastamento: 3,
  },
  {
    id: "3",
    data: "2024-01-16",
    turno: "manha",
    total: 24,
    ativos: 22,
    ferias: 1,
    afastamento: 1,
  },
]

export const mockEstatisticasCobranca: EstatisticaCobranca[] = [
  {
    id: "1",
    data: "2024-01-15",
    turno: "manha",
    carteira: "CAIXA",
    total: 15,
    presentes: 12,
    faltas: 3,
    abs: 20,
  },
  {
    id: "2",
    data: "2024-01-15",
    turno: "manha",
    carteira: "BTG",
    total: 10,
    presentes: 9,
    faltas: 1,
    abs: 10,
  },
  {
    id: "3",
    data: "2024-01-15",
    turno: "tarde",
    carteira: "BMG",
    total: 12,
    presentes: 10,
    faltas: 2,
    abs: 16.7,
  },
]

export const mockEstatisticasCobrancaGeral: EstatisticaCobrancaGeral[] = [
  {
    id: "1",
    data: "2024-01-15",
    turno: "manha",
    total: 45,
    ativos: 38,
    ferias: 4,
    afastamento: 3,
  },
  {
    id: "2",
    data: "2024-01-15",
    turno: "tarde",
    total: 42,
    ativos: 35,
    ferias: 3,
    afastamento: 4,
  },
]

export const mockCapacitacaoRecords: CapacitacaoRecord[] = [
  {
    id: "1",
    quantidade: 15,
    turno: "manha",
    carteira: "CAIXA",
    data: "2024-01-15",
    responsavel: "João Silva",
    status: "aplicado",
    assunto: "Treinamento Inicial",
  },
  {
    id: "2",
    quantidade: 8,
    turno: "tarde",
    carteira: "BTG",
    data: "2024-01-16",
    responsavel: "Maria Santos",
    status: "pendente",
    assunto: "Calibragem",
  },
  {
    id: "3",
    quantidade: 12,
    turno: "manha",
    carteira: "BMG",
    data: "2024-01-17",
    responsavel: "Pedro Costa",
    status: "aplicado",
    assunto: "Feedback",
  },
]

export const mockOperadoresTreinados: OperadorTreinado[] = [
  {
    id: "1",
    nome: "Ana Silva",
    carteira: "CAIXA",
    turno: "manha",
    dataInicio: "2024-01-10",
    dataConclusao: "2024-01-15",
    assunto: "Treinamento Inicial",
    responsavel: "João Silva",
    observacao: "Treinamento concluído com sucesso. Operador apto para atendimento.",
  },
  {
    id: "2",
    nome: "Carlos Santos",
    carteira: "BTG",
    turno: "tarde",
    dataInicio: "2024-01-12",
    dataConclusao: "2024-01-18",
    assunto: "Calibragem",
    responsavel: "Maria Santos",
    observacao: "Necessita acompanhamento adicional nos primeiros dias.",
  },
  {
    id: "3",
    nome: "Fernanda Costa",
    carteira: "BMG",
    turno: "manha",
    dataInicio: "2024-01-14",
    dataConclusao: "2024-01-20",
    assunto: "Feedback",
    responsavel: "Pedro Costa",
    observacao: "Excelente desempenho durante o treinamento.",
  },
]

export const mockDesligamentos: DesligamentoRecord[] = [
  {
    id: "1",
    nome: "Roberto Lima",
    carteira: "CAIXA",
    turno: "manha",
    data: "2024-01-20",
    motivo: "Pedido de demissão para nova oportunidade",
    avisoPrevio: true,
    responsavel: "João Silva",
    veioDeAgencia: false,
    observacao: "Funcionário solicitou desligamento para nova oportunidade.",
  },
  {
    id: "2",
    nome: "Juliana Oliveira",
    carteira: "BTG",
    turno: "tarde",
    data: "2024-01-18",
    motivo: "Desempenho abaixo do esperado",
    avisoPrevio: false,
    responsavel: "Maria Santos",
    veioDeAgencia: true,
    observacao: "Desempenho abaixo do esperado após período de experiência.",
  },
  {
    id: "3",
    nome: "Marcos Pereira",
    carteira: "BMG",
    turno: "integral",
    data: "2024-01-22",
    motivo: "Término de contrato temporário",
    avisoPrevio: true,
    responsavel: "Pedro Costa",
    veioDeAgencia: true,
    observacao: "Fim do contrato temporário.",
  },
]

export const carteirasDisponiveis: string[] = ["CAIXA", "BANCO_MERCANTIL", "BMG", "BTG", "CARREFOUR"]
export const estatisticasDisponiveis: string[] = ["ativos", "ferias", "afastamento"]
export const assuntosCapacitacao: string[] = [
  "Treinamento Inicial",
  "Calibragem",
  "Feedback",
  "Sarb",
  "Prevenção ao Assédio",
]

export const turnosDisponiveis: { value: Turno; label: string }[] = [
  { value: "geral", label: "Geral" },
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "integral", label: "Integral" },
]

export function registrarCarteira(novaCarteira: string) {
  if (!carteirasDisponiveis.includes(novaCarteira)) {
    carteirasDisponiveis.push(novaCarteira)
  }
}

export function adicionarEstatistica(novaEstatistica: string) {
  if (!estatisticasDisponiveis.includes(novaEstatistica)) {
    estatisticasDisponiveis.push(novaEstatistica)
  }
}

export function adicionarAssuntoCapacitacao(novoAssunto: string) {
  if (!assuntosCapacitacao.includes(novoAssunto)) {
    assuntosCapacitacao.push(novoAssunto)
  }
}

// Analytics helper functions
export function calculateEstatisticasGerais() {
  const totalCaixa = mockEstatisticasCaixa.reduce(
    (acc, stat) => ({
      total: acc.total + stat.total,
      ativos: acc.ativos + stat.ativos,
      ferias: acc.ferias + stat.ferias,
      afastamento: acc.afastamento + stat.afastamento,
    }),
    { total: 0, ativos: 0, ferias: 0, afastamento: 0 },
  )

  const totalCobranca = mockEstatisticasCobrancaGeral.reduce(
    (acc, stat) => ({
      total: acc.total + stat.total,
      ativos: acc.ativos + stat.ativos,
      ferias: acc.ferias + stat.ferias,
      afastamento: acc.afastamento + stat.afastamento,
    }),
    { total: 0, ativos: 0, ferias: 0, afastamento: 0 },
  )

  return {
    totalFuncionarios: totalCaixa.total + totalCobranca.total,
    totalAtivos: totalCaixa.ativos + totalCobranca.ativos,
    totalFerias: totalCaixa.ferias + totalCobranca.ferias,
    totalAfastamentos: totalCaixa.afastamento + totalCobranca.afastamento,
  }
}

export function calculateCapacitacaoStats() {
  const aplicados = mockCapacitacaoRecords.filter((r) => r.status === "aplicado").length
  const pendentes = mockCapacitacaoRecords.filter((r) => r.status === "pendente").length
  const total = mockCapacitacaoRecords.length

  return {
    totalTreinamentos: total,
    aplicados,
    pendentes,
    taxaConclusao: total > 0 ? Math.round((aplicados / total) * 100) : 0,
  }
}

export function calculateRotatividadeStats() {
  const totalDesligamentos = mockDesligamentos.length
  const comAvisoPrevio = mockDesligamentos.filter((d) => d.avisoPrevio).length
  const semAvisoPrevio = totalDesligamentos - comAvisoPrevio

  // Assumindo um quadro de 165 funcionários para cálculo da taxa
  const taxaRotatividade = Math.round((totalDesligamentos / 165) * 100)

  return {
    totalDesligamentos,
    comAvisoPrevio,
    semAvisoPrevio,
    taxaRotatividade,
  }
}

// Performance data by carteira
export const performanceByCarteira = [
  { carteira: "CAIXA", ativos: 45, treinados: 40, desligamentos: 5, eficiencia: 89 },
  { carteira: "BTG", ativos: 32, treinados: 30, desligamentos: 3, eficiencia: 94 },
  { carteira: "BMG", ativos: 28, treinados: 25, desligamentos: 4, eficiencia: 86 },
  { carteira: "CARREFOUR", ativos: 35, treinados: 32, desligamentos: 2, eficiencia: 91 },
  { carteira: "BANCO_MERCANTIL", ativos: 25, treinados: 22, desligamentos: 3, eficiencia: 88 },
]
