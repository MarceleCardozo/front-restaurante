const mensagem = document.getElementById("mensagem");

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// checo se existe um id no localStorage, se existir eu estou logado
if (localStorage.getItem("ID Usuario") !== null) {
  window.location.assign("http://127.0.0.1:5500/home.html")
}

//ela é chamada quando o formulário é enviado
//async lidar com o evento do login e vai esperar uma promise
async function logar(event) {
  //serve evitar o comportamento padrão do formulário
  //assim que o formulário é enviado, reseta a página, preventDefault() evita que isso aconteça
  event.preventDefault();

  //pegando o email e a senha do input
  const email = event.srcElement.email.value;
  const senha = event.srcElement.senha.value;

  //   Bloco try/catch serve para tratamento de exceções,
  // tratamento de códigos que podem não ser totalmente
  // atendidos e gerarem alguma exceção/erro.
  try {
    // await espera a promise ser resolvida antes de continuar
    // executando a função
    const resposta = await instance.post("/usuarios/login", {
      email,
      senha,
    });

    const usuarioid = resposta.data.usuarioId;
    //se der tudo certo envia o id direto no html
    mensagem.setAttribute("style", "color: blue; font-size:25px;");
    mensagem.innerHTML = usuarioid;

    // adiciono o id no localStorage
    localStorage.setItem("ID Usuario", usuarioid);

    // movo o usuário pra homepage
    window.location.assign("http://127.0.0.1:5500/home.html")
  } catch (error) {
    //se der errado envia 'credenciais inváliodas' direto no html
    mensagem.setAttribute("style", "color: red; font-size:25px;");
    mensagem.innerHTML = "Credenciais inválidas";
    console.log(error);
  }
}

//coloque seu mouse aqui
