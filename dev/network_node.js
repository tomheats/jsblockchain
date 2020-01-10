const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1")
const port = process.argv[2];
const rp = require("request-promise");

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

app.post('/register-and-broadcast-node', function(req, res){
	const newNodeUrl = req.body.newNodeUrl;
				 
	if (blockchain.networkNodes.indexOf(newNodeUrl) == -1){
		blockchain.networkNodes.push(newNodeUrl);
	};
				 
	const regNodesPromises = [];
				 
	blockchain.networkNodes.forEach(networkNodeUrl => {
 	
		const requestOptions = {
 			uri: networkNodeUrl + '/register-node',
 			method: 'POST',
 			body: {newNodeUrl: newNodeUrl},
 			json: true
 		};
																	
 regNodesPromises.push(rp(requestOptions));
	});
				 
	Promise.all(regNodesPromises)
	.then(data => {
				const bulkRegisterOptions = {
					uri: newNodeUrl + '/register-nodes-bulk',
					method: 'POST',
					body: {allNetworkNodes: [blockchain.networkNodes, blockchain.currentNodeUrl]},
					json:true
				};
				
				return rp(bulkRegisterOptions);
	})
 .then(data => {
		res.json({note: "New node registered with network successfully!"})
	});
});


app.post('/register-node', function(req, res){
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = blockchain.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = blockchain.currentNodeUrl !== newNodeUrl;
				 
	if (nodeNotAlreadyPresent && notCurrentNode) blockchain.networkNodes.push(newNodeUrl);
	res.json({note: "New node registered successfully."});
});

app.post('/register-nodes-bulk', function(req, res){
	const allNetworkNodes = req.body.allNetworkNodes;
				 allNetworkNodes.forEach(networkNodeUrl => {
				 const nodeNotAlreadyPresent = blockchain.networkNodes.indexOf(networkNodeUrl) == -1;
				 const notCurrentNode = blockchain.currentNodeUrl !== networkNodeUrl;
				 if (nodeNotAlreadyPresent && notCurrentNode){blockchain.networkNodes.push(networkNodeUrl)};
 	});
	
				 res.json({note: "Bulk registration successful."});
});



app.listen(port, function(){
  console.log(`Listening on port ${port}...`);
});
