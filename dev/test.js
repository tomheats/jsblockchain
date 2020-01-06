const Blockchain = require("./blockchain");

const Blockchain1 = new Blockchain();
Blockchain1.createNewBlock(2421, "NFE998s8ajfAJJAW3", "8as3kJKJNm339SFe8");
Blockchain1.createNewBlock(2421, "YUd68DafdJK3GG456", "KJFK38384sfd3J322");

Blockchain1.createNewTransaction(100, "Thomas", "Katie");
Blockchain1.createNewTransaction(45, "David", "Lehner");

Blockchain1.createNewBlock(2421, "KLF883djYUIJ43KJF", "FJK39OpdsfJJ398esJ");

//console.log(Blockchain1);
console.log(Blockchain1.chain[3]["transactions"]);

const blockData = Blockchain1.chain[3]["transactions"];
const hash = "NFE998s8ajfAJJAW3";

console.log(Blockchain1.proofOfWork(hash, blockData));
