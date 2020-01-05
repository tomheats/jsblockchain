const sha256 = require("sha256");


class Blockchain{
  constructor(){
    this.chain = [];
    this.pendingTransactions = [];
  }

  createNewBlock(nonce, prevBlockHash, hash){
    const newBlock = {
      index: this.chain.length + 1,
      timeStamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce: nonce,
      hash: hash,
      previousBlockHash: prevBlockHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock(){
    return this.chain[this.chain.length -1];
  }

  createNewTransaction(amt, sendr, recp){
    const newTransaction = {
      amount: amt,
      sender: sendr,
      recipient: recp
    };
    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()["index"] + 1;
  }

  hashBlock(prevBlockHash, currBlockData, nonce){
    const dataAsString = prevBlockHash + nonce.toString() + JSON.stringify(currBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  proofOfWork(prevBlockHash, currBlockData){
    let nonce = 0;
    let hash = this.hashBlock(prevBlockHash, currBlockData, nonce);

    while (hash.substring(0, 4) !== "0000"){
      nonce++;
      hash = this.hashBlock(prevBlockHash, currBlockData, nonce);
    }
    return nonce
  }
}

module.exports = Blockchain;
