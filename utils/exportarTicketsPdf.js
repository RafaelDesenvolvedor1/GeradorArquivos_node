const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
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
            grupos[id_ticket].push({id_user, message});
        })

        const pasta = path.join(__dirname, '../exportadosPDF');
        if(!fs.existsSync(pasta)){
            fs.mkdirSync(pasta);
        }

        for(const id in grupos){
            const doc = new PDFDocument();
            const caminho = path.join(pasta, `ticket_${id}.pdf`);
            const stream = fs.createWriteStream(caminho);
            doc.pipe(stream);

            doc.fontSize(20).text(`Ticket ID: ${id}\n\n`, {underline: true});

            grupos[id].forEach(({id_user, message}, index)=>{
                doc 
                    .fontSize(12)
                    .text(`Usuário ${id_user}`, {continued: true})
                    .text(`  |  Mensagem: ${message}\n`, {indent: 20});

                if(index < grupos[id].length - 1){
                    doc.moveDown(0.5).text('----------------------');
                }
            })

            doc.end();
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