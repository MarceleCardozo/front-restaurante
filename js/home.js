const tabela = document.getElementById("tabela");

tabela.classList.add("table-striped");
const menuPaginacao = document.getElementById("menu_paginacao");
let pagina = 1;

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// checo se existe um id no localStorage, se não existir eu não estou logado
if (localStorage.getItem("ID Usuario") === null) {
  window.location.assign("http://127.0.0.1:5501/");
}

async function atualizarPrato(id) {
  const novoNomePrato = window.prompt("Insira o novo nome do prato.");
  const novaDescricaoPrato = window.prompt("Insira a nova descrição do prato.");
  const novoPrecoPrato = window.prompt("Insira o novo preço do prato.");

  await instance.put(
    `/pratos/${id}`,
    {
      nome: novoNomePrato,
      descricao: novaDescricaoPrato,
      preco: novoPrecoPrato,
    },
    {
      headers: {
        authorization: localStorage.getItem("ID Usuario"),
      },
    }
  );

  carregarPratos();
}

async function apagarPrato(id) {
  await instance.delete(`/pratos/${id}`, {
    headers: {
      authorization: localStorage.getItem("ID Usuario"),
    },
  });

  carregarPratos();
}

function adicionarPratosTabela(pratos) {
  if (tabela.rows.length > 1) {
    var quantiaDeCabecalhos = 1;
    var quantiaDeLinhas = tabela.rows.length;

    for (var i = quantiaDeCabecalhos; i < quantiaDeLinhas; i++) {
      tabela.deleteRow(quantiaDeCabecalhos);
    }
  }

  pratos.forEach((prato) => {
    const linha = document.createElement("tr");

    const celulaNome = document.createElement("td");
    celulaNome.innerHTML = prato.nome;

    const celulaDescricao = document.createElement("td");
    celulaDescricao.innerHTML = prato.descricao;

    const celulaPreco = document.createElement("td");
    celulaPreco.innerHTML = prato.preco;

    const celulaEditar = document.createElement("td");
    const botaoEditar = document.createElement("button");
    botaoEditar.innerHTML = "Editar";
    botaoEditar.classList.add("btn", "btn-editar", "my-2");
    // Usamos uma arrow function pra que a função seja executada apenas no click
    // Não quando o código rodar
    botaoEditar.addEventListener("click", () => atualizarPrato(prato.id));
    celulaEditar.appendChild(botaoEditar);

    const celulaApagar = document.createElement("td");
    const botaoApagar = document.createElement("button");
    botaoApagar.innerHTML = "Apagar";
    botaoApagar.classList.add("btn", "btn-apagar", "my-2");
    botaoApagar.addEventListener("click", () => apagarPrato(prato.id));
    celulaApagar.appendChild(botaoApagar);

    linha.appendChild(celulaNome);
    linha.appendChild(celulaDescricao);
    linha.appendChild(celulaPreco);
    linha.appendChild(celulaEditar);
    linha.appendChild(celulaApagar);

    tabela.appendChild(linha);
  });
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
    carregarPratos(busca);
  } catch (error) {
    //se der errado envia 'credenciais inváliodas' direto no html
    mensagem.setAttribute("style", "color: red; font-size:25px;");
    mensagem.innerHTML = "Credenciais inválidas";
    console.log(error);
  }
}

async function criarPrato(event) {
  console.log(event);
  //serve evitar o comportamento padrão do formulário
  //assim que o formulário é enviado, reseta a página, preventDefault() evita que isso aconteça
  event.preventDefault();

  //pegando o campo de busca
  const nome = event.srcElement.nome.value;
  const descricao = event.srcElement.descricao.value;
  const preco = event.srcElement.preco.value;

  const resposta = await instance.post(
    "/pratos",
    {
      nome,
      descricao,
      preco,
    },
    {
      headers: {
        authorization: localStorage.getItem("ID Usuario"),
      },
    }
  );

  const pratos = resposta.data;
  adicionarPratosTabela(pratos);
}

// carrega pratos do backend
async function carregarPratos(busca) {
  let url = `/pratos`;

  if (busca) {
    url += `?nome=${busca}&pagina=1`;
  } else {
    url += `?pagina=${pagina}`;
  }

  const resposta = await instance.get(url);
  const pratos = resposta.data.pratos;

  adicionarPratosTabela(pratos);
}

function voltar() {
  pagina--;
  carregarPratos();
}

function proximo() {
  pagina++;
  carregarPratos();
}

function criarMenuPaginacao() {
  const botaoAnterior = document.createElement("button");
  botaoAnterior.innerHTML = "Anterior";
  botaoAnterior.classList.add("btn-editar");
  botaoAnterior.addEventListener("click", voltar);

  const botaoProximo = document.createElement("button");
  botaoProximo.innerHTML = "Próximo";
  botaoProximo.classList.add("btn-apagar");
  botaoProximo.addEventListener("click", proximo);

  menuPaginacao.appendChild(botaoAnterior);
  menuPaginacao.appendChild(botaoProximo);
}

// chamo a função para buscar dados do backend
carregarPratos();

// chamo a função para criar o menu de paginação
criarMenuPaginacao();
