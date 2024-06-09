document.addEventListener('DOMContentLoaded', function() {
    const formOS = document.getElementById('formOS');
    const tabelaOS = document.getElementById('tabelaOS').getElementsByTagName('tbody')[0];
    const inputPesquisa = document.getElementById('pesquisa');
    let ordemEmEdicaoId = null;

    // Carrega ordens de serviço do Firestore
    function carregarOrdensServico() {
        db.collection('ordensServico').get().then(querySnapshot => {
            const ordensServico = [];
            querySnapshot.forEach(doc => {
                ordensServico.push({ id: doc.id, ...doc.data() });
            });
            atualizarTabela(ordensServico);
        });
    }

    formOS.addEventListener('submit', function(event) {
        event.preventDefault();

        const novaOS = {
            numeroOS: formOS.numeroOS.value || Date.now().toString(), // Usa timestamp se não houver número
            nome: formOS.nome.value,
            endereco: formOS.endereco.value,
            telefone: formOS.telefone.value,
            aparelho: formOS.aparelho.value,
            defeito: formOS.defeito.value,
            pecas: formOS.pecas.value,
            preco: formOS.preco.value
        };

        if (ordemEmEdicaoId) {
            db.collection('ordensServico').doc(ordemEmEdicaoId).set(novaOS).then(() => {
                carregarOrdensServico();
                ordemEmEdicaoId = null;
                formOS.reset();
            });
        } else {
            db.collection('ordensServico').add(novaOS).then(() => {
                carregarOrdensServico();
                formOS.reset();
            });
        }
    });

    inputPesquisa.addEventListener('input', function() {
        const filtro = inputPesquisa.value.toLowerCase();
        db.collection('ordensServico').get().then(querySnapshot => {
            const ordensFiltradas = [];
            querySnapshot.forEach(doc => {
                const ordem = { id: doc.id, ...doc.data() };
                if (ordem.numeroOS.toLowerCase().includes(filtro) ||
                    ordem.nome.toLowerCase().includes(filtro) ||
                    ordem.telefone.toLowerCase().includes(filtro) ||
                    ordem.aparelho.toLowerCase().includes(filtro) ||
                    ordem.defeito.toLowerCase().includes(filtro) ||
                    ordem.pecas.toLowerCase().includes(filtro)) {
                    ordensFiltradas.push(ordem);
                }
            });
            atualizarTabela(ordensFiltradas);
        });
    });

    function atualizarTabela(ordens) {
        tabelaOS.innerHTML = '';
        ordens.forEach(function(ordem) {
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
                editarOrdemServico(ordem);
            });
            newRow.querySelector('.btnApagar').addEventListener('click', function() {
                apagarOrdemServico(ordem.id);
            });
            newRow.querySelector('.btnBaixarPDF').addEventListener('click', function() {
                baixarPDF(ordem);
            });
        });
    }

    function editarOrdemServico(ordem) {
        formOS.numeroOS.value = ordem.numeroOS;
        formOS.nome.value = ordem.nome;
        formOS.endereco.value = ordem.endereco;
        formOS.telefone.value = ordem.telefone;
        formOS.aparelho.value = ordem.aparelho;
        formOS.defeito.value = ordem.defeito;
        formOS.pecas.value = ordem.pecas;
        formOS.preco.value = ordem.preco;

        ordemEmEdicaoId = ordem.id;
    }

    function apagarOrdemServico(id) {
        db.collection('ordensServico').doc(id).delete().then(() => {
            carregarOrdensServico();
        });
    }

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

    // Carrega as ordens de serviço ao carregar a página
    carregarOrdensServico();
});

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firestore
  const db = firebase.firestore();
  