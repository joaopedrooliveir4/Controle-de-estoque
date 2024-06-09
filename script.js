document.addEventListener('DOMContentLoaded', function() {
    const formOS = document.getElementById('formOS');
    const tabelaOS = document.getElementById('tabelaOS').getElementsByTagName('tbody')[0];
    const inputPesquisa = document.getElementById('pesquisa');
    let ordensServico = [];
    let ordemEmEdicaoIndex = null;

    // Verifica se já existem dados salvos no localStorage
    if (localStorage.getItem('ordensServico')) {
        ordensServico = JSON.parse(localStorage.getItem('ordensServico'));
        atualizarTabela(ordensServico);
    }

    // Obtém o último número de OS salvo no localStorage
    let ultimoNumeroOS = localStorage.getItem('ultimoNumeroOS') ? parseInt(localStorage.getItem('ultimoNumeroOS')) : 0;

    formOS.addEventListener('submit', function(event) {
        event.preventDefault();

        const novaOS = {
            numeroOS: ordemEmEdicaoIndex !== null ? formOS.numeroOS.value : ++ultimoNumeroOS,
            nome: formOS.nome.value,
            endereco: formOS.endereco.value,
            telefone: formOS.telefone.value,
            aparelho: formOS.aparelho.value,
            defeito: formOS.defeito.value,
            pecas: formOS.pecas.value,
            preco: formOS.preco.value
        };

        if (ordemEmEdicaoIndex !== null) {
            ordensServico[ordemEmEdicaoIndex] = novaOS;
            ordemEmEdicaoIndex = null;
        } else {
            ordensServico.push(novaOS);
            // Atualiza o último número de OS no localStorage
            localStorage.setItem('ultimoNumeroOS', ultimoNumeroOS);
        }

        // Salva os dados no localStorage
        localStorage.setItem('ordensServico', JSON.stringify(ordensServico));

        // Atualiza a tabela
        atualizarTabela(ordensServico);

        formOS.reset();
    });

    inputPesquisa.addEventListener('input', function() {
        const filtro = inputPesquisa.value.toLowerCase();
        const ordensFiltradas = ordensServico.filter(ordem => 
            ordem.numeroOS.toString().toLowerCase().includes(filtro) ||
            ordem.nome.toLowerCase().includes(filtro) ||
            ordem.telefone.toLowerCase().includes(filtro) ||
            ordem.aparelho.toLowerCase().includes(filtro) ||
            ordem.defeito.toLowerCase().includes(filtro) ||
            ordem.pecas.toLowerCase().includes(filtro)
        );
        atualizarTabela(ordensFiltradas);
    });

    // Função para atualizar a tabela com os dados salvos
    function atualizarTabela(ordens) {
        tabelaOS.innerHTML = '';
        ordens.forEach(function(ordem, index) {
            const newRow = tabelaOS.insertRow();
            newRow.innerHTML = `
                <td>${ordem.numeroOS}</td>
                <td>${ordem.nome}</td>
                <td>${ordem.telefone}</td>
                <td>${ordem.aparelho}</td>
                <td>${ordem.defeito}</td>
                <td>${ordem.pecas}</td>
                <td>R$ ${ordem.preco}</td>
                <td>
                    <button class="btnEditar">Editar</button>
                    <button class="btnApagar">Apagar</button>
                    <button class="btnBaixarPDF">Baixar PDF</button>
                </td>
            `;
            newRow.querySelector('.btnEditar').addEventListener('click', function() {
                editarOrdemServico(index);
            });
            newRow.querySelector('.btnApagar').addEventListener('click', function() {
                apagarOrdemServico(index);
            });
            newRow.querySelector('.btnBaixarPDF').addEventListener('click', function() {
                baixarPDF(ordem);
            });
        });
    }

    // Função para carregar os dados da ordem de serviço no formulário para edição
    function editarOrdemServico(index) {
        const ordem = ordensServico[index];
        formOS.numeroOS.value = ordem.numeroOS;
        formOS.nome.value = ordem.nome;
        formOS.endereco.value = ordem.endereco;
        formOS.telefone.value = ordem.telefone;
        formOS.aparelho.value = ordem.aparelho;
        formOS.defeito.value = ordem.defeito;
        formOS.pecas.value = ordem.pecas;
        formOS.preco.value = ordem.preco;

        ordemEmEdicaoIndex = index;
    }

    // Função para apagar uma ordem de serviço específica
    function apagarOrdemServico(index) {
        ordensServico.splice(index, 1);
        localStorage.setItem('ordensServico', JSON.stringify(ordensServico));
        atualizarTabela(ordensServico);
    }

    // Função para baixar a ordem de serviço como PDF
    function baixarPDF(ordem) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título
        doc.setFontSize(18);
        doc.text("Ordem de Serviço", 105, 20, null, null, "center");

        // Subtítulo
        doc.setFontSize(14);
        doc.text(`Número: ${ordem.numeroOS}`, 105, 30, null, null, "center");

        // Dados do Cliente
        doc.setFontSize(12);
        doc.text("Dados do Cliente", 10, 40);
        doc.setFontSize(10);
        doc.text(`Nome: ${ordem.nome}`, 10, 50);
        doc.text(`Endereço: ${ordem.endereco}`, 10, 60);
        doc.text(`Telefone: ${ordem.telefone}`, 10, 70);

        // Dados do Aparelho
        doc.setFontSize(12);
        doc.text("Dados do Aparelho", 10, 80);
        doc.setFontSize(10);
        doc.text(`Aparelho: ${ordem.aparelho}`, 10, 90);
        doc.text(`Defeito: ${ordem.defeito}`, 10, 100);
        doc.text(`Peças para troca: ${ordem.pecas}`, 10, 110);

        // Preço e Garantia
        doc.setFontSize(12);
        doc.text(`Preço: R$ ${ordem.preco}`, 10, 120);
        doc.setFontSize(10);
        doc.text("GARANTIA DE 90 DIAS", 10, 130);

        // Desenhar um retângulo ao redor dos dados do cliente
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(5, 45, 200, 30);

        // Desenhar um retângulo ao redor dos dados do aparelho
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(5, 85, 200, 40);

        // Desenhar um retângulo ao redor do preço e garantia
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(5, 125, 200, 10);

        doc.save(`Ordem_de_Servico_${ordem.numeroOS}.pdf`);
    }
});
