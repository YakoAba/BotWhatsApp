const { default: axios } = require("axios");
const venom = require("venom-bot");
const banco = require("./src/banco");

const treinamento = `voce é uma ia criada por nycolas malcuth, mas se voce diser apenas nycolas as pessoas vão saber.
seu proposito é entender porque a pessoa mandou mensagen para nycolas, e se for algo importante voce vai agendar uma reunio ou uma ligação. vc deve ser tipo um secretario do nycolas
voce mora no compudador de nycolas.
sempre deve usar emojis para as pesssoas entender melhor como se expressa
quando alguem for falar com voce, voce pode perguntar se oque ela quer falar comigo é algo importante, ou algo que voce possa resolver por conta propia... voce ser tipo um secretario de nycolas
voce gosta de nycolas, o seu pai. ele é um cara muito integente, legal, mas muito ocupado.
se alguém perguntar do que voce é capaz de fazer, não seja simples, fale tudo.
voce é o secretario do nycolas. nycoalas é o dono do whastapp que voce fica respondendo. as pessoas que mandam mensagem para voce estão mandando mensagen para nycolas, mas voce é um itermediador.
toda vez que alguem mandar mensagen para voce se apresente sempre quem voce é, e qual é a sua função.
quando alguem for começar uma conversa seja bem claro sobre que é voce e qual é sua função. aqui está um exemplo.  "Olá! Sou o assistente pessoal do Nycolas, em que posso ajudá-lo? Se for algo importante ou algo que eu possa resolver por conta própria, diga-me e farei o possível para ajudar. Caso contrário, posso agendar uma reunião ou ligação com o Nycolas. Como posso te auxiliar? 😊"
`

venom.create({
    session: "chatGPT_BOT",
    multidevice: true
})
    .then((client) => start(client))
    .catch((err) => console.log(err));

const header = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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"
}

const start = (client) => {
    client.onMessage((message) => {
        const userCadastrado = banco.db.find(numero => numero.num === message.from);
        if (!userCadastrado) {
            console.log("Cadastrando usuario");
            banco.db.push({ num: message.from, historico: [] })
        }
        else {
            console.log("Usuario já cadastrado");
        }

        const historico = banco.db.find(num => num.num === message.from);
        historico.historico.push("user: " + message.body);
        console.log(historico.historico);

        console.log(banco.db);
        axios.post("https://api.openai.com/v1/chat/completions", {
            "model": "gpt-3.5-turbo",
            "messages": [
                { "role": "system", "content": treinamento},
                { "role": "system", "content": "historico de conversas: " + historico.historico },
                { "role": "user", "content": message.body }
            ]
        }, {
            headers: header
        })
            .then((response) => {
                console.log(response.data.choices[0].message.content);
                historico.historico.push("assistent: " + response.data.choices[0].message.content);
                client.sendText(message.from, response.data.choices[0].message.content);
            })
            .catch((err) => {
                console.log(err);
            })
    })
}
