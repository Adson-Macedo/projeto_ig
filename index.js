const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const storage = {
    alunosCont: 0,
    alunos: [],
    projetosCont: 0,
    projetos: [],

    gerarIdAluno() {
        return ++this.alunosCont
    },
    gerarIdProjeto() {
        return ++this.projetosCont
    },
    encontrarAlunoPeloId(idAluno) {
        return this.alunos.filter(al => al.id === parseInt(idAluno))[0]
    },
    encontrarProjetoPeloId(idProjeto) {
        return this.projetos.filter(pr => pr.id === parseInt(idProjeto))[0]
    },
    criarAluno(aluno){
        const novoAluno = {id: this.gerarIdAluno(), ...aluno}
        this.alunos.push(novoAluno)
        return novoAluno
    },
    criarProjeto(projeto){
        const novoProjeto = {id: this.gerarIdProjeto(), ...projeto, alunos: []}
        this.projetos.push(novoProjeto)

        return novoProjeto
    },
    adicionarAlunoAoProjeto(idAluno, idProjeto) {
        const aluno = this.encontrarAlunoPeloId(idAluno)
        const projeto = this.encontrarProjetoPeloId(idProjeto)
        
        projeto.alunos.push(aluno)
        
        return projeto
    },
    adicionarAlunosAoProjeto(alunos, idProjeto) {
        const projeto = this.encontrarProjetoPeloId(idProjeto)
        alunos.map(idAluno => this.encontrarAlunoPeloId(idAluno))
                .forEach(aluno => projeto.alunos.push(aluno))
        return projeto
    },
    getAlunosDoProjeto(idProjeto) {
        const projeto = this.projetos.filter(pr => pr.id === idProjeto)[0]
        return projeto.alunos
    }
}

app.use(express.static('.'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/alunos', (req, res) => 
    res.send(storage.alunos))

app.get('/alunos/:id', (req, res) => 
    res.send(storage.encontrarAlunoPeloId(req.params.id)))

app.post('/alunos', (req, res) => 
    res.send(storage.criarAluno(req.body)))

app.get('/projetos', (req, res) => {
    const projetos = [...storage.projetos]
    
    projetos.map(projeto => {
        delete projeto.alunos
    })
    
    res.send(projetos)
})

app.get('/projetos/:id', (req, res) => 
    res.send(storage.encontrarProjetoPeloId(req.params.id)))

app.post('/projetos', (req, res) =>
    res.send(storage.criarProjeto(req.body)))

app.get('/projetos/:id/alunos', (req, res) => 
    res.send(storage.getAlunosDoProjeto(req.params.id)))

app.post('/projetos/:id/alunos', (req, res) => 
    res.send(storage.adicionarAlunosAoProjeto(req.body.idAlunos, req.params.id)))

app.listen(3000, () => console.log('Servidor Executando...'))