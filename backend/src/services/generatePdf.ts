import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import {findClientsByName} from '../repositories/clientData';
import {findVehicleById} from '../repositories/vehicleData';
import {findOSById, findOpByIdSo } from '../repositories/osData';
import { OSModel } from '../Models/OSModel';
import { ClientModel } from '../Models/clientModel';
import { VehicleModel } from '../Models/vehicleModel';
import { PartsOsModel } from '../Models/partsOsModel';
import { findPartsByName } from '../repositories/partsData';
import { PartsModel } from '../Models/partsModel';


// Cores base da identidade da Ponto 8
const COLORS = {
   text: '#333333',
   lightText: '#666666',
   primary: '#fbb03b',
   bgLight: '#f8f9fa',
   border: '#e0e0e0'
};

export const variables = async(name:string, vehicle:number, idOs:number, parts:string) => {
   const client = await findClientsByName(name);
   if(!client) throw new Error("Impossivel gerar o PDF - não foi possivel acessar clientes");

   const vehicledb = await findVehicleById(vehicle);
   if(!vehicledb) throw new Error("Impossivel gerar o PDF - não foi possivel acessar veiculo");
   
   const os = await findOSById(idOs);
   if(!os) throw new Error("Impossivel gerar o PDF - não foi possivel acessar OS");
   
   const orderParts = await findOpByIdSo(idOs);
   if(!orderParts) throw new Error("Impossivel gerar o PDF - não foi possivel acessar peças da OS");

   const partsdb = await findPartsByName(parts);
   if(!partsdb) throw new Error("Impossivel gerar o PDF - não foi possivel acessar peças");

   generatePdf(os, client, vehicledb, orderParts, partsdb);
}

export const  generatePdf = (os:OSModel, client:ClientModel, vehicle:VehicleModel, orderParts:PartsOsModel[], parts:PartsModel[]) => {
   const doc = new PDFDocument({ size: 'A4', margin: 40 });
   const clientName = client.name.replace(" ", "_");
   const writeStream = fs.createWriteStream(`OS_${os.id}_${clientName}.pdf`);
   doc.pipe(writeStream);

   // Variável mestre que controla a altura (posição Y) dos elementos na página
   let yAtual = 40;

   yAtual = gerarCabecalho(doc, yAtual, os.id, os.createdAt);
   yAtual = gerarDadosClienteVeiculo(doc, yAtual, client, vehicle);

   const {newY: yAfterProducts, totalProducts} = gerarTabelaProdutos(doc, yAtual, orderParts, parts);
   let products = totalProducts;
   yAtual = yAfterProducts + 20;

   const {newY: yAfterServices, totalServices} = gerarTabelaServicos(doc, yAtual,orderParts, parts);
   let services = totalServices;
   yAtual = yAfterServices + 20;

   yAtual = gerarTotais(doc, yAtual, products, services);
   yAtual += 25;

   yAtual = gerarLaudoETermos(doc, yAtual, os.description);

   // Espaço antes das assinaturas
   yAtual += 50;
   gerarAssinaturas(doc, yAtual, client.name);
   gerarRodape(doc);

   // Finaliza a geração do arquivo
   doc.end();

   writeStream.on('finish', () => {
      console.log(`PDF gerado com sucesso: OS_${os.id}_${clientName}.pdf`);
   });
}

function gerarCabecalho(doc:PDFKit.PDFDocument, y:number, osId:number, open:Date): number {
   doc.image('ponto-8-webapp/frontend/img/img1.png', 40, y, { height: 40 });
   doc.fontSize(14).font('Helvetica-Bold').fillColor(COLORS.text).text('PONTO 8 OFICINA MECÂNICA', 40, y);

   doc.fontSize(8).font('Helvetica').fillColor(COLORS.lightText)
      .text(`${process.env.COMPANY_LEGAL_NAME} - CNPJ:${process.env.COMPANY_CNPJ}`, 40, y + 18)
      .text(process.env.COMPANY_ADDRESS!, 40, y + 30)
      .text(process.env.COMPANY_CITY!, 40, y + 42)
      .text(`Telefone: ${process.env.COMPANY_PHONE} | E-mail: ${process.env.COMPANY_EMAIL}`, 40, y + 54);

   doc.roundedRect(400, y, 155, 60, 5).fillAndStroke(COLORS.bgLight, COLORS.border);
   doc.fontSize(8).font('Helvetica-Bold').fillColor(COLORS.lightText)
      .text('ORDEM DE SERVIÇO', 400, y + 8, { width: 155, align: 'center' });
   doc.fontSize(18).font('Helvetica-Bold').fillColor(COLORS.text)
      .text(`Nº ${osId}`, 400, y + 20, { width: 155, align: 'center', characterSpacing: 1 });

   doc.fontSize(8).font('Helvetica').fillColor(COLORS.lightText)
      .text(`Abertura: ${open}`, 400, y + 70, { width: 155, align: 'right' })

   doc.moveTo(40, y + 105).lineTo(555, y + 105).lineWidth(2).stroke(COLORS.primary);

   return y + 125;
}

function gerarDadosClienteVeiculo(doc:PDFKit.PDFDocument, yBase:number, cl:ClientModel, ve:VehicleModel): number {
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
      .font('Helvetica').text(`${cl.name}`, colEsquerda + 50, yLinhas);
   doc.font('Helvetica-Bold').text('CPF/CNPJ:', colEsquerda, yLinhas + espaco)
      .font('Helvetica').text(`${cl.cpf}`, colEsquerda + 65, yLinhas + espaco);
   doc.font('Helvetica-Bold').text('Endereço:', colEsquerda, yLinhas + espaco * 2)
      .font('Helvetica').text(`${cl.address}`, colEsquerda + 55, yLinhas + espaco * 2);
   doc.font('Helvetica-Bold').text('Telefone:', colEsquerda, yLinhas + espaco * 4)
      .font('Helvetica').text(`${cl.phone}`, colEsquerda + 55, yLinhas + espaco * 4);

   doc.font('Helvetica-Bold').text('Veículo:', colDireita, yLinhas)
      .font('Helvetica').text(`${ve.vehicleBrand} ${ve.vehicleModel}`, colDireita + 45, yLinhas);
   doc.font('Helvetica-Bold').text('Placa:', colDireita, yLinhas + espaco)
      .font('Helvetica').text(`${ve.plate}`, colDireita + 35, yLinhas + espaco);
   doc.font('Helvetica-Bold').text('Chassi:', colDireita, yLinhas + espaco * 2)
      .font('Helvetica').text(`${ve.chassi}`, colDireita + 45, yLinhas + espaco * 2);
   doc.font('Helvetica-Bold').text('Ano:', colDireita, yLinhas + espaco * 3)
      .font('Helvetica').text(`${ve.year}`, colDireita + 50, yLinhas + espaco * 3);

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

function gerarTabelaProdutos(doc: PDFKit.PDFDocument, yBase: number, po:PartsOsModel[], pa:PartsModel[]): {newY: number, totalProducts: number} {
   desenharCabecalhoTabela(doc, yBase, 'Produtos Utilizados');
   let y = yBase + 40;
   let totalProducts = 0;

   let i  = 0;
   for(i = 0; i < po.length; i++){
      const result = pa.find(p => p.idPart === po[i].idPart);

      doc.fontSize(9).font('Helvetica').fillColor(COLORS.text).text(`${i+1}`, 45, y);
      doc.font('Helvetica-Bold').text(`${result?.namePart}`, 80, y);
      doc.font('Helvetica').fillColor(COLORS.lightText).fontSize(7.5);
      doc.fontSize(9).fillColor(COLORS.text);
      doc.text(`${po[i].amount}`, 350, y, { width: 30, align: 'center' });
      doc.text(`${po[i].unitPrice}`, 400, y, { width: 70, align: 'right' });
      let total = po[i].unitPrice * po[i].amount;
      doc.text(`${total}`, 480, y, { width: 70, align: 'right' });
      doc.moveTo(40, y + 25).lineTo(555, y + 25).lineWidth(1).stroke(COLORS.border);

      totalProducts += total

      y += 35;
   }

   return {newY: y + 25, totalProducts};
}

function gerarTabelaServicos(doc: PDFKit.PDFDocument, yBase: number, po:PartsOsModel[], pa:PartsModel[]): {newY: number, totalServices: number} {
   desenharCabecalhoTabela(doc, yBase, 'Serviços Utilizados');
   let y = yBase + 40;
   let totalServices = 0;

   let i  = 0;
   for(i = 0; i < po.length; i++){
      const result = pa.find(p => p.idPart === po[i].idPart);

      doc.fontSize(9).font('Helvetica').fillColor(COLORS.text).text(`${i+1}`, 45, y);
      doc.font('Helvetica-Bold').text(`${result?.namePart}`, 80, y);
      doc.font('Helvetica').fillColor(COLORS.lightText).fontSize(7.5);
      doc.fontSize(9).fillColor(COLORS.text);
      doc.text(`${po[i].amount}`, 350, y, { width: 30, align: 'center' });
      doc.text(`${po[i].unitPrice}`, 400, y, { width: 70, align: 'right' });
      let total = po[i].unitPrice * po[i].amount;
      doc.text(`${total}`, 480, y, { width: 70, align: 'right' });
      doc.moveTo(40, y + 25).lineTo(555, y + 25).lineWidth(1).stroke(COLORS.border);

      totalServices += total
      
      y += 35;
   }

   return {newY: y + 25, totalServices};
}

function gerarTotais(doc: PDFKit.PDFDocument, yBase: number, products:number, services:number): number {
   const startX = 350;

   doc.roundedRect(startX, yBase, 205, 65, 4).stroke(COLORS.border);

   doc.fontSize(10).font('Helvetica').fillColor(COLORS.text);
   doc.text('Total de Produtos:', startX + 10, yBase + 10);
   doc.text(`${products}`, startX, yBase + 10, { width: 195, align: 'right' });

   doc.text('Total de Serviços:', startX + 10, yBase + 28);
   doc.text(`${services}`, startX, yBase + 28, { width: 195, align: 'right' });

   // Fundo Amarelo para o Líquido
   doc.rect(startX, yBase + 45, 205, 20).fill(COLORS.primary);
   doc.fontSize(11).font('Helvetica-Bold').fillColor('black');
   doc.text('VALOR LÍQUIDO:', startX + 10, yBase + 50);
   const totalAll = products + services;
   doc.text(`${totalAll}`, startX, yBase + 50, { width: 195, align: 'right' });

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

function gerarAssinaturas(doc: PDFKit.PDFDocument, yBase: number, name:string) {
   doc.moveTo(80, yBase).lineTo(240, yBase).lineWidth(1).stroke(COLORS.text);
   doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text).text('Ponto 8 Oficina Mecânica', 80, yBase + 5, { width: 160, align: 'center' });
   doc.fontSize(8).font('Helvetica').fillColor(COLORS.lightText).text('Responsável Técnico', 80, yBase + 17, { width: 160, align: 'center' });

   doc.moveTo(350, yBase).lineTo(510, yBase).lineWidth(1).stroke(COLORS.text);
   doc.fontSize(9).font('Helvetica-Bold').fillColor(COLORS.text).text(name, 350, yBase + 5, { width: 160, align: 'center' });
   doc.fontSize(8).font('Helvetica').fillColor(COLORS.lightText).text('Assinatura do Cliente / Data', 350, yBase + 17, { width: 160, align: 'center' });
}

function gerarRodape(doc: PDFKit.PDFDocument) {
   // Fixado no final da página A4
   doc.moveTo(40, 800).lineTo(555, 800).lineWidth(1).stroke('#eeeeee');
   doc.fontSize(8).font('Helvetica').fillColor('#999999')
      .text('Gerado pelo sistema Ponto 8 - Gestão Automotiva Inteligente | app.ponto8.com.br', 40, 810, { width: 515, align: 'center' });
}