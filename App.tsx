import React from 'react'
import 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { LogBox} from 'react-native';
import { configureStore } from '@reduxjs/toolkit'
import { ToastProvider} from 'react-native-toast-notifications'
import { createNativeStackNavigator, } from '@react-navigation/native-stack'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'

import './global'
import useStore from './useStore'
import Slice, { getData } from './reducer'

import WalletSetup 		from './pages/auth/WalletSetup'
import HelpUs 			from './pages/auth/HelpUs'
import Import 			from './pages/auth/Import'
import CreatePass		from './pages/auth/CreatePass'
import SecureWallet1 	from './pages/auth/SecureWallet1'
import SecureWallet2 	from './pages/auth/SecureWallet2'
import Support 			from './pages/auth/Support'
import ConfirmPass 		from './pages/auth/ConfirmPass'
import SecretPhrase		from './pages/auth/SecretPhrase'
import ConfirmPhrase	from './pages/auth/ConfirmPhrase'
import SecureSuccess 	from './pages/auth/SecureSuccess'
import WalletTokens 	from './pages/token/WalletTokens'
import GetStarted 		from './pages/auth/GetStarted'
import Swap 			from './pages/token/Swap'
import ImportTokens 	from './pages/token/ImportTokens'
import ImportNft 		from './pages/token/ImportNft'
import Send 			from './pages/token/Send'
import SendAmount 		from './pages/token/SendAmount'
import Setting 			from './pages/setting/Setting'
import General 			from './pages/setting/General'
import Advanced 		from './pages/setting/Advanced'
import Contact 			from './pages/setting/Contact'
import Security 		from './pages/setting/Security'
import Alerts 			from './pages/setting/Alerts'
import Networks 		from './pages/setting/Networks'
import Experimental 	from './pages/setting/Experimental'
import About 			from './pages/setting/About'
import WalletActivity 	from './pages/token/WalletActivity'
import RevealPhrase 	from './pages/setting/RevealPhrase'
import ViewSessions 	from './pages/setting/ViewSessions'
import ImportAccount 	from './pages/token/ImportAccount'
import ConfirmSending 	from './pages/token/ConfirmSending'
import TsxDetails 		from './pages/token/TsxDetails'
import ShowPrivateKey 	from './pages/setting/ShowPrivateKey'
import Unlock 			from './pages/auth/Unlock'
import Loading 			from './pages/components/loading'
import WebView 			from './pages/token/WebView'
import WalletConnect 	from './pages/token/WalletconnectCapture'
import ContractTransaction 	from './pages/token/ContractTransaction'
import { checkBalances, checkNFT, waitTx, ZeroAddress } from './library/wallet'

const store = configureStore({ reducer: Slice.reducer });

const Stack = createNativeStackNavigator();

const navigationRef = createNavigationContainerRef()

interface initStatus {
	lock				:	boolean
	accountLayer 		:	number
}

const AppContainer = () => {
	const [time, setTime] = React.useState(+new Date())
	const [state, setStates] = React.useState<initStatus>({
		lock				:	true,
		accountLayer 		:	0
	});
	const updateStatus = (params: {[key: string]: string | number | boolean | Blob | any }) => setStates({ ...state, ...params });
	
	LogBox.ignoreAllLogs();
	console.warn = (args) => {}
	// console.log = (args) => {}
	// console.error = (args) => {}
	
	

	const {inited, currentNetwork, connects, transactions, networks, nfts, accounts, update, showToast} = useStore();

	const checkBalance = async () => {
		try {
			let net = {} as NetworkObject
			Object.values(networks).map(( network) => {
				if( network.chainKey === currentNetwork){
					net = network
				}
			})
			if (net) {
				const result = await checkBalances(net.rpc, currentNetwork, accounts)
				if (result!==null) {
					const _accounts = [] as AccountObject[]
					Object.values(accounts).map(( i) => {
							const value = result[i.address][ZeroAddress];
							delete  result[i.address][ZeroAddress];
							_accounts.push({
								...i,
								value: {
									...i.value,
									[currentNetwork]: value
								},
								tokens: {
									...i.tokens,
									[currentNetwork]: result[i.address]
								}
							})
					})
					update({accounts: _accounts})
				}
			}
		} catch (error) {
			return showToast("Network connection error", "warning")
		}
	}
	
	const checkNFTBalance =  () => {
		let rpc = ""
		Object.values(networks).map(( network ) => {
			if( network.chainKey === currentNetwork){
				rpc = network.rpc;
			}
		})
		let currentChainNFT = [] as NFTObject[];
		if(nfts) { 
			const chainNFT = nfts[currentNetwork];
			let newTks  = {} as  NFTObject;
			let total = 0;
			chainNFT && chainNFT.map(async (n, index) => {
				const ab = await checkNFT(rpc, n.contract, n.tokenId)
				total++;
				if(ab?.owner.toLowerCase() === n.owner.toLowerCase()) {
					newTks = {
						owner:				n.owner,
						contract:			n.contract,
						tokenId:			n.tokenId,
						name:				n.name,
						symbol:				n.symbol,
						imageUri:			n.imageUri,
						tokenUri:			n.tokenUri,
						favourite:			n.favourite,
						importedTime:		n.importedTime
					}
					currentChainNFT = [...currentChainNFT, newTks]
					if(total === chainNFT.length ) {
						currentChainNFT = currentChainNFT.sort((a, b) => {return a.importedTime>b.importedTime? -1: 1})
						update({nfts:  {...nfts, [currentNetwork]: currentChainNFT}})
					}
				} else {
					if(total === chainNFT.length ) {
						currentChainNFT = currentChainNFT.sort((a, b) => {return a.importedTime>b.importedTime? -1: 1})
						update({nfts:  {...nfts, [currentNetwork]: currentChainNFT}})
					}
				}
			})
		} 
	}

	const checkTransactionStatus = async () => {
		const currentTxs = transactions[currentNetwork];
		let txs:Transaction[] = [];
		let rpc = "";
		if(!currentTxs || Object.keys(currentTxs).length === 0) return;
		{Object.values(currentTxs).map(( tx ) => {
			if(tx.status === "pending") {
				txs.push(tx)				
			}
		})}  
		
		Object.values(networks).map(( network ) => {
			if( network.chainKey === currentNetwork){
				rpc =  network.rpc || ''
		}})

		txs.forEach(tx => {
			waitTx(rpc, tx.transactionId).then((result) => {
				if(result !== null) {
					if(result.blockNumber !== null) {
						const newtxs = {} as  {[chainKey: string] : {[hash: string]: Transaction}};
						let flag = false;
						Object.entries(transactions).map(([_chain, _transaction]) => {
							if(_chain !== currentNetwork) newtxs[_chain] = _transaction;
							else {
								let txs = {..._transaction, [tx.transactionId]: {
									from:				tx.from,
									transactionId:		tx.transactionId,
									to:					tx.to,
									status:				Number(result.status) === 0 ? "failed": 'confirmed',
									nonce:				Number(tx.nonce).toString(),
									amount:				tx.amount,
									gasPrice:			tx.gasPrice,
									gasLimit:			tx.gasLimit,
									gasUsed:			result.gasUsed,
									total:				"0",
									hexData:			tx.hexData,
									rpc:				tx.rpc,
									chainId:			tx.chainId,
									tokenAddress:		tx.tokenAddress,
									explorer:			tx.explorer,
									symbol:				tx.symbol,
									decimals:			Number(tx.decimals),
									log:				result.logs,
									created:			'0',
									time:				+new Date()
								}};
								newtxs[_chain] = txs;
								flag = true;
							}
						});
						update({transactions: newtxs})
					}
				}
			})
			
		});
	}

	React.useEffect(() => {
		if (inited===false) {
			getData().then(store => { 
				const _lastAccessTime = store?.lastAccessTime || 0;
				const _accountLayer = store?.createdAccountLayer || 0;
				const _setting = store?.setting || {currency:'usd'};
				const _password = store?.password
				const lock = ((+new Date() - _lastAccessTime) > ((_setting.autoLockTimer || 5) * 60000 ) || _password === "" ? true: false);
				updateStatus({ lock:lock, accountLayer: _accountLayer})	
				let page = _accountLayer === 0 ? "GetStarted" : (lock ? "Unlock" : "WalletTokens");
				update({...store, inited:true, browser: false});
				if(navigationRef.isReady()) {
					navigationRef.navigate(page)
				}
			})
		}
	}, [])
	
	React.useEffect(()=>{
		checkBalance()
		checkTransactionStatus();
		checkNFTBalance()
		const timer = setTimeout(()=>setTime(+new Date()), 10000)
		return () => clearTimeout(timer)
	}, [time, currentNetwork, transactions])


	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator  initialRouteName={"Loading"} screenOptions={{ headerShown: false, animation:"fade_from_bottom"  }}>
				<Stack.Screen name="Unlock" component={Unlock} />
				<Stack.Screen name="GetStarted" component={GetStarted} />
				<Stack.Screen name="WalletSetup" component={WalletSetup} />
				<Stack.Screen name="HelpUs" component={HelpUs} />
				<Stack.Screen name="Import" component={Import} />
				<Stack.Screen name="CreatePass" component={CreatePass} />
				<Stack.Screen name="SecureWallet1" component={SecureWallet1} />
				<Stack.Screen name="SecureWallet2" component={SecureWallet2} />
				<Stack.Screen name="Support" component={Support} />
				<Stack.Screen name="ConfirmPass" component={ConfirmPass} />
				<Stack.Screen name="SecretPhrase" component={SecretPhrase} />
				<Stack.Screen name="ConfirmPhrase" component={ConfirmPhrase} />
				<Stack.Screen name="SecureSuccess" component={SecureSuccess} />
				<Stack.Screen name="WalletTokens" component={WalletTokens} />
				<Stack.Screen name="WalletActivity" component={WalletActivity} />
				<Stack.Screen name="TsxDetails" component={TsxDetails} />
				<Stack.Screen name="ImportToken" component={ImportTokens} />
				<Stack.Screen name="ImportNft" component={ImportNft} />
				<Stack.Screen name="ImportAccount" component={ImportAccount} />
				<Stack.Screen name="Send" component={Send} />
				<Stack.Screen name="SendAmount" component={SendAmount} />
				<Stack.Screen name="ConfirmSending" component={ConfirmSending} />
				<Stack.Screen name="Swap" component={Swap} />
				<Stack.Screen name="Setting" component={Setting} />
				<Stack.Screen name="General" component={General} />
				<Stack.Screen name="Advanced" component={Advanced} />
				<Stack.Screen name="Contact" component={Contact} />
				<Stack.Screen name="Security" component={Security} />
				<Stack.Screen name="RevealPhrase" component={RevealPhrase} />
				<Stack.Screen name="ViewSessions" component={ViewSessions} />
				<Stack.Screen name="ShowPrivateKey" component={ShowPrivateKey} />
				<Stack.Screen name="Alerts" component={Alerts} />
				<Stack.Screen name="Networks" component={Networks} />
				<Stack.Screen name="Experimental" component={Experimental} />
				<Stack.Screen name="About" component={About} />
				<Stack.Screen name="Loading" component={Loading} />
				<Stack.Screen name="WebView" component={WebView} />
				<Stack.Screen name="WalletconnectCapture" component={WalletConnect} />
				<Stack.Screen name="ContractTransaction" component={ContractTransaction} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default function App() {
	return (
		<Provider store={store}>
			<ToastProvider>
				<AppContainer />
			</ToastProvider>
		</Provider>
	)
}
