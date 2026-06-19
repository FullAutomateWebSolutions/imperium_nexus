import React, { useMemo } from "react";
import { Card, Table, Typography, Row, Col, Statistic, Space, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, BarChartOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useMovement } from "../../hook/useMovement";

const { Title, Text } = Typography;
export const MovementDashboardComp: React.FC = () => {
  const { listMovement } = useMovement();
  const movementQuery = listMovement({ page: 0, size: 5000 });
  const dataRaw = movementQuery.data?.content ?? [];

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

  const matrixData = useMemo(() => {
    if (!dataRaw.length) return [];

    const linhasDinamicas: Record<string, { codcategoria: number; categoria: string; valores: Record<string, number>; rowType: string }> = {};

    const linhaEntrada = {
      categoria: "RECEITA",
      valores: {} as Record<string, number>,
      rowType: "entrada"
    };

    MESES_CONFIG.forEach(m => {
      linhaEntrada.valores[m.chaveIdentificadora] = 0;
    });

    dataRaw.forEach((item: any) => {
      const codCat = item.categoria?.codcategoria || 0;
      const nomeCategoria = (item.categoria?.desccategoria || "SEM CATEGORIA").toUpperCase();
      const valorUnitario = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");

      if (valorUnitario > 0 && (nomeCategoria.includes("ENTRADA") || nomeCategoria.includes("RECEITA"))) {
        return; 
      }

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
    });

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
      ...Object.values(linhasDinamicas).map((linha) => ({ key: `din-id-${linha.codcategoria}`, ...linha })),
      { key: "total-saidas", categoria: "TOTAIS DESPESAS", valores: totaisPagamento, rowType: "total" },
      { key: "total-entradas", categoria: "RECEITA TOTAL", valores: linhaEntrada.valores, rowType: "entrada" },
      { key: "total-balanco", categoria: "BALANÇO (FALTA/SOBRA)", valores: faltaSobra, rowType: "resultado" },
    ];
  }, [dataRaw, MESES_CONFIG]);

  const columns = useMemo(() => {
    const colunasFixasEsquerda = [
      {
        title: "CATEGORIA / PLANO CONTAS",
        dataIndex: "categoria",
        key: "categoria",
        width: 160,
        fixed: "left" as const,
        render: (text: string, record: any) => {
          if (record.rowType === "resultado") return <Text strong type={text.includes("SOBRA") ? "success" : "danger"}>{text}</Text>;
          if (record.rowType !== "data") return <Text strong>{text}</Text>;
          return (
            <Space>
              <span style={{ fontSize: "11px", color: "#bfbfbf", fontFamily: "monospace" }}>[{String(record.codcategoria).padStart(2, '0')}]</span>
              <span style={{ fontWeight: 500 }}>{text}</span>
            </Space>
          );
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
      width: 125,
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

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%", padding: "4px" }}>
       <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Dashboard</Title>
        <Text type="secondary">Selecione uma das opções abaixo para realizar operações no sistema.</Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Previsão de Receitas Consolidada"
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
              title="Compromissos de Despesas"
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
              title="Resultado Projetado Acumulado"
              value={Math.abs(cardStats.balanco)}
              precision={2}
              valueStyle={{ color: cardStats.balanco >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={cardStats.balanco >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="BRL"
            />
          </Card>
        </Col>
      </Row>

      {/* PLANILHA CONSOLIDADA */}
      <Card 
        title={
          <Space>
            {/* <BarChartOutlined style={{ color: "#1890ff" }} /> */}
            <span>Matriz de Fluxo de Caixa Agrupada por Código de Categoria</span>
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
          scroll={{ x: "max-content" }}
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