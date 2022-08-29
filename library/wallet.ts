// by: Leo Pawel 	<https://github.com/galaxy126>
// at 28/6/2022

// import "react-native-get-random-values"
// import "@ethersproject/shims" 

const bip39 = require('bip39')

import hdkey from 'hdkey'
import axios from 'axios'
import * as ethUtil from 'ethereumjs-util'
import {BigNumber, ethers} from 'ethers'
import ABI from './abi.json';
import { toBuffer } from 'ethereumjs-util'
import * as sigUtil from "eth-sig-util";
import * as ethSigUtil from '@metamask/eth-sig-util'
import  METHOD_SIGNATURE from './functions.json'
export const ZeroAddress = '0x0000000000000000000000000000000000000000'

const HARDEND= "m/44'/60'/0'/0/"
/**
 * 12 words 128bit
 * 15 words 160bits
 * 18 words 192bits
 * 21 words 224bits
 * 24 words 256bits
 */
export const createMnemonic = (): string => {
	const mnemonic = bip39.generateMnemonic(128)
	return mnemonic
}

export const checkMnemonic = (mnemonic: string) => {
	return bip39.validateMnemonic(mnemonic);
}

export const getAddressFromMnemonic = (mnemonic: string, index: number) => {
	const seed=bip39.mnemonicToSeedSync(mnemonic);
	const lastRoot = hdkey.fromMasterSeed(seed);
	const addrNode = lastRoot.derive(HARDEND + index);
	const privatekey = addrNode.privateKey;
	const pubKey = ethUtil.privateToPublic(privatekey);
	const addr = ethUtil.publicToAddress(pubKey).toString('hex');
	return {privatekey:hex(privatekey), publickey: ethUtil.toChecksumAddress('0x'+addr)};
}

const  hex = (arrayBuffer: Buffer) => {
	return Array.from(new Uint8Array(arrayBuffer))
		.map(n => n.toString(16).padStart(2, "0"))
		.join("");
}

export const getAddressFromPrivateKey = (privateKey: string) => {
	const w = new ethers.Wallet(privateKey)
	return w.address
}


export const getEncryptionPublicKey = (privateKey: string) => {
	return sigUtil.getEncryptionPublicKey(privateKey)
}

export const encryptMessage = (encryptKey: string, msgParams: any) => {
	return sigUtil.encrypt(encryptKey, msgParams, "1")
}

export const decryptMessage = (encryptedData: sigUtil.EthEncryptedData, privateKey: any) => {
	// return sigUtil.decryptSafely(encryptedData.)
}


export const recoverPersonalData  =  (data: any, hash: string) => {
	return ethSigUtil.recoverPersonalSignature({data: data, signature: hash})
}

export const personalSign  = async (privateKey: string, msgParams: any) => {
	const buf = await toBuffer("0x"+privateKey);
	return ethSigUtil.personalSign({privateKey: buf, data: msgParams})
}

export const signTypedData   = async (privateKey: string, msgParams: any) => {
	const buf = await toBuffer("0x"+privateKey);
	return ethSigUtil.signTypedData({privateKey: buf, data: msgParams, version: ethSigUtil.SignTypedDataVersion.V1})
}

export const signTypedData_v3  = async (privateKey: string, msgParams: any) => {
	const buf = await toBuffer("0x"+privateKey);
	return ethSigUtil.signTypedData({privateKey: buf, data: msgParams, version: ethSigUtil.SignTypedDataVersion.V3})
}

export const signTypedData_v4   = async (privateKey: string, msgParams: any) => {
	const buf = await toBuffer("0x"+privateKey);
	return ethSigUtil.signTypedData({privateKey: buf, data: msgParams, version: ethSigUtil.SignTypedDataVersion.V4})
}

export const addHexPrefix = (str:string) => {
	if (typeof str !== 'string' || str.match(/^-0x/u)) return str;
	if (str.match(/^-0X/u)) return str.replace('0X', '0x');
	if (str.startsWith('-')) return str.replace('-', '-0x');	
	return `0x${str}`;
};

export const callRpc = (rpc: string, params?:any) : Promise<any>=> {
	return new Promise(async (res, rej) => {
		try {
			const response = await axios.post(rpc, params, {headers: {'Content-Type': 'application/json'}})
			if (response && response.data) return res(response.data)
			else return res(null)
		} catch(err) {
			res(null)
		}
	})
}

export const checkContract = (rpc: string, tokenAddress: string) : Promise<TokenInterface | null> => {
	return new Promise(async resolve => {
		try { 
			let params = [] as object[];
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: tokenAddress,
				data: '0x95d89b41'
			}, "latest"], id: 1})
			
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: tokenAddress,
				data: '0x06fdde03'
			}, "latest"], id: 2})
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: tokenAddress,
				data: '0x313ce567'
			}, "latest"], id: 3})
			const rows = await callRpc(rpc, params)
			if(rows && rows.length > 0 && rows[0].result !== '0x') {
				return resolve({
					address: tokenAddress,
					symbol: ethers.utils.toUtf8String("0x" + rows[0]?.result?.toString().substring(130).replace(/00/g, "")),
					name: ethers.utils.toUtf8String("0x" + rows[1]?.result?.toString().substring(130).replace(/00/g, "")),
					decimals: Number(rows[2].result)
				})
			}
			return resolve(null)
		}
		catch (err) {
			// console.log(err)
			return resolve(null)
		}
})}

export const checkNFT = (rpc: string, contract: string, tokenID: string) : Promise<NFTInterface | null> => {
	return new Promise(async resolve => {
		try { 
			let params = [] as object[];
			// name
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: contract,
				data: '0x06fdde03'
			}, "latest"], id: 1})

			//symbol
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: contract,
				data: '0x95d89b41'
			}, "latest"], id: 2})
			//token uri
			
			let tid = ethers.BigNumber.from(tokenID)._hex.slice(2);
			let uri = "0xc87b56dd";
			for(let i = 64 ; i> tid.length; i--) {
				uri = uri+"0";
			}
			uri = uri + tid;
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: contract,
				data: uri
			}, "latest"], id: 3})
			// owner
			let own = "0x6352211e";
			for(let i = 64 ; i> tid.length; i--) {
				own = own+"0";
			}
			own = own + tid;
			params.push({jsonrpc: "2.0", method: "eth_call", params: [{
				from: null,
				to: contract,
				data: own
			}, "latest"], id: 4})
			const rows = await callRpc(rpc, params)
			if(rows && rows!== null && rows.length > 0) {
				return resolve({
					address: contract,
					name: ethers.utils.toUtf8String("0x" + rows[0].result.toString().substring(130).replace(/00/g, "")),
					symbol: ethers.utils.toUtf8String("0x" + rows[1].result.toString().substring(130).replace(/00/g, "")),
					uri: ethers.utils.toUtf8String("0x" + rows[2].result.toString().substring(130).replace(/00/g, "")),
					owner:  rows[3]?.result?.toString().replace(/0000/g, "")
				})
			}
			return resolve(null)
		}
		catch (err) {
			// console.log(err)
			return resolve(null)
		}
})}

export const checkBalances = async (rpc:string, chainKey: string, accounts: AccountObject[]) => {
	try {
		let params = [] as object[];
		let _accounts = [] as Array<{address:string, token?:string}>
		let k = 0
		Object.entries(accounts).map(([index, account]) => {
			_accounts.push({address: account.address, token: ZeroAddress})
			params.push({jsonrpc: "2.0", method: "eth_getBalance", params: [account.address, "latest"], id: ++k})
			for (let to in account.tokens[chainKey]) {
				if(to !== ZeroAddress) {
					_accounts.push({address: account.address, token: to})
					params.push({jsonrpc: "2.0", method: "eth_call", params: [{to, data: `0x70a08231000000000000000000000000${account.address.slice(2)}`}, "latest"],"id": ++k});
				}
			}
		})
		const rows = await callRpc(rpc, params)
		if (rows && Array.isArray(rows) && rows.length===k) {
			const result = {} as {[address: string]: {[token: string]: string}}
			for (let i of rows) {
				if (i.result) {
					if(i.result === '0x') i.result = '0x0';
					const acc = _accounts[i.id - 1]
					if(!result[acc.address])result[acc.address] = {[ZeroAddress]: '0'}
					if(acc.token) {
						if(result && result[acc.address] && Object.keys(result[acc.address]).indexOf(acc.token) === -1)  result[acc.address] = {...result[acc.address], [acc.token]: '0'} ;
						result[acc.address] =  {...result[acc.address], [acc.token]: i.result} ;
					}
				}
			}
			
			return result
		}
	} catch (error) {
		// console.log(error)
	}
	return null
}

export const checkTransaction = (rpc: string, txId: string) : Promise<TransactionResult | null> => {
	return new Promise(async response => {
		try {
			let params = [] as object[]
			params.push({jsonrpc: "2.0", method: "eth_getTransactionByHash", params: [txId], id: 1})
			const rows = await callRpc(rpc, params)
			console.log(rows)
			if(rows) return response(rows[0].result)
			response(null)
		} catch (error) {
			return response(null)
		}
	})
}

export const signMessage = (privateKey:string , message:string):Promise<string|null> => {
	return new Promise(async response => {
		let wallet = new ethers.Wallet(privateKey); 
		const bb = new Blob([message])
		const k = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("\x19Ethereum Signed Message:\n" + bb.size + message));
		const sign = await wallet.signMessage(k)
		response(sign)
	});
}

export const signTransaction = (rpc: string, chainId: number, privateKey: string,   to: string, amount: string, nonce: string, data: string, gasPrice: BigNumber, gasLimit: BigNumber): Promise<string | null> => {
	return new Promise(async response => {
		try {
			const provider = new ethers.providers.JsonRpcProvider(rpc)
			let wallet = new ethers.Wallet(privateKey, provider); 
			const from = await wallet.getAddress();
			let transaction = {
				from,
				to,
				value: BigNumber.from(amount).toHexString(),
				gasLimit,
				nonce: BigNumber.from(nonce).toHexString(),
				gasPrice: gasPrice,
				chainId: chainId,
				data: data
			};
			let rawTransaction = await wallet.signTransaction(transaction);
			response(rawTransaction)
		} catch(ex) {
			response(null)
		}
	})
}

export const providerTransaction = (rpc: string, chainId: number, privateKey: string,   to: string, amount: string, nonce: string, data: string, gasPrice: BigNumber, gasLimit: BigNumber): Promise<string | null> => {
	return new Promise(async response => {
		try {
			const provider = new ethers.providers.JsonRpcProvider(rpc)
			let wallet = new ethers.Wallet(privateKey, provider); 
			const from = await wallet.getAddress();
			let transaction = {
				from,
				to,
				value: BigNumber.from(amount).toHexString(),
				gasLimit,
				nonce: BigNumber.from(nonce).toHexString(),
				gasPrice: gasPrice,
				chainId: chainId,
				data: data
			};
			let rawTransaction = await wallet.signTransaction(transaction);
			let params = [] as object[]
			params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
			const rows = await callRpc(rpc, params)
			response(rows[0].result)
		} catch(ex) {
			response(null)
		}
	})
}

export const getNonceAndGasPrice = (rpc: string, from: string): Promise<any> =>  {
	return new Promise((async response => {
		try {
			let params = [] as object[];
			params.push({jsonrpc: "2.0", method: "eth_getTransactionCount", params: [from, 	"pending"], id: 1})
			params.push({jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 2})
			let rows = await callRpc(rpc, params)
			if(rows) {
				response({nonce: rows[0].result, gasPrice:rows[1].result})
			}
		} catch(err) {
			response(0)
		}
	}))
}

export const estimateNftSend = (rpc: string, from: string, to:string, contractAddress: string, tokenId: string): Promise<any> =>  {
	return new Promise((async response => {
		try {
			let params = [] as object[];
			params.push({jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1})
			params.push({jsonrpc: "2.0", method: "eth_getTransactionCount", params: [from, 	"pending"], id: 2})
			let rawData = "0x";
			const erc721Interface = new ethers.utils.Interface([
				'function safeTransferFrom(address _from, address _to, uint256 _tokenId)'
			  ])
			const encode = erc721Interface.encodeFunctionData("safeTransferFrom", ([from, to, tokenId]));
			rawData = encode;
			params.push({jsonrpc: "2.0", method: "eth_estimateGas", params: [{
				from: from,
				to: contractAddress,
				data: encode
			}], id: 3}) 
			let rows = await callRpc(rpc, params)
			if(rows && rows.length>0)rows.push(rawData)
			if(rows && rows.length > 0) return response(rows)
			return null
		} catch(err) {
			console.log(err)
			return response(null)
		}
	}))
}

export const sendNFT = (rpc: string, chainId: number, privateKey: string,  to: string, contractAddress: string, tokenId: string, nonce: string,  gasPrice: BigNumber, gasLimit: BigNumber): Promise<string | null> => {
	return new Promise(async response => {
		try {
			const provider = new ethers.providers.JsonRpcProvider(rpc)
			let wallet = new ethers.Wallet(privateKey, provider); 
			const from = await wallet.getAddress();
			const erc721Interface = new ethers.utils.Interface([
				'function safeTransferFrom(address _from, address _to, uint256 _tokenId)'
			  ])
			const encode = erc721Interface.encodeFunctionData("safeTransferFrom", ([from, to, tokenId]));
			let transaction = {
				from,
				to: contractAddress,
				gasLimit,
				nonce:BigNumber.from(nonce).toHexString(),
				chainId,
				gasPrice: BigNumber.from(gasPrice).toHexString(),
				data: encode
			};
			let rawTransaction = await wallet.signTransaction(transaction);
			let params = [] as object[]
			params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
			const rows = await callRpc(rpc, params)
			if(rows) return response(rows[0].result)
			response(null)
		} catch (err) {
			console.log(err)
			response(null)
		}
	});
}

export const sendTransaction = (rpc: string, chainId: number, privateKey: string,  tokenAddress: string, to: string, amount: string, nonce: string, data: string, gasPrice: BigNumber, gasLimit: BigNumber, maxFee: BigNumber, maxPriority: BigNumber): Promise<string | null> => {
	return new Promise(async response => {
		try {
			const provider = new ethers.providers.JsonRpcProvider(rpc)
			let wallet = new ethers.Wallet(privateKey, provider); 
			const from = await wallet.getAddress();
			// let feeData = await provider.getFeeData();
			// const maxFeePerGas = BigNumber.from(feeData?.maxFeePerGas  || 0);
			// const maxPriorityFeePerGas = BigNumber.from(feeData?.maxPriorityFeePerGas || 0) ;
			if(tokenAddress === ZeroAddress) {
				let transaction = {
					from,
					to,
					value: BigNumber.from(amount).toHexString(),
					gasLimit,
					nonce: BigNumber.from(nonce).toHexString(),
					gasPrice: gasPrice,
					chainId: chainId,
					data: data
					// maxPriorityFeePerGas: maxPriorityFeePerGas.toHexString(),
					// maxFeePerGas: maxFeePerGas.toHexString(),
					// type: 2,
				};
				let rawTransaction = await wallet.signTransaction(transaction);
				let params = [] as object[]
				params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
				const rows = await callRpc(rpc, params)
				if(rows) return response(rows[0].result)
				response(null)
			}
			else {
				let iface = new ethers.utils.Interface(ABI.ERC20);
				const encode = iface.encodeFunctionData("transfer", ([to, amount]))
				console.log(amount, gasLimit)
				let transaction = {
					from,
					to: tokenAddress || '',
					gasLimit,
					nonce:BigNumber.from(nonce).toHexString(),
					chainId,
					gasPrice,
					data: encode
				};
				let rawTransaction = await wallet.signTransaction(transaction);
				let params = [] as object[]
				params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
				const rows = await callRpc(rpc, params)
				console.log(rows)
				if(rows) return response(rows[0].result)
				response(null)
			}
		} catch (err) {
			console.log(err)
			response(null)
		}
	});
}

export const getSendInfo = (rpc: string, account: string, to:string, tokenAddress: string,  value: string,  data: string, gasPrice?: string): Promise<any> =>  {
	return new Promise((async response => {
		try {
			let params = [] as object[];
			params.push({jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1})
			params.push({jsonrpc: "2.0", method: "eth_getTransactionCount", params: [account, 	"pending"], id: 2})
			let rawData = "0x";
			if(tokenAddress !== ZeroAddress) {
				let iface = new ethers.utils.Interface(ABI.ERC20);
				
				const encode = iface.encodeFunctionData("transfer", ([to, value]));
				rawData = encode;
				params.push({jsonrpc: "2.0", method: "eth_estimateGas", params: [{
					from: account,
					to: tokenAddress,
					data: encode
				}], id: 3}) 
			} else {
				value = value.replace("0x0", "0x");
				params.push({jsonrpc: "2.0", method: "eth_estimateGas", params: [{
					from: account,
					to: to,
					value: value,
					// gasPrice: await getGasPrice(rpc),
					data: data
				}], id: 3})
				
			}
			let rows = await callRpc(rpc, params)
			if(rows && rows.length>0)rows.push(rawData)
			if(rows && rows.length > 0) return response(rows)
			return null
		} catch(err) {
			console.log(err)
			return response(null)
		}
	}))
}

export const waitTx = (rpc:string, txid:string): Promise<any> => {
	return new Promise(async response => {
		try { 
			let params = [] as object[];
			params.push({jsonrpc: "2.0", method: "eth_getTransactionReceipt", params: [txid], id: 1})
			const rows = await callRpc(rpc, params)
			if(rows) return response(rows[0].result)
			response(null)
		}
		catch (err) {
			console.log(err)
			return response(null)
		}
	})
}


interface FunctionInfoType {
	name: string
	args: {[arg: string]: string|number|boolean}
}


export const getMethodName = (data: string): FunctionInfoType|null => {
	const methods = METHOD_SIGNATURE as {[func: string]: string}
	const specs = {
		"095ea7b3": "approve(address spender,uint256 amount)"
	} as {[func: string]: string}

	try {
		const signature = data.slice(2, 10);
		const func = specs[signature] || methods[signature];
		if (func!==undefined) {
			const p = func.indexOf('(');
			if (p!==-1) {
				const name = func.slice(0, p);
				const iface = new ethers.utils.Interface([`function ${func} returns()`]);
				const fragment = Object.entries(iface.functions)[0][1];
				const decodedData = iface.decodeFunctionData(name, data);
				if (fragment.inputs.length===decodedData.length) {
					let result = {name, args: {}} as FunctionInfoType
					let k = 0;
					for (let i of decodedData) {
						result.args[fragment.inputs[k].name || k] = i instanceof ethers.BigNumber ? i.toString() : i;
						k++;
					}
					return result;
				}
			}
		}
	} catch (error) {
	} 
	return null;
}