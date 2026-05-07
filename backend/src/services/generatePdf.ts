import PDFDocument from 'pdfkit';
import * as fs from 'fs';

// Cores base da identidade da Ponto 8
const COLORS = {
  text: '#333333',
  lightText: '#666666',
  primary: '#fbb03b', // Amarelo Ponto 8
  bgLight: '#f8f9fa',
  border: '#e0e0e0',
  success: '#28a745'
};

export function gerarPDF() {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const writeStream = fs.createWriteStream('OS-Ponto8-Completa.pdf');
  doc.pipe(writeStream);

  // Variável mestre que controla a altura (posição Y) dos elementos na página
  let yAtual = 40;

  yAtual = gerarCabecalho(doc, yAtual);
  yAtual = gerarDadosClienteVeiculo(doc, yAtual);
  
  // Seção: Serviços Solicitados
  doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.text).text('Serviços Solicitados', 40, yAtual);
  yAtual += 15;
  doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#444444').text('> DISCO E PASTILHA', 45, yAtual);
  yAtual += 25;

  yAtual = gerarTabelaProdutos(doc, yAtual);
  yAtual += 20;

  yAtual = gerarTabelaServicos(doc, yAtual);
  yAtual += 20;

  yAtual = gerarTotais(doc, yAtual);
  yAtual += 25;

  // Texto simulando o laudo vindo do banco de dados (pode ter o tamanho que for)
  const laudoDoBanco = "- PAR DE DISCO DE FREIO DIANTEIRA\n- JOGO DE PASTILHA DE FREIO DIANTEIRA\n- LUBRIFICAÇÃO DOS PINOS GUIAS\n- TESTE DE RODAGEM REALIZADO E APROVADO.";
  yAtual = gerarLaudoETermos(doc, yAtual, laudoDoBanco);
  
  // Espaço antes das assinaturas
  yAtual += 50; 
  gerarAssinaturas(doc, yAtual);
  gerarRodape(doc);

  // Finaliza a geração do arquivo
  doc.end();
  
  writeStream.on('finish', () => {
    console.log('PDF gerado com sucesso: OS-Ponto8-Completa.pdf');
  });
}

function gerarCabecalho(doc: PDFKit.PDFDocument, y: number): number {
  // ATENÇÃO: Descomente a linha abaixo e ajuste o nome/caminho da imagem para usar a sua logo
  // doc.image('img1.png', 40, y, { height: 40 });
  
  // Nome da Empresa (Fallback caso a logo esteja comentada)
  doc.fontSize(14).font('Helvetica-Bold').fillColor(COLORS.text).text('PONTO 8 OFICINA MECÂNICA', 40, y);

  doc.fontSize(8).font('Helvetica').fillColor(COLORS.lightText)
    .text('DVC MACHADO ME - CNPJ: 16.995.340/0001-30', 40, y + 18)
    .text('Rua Edson Zacarias Cordeiro, 141 - Capão da Imbuia', 40, y + 30)
    .text('Curitiba PR - CEP: 82.810-462', 40, y + 42)
    .text('Telefone: (41) 3026-7888 | E-mail: ponto8motors@hotmail.com', 40, y + 54);

  // Box da OS (Direita)
  doc.roundedRect(400, y, 155, 60, 5).fillAndStroke(COLORS.bgLight, COLORS.border);
  
  doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.lightText)
     .text('ORDEM DE SERVIÇO', 400, y + 8, { width: 155, align: 'center' });
  
  doc.fontSize(18).font('Helvetica-Bold').fillColor(COLORS.text)
     .text('Nº 2168', 400, y + 20, { width: 155, align: 'center', characterSpacing: 1 });

  doc.roundedRect(437, y + 43, 80, 12, 3).fill(COLORS.success);
  doc.fontSize(7).font('Helvetica-Bold').fillColor('white')
     .text('FINALIZADA', 437, y + 45, { width: 80, align: 'center' });

  // Datas
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.lightText)
     .text('Abertura: 27/04/2026', 400, y + 70, { width: 155, align: 'right' })
     .text('Fechamento: 27/04/2026', 400, y + 82, { width: 155, align: 'right' });

  doc.moveTo(40, y + 105).lineTo(555, y + 105).lineWidth(2).stroke(COLORS.primary);
  
  return y + 125; // Retorna o novo Y
}

function gerarDadosClienteVeiculo(doc: PDFKit.PDFDocument, yBase: number): number {
  const colEsquerda = 40;
  const colDireita = 300;

  doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.text);
  doc.text('Dados do Cliente', colEsquerda, yBase);
  doc.text('Dados do Veículo', colDireita, yBase);

  doc.moveTo(colEsquerda, yBase + 15).lineTo(280, yBase + 15).lineWidth(1).stroke('#eeeeee');
  doc.moveTo(colDireita, yBase + 15).lineTo(555, yBase + 15).lineWidth(1).stroke('#eeeeee');

  const yLinhas = yBase + 25;
  const espaco = 14;

  doc.fontSize(9.5).font('Helvetica-Bold').fillColor(COLORS.text).text('Nome:', colEsquerda, yLinhas)
     .font('Helvetica').text('BigCar multimarcas', colEsquerda + 50, yLinhas);
  doc.font('Helvetica-Bold').text('CPF/CNPJ:', colEsquerda, yLinhas + espaco)
     .font('Helvetica').text('56.873.021/0001-76', colEsquerda + 65, yLinhas + espaco);
  doc.font('Helvetica-Bold').text('Endereço:', colEsquerda, yLinhas + espaco * 2)
     .font('Helvetica').text('Rua Edson Zacarias Cordeiro, 144', colEsquerda + 55, yLinhas + espaco * 2);
  doc.font('Helvetica-Bold').text('Cidade:', colEsquerda, yLinhas + espaco * 3)
     .font('Helvetica').text('Curitiba - PR - 82.810-462', colEsquerda + 45, yLinhas + espaco * 3);
  doc.font('Helvetica-Bold').text('Telefone:', colEsquerda, yLinhas + espaco * 4)
     .font('Helvetica').text('(41) 98492-1632', colEsquerda + 55, yLinhas + espaco * 4);

  doc.font('Helvetica-Bold').text('Veículo:', colDireita, yLinhas)
     .font('Helvetica').text('RENAULT KWID INTENS 10MT', colDireita + 45, yLinhas);
  doc.font('Helvetica-Bold').text('Placa:', colDireita, yLinhas + espaco)
     .font('Helvetica').text('QJO-7H63', colDireita + 35, yLinhas + espaco);
  doc.font('Helvetica-Bold').text('Chassi:', colDireita, yLinhas + espaco * 2)
     .font('Helvetica').text('93YRBB007KJ891883', colDireita + 45, yLinhas + espaco * 2);
  doc.font('Helvetica-Bold').text('Ano/Cor:', colDireita, yLinhas + espaco * 3)
     .font('Helvetica').text('2019 / BRANCA', colDireita + 50, yLinhas + espaco * 3);
  doc.font('Helvetica-Bold').text('Combust.:', colDireita, yLinhas + espaco * 4)
     .font('Helvetica').text('Álcool / Gasolina', colDireita + 55, yLinhas + espaco * 4);

  return yLinhas + (espaco * 4) + 30; // Retorna o novo Y
}

function desenharCabecalhoTabela(doc: PDFKit.PDFDocument, y: number, titulo: string) {
  doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.text).text(titulo, 40, y);
  doc.rect(40, y + 15, 515, 18).fill(COLORS.bgLight);
  
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text);
  doc.text('Item', 45, y + 20);
  doc.text('Descrição', 80, y + 20);
  doc.text('Qtd', 350, y + 20, { width: 30, align: 'center' });
  doc.text('V. Unitário', 400, y + 20, { width: 70, align: 'right' });
  doc.text('V. Total', 480, y + 20, { width: 70, align: 'right' });
  
  doc.moveTo(40, y + 33).lineTo(555, y + 33).lineWidth(1).stroke(COLORS.border);
}

function gerarTabelaProdutos(doc: PDFKit.PDFDocument, yBase: number): number {
  desenharCabecalhoTabela(doc, yBase, 'Produtos Utilizados');
  let y = yBase + 40;

  // Produto 1
  doc.fontSize(9).font('Helvetica').fillColor(COLORS.text).text('1', 45, y);
  doc.font('Helvetica-Bold').text('DISCO DE FREIO DIANTEIRO', 80, y);
  doc.font('Helvetica').fillColor(COLORS.lightText).fontSize(7.5).text('NCM: 87083090', 80, y + 12);
  doc.fontSize(9).fillColor(COLORS.text);
  doc.text('1,00', 350, y, { width: 30, align: 'center' });
  doc.text('R$ 356,00', 400, y, { width: 70, align: 'right' });
  doc.text('R$ 356,00', 480, y, { width: 70, align: 'right' });
  doc.moveTo(40, y + 25).lineTo(555, y + 25).lineWidth(1).stroke(COLORS.border);

  y += 35;

  // Produto 2
  doc.text('2', 45, y);
  doc.font('Helvetica-Bold').text('PASTILHA DE FREIO DIANTEIRA', 80, y);
  doc.font('Helvetica').fillColor(COLORS.lightText).fontSize(7.5).text('NCM: 84213100', 80, y + 12);
  doc.fontSize(9).fillColor(COLORS.text);
  doc.text('1,00', 350, y, { width: 30, align: 'center' });
  doc.text('R$ 228,00', 400, y, { width: 70, align: 'right' });
  doc.text('R$ 228,00', 480, y, { width: 70, align: 'right' });
  doc.moveTo(40, y + 25).lineTo(555, y + 25).lineWidth(1).stroke(COLORS.border);

  return y + 25;
}

function gerarTabelaServicos(doc: PDFKit.PDFDocument, yBase: number): number {
  desenharCabecalhoTabela(doc, yBase, 'Mão de Obra');
  let y = yBase + 40;

  doc.fontSize(9).font('Helvetica').fillColor(COLORS.text).text('3', 45, y);
  doc.font('Helvetica-Bold').text('MÃO DE OBRA MECÂNICA', 80, y);
  doc.fontSize(9).font('Helvetica');
  doc.text('1,00', 350, y, { width: 30, align: 'center' });
  doc.text('R$ 200,00', 400, y, { width: 70, align: 'right' });
  doc.text('R$ 200,00', 480, y, { width: 70, align: 'right' });
  doc.moveTo(40, y + 15).lineTo(555, y + 15).lineWidth(1).stroke(COLORS.border);

  return y + 15;
}

function gerarTotais(doc: PDFKit.PDFDocument, yBase: number): number {
  const startX = 350;
  
  doc.roundedRect(startX, yBase, 205, 65, 4).stroke(COLORS.border);
  
  doc.fontSize(10).font('Helvetica').fillColor(COLORS.text);
  doc.text('Total de Produtos:', startX + 10, yBase + 10);
  doc.text('R$ 584,00', startX, yBase + 10, { width: 195, align: 'right' });

  doc.text('Total de Serviços:', startX + 10, yBase + 28);
  doc.text('R$ 200,00', startX, yBase + 28, { width: 195, align: 'right' });

  // Fundo Amarelo para o Líquido
  doc.rect(startX, yBase + 45, 205, 20).fill(COLORS.primary);
  doc.fontSize(11).font('Helvetica-Bold').fillColor('black');
  doc.text('VALOR LÍQUIDO:', startX + 10, yBase + 50);
  doc.text('R$ 784,00', startX, yBase + 50, { width: 195, align: 'right' });

  return yBase + 65;
}

function gerarLaudoETermos(doc: PDFKit.PDFDocument, yBase: number, textoLaudo: string): number {
  doc.fontSize(11).font('Helvetica-Bold').fillColor(COLORS.text).text('Laudo Conclusivo', 40, yBase);
  
  // Lógica Dinâmica de Altura baseada na string
  doc.fontSize(9.5).font('Helvetica');
  const larguraTexto = 485;
  const alturaTexto = doc.heightOfString(textoLaudo, { width: larguraTexto });
  const alturaBox = alturaTexto + 30; // Altura do texto + padding

  doc.rect(40, yBase + 15, 515, alturaBox).fill(COLORS.bgLight);
  doc.rect(40, yBase + 15, 4, alturaBox).fill(COLORS.primary);
  
  doc.font('Helvetica-Bold').fillColor(COLORS.text).text('SUBSTITUÍDO / OBSERVAÇÕES:', 55, yBase + 22);
  doc.font('Helvetica').text(textoLaudo, 55, yBase + 34, { width: larguraTexto });

  // Termos calculados logo abaixo da box do laudo
  const novoYTermos = yBase + 15 + alturaBox + 15;

  doc.rect(40, novoYTermos, 515, 30).lineWidth(1).dash(2, { space: 2 }).stroke('#cccccc');
  doc.undash();
  doc.fontSize(8.5).fillColor(COLORS.lightText)
     .text('Estou ciente da conclusão dos serviços acima relacionados, bem como a aplicação das peças listadas nesta ordem de serviço. Comprometo-me em pagar conforme a descrição dos valores e prazos acordados.', 45, novoYTermos + 8, { width: 505, align: 'justify' });

  return novoYTermos + 30;
}

function gerarAssinaturas(doc: PDFKit.PDFDocument, yBase: number) {
  doc.moveTo(80, yBase).lineTo(240, yBase).lineWidth(1).stroke(COLORS.text);
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text).text('Ponto 8 Oficina Mecânica', 80, yBase + 5, { width: 160, align: 'center' });
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.lightText).text('Responsável Técnico', 80, yBase + 17, { width: 160, align: 'center' });

  doc.moveTo(350, yBase).lineTo(510, yBase).lineWidth(1).stroke(COLORS.text);
  doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text).text('BigCar multimarcas', 350, yBase + 5, { width: 160, align: 'center' });
  doc.fontSize(8).font('Helvetica').fillColor(COLORS.lightText).text('Assinatura do Cliente / Data', 350, yBase + 17, { width: 160, align: 'center' });
}

function gerarRodape(doc: PDFKit.PDFDocument) {
  // Fixado no final da página A4
  doc.moveTo(40, 800).lineTo(555, 800).lineWidth(1).stroke('#eeeeee');
  doc.fontSize(8).font('Helvetica').fillColor('#999999')
     .text('Gerado pelo sistema Ponto 8 - Gestão Automotiva Inteligente | app.ponto8.com.br', 40, 810, { width: 515, align: 'center' });
}

// Executa a função principal
gerarPDF();