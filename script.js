const inputslider=document.querySelector("[data-LengthSlider]");
const lengthDisplay=document.querySelector("[data-LengthNo]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[dataCopy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercase=document.querySelector("#Upcase");
const lowercase=document.querySelector("#Locase");
const numbers=document.querySelector("#No");
const symb=document.querySelector("#symbols");
const indicator=document.querySelector("[dataIndicator]");
const gntbtn=document.querySelector(".generate-btn");
const allcheck=document.querySelectorAll("inpu[type=checkbox]");
const symbolsAll='!@#$%^&*_+`~",.?<>,.';


let password="";
let passwordLength=10;
let checkcount=1;
handleslider(); 
setindicator("#ccc");
function handleslider(){
    inputslider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.boxShadow=((passwordLength-min)*100/(max-min))+"% 100%"
}
function setindicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRandomInt(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRandomInt(97,128));
}
function generateUppercase(){
    return String.fromCharCode(getRandomInt(65,91));
}
function generateSymbols(){
    const rndNo=getRandomInt(0,symbolsAll.length);
    return symbolsAll.charAt(rndNo);
}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSymbol=false;
    if(uppercase.checked) hasUpper=true;
    if(lowercase.checked) hasLower=true;
    if(numbers.checked) hasNum=true;
    if(symbolsAll.checked) hasSymbol=true;

    if(hasUpper&&hasLower&&(hasNum||hasSymbol)&&passwordLength>=0)
    {
        setindicator("#0f0");
    }
    else if((hasLower||hasUpper)&&(hasNum||hasSymbol)&&passwordLength>=6)
    {
        setindicator("#ff0");
    }
    else
    {
        setindicator("#f00");   
    }
}
// this function makes no effect bcoz css is not added till now 
async function copyCont(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}   
// for shuffling the password 
function shufflePass(Array){
    for(let i=Array.length-1;i>0;i--){
        // finding j randomly 
        const j=Math.floor(Math.random()*(i+1));
        // then swap it 
        const temp=Array[i];
        Array[i]=Array[j];
        Array[j]=temp;

    }
    // adding the password to the empty string and return it 
    let str="";
    Array.forEach((el)=>(str+=el));
    return str;
}
function handleCheckBoxChange(){
    checkcount=0;
    allcheck.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
    });
    if(passwordLength<checkcount){
        passwordLength=checkcount; 
        handleslider();
    }
}
allcheck.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
inputslider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleslider();
})
copybtn.addEventListener('click',()=>{
    if(password.length){
         copyCont();
    }
})
gntbtn.addEventListener('click',()=>{
    // none of the checkbox are selected 
    if(checkcount<=0) return;

    if(passwordLength<checkcount) {
        passwordLength=checkcount;
        handleslider();
    }

    // startig to finnd the new password 
    // remove old password 
    password="";
    
    // if(uppercase.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaser.checked){
    //     password+=generateLowercase();
    // }
    // if(symb.checked){
    //     password+=generateSymbols();
    // }
    // if(numbers.checked){
    //     password+=generateRandomNumber();
    // }
    let funcArry=[];

    if(uppercase.checked)
        funcArry.push(generateUppercase);

    if(lowercase.checked)
        funcArry.push(generateLowercase);
        
    if(symb.checked)
        funcArry.push(generateSymbols);
    
    if(numbers.checked)
        funcArry.push(generateRandomNumber);
        
    // compulsory addition 
    for(let i=0;i<funcArry.length;i++){
        password+=funcArry[i]();
    }
    // remaining addition 
    for(let i=0;i<passwordLength-funcArry.length;i++){
        let randIndex=getRandomInt(0,funcArry.length);
        password+=funcArry[randIndex]();
    }
    // shuffle the password 
    password=shufflePass(Array.from(password));

    // show inn the inputt 
    passwordDisplay.value=password;
    calcStrength(); 
})
