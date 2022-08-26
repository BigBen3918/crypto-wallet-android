import { useSelector, useDispatch}	from 'react-redux';
import * as Clipboard from 'expo-clipboard';
let cryptDecrypt = require('react-native-encrypt-decrypt');
import { JSHmac,  CONSTANTS } from "react-native-hash";
import { useToast  } from 'react-native-toast-notifications'

import Slice from './reducer';

import langEn from './locales/en-US.json'
import langCn from './locales/zh-CN.json'

const chainIcons = {} as {[chainId: string]: string}
const tokenIcons = {} as {[address: string]: string}

const REACT_APP_SECRET = "icicb-wallet-secret";

const locales = {
	"en-US": langEn,
	"zh-CN": langCn,
} as {[lang: string]: {[key: string]: string}}; 

export const copyToClipboard =  (text:string) => {
	Clipboard.setString(text)
}

export const hmac = async (plain:string):Promise<string> => {
	try {
		return await JSHmac(plain, REACT_APP_SECRET, CONSTANTS.HmacAlgorithms.HmacMD5)
	} catch (error) {
		// console.log(error)
	}
	return ""
}


export const encrypt =  (plain:string, key: string) => {
	try {
        const cipher = cryptDecrypt.encrypt(plain, key)
        return cipher;
	} catch (error) {
		// console.log(error)
	}
	return ""
}

export const decrypt =  (cipher:string, key: string) => {
	try {
        const plain = cryptDecrypt.decrypt(cipher, key)
        return plain;
	} catch (error) {
		// console.log(error)
	}
	return ""
}

export const N = (num: number, p: number = 2) => num.toLocaleString('en', { maximumFractionDigits: p });

export const fetchJson = async (uri: string, params?: any) => {
	try {
		if (params===undefined) {
			const response = await fetch(uri, {headers: {Accept: "application/json", "Content-Type": "application/json"}});
			return await response.json()
		} else {
			const response = await fetch(uri, {
				body: JSON.stringify(params),
				headers: {Accept: "application/json", "Content-Type": "application/json"},
				method: "POST"
			});
			return await response.json()
		}
		
	} catch (error) {
		// console.log(error)
	}
	return null
}

export const initChainIcons = async () => {
	if (Object.keys(chainIcons).length===0) {
		const res = (await fetchJson("https://raw.githubusercontent.com/olesatanya/token-icons/main/chains.json"));
		for (let k in res) {
			chainIcons[k] = res[k];
		}
	}
}

export const initTokenIcons = async () => {
	if (Object.keys(tokenIcons).length===0) {
		const res = (await fetchJson("https://raw.githubusercontent.com/olesatanya/token-icons/main/tokens.json"));
		for (let k in res) {
			tokenIcons[k] = res[k];
		}
	}
}

export const getChainIcon = (chainId: number) => {
	if(chainIcons[chainId]) return "https://raw.githubusercontent.com/olesatanya/token-icons/main/chains/"+chainId+ chainIcons[chainId] ;
	return null;
}

export const getTokenIcon = async (address: string) => {
	if(tokenIcons[address]) return "https://raw.githubusercontent.com/olesatanya/token-icons/main/icons/"+address + tokenIcons[address];
	return null
}

export const roundNumber = (number: string | number, p: number = 6) => {
	return Number(Number(number.toString()).toFixed(p).replace(/,/g, "")).toString();
}

export const toDate = (timestamp: number) => {
	const d = new Date(timestamp )
	return [d.getMonth() + 1, d.getDate()].join('/') + " " + d.getHours() +":"+(d.getMinutes())
}

export const toKillo = (n: number) => {
	return (Number(n) < 1000 ? String(n) : `${~~(Number(n)/1000)}k`)
}

export const ellipsis = (address: string, start: number=6) => {
	if (!address) return ''
	const len = (start ) + 7
	return address.length > len ? `${address.slice(0, start)}...${address.slice(-4)}` : address
}

const useStore = () => {
	const G = useSelector((state:StoreObject)=>state)
	const L = locales[G.lang]
	const dispatch = useDispatch() 
	const update = (payload:Partial<StoreObject>) => dispatch(Slice.actions.update({...payload, lastAccessTime: new Date().getTime()}))
	const T = (key:string, args?:{[key:string]:string|number}|string|number):string => {
		let text = L[key]
		if (text===undefined) throw new Error('Undefined lang key[' + key + ']')
		if (typeof args==='string' || typeof args==='number') { 
			text = text.replace(/\{\w+\}/, String(args)) 
		} else {
			for(let k in args) text = text.replace(new RegExp('{'+k+'}', 'g'), String(args[k]))
		}
		return text
	}
		
	const toast = useToast();

	const showToast = async (msg:string, type="danger" ) => {
		// "normal" | "success" | "danger" | "warning" 
		if(msg.length > 30 ) msg = msg.substring(0, 25)+"...";
		toast.show(msg, {
			type: type, 
			onPress:(id) => {toast.hide(id)}, 
			placement:"center", 
			duration: 1500,
			animationType:"zoom-in", 
			successColor:"#144858",
			dangerColor:"#62220e",
			warningColor:"#971c00",
			normalColor:"#5a1a6a"
		})
	}
	return {...G, T, update, showToast};
}

export default useStore
