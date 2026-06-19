import React, { useMemo } from "react";
import { Card, Table, Typography, Row, Col, Statistic, Space, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, BarChartOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useMovement } from "../../hook/useMovement";

const { Text, Title } = Typography;

// Definição dos meses fixos para montagem das colunas da matriz 2026
const MESES_CONFIG = [
  { chave: "01", nome: "Jan", dataRef: "01/01/2026" },
  { chave: "02", nome: "Fev", dataRef: "01/02/2026" },
  { chave: "03", nome: "Mar", dataRef: "01/03/2026" },
  { chave: "04", nome: "Abr", dataRef: "01/04/2026" },
  { chave: "05", nome: "Mai", dataRef: "01/05/2026" },
  { chave: "06", nome: "Jun", dataRef: "01/06/2026" },
  { chave: "07", nome: "Jul", dataRef: "01/07/2026" },
  { chave: "08", nome: "Ago", dataRef: "01/07/2026" }, // Baseado na imagem sequencial
  { chave: "09", nome: "Set", dataRef: "01/08/2026" },
  { chave: "10", nome: "Out", dataRef: "01/09/2026" },
  { chave: "11", nome: "Nov", dataRef: "01/10/2026" },
  { chave: "12", nome: "Dez", dataRef: "01/11/2026" },
];

export const MovementDashboard: React.FC = () => {
  // Busca todas as movimentações sem paginação restritiva para calcular a matriz completa
  const { listMovement } = useMovement();
  const movementQuery = listMovement({ page: 0, size: 1000 });
  const dataRaw = movementQuery.data?.content ?? [];

  // PROCESSAMENTO DE MATRIZ PIVOTADA (AGRUPAMENTO)
  const matrixData = useMemo(() => {
    if (!dataRaw.length) return [];

    // Estrutura base das linhas conforme a imagem fornecida
    const rows = {
      financiamento: { categoria: "FINANCIAMENTO", item: "FIXA", valores: {} as any },
      credito_m: { categoria: "CREDITO", item: "CATAO PARELAS M", valores: {} as any },
      cartao_mes: { categoria: "CREDITO", item: "CARTAO MÊS", valores: {} as any },
      saida_d: { categoria: "FEITO", item: "SAIDA_D_MES", valores: {} as any },
      saida_a: { categoria: "AGENDADO", item: "SAIDA_A_MES", valores: {} as any },
      saida_pj: { categoria: "PJ", item: "SAIDA_PJ_MES", valores: {} as any },
      credito_a: { categoria: "CREDITO", item: "CATAO PARELAS A", valores: {} as any },
      poupanca: { categoria: "REPOSIÇÃO", item: "POUPANÇA", valores: {} as any },
      entrada: { categoria: "RECEITA", item: "ENTRADA_MES", valores: {} as any }, 
    };

    // Inicializa todas as células com 0
    MESES_CONFIG.forEach((m) => {
      Object.keys(rows).forEach((key) => {
        (rows as any)[key].valores[m.chave] = 0;
      });
    });

    // Mapeia e distribui os valores somando por Categoria/Descrição e Mês
    dataRaw.forEach((item: any) => {
      if (!item.datamov) return;
      const mesItem = dayjs(item.datamov).format("MM"); // Pega o número do mês (ex: '03')
      const valor = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");

      const desc = (item.descmovimento || "").toUpperCase();
      const cat = (item.categoria?.desccategoria || "").toUpperCase();

      // Regra de agrupamento baseada nos dados do seu banco
      if (cat.includes("FINANCIAMENTO") || desc.includes("FIXA")) {
        rows.financiamento.valores[mesItem] += valor;
      } else if (desc.includes("CATAO PARELAS M")) {
        rows.credito_m.valores[mesItem] += valor;
      } else if (desc.includes("CARTAO MÊS") || desc.includes("CARTAO MES")) {
        rows.cartao_mes.valores[mesItem] += valor;
      } else if (cat.includes("FEITO") || desc.includes("SAIDA_D")) {
        rows.saida_d.valores[mesItem] += valor;
      } else if (cat.includes("AGENDADO") || desc.includes("SAIDA_A")) {
        rows.saida_a.valores[mesItem] += valor;
      } else if (cat.includes("PJ") || desc.includes("SAIDA_PJ")) {
        rows.saida_pj.valores[mesItem] += valor;
      } else if (desc.includes("CATAO PARELAS A")) {
        rows.credito_a.valores[mesItem] += valor;
      } else if (cat.includes("REPOSIÇÃO") || desc.includes("POUPANÇA") || desc.includes("POUPANCA")) {
        rows.poupanca.valores[mesItem] += valor;
      } else if (valor > 0 && (cat.includes("ENTRADA") || cat.includes("RECEITA"))) {
        // Assume saídas por padrão, exceto se mapeado como entrada/receita
        rows.entrada.valores[mesItem] += valor;
      } else {
        // Fallback genérico para não perder somas de saídas avulsas
        rows.saida_d.valores[mesItem] += valor;
      }
    });

    // Cálculos de Totais Verticais (Rodapé dinâmico estilo planilha)
    const totaisPagamento = {} as any;
    const faltaSobra = {} as any;

    MESES_CONFIG.forEach((m) => {
      const somaSaidas =
        rows.financiamento.valores[m.chave] +
        rows.credito_m.valores[m.chave] +
        rows.cartao_mes.valores[m.chave] +
        rows.saida_d.valores[m.chave] +
        rows.saida_a.valores[m.chave] +
        rows.saida_pj.valores[m.chave] +
        rows.credito_a.valores[m.chave] +
        rows.poupanca.valores[m.chave];

      totaisPagamento[m.chave] = somaSaidas;
      
      // Sobra ou Falta = Entrada - Saídas totais
      faltaSobra[m.chave] = rows.entrada.valores[m.chave] - somaSaidas;
    });

    // Retorna a estrutura flat para a tabela do AntD ler em linhas
    return [
      { key: "1", ...rows.financiamento, rowType: "data" },
      { key: "2", ...rows.credito_m, rowType: "data" },
      { key: "3", ...rows.cartao_mes, rowType: "data" },
      { key: "4", ...rows.saida_d, rowType: "data" },
      { key: "5", ...rows.saida_a, rowType: "data" },
      { key: "6", ...rows.saida_pj, rowType: "data" },
      { key: "7", ...rows.credito_a, rowType: "data" },
      { key: "8", ...rows.poupanca, rowType: "data" },
      { key: "9", categoria: "TOTAIS", item: "TT_PAG_MES", valores: totaisPagamento, rowType: "total" },
      { key: "10", categoria: "RECEITA", item: "ENTRADA_MES", valores: rows.entrada.valores, rowType: "entrada" },
      { key: "11", categoria: "BALANÇO", item: "FALTA/SOBRA", valores: faltaSobra, rowType: "resultado" },
    ];
  }, [dataRaw]);

  // MONTAGEM DINÂMICA DAS COLUNAS DA MATRIZ (MÊS / ID_PARC)
  const columns = useMemo(() => {
    const colunasIniciais = [
      {
        title: "GRUPO",
        dataIndex: "categoria",
        key: "categoria",
        width: 150,
        fixed: "left" as const,
        render: (text: string, record: any) => {
          if (record.rowType !== "data") return <Text strong>{text}</Text>;
          return <Tag color="blue">{text}</Tag>;
        },
      },
      {
        title: "CONCEITO / LINHA",
        dataIndex: "item",
        key: "item",
        width: 180,
        fixed: "left" as const,
        render: (text: string, record: any) => {
          if (record.rowType === "resultado") return <Text strong type={text.includes("SOBRA") ? "success" : "danger"}>{text}</Text>;
          if (record.rowType !== "data") return <Text strong>{text}</Text>;
          return text;
        },
      },
    ];

    // Injeta um loop para gerar as colunas de valores de cada mês
    const colunasMeses = MESES_CONFIG.map((m) => ({
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>{m.nome}</div>
          <div style={{ fontSize: "11px", color: "#8c8c8c" }}>{m.dataRef}</div>
        </div>
      ),
      dataIndex: ["valores", m.chave],
      key: m.chave,
      width: 120,
      align: "right" as const,
      render: (val: number, record: any) => {
        const valorFormatado = `R$ ${(val || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        if (record.rowType === "total") return <Text strong style={{ color: "#000" }}>{valorFormatado}</Text>;
        if (record.rowType === "entrada") return <Text strong style={{ color: "#3f8600" }}>{valorFormatado}</Text>;
        if (record.rowType === "resultado") {
          const isNegativo = val < 0;
          return (
            <Text strong style={{ color: isNegativo ? "#cf1322" : "#3f8600" }}>
              {isNegativo ? "" : "+"}{valorFormatado}
            </Text>
          );
        }
        return val > 0 ? valorFormatado : <span style={{ color: "#bfbfbf" }}>-</span>;
      },
    }));

    return [...colunasIniciais, ...colunasMeses];
  }, []);

  // DASHBOARD CARDS (Cálculos rápidos para o topo com base no mês atual rodando)
  const cardStats = useMemo(() => {
    const mesAtual = dayjs().format("MM");
    let totalEntradas = 0;
    let totalSaidas = 0;

    dataRaw.forEach((item: any) => {
      const valor = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");
      const cat = (item.categoria?.desccategoria || "").toUpperCase();
      if (cat.includes("ENTRADA") || cat.includes("RECEITA")) {
        totalEntradas += valor;
      } else {
        totalSaidas += valor;
      }
    });

    return {
      entradas: totalEntradas,
      saidas: totalSaidas,
      balanco: totalEntradas - totalSaidas,
    };
  }, [dataRaw]);

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%", padding: "4px" }}>
      {/* SEÇÃO: CARDS DE SUMÁRIO SUPERIOR */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <Statistic
              title="Previsão Total de Entradas"
              value={cardStats.entradas}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="BRL"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <Statistic
              title="Previsão Total de Saídas"
              value={cardStats.saidas}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="BRL"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <Statistic
              title="Balanço Global Projetado"
              value={Math.abs(cardStats.balanco)}
              precision={2}
              valueStyle={{ color: cardStats.balanco >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={cardStats.balanco >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="BRL"
            />
          </Card>
        </Col>
      </Row>

      {/* SEÇÃO: MATRIZ ESTILO PLANILHA */}
      <Card 
        title={
          <Space>
            <BarChartOutlined style={{ color: "#1890ff" }} />
            <span>Matriz de Fluxo de Caixa Consolidado (Modo Competência 2026)</span>
          </Space>
        }
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      >
        <Table
          rowKey="key"
          columns={columns}
          dataSource={matrixData}
          pagination={false} // Mantém como planilha contínua
          loading={movementQuery.isLoading}
          scroll={{ x: 1600 }}
          bordered
          rowClassName={(record) => {
            if (record.rowType === "total") return "row-matriz-total";
            if (record.rowType === "entrada") return "row-matriz-entrada";
            if (record.rowType === "resultado") return "row-matriz-resultado";
            return "";
          }}
        />
      </Card>

      {/* CSS customizado em escopo para estilizar as linhas de totais iguais ao Excel */}
      <style>{`
        .row-matriz-total {
          background-color: #e6f7ff !important;
          font-weight: bold;
        }
        .row-matriz-entrada {
          background-color: #f6ffed !important;
          font-weight: bold;
        }
        .row-matriz-resultado {
          background-color: #fafafa !important;
          font-weight: bold;
          border-top: 2px solid #d9d9d9 !important;
        }
      `}</style>
    </Space>
  );
};