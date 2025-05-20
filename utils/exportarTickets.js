const fs = require('fs');
const path = require('path');
const db = require("../db/conect");

function exportarTickets(callback){
    const sql = "SELECT id_ticket, id_user, message FROM tickets";

    db.query(sql, (err, results) => {
        if(err){ return callback(err);}

        const grupos = {};

        results.forEach(({id_ticket, id_user, message})=> {
            if(!grupos[id_ticket]){
                grupos[id_ticket] = [];
            }
            grupos[id_ticket].push(`Usuário: ${id_user}\nMensagem: ${message}\n`);
        })

        const pasta = path.join(__dirname, '../exportados');
        if(!fs.existsSync(pasta)){
            fs.mkdirSync(pasta);
        }

        for(const id in grupos){
            const conteudo = grupos[id].join('\n-------\n');
            const caminho = path.join(pasta, `ticket_${id}.txt`);
            fs.writeFileSync(caminho, conteudo, 'utf8');
        }

        callback(null);
    })
}

exportarTickets((err) => {
    if(err){
        console.log('Erro ao exportar os tickets: ', err);
    }else{
        console.log('Arquivos gerados com sucesso!');
    }


    db.end();
})