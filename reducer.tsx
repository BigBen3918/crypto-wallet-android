import { createSlice } from '@reduxjs/toolkit'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const appKey = 'neon-store-1.0';

export const  initialState: StoreObject = {
	inited:				false,
	theme:				'',
	lang:				'en-US',
	browser:			false,
	lastAccessTime:		0,
	vault:			'',		// cipered wallet data
	networks:			[],
	tokens:				{},
	accounts:			[],
	apps:				{},		// connected app
	contacts:			[],
	connects:			[],
	recents:			[],
	nfts:				{},
	transactions:		{},
	currentNetwork:		'',		// current network
	currentAccount:		'',		// current address
	setting:			{
		currency:		'USD'
	},
	createdAccountLayer: 0,
	password:			'',
	connectHistory:		[]
} 

export const storeData = async (value:any) => {
	return AsyncStorage.setItem(appKey, JSON.stringify(value)) 
}

export const getData = async () => {
	let init = {} as any
	try {
		const buf = await AsyncStorage.getItem(appKey)
		if (buf) {
			const json = JSON.parse(buf)
			Object.entries(json).map(([k, value]) => {
				init[k] = value;
			})
		}
	} catch (err) {
	}
	return init
}


export default createSlice({
	name: 'neon-wallet-app',
	initialState,
	reducers: {
		update: (state:any, action:any) => {
			for (const k in action.payload) {
				if (state[k] === undefined) new Error('🦊 undefined account item') 
				state[k] = action.payload[k]
			}
			storeData(state)
		}
	}
})
