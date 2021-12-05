const jwt = require ('jsonwebtoken');
module.exports = (req, res, next) => {

try{
const token = req.headers.authorization.split (" ")[1];
const tokenDecodificado = jwt.verify(token, "minhasenha");

req.dadosHospital = {
email: tokenDecodificado.email,
idHospital: tokenDecodificado.id
}
next()
}

catch (err){
res.status(401).json({
mensagem: "Autenticação falhou"
})
}
}
