document.addEventListener('DOMContentLoaded', function() {
    const formOS = document.getElementById('formOS');
    const tabelaOS = document.getElementById('tabelaOS').getElementsByTagName('tbody')[0];
    let ordensServico = [];

    // Verifica se já existem dados salvos no localStorage
    if (localStorage.getItem('ordensServico')) {
        ordensServico = JSON.parse(localStorage.getItem('ordensServico'));
        atualizarTabela();
    }

    formOS.addEventListener('submit', function(event) {
        event.preventDefault();

        const numeroOS = document.getElementById('numeroOS').value;
        const nome = document.getElementById('nome').value;
        const endereco = document.getElementById('endereco').value;
        const telefone = document.getElementById('telefone').value;
        const aparelho = document.getElementById('aparelho').value;
        const defeito = document.getElementById('defeito').value;
        const pecas = document.getElementById('pecas').value;
        const preco = document.getElementById('preco').value;

        // Adiciona a nova ordem de serviço ao array
        ordensServico.push({
            numeroOS,
            nome,
            endereco,
            telefone,
            aparelho,
            defeito,
            pecas,
            preco
        });

        // Salva os dados no localStorage
        localStorage.setItem('ordensServico', JSON.stringify(ordensServico));

        // Atualiza a tabela
        atualizarTabela();

        formOS.reset();
    });

    // Função para atualizar a tabela com os dados salvos
    function atualizarTabela() {
        tabelaOS.innerHTML = '';
        ordensServico.forEach(function(ordem, index) {
            const newRow = tabelaOS.insertRow();
            const cells = [
                newRow.insertCell(0),
                newRow.insertCell(1),
                newRow.insertCell(2),
                newRow.insertCell(3),
                newRow.insertCell(4),
                newRow.insertCell(5),
                newRow.insertCell(6),
                newRow.insertCell(7)
            ];

            cells[0].innerText = ordem.numeroOS;
            cells[1].innerText = ordem.nome;
            cells[2].innerText = ordem.telefone;
            cells[3].innerText = ordem.aparelho;
            cells[4].innerText = ordem.defeito;
            cells[5].innerText = ordem.pecas;
            cells[6].innerText = `R$ ${ordem.preco}`;

            // Adiciona o botão de apagar
            const botaoApagar = document.createElement('button');
            botaoApagar.innerText = 'Apagar';
            botaoApagar.addEventListener('click', function() {
                apagarOrdemServico(index);
            });
            cells[7].appendChild(botaoApagar);
        });
    }

    // Função para apagar uma ordem de serviço específica
    function apagarOrdemServico(index) {
        ordensServico.splice(index, 1);
        localStorage.setItem('ordensServico', JSON.stringify(ordensServico));
        atualizarTabela();
    }
});
