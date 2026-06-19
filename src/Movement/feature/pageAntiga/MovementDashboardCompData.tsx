import React, { useMemo } from "react";
import { Card, Table, Typography, Row, Col, Statistic, Space, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, BarChartOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useMovement } from "../../hook/useMovement";

const { Text } = Typography;

export const MovementDashboardComp: React.FC = () => {
  // 1. Busca todas as movimentações do banco de dados
  const { listMovement } = useMovement();
  const movementQuery = listMovement({ page: 0, size: 5000 }); // Tamanho maior para cobrir histórico longo
  const dataRaw = movementQuery.data?.content ?? [];

  // 2. DETECTA O HORIZONTE CRONOLÓGICO AUTOMATICAMENTE (Até 2050 ou mais se houver)
  const MESES_CONFIG = useMemo(() => {
    const dataMinima = dayjs().startOf("year"); // Começa em Janeiro do ano atual por padrão
    let dataMaxima = dayjs().endOf("year");    // Pelo menos até Dezembro do ano atual

    // Varre o banco procurando a maior data final de parcelamento
    dataRaw.forEach((item: any) => {
      if (item.datafimmov) {
        const fimItem = dayjs(item.datafimmov);
        if (fimItem.isAfter(dataMaxima)) {
          dataMaxima = fimItem;
        }
      }
      if (item.datamov) {
        const inicioItem = dayjs(item.datamov);
        if (inicioItem.isAfter(dataMaxima)) {
          dataMaxima = inicioItem;
        }
      }
    });

    // Gera dinamicamente o array de meses do ponto inicial ao ponto final máximo detectado
    const listaMeses = [];
    let ponteiro = dataMinima.clone().startOf("month");
    const limiteFinal = dataMaxima.clone().endOf("month");

    while (ponteiro.isBefore(limiteFinal) || ponteiro.isSame(limiteFinal, "month")) {
      listaMeses.push({
        chaveIdentificadora: ponteiro.format("YYYY-MM"), // Ex: '2026-01', '2026-02', '2050-12'
        nomeCabecalho: ponteiro.locale("pt-br").format("MMM/YY"), // Ex: 'jan/26', 'dez/50'
        dataRef: ponteiro.format("01/MM/YYYY"),
      });
      ponteiro = ponteiro.add(1, "month");
    }

    return listaMeses;
  }, [dataRaw]);

  // 3. PROCESSAMENTO DA MATRIZ PIVOTADA DINÂMICA
  const matrixData = useMemo(() => {
    const rows = {
      financiamento: { categoria: "FINANCIAMENTO", item: "FIXA", valores: {} as any },
      credito_m: { categoria: "CREDITO PARC", item: "CARTAO PARELAS M", valores: {} as any },
      cartao_mes: { categoria: "CREDITO MES", item: "CARTAO MÊS", valores: {} as any },
      saida_d: { categoria: "FEITO", item: "SAIDA_D_MES", valores: {} as any },
      saida_a: { categoria: "AGENDADO", item: "SAIDA_A_MES", valores: {} as any },
      saida_pj: { categoria: "PJ", item: "SAIDA_PJ_MES", valores: {} as any },
      credito_a: { categoria: "CREDITO", item: "CATAO PARELAS A", valores: {} as any },
      poupanca: { categoria: "REPOSIÇÃO", item: "POUPANÇA", valores: {} as any },
      entrada: { categoria: "RECEITA", item: "ENTRADA_MES", valores: {} as any }, 
    };

    // Inicializa todas as células geradas dinamicamente com zero
    MESES_CONFIG.forEach((m) => {
      Object.keys(rows).forEach((key) => {
        (rows as any)[key].valores[m.chaveIdentificadora] = 0;
      });
    });

    if (!dataRaw.length) return [];

    // Distribuição e replicação das parcelas pelos meses correspondentes
    dataRaw.forEach((item: any) => {
      if (!item.datamov) return;

      const valorUnitario = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");
      const desc = (item.descmovimento || "").toUpperCase();
      const cat = (item.categoria?.desccategoria || "").toUpperCase();
      
      const dataInicio = dayjs(item.datamov);
      const dataFim = item.datafimmov ? dayjs(item.datafimmov) : dataInicio;

      const diferencaMeses = dataFim.diff(dataInicio, "month") + 1;
      const mesesDuracao = diferencaMeses > 0 ? diferencaMeses : 1;

      // Aloca o valor em todos os meses do intervalo da dívida
      for (let i = 0; i < mesesDuracao; i++) {
        const dataReferenciaParcela = dataInicio.add(i, "month");
        const chaveMes = dataReferenciaParcela.format("YYYY-MM");

        // Verifica se o mês calculado faz parte do grid montado
        if (rows.financiamento.valores[chaveMes] !== undefined) {
          if (cat.includes("FINANCIAMENTO") || desc.includes("FIXA")) {
            rows.financiamento.valores[chaveMes] += valorUnitario;
          } else if (desc.includes("CATAO PARELAS M") || desc.includes("CARTAO PARCELAS M")) {
            rows.credito_m.valores[chaveMes] += valorUnitario;
          } else if (desc.includes("CARTAO MÊS") || desc.includes("CARTAO MES")) {
            rows.cartao_mes.valores[chaveMes] += valorUnitario;
          } else if (cat.includes("FEITO") || desc.includes("SAIDA_D")) {
            rows.saida_d.valores[chaveMes] += valorUnitario;
          } else if (cat.includes("AGENDADO") || desc.includes("SAIDA_A")) {
            rows.saida_a.valores[chaveMes] += valorUnitario;
          } else if (cat.includes("PJ") || desc.includes("SAIDA_PJ")) {
            rows.saida_pj.valores[chaveMes] += valorUnitario;
          } else if (desc.includes("CATAO PARELAS A") || desc.includes("CARTAO PARCELAS A")) {
            rows.credito_a.valores[chaveMes] += valorUnitario;
          } else if (cat.includes("REPOSIÇÃO") || desc.includes("POUPANÇA") || desc.includes("POUPANCA")) {
            rows.poupanca.valores[chaveMes] += valorUnitario;
          } else if (valorUnitario > 0 && (cat.includes("ENTRADA") || cat.includes("RECEITA"))) {
            rows.entrada.valores[chaveMes] += valorUnitario;
          } else {
            rows.saida_d.valores[chaveMes] += valorUnitario;
          }
        }
      }
    });

    // CÁLCULOS TOTAIS HORIZONTAIS/VERTICAIS
    const totaisPagamento = {} as any;
    const faltaSobra = {} as any;

    MESES_CONFIG.forEach((m) => {
      const somaSaidasMese =
        rows.financiamento.valores[m.chaveIdentificadora] +
        rows.credito_m.valores[m.chaveIdentificadora] +
        rows.cartao_mes.valores[m.chaveIdentificadora] +
        rows.saida_d.valores[m.chaveIdentificadora] +
        rows.saida_a.valores[m.chaveIdentificadora] +
        rows.saida_pj.valores[m.chaveIdentificadora] +
        rows.credito_a.valores[m.chaveIdentificadora] +
        rows.poupanca.valores[m.chaveIdentificadora];

      totaisPagamento[m.chaveIdentificadora] = somaSaidasMese;
      faltaSobra[m.chaveIdentificadora] = rows.entrada.valores[m.chaveIdentificadora] - somaSaidasMese;
    });

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
  }, [dataRaw, MESES_CONFIG]);

  // 4. CONFIGURAÇÃO DINÂMICA DAS COLUNAS (Scroll horizontal habilitado para tabelas longas)
  const columns = useMemo(() => {
    const colunasFixasEsquerda = [
      {
        title: "GRUPO",
        dataIndex: "categoria",
        key: "categoria",
        width: 140,
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

    const colunasMesesDinamicos = MESES_CONFIG.map((m) => ({
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>{m.nomeCabecalho}</div>
          <div style={{ fontSize: "10px", color: "#8c8c8c" }}>{m.dataRef}</div>
        </div>
      ),
      dataIndex: ["valores", m.chaveIdentificadora],
      key: m.chaveIdentificadora,
      width: 115,
      align: "right" as const,
      render: (val: number, record: any) => {
        const valorFormatado = `R$ ${(val || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        if (record.rowType === "total") return <Text strong style={{ color: "#1890ff" }}>{valorFormatado}</Text>;
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

    return [...colunasFixasEsquerda, ...colunasMesesDinamicos];
  }, [MESES_CONFIG]);

  // KPI CARDS SUPERIORES CONSOLIDANDO TODO O HORIZONTE DETECTADO
  const cardStats = useMemo(() => {
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
      {/* SUMÁRIO GERAL */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Receita Total Projetada (Projeção Completa)"
              value={cardStats.entradas}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="BRL"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Despesa Total Contratada (Projeção Completa)"
              value={cardStats.saidas}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="BRL"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Balanço Final Estregue"
              value={Math.abs(cardStats.balanco)}
              precision={2}
              valueStyle={{ color: cardStats.balanco >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={cardStats.balanco >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="BRL"
            />
          </Card>
        </Col>
      </Row>

      {/* PLANILHA AUTO-EXPANSÍVEL */}
      <Card 
        title={
          <Space>
            <BarChartOutlined style={{ color: "#1890ff" }} />
            <span>Matriz de Projeção Financeira Volátil Inteligente (Auto-Expansível)</span>
          </Space>
        }
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Table
          rowKey="key"
          columns={columns}
          dataSource={matrixData}
          pagination={false}
          loading={movementQuery.isLoading}
          scroll={{ x: "max-content" }} // Faz o scroll horizontal se ajustar ao tamanho gerado
          bordered
          rowClassName={(record) => {
            if (record.rowType === "total") return "row-matriz-total";
            if (record.rowType === "entrada") return "row-matriz-entrada";
            if (record.rowType === "resultado") return "row-matriz-resultado";
            return "";
          }}
        />
      </Card>

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
          border-top: 2px solid #bfbfbf !important;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f2f5 !important;
          font-size: 13px;
        }
      `}</style>
    </Space>
  );
};