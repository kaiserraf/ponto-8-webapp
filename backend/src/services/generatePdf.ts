import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { getClientByIdService } from '../services/clientService';
import { getVehicleByIdService } from '../services/vehicleService';
import { findOSById, findOpByIdSo, findOlByIdSo } from '../repositories/osData';
import { findPartById } from '../repositories/partsData';
import { selectLaborById } from '../repositories/laborData';
import { OSModel } from '../Models/OSModel';
import { ClientModel } from '../Models/clientModel';
import { VehicleModel } from '../Models/vehicleModel';
import { PartsOsModel } from '../Models/partsOsModel';
import { PartsModel } from '../Models/partsModel';
import { LaborModel } from '../Models/laborModel';
import { LaborOsModel } from '../Models/laborOsModel';

// ---------------------------------------------------------------------------
// Cores da identidade visual Ponto 8
// ---------------------------------------------------------------------------
const CORES = {
    texto:      '#333333',
    textoClaro: '#666666',
    primaria:   '#fbb03b',
    fundoClaro: '#f8f9fa',
    borda:      '#e0e0e0'
};

// ---------------------------------------------------------------------------
// Ponto de entrada público — recebe apenas o idOs e busca tudo do banco
// ---------------------------------------------------------------------------

export const gerarOsPdf = async (idOs: number): Promise<string> => {
    // 1. Busca a OS
    const os = await findOSById(idOs);
    if (!os) throw new Error(`OS ${idOs} não encontrada`);

    // FIX: OSModel retorna "idSo" via alias SQL, não "id".
    // Usamos idOs (parâmetro da função) como identificador confiável
    // em vez de os.id, que chega undefined.
    const osId = idOs;

    // 2. Busca cliente e veículo em paralelo
    const [cliente, veiculo] = await Promise.all([
        getClientByIdService(os.idClient),
        getVehicleByIdService(os.idVehicle)
    ]);

    if (!cliente) throw new Error(`Cliente ${os.idClient} não encontrado`);
    if (!veiculo) throw new Error(`Veículo ${os.idVehicle} não encontrado`);

    // 3. Busca peças e serviços vinculados à OS
    const pecasDaOs    = await findOpByIdSo(idOs);
    const servicosDaOs = await findOlByIdSo(idOs);

    // 4. Detalhes das peças
    const detalhesPecas: PartsModel[] = await Promise.all(
        pecasDaOs.map(async (op: PartsOsModel) => {
            const peca = await findPartById(op.idPart);
            if (!peca) throw new Error(`Peça ${op.idPart} não encontrada`);
            return peca[0];
        })
    );

    // 5. Detalhes dos serviços
    const detalhesServicos: LaborModel[] = await Promise.all(
        servicosDaOs.map(async (ol: LaborOsModel) => {
            const servico = await selectLaborById(ol.idLabor);
            if (!servico || servico.length === 0) throw new Error(`Serviço ${ol.idLabor} não encontrado`);
            return servico[0];
        })
    );

    // 6. Gera o PDF — passa osId explicitamente para evitar o "Nº undefined"
    const caminho = await gerarPdf(
        os, osId, cliente, veiculo,
        pecasDaOs, detalhesPecas,
        servicosDaOs, detalhesServicos
    );

    return caminho;
};

// ---------------------------------------------------------------------------
// Função principal de geração
// FIX: recebe osId como parâmetro separado (os.id chega undefined porque
//      o alias SQL é "idSo", não "id")
// ---------------------------------------------------------------------------

const gerarPdf = (
    os:               OSModel,
    osId:             number,        // <-- FIX: id confiável
    cliente:          ClientModel,
    veiculo:          VehicleModel,
    pecasDaOs:        PartsOsModel[],
    detalhesPecas:    PartsModel[],
    servicosDaOs:     LaborOsModel[],
    detalhesServicos: LaborModel[]
): Promise<string> => {

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 40 });

        // FIX: usa osId em vez de os.id
        const nomeCliente  = cliente.name.replace(/ /g, '_');
        const nomeArquivo  = `OS_${osId}_${nomeCliente}.pdf`;

        const pastaPdfs = path.join(__dirname, '../../pdfs');
        if (!fs.existsSync(pastaPdfs)) {
            fs.mkdirSync(pastaPdfs, { recursive: true });
        }

        const caminhoArquivo = path.join(pastaPdfs, nomeArquivo);
        const writeStream    = fs.createWriteStream(caminhoArquivo);

        doc.pipe(writeStream);

        let y = 40;

        // FIX: passa osId em vez de os.id
        y = gerarCabecalho(doc, y, osId, os.createdAt);
        y = gerarDadosClienteVeiculo(doc, y, cliente, veiculo);

        const { novoY: yAposPecas,    totalPecas    } = gerarTabelaPecas(doc, y, pecasDaOs, detalhesPecas);
        y = yAposPecas + 20;

        const { novoY: yAposServicos, totalServicos } = gerarTabelaServicos(doc, y, servicosDaOs, detalhesServicos);
        y = yAposServicos + 20;

        y = gerarTotais(doc, y, totalPecas, totalServicos);
        y += 25;

        y = gerarLaudoETermos(doc, y, os.description ?? '');
        y += 50;

        gerarAssinaturas(doc, y, cliente.name);
        gerarRodape(doc);

        doc.end();

        writeStream.on('finish', () => {
            console.log(`PDF gerado: ${caminhoArquivo}`);
            resolve(caminhoArquivo);
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
};

// ---------------------------------------------------------------------------
// Helpers utilitários
// ---------------------------------------------------------------------------

function checarNovaPagina(doc: PDFKit.PDFDocument, y: number, alturaLinha: number = 35): number {
    const LIMITE_INFERIOR = 760;
    if (y + alturaLinha > LIMITE_INFERIOR) {
        doc.addPage();
        return 40;
    }
    return y;
}

function formatarData(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
        day:    '2-digit',
        month:  '2-digit',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit'
    });
}

function formatarMoeda(valor: number): string {
    return Number(valor).toLocaleString('pt-BR', {
        style:    'currency',
        currency: 'BRL'
    });
}

// ---------------------------------------------------------------------------
// Seções do documento
// ---------------------------------------------------------------------------

function gerarCabecalho(
    doc: PDFKit.PDFDocument,
    y: number,
    osId: number,       // FIX: parâmetro renomeado para osId
    abertura: Date
): number {
    const caminhoLogo = path.join(__dirname, '../../../frontend/img/logo.png');

    if (fs.existsSync(caminhoLogo)) {
        doc.image(caminhoLogo, 40, y, { height: 80 });
    }

    doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor(CORES.texto)
        .text('PONTO 8 OFICINA MECÂNICA', 150, y);

    doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor(CORES.textoClaro)
        .text(`${process.env.COMPANY_LEGAL_NAME} - CNPJ: ${process.env.COMPANY_CNPJ}`, 150, y + 18)
        .text(`${process.env.COMPANY_ADDRESS}`,                                          150, y + 30)
        .text(`${process.env.COMPANY_CITY}`,                                             150, y + 42)
        .text(`Tel: ${process.env.COMPANY_PHONE} | E-mail: ${process.env.COMPANY_EMAIL}`, 150, y + 54);

    // Caixa da OS — FIX: usa osId
    doc.roundedRect(400, y, 155, 60, 5).fillAndStroke(CORES.fundoClaro, CORES.borda);
    doc
        .fontSize(8).font('Helvetica-Bold').fillColor(CORES.textoClaro)
        .text('ORDEM DE SERVIÇO', 400, y + 8, { width: 155, align: 'center' });
    doc
        .fontSize(18).font('Helvetica-Bold').fillColor(CORES.texto)
        .text(`Nº ${osId}`, 400, y + 20, { width: 155, align: 'center', characterSpacing: 1 });

    doc
        .fontSize(8).font('Helvetica').fillColor(CORES.textoClaro)
        .text(`Abertura: ${formatarData(abertura)}`, 400, y + 70, { width: 155, align: 'right' });

    doc.moveTo(40, y + 105).lineTo(555, y + 105).lineWidth(2).stroke(CORES.primaria);

    return y + 125;
}

function gerarDadosClienteVeiculo(
    doc: PDFKit.PDFDocument,
    y: number,
    cl: ClientModel,
    ve: VehicleModel
): number {
    const colEsq = 40;
    const colDir = 300;

    doc.fontSize(11).font('Helvetica-Bold').fillColor(CORES.texto);
    doc.text('Dados do Cliente', colEsq, y);
    doc.text('Dados do Veículo', colDir, y);

    doc.moveTo(colEsq, y + 15).lineTo(280, y + 15).lineWidth(1).stroke('#eeeeee');
    doc.moveTo(colDir, y + 15).lineTo(555, y + 15).lineWidth(1).stroke('#eeeeee');

    const yLinhas = y + 25;
    const espaco  = 14;

    doc.fontSize(9.5).font('Helvetica-Bold').fillColor(CORES.texto)
        .text('Nome:',     colEsq,      yLinhas)
        .font('Helvetica').text(`${cl.name}`,    colEsq + 50, yLinhas);

    doc.font('Helvetica-Bold').text('CPF/CNPJ:',  colEsq,      yLinhas + espaco)
        .font('Helvetica').text(`${cl.cpf}`,      colEsq + 65, yLinhas + espaco);

    doc.font('Helvetica-Bold').text('Endereço:',  colEsq,      yLinhas + espaco * 2)
        .font('Helvetica').text(`${cl.address}`,  colEsq + 55, yLinhas + espaco * 2);

    doc.font('Helvetica-Bold').text('Telefone:',  colEsq,      yLinhas + espaco * 3)
        .font('Helvetica').text(`${cl.phone}`,    colEsq + 55, yLinhas + espaco * 3);

    doc.font('Helvetica-Bold').text('Veículo:',   colDir,      yLinhas)
        .font('Helvetica').text(`${ve.vehicleBrand} ${ve.vehicleModel}`, colDir + 45, yLinhas);

    doc.font('Helvetica-Bold').text('Placa:',     colDir,      yLinhas + espaco)
        .font('Helvetica').text(`${ve.plate}`,    colDir + 35, yLinhas + espaco);

    doc.font('Helvetica-Bold').text('Chassi:',    colDir,      yLinhas + espaco * 2)
        .font('Helvetica').text(`${ve.chassi}`,   colDir + 45, yLinhas + espaco * 2);

    doc.font('Helvetica-Bold').text('Ano:',       colDir,      yLinhas + espaco * 3)
        .font('Helvetica').text(`${ve.year}`,     colDir + 30, yLinhas + espaco * 3);

    return yLinhas + (espaco * 4) + 30;
}

function desenharCabecalhoTabela(doc: PDFKit.PDFDocument, y: number, titulo: string) {
    doc.fontSize(11).font('Helvetica-Bold').fillColor(CORES.texto).text(titulo, 40, y);
    doc.rect(40, y + 15, 515, 18).fill(CORES.fundoClaro);

    doc.fontSize(9).font('Helvetica-Bold').fillColor(CORES.texto);
    doc.text('Item',        45,  y + 20);
    doc.text('Descrição',   80,  y + 20);
    doc.text('Qtd',         350, y + 20, { width: 30,  align: 'center' });
    doc.text('V. Unitário', 400, y + 20, { width: 70,  align: 'right'  });
    doc.text('V. Total',    480, y + 20, { width: 70,  align: 'right'  });

    doc.moveTo(40, y + 33).lineTo(555, y + 33).lineWidth(1).stroke(CORES.borda);
}

function gerarTabelaPecas(
    doc:           PDFKit.PDFDocument,
    yBase:         number,
    pecasDaOs:     PartsOsModel[],
    detalhesPecas: PartsModel[]
): { novoY: number; totalPecas: number } {

    desenharCabecalhoTabela(doc, yBase, 'Produtos Utilizados');
    let y          = yBase + 40;
    let totalPecas = 0;

    for (let i = 0; i < pecasDaOs.length; i++) {
        y = checarNovaPagina(doc, y);

        const ordemPeca = pecasDaOs[i];
        const detalhe   = detalhesPecas.find(p => p.idPart === ordemPeca.idPart);

        // FIX: garante que amount e unitPrice são números antes de multiplicar
        const amount    = Number(ordemPeca.amount);
        const unitPrice = Number(ordemPeca.unitPrice);
        const total     = amount * unitPrice;

        doc.fontSize(9).font('Helvetica').fillColor(CORES.texto)
            .text(`${i + 1}`,                          45,  y);
        doc.font('Helvetica-Bold')
            .text(`${detalhe?.namePart ?? '—'}`,       80,  y);
        doc.fontSize(9).fillColor(CORES.texto)
            .text(`${amount}`,                         350, y, { width: 30, align: 'center' })
            .text(formatarMoeda(unitPrice),            400, y, { width: 70, align: 'right'  })
            .text(formatarMoeda(total),                480, y, { width: 70, align: 'right'  });

        doc.moveTo(40, y + 25).lineTo(555, y + 25).lineWidth(1).stroke(CORES.borda);

        totalPecas += total;
        y          += 35;
    }

    return { novoY: y + 25, totalPecas };
}

function gerarTabelaServicos(
    doc:              PDFKit.PDFDocument,
    yBase:            number,
    servicosDaOs:     LaborOsModel[],
    detalhesServicos: LaborModel[]
): { novoY: number; totalServicos: number } {

    desenharCabecalhoTabela(doc, yBase, 'Serviços Realizados');
    let y             = yBase + 40;
    let totalServicos = 0;

    for (let i = 0; i < servicosDaOs.length; i++) {
        y = checarNovaPagina(doc, y);

        const ordemServico = servicosDaOs[i];
        const detalhe      = detalhesServicos.find(l => l.idLabor === ordemServico.idLabor);

        // FIX: garante que value é número
        const valor = Number(ordemServico.value);

        doc.fontSize(9).font('Helvetica').fillColor(CORES.texto)
            .text(`${i + 1}`,                    45, y);
        doc.font('Helvetica-Bold')
            .text(`${detalhe?.laborName ?? '—'}`, 80, y);
        doc.fontSize(9).fillColor(CORES.texto)
            .text('1',                           350, y, { width: 30, align: 'center' })
            .text(formatarMoeda(valor),          400, y, { width: 70, align: 'right'  })
            .text(formatarMoeda(valor),          480, y, { width: 70, align: 'right'  });

        doc.moveTo(40, y + 25).lineTo(555, y + 25).lineWidth(1).stroke(CORES.borda);

        totalServicos += valor;
        y             += 35;
    }

    return { novoY: y + 25, totalServicos };
}

function gerarTotais(
    doc: PDFKit.PDFDocument,
    y: number,
    totalPecas: number,
    totalServicos: number
): number {
    const startX = 350;

    // FIX: garante soma numérica (evita concatenação se algum valor vier como string)
    const totalGeral = Number(totalPecas) + Number(totalServicos);

    doc.roundedRect(startX, y, 205, 65, 4).stroke(CORES.borda);

    doc.fontSize(10).font('Helvetica').fillColor(CORES.texto);
    doc.text('Total de Produtos:', startX + 10, y + 10);
    doc.text(formatarMoeda(totalPecas),     startX, y + 10, { width: 195, align: 'right' });

    doc.text('Total de Serviços:', startX + 10, y + 28);
    doc.text(formatarMoeda(totalServicos),  startX, y + 28, { width: 195, align: 'right' });

    doc.rect(startX, y + 45, 205, 20).fill(CORES.primaria);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('black');
    doc.text('VALOR LÍQUIDO:', startX + 10, y + 50);
    doc.text(formatarMoeda(totalGeral), startX, y + 50, { width: 195, align: 'right' });

    return y + 65;
}

function gerarLaudoETermos(doc: PDFKit.PDFDocument, y: number, descricao: string): number {
    // FIX: garante que descricao nunca é undefined/null no PDF
    const textoDescricao = descricao && descricao.trim() !== '' ? descricao : 'Sem observações.';

    doc.fontSize(11).font('Helvetica-Bold').fillColor(CORES.texto).text('Laudo Conclusivo', 40, y);

    const largura     = 485;
    const alturaTexto = doc.heightOfString(textoDescricao, { width: largura });
    const alturaBox   = alturaTexto + 30;

    doc.rect(40, y + 15, 515, alturaBox).fill(CORES.fundoClaro);
    doc.rect(40, y + 15, 4,   alturaBox).fill(CORES.primaria);

    doc.font('Helvetica-Bold').fillColor(CORES.texto)
        .text('SUBSTITUÍDO / OBSERVAÇÕES:', 55, y + 22);
    doc.font('Helvetica')
        .text(textoDescricao, 55, y + 34, { width: largura });

    const yTermos = y + 15 + alturaBox + 15;

    doc.rect(40, yTermos, 515, 30).lineWidth(1).dash(2, { space: 2 }).stroke('#cccccc');
    doc.undash();
    doc.fontSize(8.5).fillColor(CORES.textoClaro)
        .text(
            'Estou ciente da conclusão dos serviços acima relacionados, bem como a aplicação das peças listadas nesta ordem de serviço. ' +
            'Comprometo-me em pagar conforme a descrição dos valores e prazos acordados.',
            45, yTermos + 8,
            { width: 505, align: 'justify' }
        );

    return yTermos + 30;
}

function gerarAssinaturas(doc: PDFKit.PDFDocument, y: number, nomeCliente: string) {
    doc.moveTo(80,  y).lineTo(240, y).lineWidth(1).stroke(CORES.texto);
    doc.fontSize(9).font('Helvetica-Bold').fillColor(CORES.texto)
        .text('Ponto 8 Oficina Mecânica', 80, y + 5,  { width: 160, align: 'center' });
    doc.fontSize(8).font('Helvetica').fillColor(CORES.textoClaro)
        .text('Responsável Técnico',      80, y + 17, { width: 160, align: 'center' });

    doc.moveTo(350, y).lineTo(510, y).lineWidth(1).stroke(CORES.texto);
    doc.fontSize(9).font('Helvetica-Bold').fillColor(CORES.texto)
        .text(nomeCliente,                    350, y + 5,  { width: 160, align: 'center' });
    doc.fontSize(8).font('Helvetica').fillColor(CORES.textoClaro)
        .text('Assinatura do Cliente / Data', 350, y + 17, { width: 160, align: 'center' });
}

function gerarRodape(doc: PDFKit.PDFDocument) {
    doc.moveTo(40, 800).lineTo(555, 800).lineWidth(1).stroke('#eeeeee');
    doc.fontSize(8).font('Helvetica').fillColor('#999999')
        .text(
            'Gerado pelo sistema Ponto 8 - Gestão Automotiva Inteligente | app.ponto8.com.br',
            40, 810,
            { width: 515, align: 'center' }
        );
}