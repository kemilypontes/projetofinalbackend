// npm init -> criar o pacote inicial 
// npm i express
const express = require("express")
const app = express()
app.use(express.json())
const port = 3000

app.get("/aula", (req, res) => {
    // conectar ao banco de dados 
    // ler os dados (SQL Select)
    // retornar os dados na resposta 
})

app.listen(port, ()=>{
    console.log("API rodando porta " + port)
})