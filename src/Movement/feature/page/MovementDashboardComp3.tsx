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
  const movementQuery = listMovement({ page: 0, size: 5000 });
  const dataRaw = movementQuery.data?.content ?? [];

  // 2. DETECTA O HORIZONTE CRONOLÓGICO AUTOMATICAMENTE (Meses/Anos em colunas)
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

  // 3. PROCESSAMENTO DA MATRIZ DINÂMICA (Linhas geradas pelas Categorias do Banco)
  const matrixData = useMemo(() => {
    if (!dataRaw.length) return [];

    // Objeto temporário para agrupar as linhas encontradas dinamicamente
    const linhasDinamicas: Record<string, { categoria: string; item: string; valores: Record<string, number>; rowType: string }> = {};

    // Linhas fixas para a Receita (Entradas) para garantir que ela fique separada no cálculo
    const linhaEntrada = {
      categoria: "RECEITA",
      item: "ENTRADA_MES",
      valores: {} as Record<string, number>,
      rowType: "entrada"
    };

    // Inicializa os meses zerados para a linha de receita
    MESES_CONFIG.forEach(m => {
      linhaEntrada.valores[m.chaveIdentificadora] = 0;
    });

    // Passo 1: Descobrir todas as combinações de Categoria + Descrição existentes nos dados e inicializar
    dataRaw.forEach((item: any) => {
      const nomeCategoria = (item.categoria?.desccategoria || "SEM CATEGORIA").toUpperCase();
      const nomeMovimento = (item.descmovimento || "DIVERSOS").toUpperCase();
      const valorUnitario = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");

      // Se for uma receita/entrada, joga na nossa linha fixa de entradas
      if (valorUnitario > 0 && (nomeCategoria.includes("ENTRADA") || nomeCategoria.includes("RECEITA"))) {
        return; 
      }

      // Cria uma chave única combinando a categoria e a descrição para agrupar na mesma linha
      const chaveLinha = `${nomeCategoria}_${nomeMovimento}`;

      if (!linhasDinamicas[chaveLinha]) {
        linhasDinamicas[chaveLinha] = {
          categoria: nomeCategoria,
          item: nomeMovimento,
          valores: {},
          rowType: "data"
        };
        // Inicializa todos os meses com zero para essa nova linha descoberta
        MESES_CONFIG.forEach(m => {
          linhasDinamicas[chaveLinha].valores[m.chaveIdentificadora] = 0;
        });
      }
    });

    // Passo 2: Distribuir os valores e replicar as parcelas até a 'datafimmov'
    dataRaw.forEach((item: any) => {
      if (!item.datamov) return;

      const valorUnitario = parseFloat(item.valorunit || "0") + parseFloat(item.valorjuros || "0");
      const nomeCategoria = (item.categoria?.desccategoria || "SEM CATEGORIA").toUpperCase();
      const nomeMovimento = (item.descmovimento || "DIVERSOS").toUpperCase();
      
      const dataInicio = dayjs(item.datamov);
      const dataFim = item.datafimmov ? dayjs(item.datafimmov) : dataInicio;

      const diferencaMeses = dataFim.diff(dataInicio, "month") + 1;
      const mesesDuracao = diferencaMeses > 0 ? diferencaMeses : 1;

      const isEntrada = valorUnitario > 0 && (nomeCategoria.includes("ENTRADA") || nomeCategoria.includes("RECEITA"));
      const chaveLinha = `${nomeCategoria}_${nomeMovimento}`;

      // Loop de parcelas
      for (let i = 0; i < mesesDuracao; i++) {
        const dataReferenciaParcela = dataInicio.add(i, "month");
        const chaveMes = dataReferenciaParcela.format("YYYY-MM");

        // Soma no mês correspondente
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

    // Passo 3: Calcular os Totais Verticais (Rodapé) mês a mês
    const totaisPagamento = {} as Record<string, number>;
    const faltaSobra = {} as Record<string, number>;

    MESES_CONFIG.forEach((m) => {
      let somaSaidasMes = 0;

      // Soma o valor de todas as linhas de despesa dinâmicas daquele mês
      Object.values(linhasDinamicas).forEach((linha) => {
        somaSaidasMes += linha.valores[m.chaveIdentificadora] || 0;
      });

      totaisPagamento[m.chaveIdentificadora] = somaSaidasMes;
      faltaSobra[m.chaveIdentificadora] = (linhaEntrada.valores[m.chaveIdentificadora] || 0) - somaSaidasMes;
    });

    // Transforma o objeto de linhas em um Array pro dataSource da tabela e anexa os totais
    return [
      ...Object.values(linhasDinamicas).map((linha, index) => ({ key: `din-${index}`, ...linha })),
      { key: "total-saidas", categoria: "TOTAIS", item: "TT_PAG_MES", valores: totaisPagamento, rowType: "total" },
      { key: "total-entradas", categoria: "RECEITA", item: "ENTRADA_MES", valores: linhaEntrada.valores, rowType: "entrada" },
      { key: "total-balanco", categoria: "BALANÇO", item: "FALTA/SOBRA", valores: faltaSobra, rowType: "resultado" },
    ];
  }, [dataRaw, MESES_CONFIG]);

  // 4. CONFIGURAÇÃO DAS COLUNAS
  const columns = useMemo(() => {
    const colunasFixasEsquerda = [
      {
        title: "GRUPO (CATEGORIA)",
        dataIndex: "categoria",
        key: "categoria",
        width: 160,
        fixed: "left" as const,
        render: (text: string, record: any) => {
          if (record.rowType !== "data") return <Text strong>{text}</Text>;
          return <Tag color="blue">{text}</Tag>;
        },
      },
      {
        title: "CONCEITO / DESCRIÇÃO",
        dataIndex: "item",
        key: "item",
        width: 200,
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
      width: 120,
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

  // KPI CARDS SUPERIORES CONSOLIDANDO TODO O HORIZONTE
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
              title="Receita Total Projetada"
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
              title="Despesa Total Contratada"
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
              title="Balanço Final Geral"
              value={Math.abs(cardStats.balanco)}
              precision={2}
              valueStyle={{ color: cardStats.balanco >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={cardStats.balanco >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="BRL"
            />
          </Card>
        </Col>
      </Row>

      {/* PLANILHA DINÂMICA INTEGRAL */}
      <Card 
        title={
          <Space>
            <BarChartOutlined style={{ color: "#1890ff" }} />
            <span>Matriz do Fluxo de Caixa por Categorias Automatizadas</span>
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