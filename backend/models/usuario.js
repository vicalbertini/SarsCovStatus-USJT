const mongoose = require('mongoose');


const usuarioSchema = mongoose.Schema({
  nome: {type: String, required: true},
  cpf: {type: String, required: true},
  email: {type: String, required: true},
  status: {type: String, required: true},
  relatorio: {type: String, required: true},
  criador: {type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true}
});


module.exports = mongoose.model('Paciente', usuarioSchema);
