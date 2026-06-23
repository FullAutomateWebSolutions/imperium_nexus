import React, { useMemo } from "react";
import { Card, Table, Typography, Row, Col, Statistic, Space, Grid } from "antd";
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  BarChartOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useMovement } from "../../hook/useMovement";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const MovementDashboardCompP: React.FC = () => {
  const { listMovement } = useMovement();
  const movementQuery = listMovement({ page: 0, size: 5000 });
  const dataRaw = movementQuery.data?.content ?? [];

  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  // Identifica a chave do mês atual no formato "YYYY-MM"
  const mesAtualChave = useMemo(() => dayjs().format("YYYY-MM"), []);

  // 1. Configuração de Datas Limite e Geração de Meses
  const MESES_CONFIG = useMemo(() => {
    const dataMinima = dayjs().startOf("year");
    let dataMaxima = dayjs().endOf("year");

    dataRaw.forEach((item: any) => {
      if (item.datafimmov) {
        const fimItem = dayjs(item.datafimmov);
        if (fimItem.isAfter(dataMaxima)) dataMaxima = fimItem;
      }
      if (item.datamov) {
        const inicioItem = dayjs(item.datamov);
        if (inicioItem.isAfter(dataMaxima)) dataMaxima = inicioItem;
      }
    });

    const listaMeses = [];
    let ponteiro = dataMinima.clone().startOf("month");
    const limiteFinal = dataMaxima.clone().endOf("month");

    while (ponteiro.isBefore(limiteFinal) || ponteiro.isSame(limiteFinal, "month")) {
      listaMeses.push({
        chaveIdentificadora: ponteiro.format("YYYY-MM"),
        nomeCabecalho: ponteiro.locale("pt-br").format("MMM/YY"),
        dataRef: ponteiro.format("01/MM/YYYY"),
      });
      ponteiro = ponteiro.add(1, "month");
    }

    return listaMeses;
  }, [dataRaw]);

  // 2. Montagem Estrutural da Matriz Multiperacional
  const matrixData = useMemo(() => {
    if (!dataRaw.length) return [];

    const linhasDinamicas: Record<string, { codcategoria: number; categoria: string; valores: Record<string, number>; rowType: string }> = {};

    const linhaEntrada = {
      categoria: "RECEITA TOTAL",
      valores: {} as Record<string, number>,
      rowType: "entrada"
    };

    MESES_CONFIG.forEach(m => {
      linhaEntrada.valores[m.chaveIdentificadora] = 0;
    });

    // Mapeamento inicial das categorias de Despesa (Saídas)
    dataRaw.forEach((item: any) => {
      const codCat = item.categoria?.codcategoria || 0;
      const nomeCategoria = (item.categoria?.desccategoria || "SEM CATEGORIA").toUpperCase();
      const valorUnitario = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");

      const isEntrada = valorUnitario > 0 && (nomeCategoria.includes("ENTRADA") || nomeCategoria.includes("RECEITA"));

      // Ignora as entradas na criação de linhas de despesa por categoria
      if (!isEntrada) {
        const chaveLinha = `cat-id-${codCat}`;
        if (!linhasDinamicas[chaveLinha]) {
          linhasDinamicas[chaveLinha] = {
            codcategoria: codCat,
            categoria: nomeCategoria,
            valores: {},
            rowType: "data"
          };
          
          MESES_CONFIG.forEach(m => {
            linhasDinamicas[chaveLinha].valores[m.chaveIdentificadora] = 0;
          });
        }
      }
    });

    // Distribuição dos valores correspondentes por competência mensal
    dataRaw.forEach((item: any) => {
      if (!item.datamov) return;

      const valorUnitario = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");
      const codCat = item.categoria?.codcategoria || 0;
      const nomeCategoria = (item.categoria?.desccategoria || "SEM CATEGORIA").toUpperCase();
      
      const dataInicio = dayjs(item.datamov);
      const dataFim = item.datafimmov ? dayjs(item.datafimmov) : dataInicio;

      const diferencaMeses = dataFim.diff(dataInicio, "month") + 1;
      const mesesDuracao = diferencaMeses > 0 ? diferencaMeses : 1;

      const isEntrada = valorUnitario > 0 && (nomeCategoria.includes("ENTRADA") || nomeCategoria.includes("RECEITA"));
      const chaveLinha = `cat-id-${codCat}`;

      for (let i = 0; i < mesesDuracao; i++) {
        const dataReferenciaParcela = dataInicio.add(i, "month");
        const chaveMes = dataReferenciaParcela.format("YYYY-MM");

        if (isEntrada) {
          if (linhaEntrada.valores[chaveMes] !== undefined) {
            linhaEntrada.valores[chaveMes] += valorUnitario;
          }
        } else {
          if (linhasDinamicas[chaveLinha] && linhasDinamicas[chaveLinha].valores[chaveMes] !== undefined) {
            linhasDinamicas[chaveLinha].valores[chaveMes] += valorUnitario;
          }
        }
      }
    });

    const totaisPagamento = {} as Record<string, number>;
    const faltaSobra = {} as Record<string, number>;

    MESES_CONFIG.forEach((m) => {
      let somaSaidasMes = 0;

      Object.values(linhasDinamicas).forEach((linha) => {
        somaSaidasMes += linha.valores[m.chaveIdentificadora] || 0;
      });

      totaisPagamento[m.chaveIdentificadora] = somaSaidasMes;
      faltaSobra[m.chaveIdentificadora] = (linhaEntrada.valores[m.chaveIdentificadora] || 0) - somaSaidasMes;
    });

    return [
      { key: "total-entradas", categoria: "RECEITA TOTAL", valores: linhaEntrada.valores, rowType: "entrada" },
      ...Object.values(linhasDinamicas).map((linha) => ({ key: `din-id-${linha.codcategoria}`, ...linha })),
      { key: "total-saidas", categoria: "TOTAIS DESPESAS", valores: totaisPagamento, rowType: "total" },
      { key: "total-balanco", categoria: "BALANÇO (FALTA/SOBRA)", valores: faltaSobra, rowType: "resultado" },
    ];
  }, [dataRaw, MESES_CONFIG]);

  // 3. Definição Dinâmica de Colunas (Layout Fluido)
  const columns = useMemo(() => {
    const colunasFixasEsquerda = [
      {
        title: "CATEGORIA / PLANO CONTAS",
        dataIndex: "categoria",
        key: "categoria",
        width: isMobile ? 160 : 240,
        fixed: "left" as const,
        render: (text: string, record: any) => {
          if (record.rowType === "resultado") return <Text strong style={{ color: "#000" }}>{text}</Text>;
          if (record.rowType !== "data") return <Text strong>{text}</Text>;
          return (
            <Space size={6}>
              <span style={{ fontSize: "11px", color: "#bfbfbf", fontFamily: "monospace", background: "#f5f5f5", padding: "2px 4px", borderRadius: "4px" }}>
                {String(record.codcategoria).padStart(2, '0')}
              </span>
              <Text style={{ fontWeight: 500, fontSize: isMobile ? "12px" : "13px" }}>{text}</Text>
            </Space>
          );
        },
      },
    ];

    const colunasMesesDinamicos = MESES_CONFIG.map((m) => {
      const isMesAtual = m.chaveIdentificadora === mesAtualChave;
      const corFundoColunaAtual = "#fffbe6"; 

      return {
        title: (
          <div style={{ textAlign: "center", lineHeight: "1.2" }}>
            <div style={{ fontWeight: 700, fontSize: "12px", letterSpacing: "0.5px", color: isMesAtual ? "#d46b08" : "inherit" }}>
              {m.nomeCabecalho} {isMesAtual && "•"}
            </div>
            <div style={{ fontSize: "10px", color: isMesAtual ? "#d46b08" : "#8c8c8c", fontWeight: 400 }}>{m.dataRef}</div>
          </div>
        ),
        dataIndex: ["valores", m.chaveIdentificadora],
        key: m.chaveIdentificadora,
        width: 130,
        align: "right" as const,
        onHeaderCell: () => ({
          style: isMesAtual ? { backgroundColor: "#ffe7ba", borderBottom: "2px solid #ffd591" } : {},
        }),
        onCell: () => ({
          style: isMesAtual ? { backgroundColor: corFundoColunaAtual } : {},
        }),
        render: (val: number, record: any) => {
          const valorFormatado = `R$ ${(val || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          
          if (record.rowType === "total") return <Text strong style={{ color: "#096dd9" }}>{valorFormatado}</Text>;
          if (record.rowType === "entrada") return <Text strong style={{ color: "#389e0d" }}>{valorFormatado}</Text>;
          if (record.rowType === "resultado") {
            const isNegativo = val < 0;
            return (
              <Text strong style={{ color: isNegativo ? "#cf1322" : "#389e0d" }}>
                {isNegativo ? "" : "+"}{valorFormatado}
              </Text>
            );
          }
          return val > 0 ? <span style={{ color: "#434343" }}>{valorFormatado}</span> : <span style={{ color: "#d9d9d9" }}>-</span>;
        },
      };
    });

    return [...colunasFixasEsquerda, ...colunasMesesDinamicos];
  }, [MESES_CONFIG, isMobile, mesAtualChave]);

  // 4. Mapeamento de Acumulados dos Cards Superiores
  const cardStats = useMemo(() => {
    let totalEntradas = 0;
    let totalSaidas = 0;

    dataRaw.forEach((item: any) => {
      const valor = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");
      const nomeCategoria = (item.categoria?.desccategoria || "").toUpperCase();
      if (nomeCategoria.includes("ENTRADA") || nomeCategoria.includes("RECEITA")) {
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

  const getRowStyle = (rowType: string) => {
    switch (rowType) {
      case "total":
        return { backgroundColor: "#e6f7ff", fontWeight: "bold" };
      case "entrada":
        return { backgroundColor: "#f6ffed", fontWeight: "bold" };
      case "resultado":
        return { backgroundColor: "#fafafa", fontWeight: "bold" };
      default:
        return {};
    }
  };

  return (
    <Space direction="vertical" size={20} style={{ width: "100%", padding: isMobile ? "0" : "4px" }}>
      {/* Título Operacional */}
      <div>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>Fluxo de Caixa Consolidado</Title>
        <Text type="secondary" style={{ fontSize: isMobile ? "13px" : "14px" }}>
          Demonstrativo macro de competência financeira agrupado estruturalmente por categorias.
        </Text>
      </div>

      {/* Cards de Estatísticas */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false} style={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Statistic
                title={<Text type="secondary" style={{ fontSize: "13px" }}>Previsão de Receitas Consolidada</Text>}
                value={cardStats.entradas}
                precision={2}
                valueStyle={{ color: "#389e0d", fontWeight: 700, fontSize: isMobile ? "20px" : "24px" }}
                prefix={<ArrowUpOutlined />}
                suffix={<span style={{ fontSize: "12px", marginLeft: "4px" }}>BRL</span>}
              />
              <div style={{ background: "#f6ffed", padding: "8px", borderRadius: "6px", color: "#389e0d" }}>
                <ArrowUpOutlined style={{ fontSize: "18px" }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false} style={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Statistic
                title={<Text type="secondary" style={{ fontSize: "13px" }}>Compromissos de Despesas</Text>}
                value={cardStats.saidas}
                precision={2}
                valueStyle={{ color: "#cf1322", fontWeight: 700, fontSize: isMobile ? "20px" : "24px" }}
                prefix={<ArrowDownOutlined />}
                suffix={<span style={{ fontSize: "12px", marginLeft: "4px" }}>BRL</span>}
              />
              <div style={{ background: "#fff1f0", padding: "8px", borderRadius: "6px", color: "#cf1322" }}>
                <ArrowDownOutlined style={{ fontSize: "18px" }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false} style={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Statistic
                title={<Text type="secondary" style={{ fontSize: "13px" }}>Resultado Projetado Acumulado</Text>}
                value={Math.abs(cardStats.balanco)}
                precision={2}
                valueStyle={{ color: cardStats.balanco >= 0 ? "#389e0d" : "#cf1322", fontWeight: 700, fontSize: isMobile ? "20px" : "24px" }}
                prefix={cardStats.balanco >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix={<span style={{ fontSize: "12px", marginLeft: "4px" }}>BRL</span>}
              />
              <div style={{ 
                background: cardStats.balanco >= 0 ? "#f6ffed" : "#fff1f0", 
                padding: "8px", 
                borderRadius: "6px", 
                color: cardStats.balanco >= 0 ? "#389e0d" : "#cf1322" 
              }}>
                <BarChartOutlined style={{ fontSize: "18px" }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bloco de Matriz de Dados */}
      <Card 
        title={
          <Space size={8}>
            <CalendarOutlined style={{ color: "#096dd9" }} />
            <span style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: 600 }}>Matriz Multoperacional Mensal</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
        bodyStyle={{ padding: isMobile ? "4px" : "16px" }}
      >
        <Table
          rowKey="key"
          columns={columns}
          dataSource={matrixData}
          pagination={false}
          loading={movementQuery.isLoading}
          scroll={{ x: "max-content", y: 550 }}
          bordered
          size={isMobile ? "small" : "middle"}
          onRow={(record) => ({
            style: getRowStyle(record.rowType),
          })}
        />
      </Card>
    </Space>
  );
};