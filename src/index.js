const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const database = require('./database/db');

/**
 * Middlewares
 */
server.use(bodyParser.json());

/**
 * Listar todos os usuários
 */
server.get('/', (req, res) => {
  //traz todos os dados do banco relacionados a usuários
  res.json(database.usuarios);
});

/**
 * Listar um usuario
 */
server.get('/:id', (req, res) => {
  //pegar o id enviado pela url
  const { id } = req.params;

  //procura se existe o id no banco
  const resultado = database.usuarios.find((user) => {
    return user.id === id ? user : false;
  })

  //testa se houver resultado exibe senão exibe erro
  if (resultado) {
    //retorna 200 se houver resultado
    return res.status(200).json(resultado);
  } else {
    //senão retorna 404 e da erro!
    return res.status(404).json({
      message: `O id informado ${id} não pertence a nenhum usuário da base de dados, favor tente outro :)`,
    })
  }
});

/**
 * Cria usuario
 */
server.post('/', (req, res) => {
  //pega o corpo da requisição, ou seja, os dados que serão cadastrados
  const novoUsuario = req.body;

  //testa se há conteudo no corpo da requisição, se não houver dá erro!
  if (!novoUsuario) {
    return res.state(400).json({ message: "Não foram encontrado dados para input na base, por favor tente novamente!" })
  }
  //grava o usuario na base de dados
  database.usuarios.push(novoUsuario);
  //retorna status 200 e a mensagem de sucesso :)
  return res.status(200).json({ "message": `O novo usuario ${novoUsuario.nome} foi cadastrado com sucesso :)` })
});

/**
 * Edita usuario
 */
server.put('/:id', (req, res) => {
  //pega o id para localiza-lo na base
  const { id } = req.params;
  //pega o corpo da requisição com as alterações
  const usuarioEditado = req.body;

  //Testa se o id e o corpo da requisição estão preenchidos
  if (!id || !usuarioEditado) {
    res.status(400).json({ message: "Id do usuário ou conteúdo da alteração não estão preenchidos, favor verificar" })
  }

  //Pesquisa na base de usuários e retorna em resultado se achou (ou não) algo
  const resultado = database.usuarios.find((user, index) => {
    if(user.id === id){
      //se o id bater com o da base, troca o valor do usuario escolhido (substitui todo o usuario, temos que ver um jeito de ser só os campos escolhidos)
      return database.usuarios[index] = usuarioEditado;
    } else {
      return user = false;
    }
  });

  //testa o resultado
  if(!resultado){
    return res.status(404).json({"message": `O id informado ${id} não corresponde a nenhum registro da base de dados! :()`})
  } else {
    //retorna a mensagem de sucesso
    return res.status(200).json({"message": `O usuário ${id} foi alterado com sucesso ;)`})
  }

});

server.delete('/:id', (req, res) => {
  //pega o id da url
  const { id } = req.params;
  
  // procura se este id pertence a base de dados
  const resposta = database.usuarios.find((user, index) => {
    //testa se os id são iguais
    if(user.id === id){
      //se sim, tira o usuario solicitado
      database.usuarios.splice(index, 1);
      //exibe a mensagem de sucesso
      res.status(200).json({message: `O registro ${id} foi excluido com sucesso! :)`});
    } else {
      //senão seta como false
      return false;
    }
  })

  //testa se a resposta tem conteudo
  if(!resposta){
    // senão tiver, dá erro!
    return res.status(404).json({message: `O registro ${id} não foi localizado na base de dados`});
  }
});

//fica ouvindo o servidor na porta 3000
server.listen(3000, () => {
  // mesagem de informação que o servidor está sendo executado
  console.log('Servidor está rodando na porta 3000, por gentileza insira no seu browser a seguinte url: http://localhost:3000 e seja feliz :)');
});
