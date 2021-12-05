require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
app.use(cors());
app.use(express.json());
const bcrypt = require ('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('./models/usuario');
const Hospital = require('./models/hospital');
const checkAuth = require ('./middleware/check-auth');
//const io = require('socket.io-client')
//let socket = io.connect("http://localhost:3000")



const user_db = process.env.MONGODB_USER;
const pass_db = process.env.MONGODB_PASSWORD;
const cluster_db = process.env.MONGODB_CLUSTER;
const name_db = process.env.MONGODB_DATABASE;

mongoose.connect(`mongodb+srv://${user_db}:${pass_db}@${cluster_db}.mongodb.net/${name_db}?retryWrites=true&w=majority`)
.then(() => {
  console.log("Conexão OK");
}).catch(() => {
  console.log("Erro ao conectar-se com o Banco de Dados");
})


app.post('/api/usuarios', checkAuth, (req, res, next) => {
  const usuario = new Usuario({
    nome: req.body.nome,
    cpf: req.body.cpf,
    email: req.body.email,
    status: req.body.status,
    relatorio: req.body.relatorio,
    criador: req.dadosHospital.idHospital
  })
  usuario.save().
  then (usuarioInserido => {
  res.status(201).json({
  mensagem: 'Paciente inserido',
  usuario:{
    id: usuarioInserido._id,
    nome: usuarioInserido.nome,
    cpf: usuarioInserido.cpf,
    email: usuarioInserido.email,
    status: usuarioInserido.status,
    relatorio: usuarioInserido.relatorio
  }
  })
  })
});

app.get('/api/usuarios', (req, res, next) => {
  Usuario.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      mensagem: "Tudo OK",
      usuarios: documents
    });
  })
});


app.delete ('/api/usuarios/:id', checkAuth, (req, res, next) => {
  Usuario.deleteOne ({_id: req.params.id}).then((resultado) => {
  console.log (resultado);
  res.status(200).json({mensagem: "Paciente removido"})
  });
  });




  app.get("/api/usuarios/:id",  (req, res, next) =>{

    Usuario.findOne({_id: req.params.id}).then((resultado) => {
      console.log (resultado);
      res.status(200).json({usuario: resultado})


    });
    });



  app.put('/api/usuarios/:id', checkAuth, (req, res, next) => {
    const usuario = new Usuario({
      _id: req.params.id,
      nome: req.body.nome,
      cpf: req.body.cpf,
      email: req.body.email,
      status: req.body.status,
      relatorio: req.body.relatorio
    });
    Usuario.updateOne({_id: req.params.id}, usuario)
    .then((resultado) => {
      console.log(resultado);
    }).catch((err) => {
      console.log(err);
    });
    res.status(200).json({mensagem: 'Atualização realizada com sucesso'});
  })


  //----------------------Chat Real-Time--------------------------
/*
  socket.on("welcome", (data) => {
    console.log("received: ", data)
  })

  socket.emit("joinRoom", "");

  socket.on("err", (err) => console.log(err));

  socket.on("err", (sucess) => console.log(sucess));

*/



//----------------------Sistema de autenticação-----------------


  app.post('/api/hospitais/cadastro', (req, res, next) => {
    bcrypt.hash (req.body.senha, 10)
    .then(hash => {
      const hospital = new Hospital({
        nome: req.body.nome,
        cnpj: req.body.cnpj,
        cep: req.body.cep,
        endereco: req.body.endereco,
        estado: req.body.estado,
        telefone: req.body.telefone,
        email: req.body.email,
        senha: hash
      })
      hospital.save()
    .then(result => {
    res.status(201).json({
    mensagem: "Hospital criado",
    resultado: result
    });
    })
    .catch(err => {
    res.status(500).json({
    erro: err
    })
    })
    })
    });


  app.post('/api/hospitais/login', (req, res, next) => {
    let hospitalUser;
    Hospital.findOne({ cnpj: req.body.cnpj }).then(u => {
      hospitalUser = u;
      if (!u) {
      return res.status(401).json({
      mensagem: "cnpj inválido"
      })
      }
      return bcrypt.compare(req.body.senha, u.senha);
      })
      .then(result => {
        if(!result){
          return res.status(401).json({
            mensagem: "senha inválida"
          })
        }
        const token = jwt.sign(
          {cnpj: hospitalUser.cnpj, id: hospitalUser._id},
          'minhasenha',
          {expiresIn: '1h'}
        )
        res.status(200).json({token: token,
        expiresIn: 3600
        })
      })
      .catch(err => {
        return res.status(401).json({
          mensagem: "Login falhou" + err
        })
      })
      })





app.post('/api/usuarios/login', (req, res, next) => {
  let pacienteUser;
  Usuario.findOne({ cpf: req.body.cpf }).then(k => {
    pacienteUser = k;
    if (!k) {
    return res.status(401).json({
    mensagem: "cpf inválido"
    })
    }
    else if(!k){
      return res.status(401).json({
        mensagem: "id inválido"
        })
    }
    const tokenAuth = jwt.sign(
      {cpf: pacienteUser.cpf, id: pacienteUser._id},
      'meuid',
      {expiresIn: '1h'}
    )
    res.status(200).json({tokenAuth: tokenAuth,
      expiresIn: 3600
      })
    })
    .catch(err => {
      return res.status(401).json({
        mensagem: "Login falhou" + err
      })
    })
    })






module.exports = app;
