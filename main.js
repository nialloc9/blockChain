const SHA256 = require('crypto-js/sha256');

class Block{

    constructor({index, timestamp, data, previousHash = ""}){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash)
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    };

    createGenesisBlock(){
        return new Block({
            index: 0,
            timestamp: "01/01/2017",
            data: "Genesis block",
            previousHash: "0"
        })
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty)

        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                console.log("hashes don't match");
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                console.log("current previous has does not match previous block hash");
                return false;
            }

            return;
        }

        return true;
    }
}

let coin = new BlockChain();

console.log("Mining block 1...");

coin.addBlock(new Block({
    index: 1,
    timestamp: "10/07/2017",
    data: {
        amount: 4
    }
}));

console.log("Mining block 2...");
coin.addBlock(new Block({
    index: 2,
    timestamp: "12/07/2017",
    data: {
        amount: 6
    }
}));