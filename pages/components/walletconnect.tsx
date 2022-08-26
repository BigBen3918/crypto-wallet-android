import React from 'react';
import WalletConnect from '@walletconnect/client';
import { toUtf8 } from 'ethereumjs-util';
import { BigNumber } from 'ethers';
import Avatar from './avatar';
import { colors, grid, gstyle, h, w } from './style';
import { Content, OpacityButton, Picture, ScrollWrap, Wrap } from './commons';
import { DefaultButton, DefaultInput, Modal } from './elements';
import { bmul, formatUnit } from '../../library/bigmath';
import { METHOD_TYPE } from '../../library/constants';
import useStore, { decrypt, ellipsis, hmac, roundNumber } from '../../useStore'
import {personalSign, signTransaction,  signTypedData_v4, signMessage, providerTransaction, checkTransaction, getMethodName, checkContract, getSendInfo, ZeroAddress} from '../../library/wallet'

interface WalletConnectStatus{
	addChainModal:			boolean
	requestAccountsModal:	boolean
	ethSignModal:			boolean
	watchAssetModal:		boolean
	switchChainModal:		boolean
	requestPermissionModal:	boolean
	sendTransactionModal:	boolean
	signTransactionModal:	boolean
	signDataModal:			boolean
	signDataV3Modal:		boolean
	signDataV4Modal:		boolean
	personalSignModal:		boolean
	connectModal:			boolean
	uri:					string
	name:					string
	icon:					string
	description:			string
	url:					string
	connectors:				WalletConnect[]
	params:					any
	password:				string
}



interface SendTransactionStatus {
	nonce: 		string
	gasPrice:	string
	gas:		string
	to:			string
	from:		string
	value:		string
	data:		string
	chainId:	string
	symbol:			string
	rpc:			string
	gasFee:			string
	balance:		string
	tokenAddress:	string
	explorer:		string
	method:			string
	params:			{[index: string]: string}
	erc20?:			{
		symbol: 	string
		decimals: 	number
		value:		string
	}
	tabIndex:		number
}


const WalletConnectDetect =  () => {
	const {currentAccount, currentNetwork, accounts, networks, transactions, setting, connects, vault,  showToast, update} = useStore(); 

	const [status, setStatus] = React.useState<WalletConnectStatus>({
		addChainModal:			false,
		requestAccountsModal:	false,
		ethSignModal:			false,
		watchAssetModal:		false,
		switchChainModal:		false,
		requestPermissionModal:	false,
		sendTransactionModal:	false,
		signDataModal:			false,
		signDataV3Modal:		false,
		signDataV4Modal:		false,
		personalSignModal:		false,
		connectModal:			false,
		signTransactionModal:	false,
		name:					"",
		icon:					"",
		description:			"",
		url:					"",
		uri:					"",
		connectors:				[],
		params:					null,
		password:				""
	});

	
	const [transactionStatus, setTransactionStatus] = React.useState<SendTransactionStatus>({
		from:		'',
		to:			'',
		nonce:		'',
		gasPrice:	'',
		gas:		'',
		value:		'',
		data:		'',
		chainId:	'',
		symbol:		'',
		rpc:		'',
		gasFee: 	'',
		balance:	'',
		tokenAddress: '',
		explorer:		'',
		method:		'',
		params:		{},
		tabIndex:	1
	});


	const updateStatus = (params : {[key : string] : string|number|boolean | any}) => setStatus({...status, ...params});
	const updateTransactionStatus = (params : {[key : string] : string|number|boolean | any}) => setTransactionStatus({...transactionStatus, ...params});

	const emitNetworkChanged = (chainId: number) => {
		connects && Object.values(connects).map(async (peerInfo: WalletConnectSession) => {
			let connector = new WalletConnect({
				uri: peerInfo.uri,
				bridge: peerInfo.bridge,
				session: peerInfo.session,
				clientMeta: {
					description: peerInfo.description,
					url: peerInfo.url,
					icons: [peerInfo.icon],
					name: peerInfo.name
				}
			})
			if (connector) {
				connector.approveSession({chainId: chainId, accounts: [currentAccount] })
			}
		})
	}
		
	React.useEffect(() => {
		connects && Object.values(connects).map(async (peerInfo: WalletConnectSession) => {
			let connector = new WalletConnect({
				uri: peerInfo.uri,
				bridge: peerInfo.bridge,
				session: peerInfo.session,
				clientMeta: {
					description: peerInfo.description,
					url: peerInfo.url,
					icons: [peerInfo.icon],
					name: peerInfo.name
				}
			})
			approveSession(connector)
			connector?.on("session_request", (error:any, payload) => {
				if (error) {
					return;
				}
				try{
					let chainId = 0;
					Object.values(networks).map(( network) => {
						if( network.chainKey === currentNetwork){
							chainId = network.chainId;
					}})
					connector?.approveSession({chainId: chainId, accounts: [currentAccount]})
				} catch(ex){
					throw ex;
				}
			});

			connector?.on("call_request", (error, payload) => {
				if (error) return;
				const id = payload?.id;
				const method = payload?.method;
				const params = payload?.params;
				if(method) {
					switch(method){
						case METHOD_TYPE.SWITCH_ETHEREUM_CHAIN: {
							const chainId = Number(params[0]?.chainId);
							let chainKey = "", label = "";
							networks.forEach(element => {
								if(Number(element.chainId) === chainId){
									chainKey = element.chainKey;
									label = element.label
								}
							});
							if(label === "" || chainKey === "") return connector.rejectRequest({id, error:{message:"Not exists chain"}})
							updateStatus({switchChainModal: true, params: {id, chainId, chainKey, label, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon})
							break;
						}
						case METHOD_TYPE.ADD_ETHEREUM_CHAIN: {
							const chain = params[0] as AddEthereumChainParameter | null;
							updateStatus({addChainModal: true, params: {id, chain, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon})
							break;
						}
						case METHOD_TYPE.PERSONAL_SIGN: {
							const data = params[0];
							updateStatus({personalSignModal: true, params: {id, data, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon, password: ""})
							break;
						}
						case METHOD_TYPE.ETH_SIGN_DATA: {
							const data = params;
							updateStatus({signDataModal: true, params: {id, data, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon, password: ""})
							break;
						}
						case METHOD_TYPE.ETH_SIGN_DATA_V3: {
							const data = params;
							updateStatus({signDataModal: true, params: {id, data, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon, password: ""})
							break;
						}
						case METHOD_TYPE.ETH_SIGN_DATA_V4: {
							const data = params;
							updateStatus({signDataModal: true, params: {id, data, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon, password: ""})
							break;
						}
						case METHOD_TYPE.ETH_SIGN: {
							const data = params;
							updateStatus({ethSignModal: true, params: {id, data, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon, password: ""})
							break;
						}
						case METHOD_TYPE.ETH_CHAIN_ID: {
							let chainId = 0;
							Object.values(networks).map(( network) => {
								if( network.chainKey === currentNetwork){
									chainId = network.chainId;
							}})
							connector.approveRequest({id, result: chainId})
							break;
						}
						case METHOD_TYPE.ETH_ACCOUNTS: {
							connector.approveRequest({id, result: [currentAccount]})
							break;
						}
						case METHOD_TYPE.ETH_SEND_TRANSACTION: {
							const data = params?.[0];
							updateStatus({sendTransactionModal: true, params: {id, data, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon, password: ""})
							checkTransactionParams(connector, id, data)
							break;
						}
						case METHOD_TYPE.ETH_SIGN_TRANSACTION: {
							const data = params?.[0];
							updateStatus({signTransactionModal: true, params: {id, data, connector}, url: peerInfo.url, name: peerInfo.name, icon: peerInfo.icon, password: ""})
							checkTransactionParams(connector, id, data)
							break;
						}
						default: {
							console.log(method, params)
							break;
						}
					}
				}
				return;
			});
						
			connector?.on("disconnect", (error, payload) => {
				killSession(connector)
				if (error) return;
			});
			const cons = [...status.connectors, connector];
			updateStatus({connectors: cons})
		})
	}, [connects])

	const approveSession =  (connector: WalletConnect) => {
		let chainId = 0;
		Object.values(networks).map(( network) => {
			if( network.chainKey === currentNetwork){
				chainId = network.chainId;
		}})
		if (connector) {
			connector.approveSession({chainId: chainId, accounts: [currentAccount] })
		}
	}
	
	const killSession = (connector: WalletConnect) => {
		let cons = [] as WalletConnectSession[];
		connects.forEach(element => {
			if(element.bridge !== connector.bridge && element.peerId !== connector.peerId && element.session !== connector.session) cons.push(element)
		})
		update({connects: cons})
	}

	const approveRequest = (connector: WalletConnect, id: number, result: any) => {
		connector?.approveRequest({id, result});
	};

	const rejectRequest = (connector: WalletConnect, id: number, error: any) => {
		connector?.rejectRequest({id, error});
	};

	const switchNetwork = (type: boolean) => {
		const chainKey = status.params?.chainKey;
		const chainId = status.params?.chainId;
		const id = status.params?.id;
		const connector = status.params?.connector;
		if(chainKey) {
			if(type) {
				update({currentNetwork: chainKey})
				emitNetworkChanged(chainId)
				approveRequest(connector, id, null)		
			}
			else {
				rejectRequest(connector, id, "Request reject by user")
			}
		}
		else {
			rejectRequest(connector, id, "Not exists chain")
		}
		updateStatus({switchChainModal: false, params: {}})
	}
	
	const addNetwork = async (type: boolean) => {
		const id = status.params?.id;
		const connector = status.params?.connector;
		const chain = status.params?.chain as AddEthereumChainParameter;
		if(type) {
			try {
				const chainKey = await hmac((chain?.chainId || '') + (chain?.chainName || ''));
				const newNetworks:NetworkObject[] = [];
				let exists = false;
				let existsChain;
				Object.values(networks).map((v) => {
					newNetworks.push(v)
					if(Number(v.chainId) === Number(chain?.chainId)) {
						exists = true;
						existsChain = v.chainKey;
					}
				})
				if(exists) 
				{
					update({ currentNetwork: existsChain})
					showToast("Already exists same chain", "warning");
					updateStatus({addChainModal: false, params: {}})
					return rejectRequest(connector, id, "Already exists same chain")
				}
				const network = {
					"chainKey": chainKey,
					"url": chain?.blockExplorerUrls?.[0] || '',
					"rpc": chain?.rpcUrls?.[0] || '',
					"symbol": chain?.nativeCurrency?.symbol || '',
					"testnet": (chain?.chainName || '').indexOf('test') > -1 ? true: false,
					"chainId" : Number(chain?.chainId) || 0,
					"label": chain?.chainName || '',
					"imported": true
				}
				let flag = false
				Object.values(networks).map((v) => {
					if(v.chainId === Number(chain?.chainId))  flag = true;
				})
				if(!flag) {
					newNetworks.push(network)
					update({networks: newNetworks, currentNetwork: chainKey})
					emitNetworkChanged(Number(chain?.chainId || 0))
					approveRequest(connector, id, null)
				}
				else {
					rejectRequest(connector, id, "Request rejected by user")
				}
			} catch (err: any){
				rejectRequest(connector, id, "Already exists same chain")
			}	
		} else {
			rejectRequest(connector, id, "Request reject by user")
		}
		updateStatus({addChainModal: false, params: {}})
	}

	const onPersonalSign = async (type: boolean) => {
		const id = status.params?.id;
		const connector = status.params?.connector;
		if(type) {
			try {
				const passHash = await hmac(status.password);
				const plain = await decrypt(vault, passHash);
				if (plain===null || plain==='') return showToast("Incorrect password", "warning")
				const wallet = JSON.parse(plain)
				const privatekey  = wallet.keys?.[currentAccount]	
				const sign = await personalSign(privatekey, status.params?.data || "");
				approveRequest(connector, id, sign)
			} catch(err: any) {
				console.log(err)
				return showToast("Incorrect password", "warning")
			}
		} else {
			rejectRequest(connector, id, "Request reject by user")
		}
		updateStatus({personalSignModal: false, params: {}, password: ""})
	}

	const onSignTypeData = async (type: boolean) => {
		const id = status.params?.id;
		const connector = status.params?.connector;
		if(type) {
			try {
				const passHash = await hmac(status.password);
				const plain = await decrypt(vault, passHash);
				if (plain===null || plain==='') return showToast("Incorrect password", "warning")
				const wallet = JSON.parse(plain)
				const privatekey  = wallet.keys?.[currentAccount]	
				const sign = await signTypedData_v4(privatekey, JSON.parse(status.params?.data[1]) || "");
				approveRequest(connector, id, sign)
			} catch(err: any) {
				console.log(err)
				return showToast("Incorrect password", "warning")
			}
		} else {
			rejectRequest(connector, id, "Request reject by user")
		}
		updateStatus({signDataModal: false, params: {}, password: ""})
	}

	const onEthSign = async (type: boolean) => {
		const id = status.params?.id;
		const connector = status.params?.connector;
		if(type) {
			try {
				const passHash = await hmac(status.password);
				const plain = await decrypt(vault, passHash);
				if (plain===null || plain==='') return showToast("Incorrect password", "warning")
				const wallet = JSON.parse(plain)
				const privatekey  = wallet.keys?.[currentAccount]	
				const sign = await signMessage(privatekey, status.params?.data[1] || "");
				approveRequest(connector, id, sign)
			} catch(err: any) {
				console.log(err)
				return showToast("Incorrect password", "warning")
			}
		} else {
			rejectRequest(connector, id, "Request reject by user")
		}
		updateStatus({ethSignModal: false, params: {}, password: ""})
	}

	const checkTransactionParams = async (connector: WalletConnect, id: number, param: any) => {
		let  rpc = '', symbol = '', chainId = '', explorer="", name='', nativeBalance='';
		Object.values(networks).map((network) => {
			if(network.chainKey === currentNetwork) {
				symbol = network.symbol;
				rpc = network.rpc;
				chainId = Number(network.chainId).toString();
				explorer = network.url;
			}
		})
		
		Object.values(accounts).map((account) => {
			if(account.address === currentAccount) {
				nativeBalance = account.value[currentNetwork] || '0'		
			}
		})

		let from = param.from || currentAccount;
		let {to, data, gasPrice, gas, nonce} = param;

		let value = param.value || "0";

		if(!from || from == null) return rejectRequest(connector, id, "error: not found from")
		if(!to || to == null) return rejectRequest(connector, id, "error: not found to")
		

		let hexData = "";
		if(data){
			if(data?.startsWith("0x")) data = data?.replace("0x", "")
			hexData = "0x"+data;	
		}
		if(hexData.length % 2 == 1) hexData = "0x0"+data;
		if(BigNumber.from(value).gt(BigNumber.from(nativeBalance))) {
			updateTransactionStatus({symbol, rpc, from, to, value, data:hexData, chainId, explorer})
			return showToast("Insufficient  balance", "warning");	
		}
		let method = "", params = {};
		let erc20 = undefined as {
			symbol: 	string
			decimals: 	number
			value:		string
		}|undefined

		if(hexData!=="0x" && hexData!==""){
			const methodData =  getMethodName(hexData);	
			method = methodData?.name || "unknown method";
			params = methodData?.args || {amount: 0};
			const index = 0;
			if (method==='approve') {
				const info = await checkContract(rpc, to);
				const ps = Object.values(params) ;	
				if(info != null  ) {
					erc20 = {
						symbol: 	info.symbol,
						decimals: 	info.decimals,
						value:		formatUnit(String(ps[index] || "0"), info.decimals).toString()
					}
				}	
			}
		}
		const rows = await getSendInfo(rpc, from, to, ZeroAddress, BigNumber.from(value)._hex || "0", hexData)
		let _gasPrice = gasPrice || rows[0]?.result
		let _nonce = nonce || rows[1]?.result
		let _limit = gas || rows[2]?.result
		const gasFee = bmul(_gasPrice, _limit).div(1e9).toString();
		updateTransactionStatus({method, params, erc20, symbol, rpc, from, to, nonce:_nonce, gasPrice:_gasPrice, gas:_limit, value, data:hexData, chainId, gasFee, explorer})
	}

	const sendTransaction = async (type: boolean) => {
		const id = status.params?.id;
		const connector = status.params?.connector;
		if(type) {
			try {
				const passHash = await hmac(status.password);
				const plain = await decrypt(vault, passHash);
				if (plain===null || plain==='') return showToast("Incorrect password", "warning")
				const wallet = JSON.parse(plain)
				const privatekey  = wallet.keys?.[currentAccount]	
				
				const tx = await providerTransaction(transactionStatus.rpc, Number(transactionStatus.chainId), privatekey,  transactionStatus.to, transactionStatus.value, transactionStatus.nonce,  transactionStatus.data, BigNumber.from(transactionStatus.gasPrice), BigNumber.from(transactionStatus.gas));
				if(tx != undefined) {
					const result = await checkTransaction(transactionStatus.rpc, tx)
					if(result) {
						const newtxs = {} as  {[chainKey: string] : {[hash: string]: Transaction}};
						let flag = false;
						if(transactions) Object.entries(transactions).map(([_chain, _transaction]) => {
							if(_chain !== currentNetwork) newtxs[_chain] = _transaction;
							else {
								let txs = {[result.hash]: {
									from:				result.from,
									transactionId:		result.hash,
									to:					transactionStatus.to,
									status:				result.blockNumber == null ?'pending' : 'confirmed',
									nonce:				Number(result.nonce).toString(),
									amount:				transactionStatus.value,
									gasPrice:			result.gasPrice,
									gasLimit:			result.gas,
									gasUsed:			'0',
									total:				"0",
									hexData:			result.input.substring(2),
									rpc:				transactionStatus.rpc,
									chainId:			Number(transactionStatus.chainId),
									tokenAddress:		transactionStatus.tokenAddress,
									explorer:			transactionStatus.explorer,
									symbol:				transactionStatus.symbol,
									decimals:			Number(18),
									log:				[],
									created:			'0',
									time:				+new Date() + 100000000,
									method:				transactionStatus.method
								}, ..._transaction};
								newtxs[_chain] = txs;
								flag = true;
							}
						});
						if(!flag) {
							let txs = {} as {[hash: string]: Transaction};
							txs[result.hash] = {
								from:				result.from,
								transactionId:		result.hash,
								to:					transactionStatus.to,
								status:				result.blockNumber == null ?'pending' : 'confirmed',
								nonce:				Number(result.nonce).toString(),
								amount:				result.value,
								gasPrice:			result.gasPrice,
								gasLimit:			result.gas,
								gasUsed:			result.gas,
								total:				"0",
								hexData:			result.input.substring(2),
								rpc:				transactionStatus.rpc,
								chainId:			Number(transactionStatus.chainId),
								tokenAddress:		transactionStatus.tokenAddress,
								explorer:			transactionStatus.explorer,
								symbol:				transactionStatus.symbol,
								decimals:			18,
								log:				[],
								created:			'0',
								time:				+new Date() + 100000000,
								method:				transactionStatus.method
							}
							newtxs[currentNetwork] = txs;
						}
						update({transactions: newtxs})
						approveRequest(connector, id, result.hash)
					}
					approveRequest(connector, id, null)
				}
				else {
					approveRequest(connector, id, null)
				}
			} catch(err: any) {
				return showToast("Incorrect password", "warning")
			}
		} else {
			rejectRequest(connector, id, "Request reject by user")
		}
		updateStatus({sendTransactionModal: false, params: {}, password: ""})
	}


	const signTransactionData = async (type: boolean) => {
		const id = status.params?.id;
		const connector = status.params?.connector;
		if(type) {
			try {
				const passHash = await hmac(status.password);
				const plain = await decrypt(vault, passHash);
				if (plain===null || plain==='') return showToast("Incorrect password", "warning")
				const wallet = JSON.parse(plain)
				const privatekey  = wallet.keys?.[currentAccount]	
				
				const hash = await signTransaction(transactionStatus.rpc, Number(transactionStatus.chainId), privatekey,  transactionStatus.to, transactionStatus.value, transactionStatus.nonce,  transactionStatus.data, BigNumber.from(transactionStatus.gasPrice), BigNumber.from(transactionStatus.gas));
				approveRequest(connector, id, hash)
			} catch(err: any) {
				return showToast("Incorrect password", "warning")
			}
		} else {
			rejectRequest(connector, id, "Request reject by user")
		}
		updateStatus({signTransactionModal: false, params: {}, password: ""})
	}

	return (
		<>
			{
				status.addChainModal && (
					<Modal title={"Add new network"}
						close={() => {addNetwork(false)}}
					>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: status.icon}} style={{width: w(10), height: w(10)}} />
						</Wrap>
						<Content style={gstyle.textLightCenter}>{status.url}</Content>
						<Content style={{...gstyle.textLightLgCenter, marginTop: h(2)}}>Allow to this network?</Content>
						<Content style={{...gstyle.textLightCenter, marginTop: h(2)}}>Do you want to add to this network?</Content>
						<Content style={gstyle.textLightCenter}>Name: {status.params?.chain?.chainName || ""}</Content>
						<Content style={gstyle.textLightCenter}>ChainId: {status.params?.chain?.chainId || ""}</Content>
						<Content style={gstyle.textLightCenter}>Rpc: {status.params?.chain?.rpcUrls[0] || ""}</Content>
						<Content style={gstyle.textLightCenter}>Explorer: {status.params?.chain?.blockExplorerUrls[0] || ""}</Content>
						<Wrap style={{...grid.btnGroup, marginTop: h(2)}}>
							<DefaultButton theme="danger" btnProps={{onPress: () => {addNetwork(false)}}}>Reject</DefaultButton>
							{status.params?.label && <DefaultButton theme="warning" btnProps={{onPress: () => {addNetwork(true)}}}>Allow</DefaultButton>}
						</Wrap>
					</Modal>
				)
			}
			{
				status.ethSignModal && (
					<Modal title={"Signatue Request"}
						close={() => onEthSign(false)}
					>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: status.icon}} style={{width: w(10), height: w(10)}} />
						</Wrap>
						<Content style={gstyle.textLightCenter}>{status.url}</Content>
						<Wrap style={{...grid.rowCenter, paddingTop: h(1), paddingBottom: h(1), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2), ...grid.gridMargin4}}>
							<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
								<Avatar address={currentAccount} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>		
							</Wrap>
							<Wrap style={{flex: 1}}>
								<Content style={gstyle.labelWhite}>
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return ellipsis(account.label, 10)
										}
									})}  :
									{
										ellipsis(currentAccount, 12)
									}
								</Content>
								<Content style={gstyle.labelWhite}> Balance:
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
									}})}  
									{
										networks && Object.values(networks).map((network) => {
											if( network.chainKey === currentNetwork){
												return " " + network.symbol
										}})
									}
								</Content>
							</Wrap>
						</Wrap>
						<Content style={{...gstyle.textLightLgCenter}}>Allow to sign this message?</Content>
						<Content style={{...gstyle.textLightCenter}}>You are signing:</Content>
						<Content style={{...gstyle.textLight, borderRadius: w(1), borderColor: colors.danger, borderWidth: w(0.3), padding: w(3)}}> {
							status.params?.data[1] || ""
						}</Content>
						
						<DefaultInput
							label={"Enter wallet password"}
							inputProps={{
								placeholder: "Wallet password",
								onChangeText: (txt:string) => updateStatus({password: txt}),
								value: status.password
							}}
							visibleValue={true}
						/>
						<Wrap style={{...grid.btnGroup, marginTop: h(2)}}>
							<DefaultButton theme="danger" btnProps={{onPress: () => {onEthSign(false)}}}>Reject</DefaultButton>
							<DefaultButton theme="warning" btnProps={{onPress: () => {onEthSign(true)}}}>Allow</DefaultButton>
						</Wrap>
					</Modal>
				)
			}
			{
				status.personalSignModal && (
					<Modal title={"Signatue Request"}
						close={() => onPersonalSign(false)}
					>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: status.icon}} style={{width: w(10), height: w(10)}} />
						</Wrap>
						<Content style={gstyle.textLightCenter}>{status.url}</Content>
						<Wrap style={{...grid.rowCenter, paddingTop: h(1), paddingBottom: h(1), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2), ...grid.gridMargin4}}>
							<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
								<Avatar address={currentAccount} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>		
							</Wrap>
							<Wrap style={{flex: 1}}>
								<Content style={gstyle.labelWhite}>
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return ellipsis(account.label, 10)
										}
									})}  :
									{
										ellipsis(currentAccount, 12)
									}
								</Content>
								<Content style={gstyle.labelWhite}> Balance:
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
									}})}  
									{
										networks && Object.values(networks).map((network) => {
											if( network.chainKey === currentNetwork){
												return " " + network.symbol
										}})
									}
								</Content>
							</Wrap>
						</Wrap>
						<Content style={{...gstyle.textLightLgCenter}}>Allow to sign this message?</Content>
						<Content style={{...gstyle.textLightCenter}}>You are signing:</Content>
						<Content style={{...gstyle.textLight, borderRadius: w(1), borderColor: colors.danger, borderWidth: w(0.3), padding: w(3)}}> {
								toUtf8(status.params?.data || "0x")
						}</Content>
						
						<DefaultInput
							label={"Enter wallet password"}
							inputProps={{
								placeholder: "Wallet password",
								onChangeText: (txt:string) => updateStatus({password: txt}),
								value: status.password
							}}
							visibleValue={true}
						/>
						<Wrap style={{...grid.btnGroup, marginTop: h(2)}}>
							<DefaultButton theme="danger" btnProps={{onPress: () => {onPersonalSign(false)}}}>Reject</DefaultButton>
							<DefaultButton theme="warning" btnProps={{onPress: () => {onPersonalSign(true)}}}>Allow</DefaultButton>
						</Wrap>
					</Modal>
				)
			}
			{
				status.sendTransactionModal && <></>
			}
			{
				status.signDataModal  && (
					<Modal title={"Signatue Request"}
						close={() => onSignTypeData(false)}
					>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: status.icon}} style={{width: w(10), height: w(10)}} />
						</Wrap>
						<Content style={gstyle.textLightCenter}>{status.url}</Content>
						<Wrap style={{...grid.rowCenter, paddingTop: h(1), paddingBottom: h(1), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2), ...grid.gridMargin4}}>
							<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
								<Avatar address={currentAccount} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>		
							</Wrap>
							<Wrap style={{flex: 1}}>
								<Content style={gstyle.labelWhite}>
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return ellipsis(account.label, 10)
										}
									})}: 
									{
										ellipsis(currentAccount, 12)
									}
								</Content>
								<Content style={gstyle.labelWhite}>Balance:&nbsp;&nbsp;
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
									}})}  
									{
										networks && Object.values(networks).map((network) => {
											if( network.chainKey === currentNetwork){
												return " " + network.symbol
										}})
									}
								</Content>
							</Wrap>
						</Wrap>
						<Content style={{...gstyle.textLightLgCenter}}>Allow to sign this message?</Content>
						<Content style={{...gstyle.textLightCenter}}>You are signing:</Content>
						<ScrollWrap style={{height: h(20), marginBottom: h(2)}}>
							<Content style={{borderRadius: w(1), borderColor: colors.danger, borderWidth: w(0.3), padding: w(3)}}> {
								status.params?.data[1] &&  
								Object.entries(JSON.parse(status.params?.data[1])?.["message"]).map(([key, value]: any) => {
									return <Content style={gstyle.textLight} key={key}>
										{
											key + ": " + JSON.stringify(value)
										}
										</Content>
								})
							}</Content>
						</ScrollWrap>
						
						<DefaultInput
							label={"Enter wallet password"}
							inputProps={{
								placeholder: "Wallet password",
								onChangeText: (txt:string) => updateStatus({password: txt}),
								value: status.password
							}}
							visibleValue={true}
						/>
						<Wrap style={{...grid.btnGroup, marginTop: h(1)}}>
							<DefaultButton theme="danger" btnProps={{onPress: () => {onSignTypeData(false)}}}>Reject</DefaultButton>
							<DefaultButton theme="warning" btnProps={{onPress: () => {onSignTypeData(true)}}}>Allow</DefaultButton>
						</Wrap>
					</Modal>
				)
			}
			{
				status.switchChainModal && (
					<Modal title={"Switch Network"}
						close={() => {switchNetwork(false)}}
					>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: status.icon}} style={{width: w(10), height: w(10)}} />
						</Wrap>
						<Content style={gstyle.textLightCenter}>{status.url}</Content>
						<Content style={{...gstyle.textLightLgCenter, marginTop: h(2)}}>Allow to this network?</Content>
						<Content style={{...gstyle.textLightCenter, marginTop: h(2)}}>Do you want to allow to switch this network?</Content>
						<Content style={gstyle.textLightCenter}>ChainId: {status.params?.chainId || 0}</Content>
						<Content style={gstyle.textLightCenter}>Network: {status.params?.label || ""}</Content>
						<Wrap style={{...grid.btnGroup, marginTop: h(2)}}>
							<DefaultButton theme="danger" btnProps={{onPress: () => {switchNetwork(false)}}}>Reject</DefaultButton>
							{status.params?.label && <DefaultButton theme="warning" btnProps={{onPress: () => {switchNetwork(true)}}}>Allow</DefaultButton>}
						</Wrap>
					</Modal>
				)
			}
			{
				status.sendTransactionModal && (
					<Modal title="Send Transaction" close={() => sendTransaction(false)}>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: status.icon}} style={{width: w(10), height: w(10)}} />
						</Wrap>
						<Content style={gstyle.textLightCenter}>{status.url}</Content>
						<Content style={{...gstyle.textLightSmCenter, borderRadius: w(1), borderColor: colors.border, borderWidth: w(0.2), padding: w(1), marginHorizontal:"auto"}} >
							{Object.values(networks).map((network) => {
								if( network.chainKey === currentNetwork){
									return network.label
								}}) 
							}
						</Content>
						<Wrap style={{...grid.rowCenter, paddingTop: h(1), paddingBottom: h(1), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2), ...grid.gridMargin4}}>
							<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
								<Avatar address={currentAccount} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>		
							</Wrap>
							<Wrap style={{flex: 1}}>
								<Content style={gstyle.labelWhite}>
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return ellipsis(account.label, 10)
										}
									})}:&nbsp;&nbsp;
									{
										ellipsis(currentAccount, 12)
									}
								</Content>
								<Content style={gstyle.labelWhite}>Balance:&nbsp;&nbsp;
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
									}})}  
									{
										networks && Object.values(networks).map((network) => {
											if( network.chainKey === currentNetwork){
												return " " + network.symbol
										}})
									}
								</Content>
							</Wrap>
						</Wrap>
						{
							(transactionStatus.data !== "" && transactionStatus.data !== "0x") && <Wrap style={{...grid.rowCenter, justifyContent:"flex-start"}}>
								<OpacityButton style={{padding:w(1), paddingLeft: w(3), paddingRight: w(3),  borderWidth:w(0.2), borderColor:"transparent",  borderBottomColor:transactionStatus.tabIndex===1?'rgb(144, 59, 255)':'transparent'}} onPress={() => {updateTransactionStatus({tabIndex:1})}}>
									<Content style={gstyle.labelWhite}>DETAILS</Content>
								</OpacityButton>
								<OpacityButton style={{padding:w(1), paddingLeft: w(3), paddingRight: w(3), borderWidth:w(0.2), borderColor:"transparent", borderBottomColor:transactionStatus.tabIndex===2?'rgb(144, 59, 255)':'transparent'}} onPress={() => {updateTransactionStatus({tabIndex:2})}}>
									<Content style={gstyle.labelWhite}>DATA</Content>
								</OpacityButton>
								<OpacityButton style={{padding:w(1), paddingLeft: w(3), paddingRight: w(3), borderWidth:w(0.2), borderColor:"transparent", borderBottomColor:transactionStatus.tabIndex===3?'rgb(144, 59, 255)':'transparent'}} onPress={() => {updateTransactionStatus({tabIndex:3})}}>
									<Content style={gstyle.labelWhite}>HEX</Content>
								</OpacityButton>
							</Wrap>
						}
						<Wrap style={gstyle.hr}></Wrap>
						{
							(transactionStatus.tabIndex === 1) && <>
								<Wrap style={{ paddingTop: h(2), paddingLeft: w(2), paddingRight: w(2), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2)}}>
									<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
										<Content style={gstyle.textDanger}>Gas (estimated): </Content>
										<Content style={gstyle.textLight}>{roundNumber(formatUnit(transactionStatus.gasFee || "0", 9).toString())}</Content>
									</Wrap>
									<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
										<Content style={gstyle.textDanger}>Max fee: </Content>
										<Content style={gstyle.textLight}>
											{roundNumber(formatUnit(transactionStatus.gasFee || "0", 9).toString()) + transactionStatus.symbol}
										</Content>
									</Wrap>
								</Wrap>
								<Wrap style={gstyle.hr}></Wrap>
								
								<Wrap style={{ paddingTop: h(2), paddingLeft: w(2), paddingRight: w(2), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2)}}>
									<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
										<Wrap>
											<Content style={gstyle.textDanger}>Total: </Content>
											<Content style={gstyle.textDanger}>Amount + gas fee: </Content>
										</Wrap>
										<Content style={gstyle.textLight}>
										{
											transactionStatus.method == "" ? roundNumber(Number(formatUnit(transactionStatus.gasFee || "0", 9))  + Number(formatUnit(transactionStatus.value || "0", 18))).toString().concat(" ", transactionStatus.symbol) : roundNumber(Number(formatUnit(transactionStatus.gasFee || "0", 9))).concat(" ", transactionStatus.symbol)
										}
										</Content>
									</Wrap>
								</Wrap>
								<Wrap style={{marginTop: h(2)}}></Wrap>
								<DefaultInput
									label={"Enter wallet password"}
									inputProps={{
										placeholder: "Wallet password",
										onChangeText: (txt:string) => updateStatus({password: txt}),
										value: status.password
									}}
									visibleValue={true}
								/>
							</>
						}
						{
							transactionStatus.tabIndex === 2 && <>
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
									<Content style={gstyle.textLight}>FUNCTION TYPE: </Content>
									<Content style={gstyle.textLight}>{transactionStatus.method} </Content>
								</Wrap>
								<Content style={gstyle.textLight}>PARAMETERS: </Content>
								{
									transactionStatus.params && Object.entries(transactionStatus.params).map(([key, param]) => (
										<Content style={gstyle.textLightSm}>{transactionStatus.method === "approve" ? key +" : ": ""} 
											{transactionStatus.erc20 ? 
												key !== "amount" ? ellipsis(param, 20) : `${formatUnit(param, transactionStatus.erc20.decimals)}${transactionStatus.erc20.symbol}` 
												: 
												ellipsis(param, 25)}
										</Content>
									))
								} 
							</>
						}
						{
							transactionStatus.tabIndex === 3 && <>
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
									<Content style={gstyle.textLight}>FUNCTION TYPE: </Content>
									<Content style={gstyle.textLight}>{transactionStatus.method} </Content>
								</Wrap>
								<Content style={gstyle.textLight}>hex data: </Content>
								<Content style={gstyle.textLightSm}>
									{transactionStatus.data}
								</Content>
							</>
						}
						
						<Wrap style={{...grid.btnGroup, marginTop: h(1)}}>
							<DefaultButton theme="danger" btnProps={{onPress: () => {sendTransaction(false)}}}>Reject</DefaultButton>
							<DefaultButton theme="warning" btnProps={{onPress: () => {sendTransaction(true)}}}>Allow</DefaultButton>
						</Wrap>
					</Modal>
				)
			}
			{
				status.signTransactionModal && (
					<Modal title="Sign Transaction" close={() => signTransactionData(false)}>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: status.icon}} style={{width: w(10), height: w(10)}} />
						</Wrap>
						<Content style={gstyle.textLightCenter}>{status.url}</Content>
						<Content style={{...gstyle.textLightSmCenter, borderRadius: w(1), borderColor: colors.border, borderWidth: w(0.2), padding: w(1), marginHorizontal:"auto"}} >
							{Object.values(networks).map((network) => {
								if( network.chainKey === currentNetwork){
									return network.label
								}}) 
							}
						</Content>
						<Wrap style={{...grid.rowCenter, paddingTop: h(1), paddingBottom: h(1), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2), ...grid.gridMargin4}}>
							<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
								<Avatar address={currentAccount} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>		
							</Wrap>
							<Wrap style={{flex: 1}}>
								<Content style={gstyle.labelWhite}>
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return ellipsis(account.label, 10)
										}
									})}:&nbsp;&nbsp;
									{
										ellipsis(currentAccount, 12)
									}
								</Content>
								<Content style={gstyle.labelWhite}>Balance:&nbsp;&nbsp;
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
									}})}  
									{
										networks && Object.values(networks).map((network) => {
											if( network.chainKey === currentNetwork){
												return " " + network.symbol
										}})
									}
								</Content>
							</Wrap>
						</Wrap>
						{
							(transactionStatus.data !== "" && transactionStatus.data !== "0x") && <Wrap style={{...grid.rowCenter, justifyContent:"flex-start"}}>
								<OpacityButton style={{padding:w(1), paddingLeft: w(3), paddingRight: w(3),  borderWidth:w(0.2), borderColor:"transparent",  borderBottomColor:transactionStatus.tabIndex===1?'rgb(144, 59, 255)':'transparent'}} onPress={() => {updateTransactionStatus({tabIndex:1})}}>
									<Content style={gstyle.labelWhite}>DETAILS</Content>
								</OpacityButton>
								<OpacityButton style={{padding:w(1), paddingLeft: w(3), paddingRight: w(3), borderWidth:w(0.2), borderColor:"transparent", borderBottomColor:transactionStatus.tabIndex===2?'rgb(144, 59, 255)':'transparent'}} onPress={() => {updateTransactionStatus({tabIndex:2})}}>
									<Content style={gstyle.labelWhite}>DATA</Content>
								</OpacityButton>
								<OpacityButton style={{padding:w(1), paddingLeft: w(3), paddingRight: w(3), borderWidth:w(0.2), borderColor:"transparent", borderBottomColor:transactionStatus.tabIndex===3?'rgb(144, 59, 255)':'transparent'}} onPress={() => {updateTransactionStatus({tabIndex:3})}}>
									<Content style={gstyle.labelWhite}>HEX</Content>
								</OpacityButton>
							</Wrap>
						}
						<Wrap style={gstyle.hr}></Wrap>
						{
							(transactionStatus.tabIndex === 1) && <>
								<Wrap style={{ paddingTop: h(2), paddingLeft: w(2), paddingRight: w(2), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2)}}>
									<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
										<Content style={gstyle.textDanger}>Gas (estimated): </Content>
										<Content style={gstyle.textLight}>{roundNumber(formatUnit(transactionStatus.gasFee || "0", 9).toString())}</Content>
									</Wrap>
									<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
										<Content style={gstyle.textDanger}>Max fee: </Content>
										<Content style={gstyle.textLight}>
											{roundNumber(formatUnit(transactionStatus.gasFee || "0", 9).toString()) + transactionStatus.symbol}
										</Content>
									</Wrap>
								</Wrap>
								<Wrap style={gstyle.hr}></Wrap>
								
								<Wrap style={{ paddingTop: h(2), paddingLeft: w(2), paddingRight: w(2), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2)}}>
									<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
										<Wrap>
											<Content style={gstyle.textDanger}>Total: </Content>
											<Content style={gstyle.textDanger}>Amount + gas fee: </Content>
										</Wrap>
										<Content style={gstyle.textLight}>
										{
											transactionStatus.method == "" ? roundNumber(Number(formatUnit(transactionStatus.gasFee || "0", 9))  + Number(formatUnit(transactionStatus.value || "0", 18))).toString().concat(" ", transactionStatus.symbol) : roundNumber(Number(formatUnit(transactionStatus.gasFee || "0", 9))).concat(" ", transactionStatus.symbol)
										}
										</Content>
									</Wrap>
								</Wrap>
								<Wrap style={{marginTop: h(2)}}></Wrap>
								<DefaultInput
									label={"Enter wallet password"}
									inputProps={{
										placeholder: "Wallet password",
										onChangeText: (txt:string) => updateStatus({password: txt}),
										value: status.password
									}}
									visibleValue={true}
								/>
							</>
						}
						{
							transactionStatus.tabIndex === 2 && <>
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
									<Content style={gstyle.textLight}>FUNCTION TYPE: </Content>
									<Content style={gstyle.textLight}>{transactionStatus.method} </Content>
								</Wrap>
								<Content style={gstyle.textLight}>PARAMETERS: </Content>
								{
									transactionStatus.params && Object.entries(transactionStatus.params).map(([key, param]) => (
										<Content style={gstyle.textLightSm}>{transactionStatus.method === "approve" ? key +" : ": ""} 
											{transactionStatus.erc20 ? 
												key !== "amount" ? ellipsis(param, 20) : `${formatUnit(param, transactionStatus.erc20.decimals)}${transactionStatus.erc20.symbol}` 
												: 
												ellipsis(param, 25)}
										</Content>
									))
								} 
							</>
						}
						{
							transactionStatus.tabIndex === 3 && <>
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
									<Content style={gstyle.textLight}>FUNCTION TYPE: </Content>
									<Content style={gstyle.textLight}>{transactionStatus.method} </Content>
								</Wrap>
								<Content style={gstyle.textLight}>hex data: </Content>
								<Content style={gstyle.textLightSm}>
									{transactionStatus.data}
								</Content>
							</>
						}
						
						<Wrap style={{...grid.btnGroup, marginTop: h(1)}}>
							<DefaultButton theme="danger" btnProps={{onPress: () => {signTransactionData(false)}}}>Reject</DefaultButton>
							<DefaultButton theme="warning" btnProps={{onPress: () => {signTransactionData(true)}}}>Allow</DefaultButton>
						</Wrap>
					</Modal>
				)
			}
		</>
	);
}

export default WalletConnectDetect