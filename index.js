// npm init -> cria o pacote inicial API
// npm i express
const express = require("express")
const app = express()
app.use(express.json())
const port = 3000
// npm i mysql2
const db = require("./db")

app.get("/aula", async (req, res) => {
    try {
        const resultado = await db.pool.query("SELECT * FROM aula")
        res.status(200).json(resultado[0])
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

app.post("/aula", async (req, res) => {
    try {
        //realiza a consulta ao banco de dados:
        const dados = req.body
        const resultado = await db.pool.query(
            "INSERT INTO aula (serie, turma, componente, professor) VALUES (?, ?, ?, ?)",
            [dados.serie, dados.turma, dados.componente, dados.professor]
        )
        res.status(201).json(
            {resultado: "Aula cadastrada, ID = " + resultado[0].insertId}
        )
    } catch (erro) {
        res.status(500).json({erro: erro.message})
    }
})

// delete aula e id
app.delete("/aula/:id", async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await db.pool.query(
            "DELETE FROM aula WHERE id = ?",
            [id]
        )
        // affectedRows = quantas linhas foram apagadas
        if (resultado[0].affectedRows === 0) {
            return res.status(404).json({ erro: "Aula não encontrada" })
        }
        res.status(200).json({ resultado: "Aula deletada com sucesso" })
    } catch (erro) {
        // Se a aula tiver horários vinculados, o MySQL barra com erro de FK
        if (erro.code === "ERRO") {
            return res.status(400).json({
                erro: "Não é possível deletar: existem horários vinculados a esta aula"
            })
        }
        res.status(500).json({ erro: erro.message })
    }
})


// post
app.post("/horario", async (req, res) => {
    try {
        const dados = req.body
        const resultado = await db.pool.query(
            "INSERT INTO horario_aula (idaula, dia_semana, ordem) VALUES (?, ?, ?)",
            [dados.idaula, dados.dia_semana, dados.ordem]
        )
        res.status(201).json({
            resultado: "Horário cadastrado, ID = " + resultado[0].insertId
        })
    } catch (erro) {
        // Erro de chave estrangeira: idaula não existe em aula
        if (erro.code === "ERRO") {
            return res.status(400).json({
                erro: "Não é possível cadastrar horário: a aula informada (idaula) não existe"
            })
        }
        res.status(500).json({ erro: erro.message })
    }
})

// get
app.get("/horario/:dia", async (req, res) => {
    try {
        const { dia } = req.params
        // JOIN para trazer os dados da aula junto com o horário 
        const resultado = await db.pool.query(
            `SELECT h.id, h.dia_semana, h.ordem,
                    a.serie, a.turma, a.componente, a.professor
             FROM horario_aula h
             INNER JOIN aula a ON a.id = h.idaula
             WHERE h.dia_semana = ?`,
            [dia]
        )
        if (resultado[0].length === 0) {
            return res.status(404).json({ erro: "Nenhum horário encontrado para esse dia" })
        }
        res.status(200).json(resultado[0])
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})

// delete horario e id
app.delete("/horario/:id", async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await db.pool.query(
            "DELETE FROM horario_aula WHERE id = ?",
            [id]
        )
        if (resultado[0].affectedRows === 0) {
            return res.status(404).json({ erro: "Horário não encontrado" })
        }
        res.status(200).json({ resultado: "Horário deletado com sucesso" })
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})


app.listen(port, () => {
    console.log("API rodando na porta " + port)
})

// No Rapid Client:
// GET http://127.0.0.1:3000/aula
