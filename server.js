const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const storage = {
    alunosCont: 2,
    alunos: [
        {   //  mock
            id: 1,
            nome: "Thairam Michel",
            email: "thairam.michel@aluno.uepb.edu.br",
            matricula: "000000000",
            idade: 25,
            curso: "Ciencia da Computação"
        },    
        {   //  mock
            id: 2,
            nome: "Adson Macêdo",
            email: "adson.macedo@aluno.uepb.edu.br",
            matricula: "111111111",
            idade: 36,
            curso: "Ciencia da Computação"
        },    
    ],
    projetosCont: 2,
    projetos: [
        {   //mock
            id: 1,
            descricao: "Teste de Software",
            orientador: "Sabrina Souto",
            duracao: 5,
            alunos: []
        },    
        {   //mock
            id: 2,
            descricao: "Teste Automation",
            orientador: "Thairam Michel",
            duracao: 1,
            alunos: []
        }    
    ],

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

        if (aluno && projeto && !projeto.alunos.filter(aluno => idAluno === aluno.id).length)
            projeto.alunos.push(aluno)
        
        return projeto
    },
    removerAlunoDoProjeto(idAluno, idProjeto) {
        const aluno = this.encontrarAlunoPeloId(idAluno)
        const projeto = this.encontrarProjetoPeloId(idProjeto)
        
        aluno && projeto && delete projeto.alunos.splice(projeto.alunos.indexOf(aluno), 1)
        
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

app.post('/alunos', (req, res) => {
    const nome = req.body.nome

    if (storage.alunos.filter(aluno => nome === aluno.nome).length){
        res.sendStatus(409)
    }else{
        res.send(storage.criarAluno(req.body))
    }
})

app.get('/projetos', (req, res) => {
    const projetos = []

    storage.projetos.forEach(projeto => {
        const newProj = {...projeto}
        projetos.push(newProj)
    })
    
    projetos.map(projeto => {
        delete projeto.alunos
    })
    
    res.send(projetos)
})

app.get('/projetos/:id', (req, res) => 
    res.send(storage.encontrarProjetoPeloId(parseInt(req.params.id))))

app.post('/projetos', (req, res) =>
    res.send(storage.criarProjeto(req.body)))

app.get('/projetos/:id/alunos', (req, res) => 
    res.send(storage.getAlunosDoProjeto(parseInt(req.params.id))))

app.post('/projetos/:id/alunos', (req, res) => 
    res.send(storage.adicionarAlunoAoProjeto(parseInt(req.body.idAluno), parseInt(req.params.id))))

app.delete('/projetos/:id/alunos', (req, res) => 
    res.send(storage.removerAlunoDoProjeto(parseInt(req.body.idAluno), parseInt(req.params.id))))

app.listen(3000, () => console.log('Servidor Executando...'))