import express from 'express'; 
import path from 'path';
import { OpenAI } from 'openai'; 
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs'
import os from 'os'
dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const historyPath = path.join(os.tmpdir,'chat_history.json')
const app = express();
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
let hisMessages = []



if(fs.existsSync(historyPath)){
    const fileData = fs.readFileSync(historyPath,'utf-8')
    hisMessages = JSON.parse(fileData)
}

app.get('/',(req,res)=>{
    
    if(localStorage.getItem(vivo)){
        
    res.sendFile(path.join(__dirname,'public','index.html'))
    }else{
        res.sendFile(path.join(__dirname,'public','adeus.html'))
    }

})
process.on('exit',saveHistory)
process.on('SIGINT',()=>{
    saveHistory();
    process.exit()
})
function saveHistory(){
    let date = new Date()
    fs.writeFileSync(historyPath,JSON.stringify(hisMessages,null,2),'utf-8')

}

app.post('/getResponse',async (req,res)  =>{
    try{
    if (hisMessages.length == 0 && !fs.existsSync(historyPath)){
        hisMessages.push({role:"system",content:process.env.PERSONALITY})
    }
    else{hisMessages.push({role:req.body.role,content:req.body.message})}
    }catch(erro){console.log('DEU ERRO AQUI LINHA')}
    try{
    const client = new OpenAI({baseURL:process.env.ENDPOINT ,apiKey:process.env.API_KEY})

    const response = await client.chat.completions.create({
        messages:hisMessages,
        temperature:1.0,
        top_p:1.0,
        max_tokens:1000,
        model:"gpt-4o"
    })
    const reply = response.choices[0].message.content
    hisMessages.push({role:"assistant",content:reply})
    
    console.log(hisMessages)
    
    
    res.json({result:reply})
}catch(errao){
    console.log("cabo os token se pa")
    res.json({result:"Zzz... (Seu balãozinho desmaiou por usar muito gás hélio, volte amanhã)"})
}
})

app.listen(process.env.PORT || 3000,()=>console.log(`http://localhost:3000`))
