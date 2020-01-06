const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1")

const nodeAdress = uuid().split("-").join("");

const blockchain = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}))

app.get("/blockchain", function(req, res){
  res.send(blockchain);
});

app.post("/transaction", function(req, res){
  const blockIndex = blockchain.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({note: `Transaction will be added to block ${blockIndex}.`});
});

app.get("/mine", function(req, res){
  const lastBlock = blockchain.getLastBlock();
  const prevBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: blockchain.pendingTransactions,
    index: lastBlock["index"] + 1
  };

  const nonce = blockchain.proofOfWork(prevBlockHash, currentBlockData);
  const blockHash = blockchain.hashBlock(prevBlockHash, currentBlockData, nonce);

  const reward = blockchain.createNewTransaction(12.5, "00", nodeAdress);
  const newBlock = blockchain.createNewBlock(nonce, prevBlockHash, blockHash);
  res.json({note: "New block has been mined successfully",
            block: newBlock
  });
});


app.listen(3000, function(){
  console.log("Listening on port 3000...");
});
