const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const hospitalSchema = mongoose.Schema({
nome: {type: String, required: true},
cnpj: {type: String, required: true},
cep: {type: String, required: true},
endereco: {type: String, required: true},
estado: {type: String, required: true},
telefone: {type: String, required: true},
  email: {type: String, required: true},
  senha: {type: String, required: true}
})

hospitalSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Hospital", hospitalSchema);
