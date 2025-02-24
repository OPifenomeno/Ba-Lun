
const balao = document.getElementById('balao');
const balaoW = parseInt(window.getComputedStyle(balao).width, 10);
const balaoH = parseInt(window.getComputedStyle(balao).height, 10);
const maxBalao = balaoW*2
const olho = document.getElementById('olhos')
const chat = document.getElementById('MsgBox')
var enchendo = false;
var currWidth;
let limit = 5

balao.addEventListener('animationstart',async (anim)=>{
if (anim.animationName=='estourando'){
document.body.style.transition='5s'
document.body.style.boxShadow = "0px 0px 200px 150px inset black"

if (limit <= 5){
    response = await fetch('/getResponse',{
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({role:"system",message:"Você está enchendo até quase estourar"})
    })
    const data = await response.json()
    chat.innerText = data.result
    box.value = ''
}else{
    chat.value =''
}

}
})

document.getElementById('balao').addEventListener('mousedown',()=>{
    enchendo = true;
    aumentarBalao()
});
document.getElementById('balao').addEventListener('mouseup',()=>{
    enchendo =false;
    balao.style.animation = 'flutuando 2s ease-in-out infinite alternate'
    document.body.style.boxShadow = "0px 0px  100px inset black"
    document.body.style.transition= '1s'
    diminuirBalao();
});
document.addEventListener('mousemove',seguirMouse)
document.getElementById('btnEnviar').addEventListener('mousedown',sendMessage)
document.addEventListener('DOMContentLoaded',async ()=>{
        const now = new Date()
        if(localStorage.getItem('vivo')==null){
            localStorage.setItem('vivo',true)
                                }
        if(localStorage.getItem('vivo') == false){
            window.location.href = "/adeus.html"
        }
        

        let message = "Emilly chegou"
        if(localStorage.getItem("ultimaVez") != undefined){
             message = "Emilly chega pela primeira vez: " +now.toUTCString
        }else{
             message = `Emilly retornou. Ultima vez: ${localStorage.getItem('ultimaVez')} || Agora: ${now.toUTCString}`
        }
        response = await fetch('/getResponse',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({role:"system",message:message})
        })
        const data = await response.json()
        chat.innerText = data.result
})


function seguirMouse(event) {
        const olho = document.getElementById('olhos')
        const rect = olho.getBoundingClientRect();

        // Definir os limites do olho
        const left = rect.left;
        const right = rect.right;
        const top = rect.top;
        const bottom = rect.bottom;

        const cursorX = event.clientX;
        const cursorY = event.clientY;

        // Verifica se o cursor está fora do retângulo do olho
        if (cursorX < left || cursorX > right || cursorY < top || cursorY > bottom) {
           olho.style.transition = '0.1s'
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = cursorX - centerX;
            const deltaY = cursorY - centerY;
            const angle = Math.atan2(deltaY, deltaX);
            const maxMove = 20; 
            
            olho.style.transform = `translate(${Math.cos(angle) * maxMove}px, ${Math.sin(angle) * maxMove}px)`;
        } else {
      
            olho.style.transition = '0.5s'
            olho.style.transform = `translate(0px, 0px)`;

        }
    ;
}

// Adiciona o evento de movimento do mouse
document.addEventListener('mousemove', seguirMouse);

function aumentarBalao(){
    if (!enchendo) return;
 
    currWidth = parseInt(window.getComputedStyle(balao).width,10)
    balao.style.width = (currWidth+ (maxBalao*0.50 - currWidth*0.50)+4) +'px';
     
    if(currWidth > balaoW * 1.50){ 
         olho.style.filter = 'blur(9px)'
        balao.style.animation = 'flutuando 2s ease-in-out infinite alternate,' +
            'estourando 0.1s linear infinite'
        
    }
    if(currWidth >= maxBalao){
        balao.style.visibility = 'hidden';
        let rost = document.getElementById('olhos')
        rost.style.transition = 0+'s';
        rost.style.visibility = 'hidden';
        localStorage.setItem('vivo',false)

        document.body.style.transition = '5s'
        document.body.style.backgroundColor = "rgb(80, 80, 80)"
        document.body.style.boxShadow = "0px 0px 1200px 300px inset black"

        setTimeout(() => {
                document.getElementById('chat').style.transition = '6s'
                document.getElementById('chat').style.left = '-100%'
                setTimeout(function() {
                    window.location.href = '/adeus.html'
                }, 8000);
        }, 2000);

        
    }


    requestAnimationFrame(aumentarBalao)
}
function diminuirBalao(){
    currWidth = parseInt(window.getComputedStyle(balao).width,10)
    
    if(currWidth>balaoW && !enchendo){
       olho.style.filter = 'blur(0px)'
        balao.style.width = currWidth - (currWidth - balaoW) +'px'
        requestAnimationFrame(diminuirBalao)
    }
}

async function sendMessage() {
    const box = document.getElementById('userMsgBox')
    if(box.value != ''){
        response = await fetch('/getResponse',{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({role:"user",message:box.value})
        })
        const data = await response.json()
        chat.innerText = data.result
        box.value = ''
    }
}
