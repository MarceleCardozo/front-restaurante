const tabela = document.getElementById("tabela");

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// checo se existe um id no localStorage, se não existir eu não estou logado
if (localStorage.getItem("ID Usuario") === null) {
  window.location.assign("http://127.0.0.1:5500/")
}

async function buscarPrato(event) {
  //serve evitar o comportamento padrão do formulário
  //assim que o formulário é enviado, reseta a página, preventDefault() evita que isso aconteça
  event.preventDefault();

  //pegando o campo de busca
  const busca = event.srcElement.busca.value;

  //   Bloco try/catch serve para tratamento de exceções,
  // tratamento de códigos que podem não ser totalmente
  // atendidos e gerarem alguma exceção/erro.
  try {
    carregarPratos(busca)
  } catch (error) {
    //se der errado envia 'credenciais inváliodas' direto no html
    mensagem.setAttribute("style", "color: red; font-size:25px;");
    mensagem.innerHTML = "Credenciais inválidas";
    console.log(error);
  }
}

// carrega pratos do backend
async function carregarPratos(busca) {
  let url = '/pratos'

  if (busca) {
    url += `?nome=${busca}`
  }

  if (tabela.rows.length > 1) {
    var quantiaDeCabecalhos = 1;
    var quantiaDeLinhas = tabela.rows.length;
    for (var i = quantiaDeCabecalhos; i < quantiaDeLinhas; i++) {
      tabela.deleteRow(quantiaDeCabecalhos);
    }
  }
  const resposta = await instance.get(url)
  const pratos = resposta.data

  pratos.forEach((prato) => {
    const linha = document.createElement('tr')

    const nome = document.createElement('td')
    nome.innerHTML = prato.nome

    const descricao = document.createElement('td')
    descricao.innerHTML = prato.descricao

    const preco = document.createElement('td')
    preco.innerHTML = prato.preco

    linha.appendChild(nome)
    linha.appendChild(descricao)
    linha.appendChild(preco)

    tabela.appendChild(linha)
  })
}

// chamo a função para buscar dados do backend
carregarPratos()
