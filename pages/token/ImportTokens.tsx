import React from "react"
import { isValidAddress } from "ethereumjs-util"
import Icon from "../components/Icon"
import Coins from "../../assets/coins.png"
import { Content, OpacityButton, Picture, ScrollWrap, Wrap } from "../components/commons"
import { DefaultButton, DefaultInput, ImageInput, Loading } from "../components/elements"
import { colors, grid, gstyle, h, w } from "../components/style"
import FunctionLayout from "../layouts/FunctionLayout"
import useStore, { ellipsis } from "../../useStore"
import {checkContract} from '../../library/wallet'

interface ImportTokenObject {
	tabKey: 		number
	address1:		string
	symbol1:		string
	decimals1:		string
	name1:			string
	address2:		string
	name2:			string
	symbol2:		string
	decimals2:		string
	loading:		boolean
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<ImportTokenObject>({
		tabKey:			0,
		address1:		"",
		symbol1:		"",
		decimals1:		"",
		name1:			"",
		address2:		"",
		name2:			"",
		symbol2:		"",
		decimals2:		"",
		loading:		false
	})
		
	const updateStatus = (params:Partial<ImportTokenObject>) => setStatus({...status, ...params});

	const {tokens, currentNetwork, currentAccount,  accounts, networks, update, showToast} = useStore()

	const goBack = () => { 
		navigation?.navigate('WalletTokens')
	}

	const checkToken = async (address: string) => {
		if(!isValidAddress(address)) {
			if(status.tabKey===0) updateStatus({address1: address, symbol1: '', name1:'', decimals1: ''})
			else  updateStatus({address2: address, symbol2: '', decimals2: '', name2:''});
			return;
		}
		if(status.tabKey === 0)  updateStatus({address1: address})
		if(status.tabKey === 1)  updateStatus({address2: address})
		const info  = await getContractInfo(address);
		if(info !== null) {
			if(status.tabKey === 0) return updateStatus({address1: address, name1:info.name, symbol1: info.symbol, decimals1: info.decimals? Number(info.decimals).toString(): ""})
			if(status.tabKey === 1) return updateStatus({address2: address, name2:info.name, symbol2: info.symbol, decimals2: info.decimals? Number(info.decimals).toString(): ""})
		}
		else {
			if(status.tabKey === 0) return updateStatus({address1: address, name1:'', symbol1: '', decimals1: ''})
			if(status.tabKey === 1) return updateStatus({address2: address, name2:'', symbol2: '', decimals2: ''})
		}
	}

	const getContractInfo = async (address: string) :  Promise<Partial<TokenInterface> | null>=> (
		new Promise(async response => {
			let rpc = null;
			Object.values(networks).map(( network) => {
				if( network.chainKey === currentNetwork){
					rpc = network.rpc;
				}
			})
			if(rpc !== null) {
				updateStatus({loading: true})
				try {
					const info = await checkContract(rpc, address)
					updateStatus({loading: false})
					if(info != null) {
						const name = info.name
						const contractAddress = info.address
						const decimals = info.decimals;
						const symbol = info.symbol;
						return response({name, decimals, symbol, address:contractAddress})	
					}
				} catch(err) {
					updateStatus({loading: false})
				}
			}
			return response(null)
		})
	);


	const importToken = () => {
		const address= status.tabKey === 0 ? status.address1 : status.address2;
		const name= status.tabKey === 0 ? status.name1 : status.name2;
		const symbol= status.tabKey === 0 ? status.symbol1 : status.symbol2;
		const decimals= status.tabKey === 0 ? status.decimals1 : status.decimals2

		if(address === "") return showToast("Invalid address")
		if(name === "") return showToast("Invalid name")
		if(symbol === "") return showToast("Invalid symbol")
		if(decimals === "") return showToast("Invalid decimals")

		var accs:AccountObject[] = [];
		Object.values(accounts).map((account) => {
			if(account.address.toLowerCase() !== currentAccount.toLowerCase()) accs.push(account)
			else {
				let tks:{[tkey:string] :string} = {};
				account.tokens[currentNetwork] && Object.entries(account.tokens[currentNetwork]).map(([tkey, tvalue]) => {
					tks[tkey] = tvalue;
				})
				if(account.address === currentAccount) {
					tks[address] = "0";
				}
				let newAccount:AccountObject = {
					"address": account.address,
					"imported": account.imported,
					"index": account.index,
					"label": account.label,
					"value": account.value,
					"tokens": {...account.tokens, [currentNetwork]: tks}
				}
				accs.push(newAccount)
			}
		})
		let newTokens:{[chainKey: string]: {[token: string]: TokenInfoObject}}  = {}
		if(tokens && Object.entries(tokens).length> 0) { 
			let flag = false;
			Object.entries(tokens).map(([chainKey, tks]) => {
				if(chainKey !== currentNetwork) newTokens[chainKey] = tks;
				else {
					let newTks:{[token: string]: TokenInfoObject} = {};
					Object.entries(tks).map(([adr, info]) => {
						newTks[adr] = info;
					})
					newTks[address] = {
						"name": name,
						"symbol": symbol,
						"decimals": decimals,
						"icon": "",
						"type":"ERC20"
					};
					newTokens[chainKey] = newTks;
					flag = true;
				}
			})
			if(!flag) {
				let newTks:{[token: string]: TokenInfoObject} = {};
				newTks[address] = {
					"name": name,
					"symbol": symbol,
					"decimals": decimals,
					"icon": "",
					"type":"ERC20"
				};
				newTokens[currentNetwork] = newTks;
			}
		}
		else { 
			let newTks:{[token: string]: TokenInfoObject} = {};
			newTks[address] = {
				"name": name,
				"symbol": symbol,
				"decimals": decimals,
				"icon": "", 
				"type":"ERC20"
			};
			newTokens[currentNetwork] = newTks; 
		}
		update({accounts: accs, tokens:newTokens}) 
		showToast("Imported token successfully", "success")
		goBack()
	}


	return (
		<>
			<FunctionLayout
				navigation={navigation}
				title="IMPORT TOKENS"
				onBack={goBack}
			>
				<Wrap>
					<Wrap style={{display: "flex", alignItems: "center"}}>
						<Wrap style={{flex: 1, width: w(100)}}>
							<Wrap style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
								<OpacityButton style={{flex: 1, borderBottomWidth: h(0.1), borderColor: (status.tabKey === 0 ? colors.color : colors.border)}} onPress={() => setStatus({...status, tabKey: 0})}>
									<Content style={gstyle.textLightCenter}>// SEARCH</Content>
								</OpacityButton>
								<OpacityButton style={{flex: 1, borderBottomWidth: h(0.1), borderColor: (status.tabKey === 1 ? colors.color : colors.border)}} onPress={() => setStatus({...status, tabKey: 1})}>
									<Content style={gstyle.textLightCenter}>// CUSTOM TOKEN</Content>
								</OpacityButton>
							</Wrap>
							<ScrollWrap>
								<Wrap style={{alignSelf: "center",width: w(90), paddingTop: h(3), paddingBottom: h(3)}}>
									{status.tabKey === 0 && (
										<>
											<Wrap style={{...grid.rowCenterCenter, paddingTop: h(2), paddingBottom: h(2), paddingLeft: w(3), paddingRight: w(3), backgroundColor: colors.bgLight, marginBottom: h(3)}}>
												<Wrap style={{marginRight: w(2)}}>
													<Icon.Exclamation color={colors.bgButton} />
												</Wrap>
												<Wrap style={{flex: 1}}>
													<Content style={gstyle.labelWhite}>New! Improved token detection is available on Ethereum Mainnet as an experinebtak feature. Enable it frin wetting</Content>
												</Wrap>
											</Wrap>
											<Wrap style={{marginBottom: h(3)}}>
												<ImageInput
													icon={<Icon.Search color={colors.placeholder} />} 
													inputProps={{
														placeholder: "Search Tokens",
														onChangeText: (txt:string) => checkToken(txt),
														value:	  status.address1
													}}
												/>
											</Wrap>
											<Wrap style={{marginBottom: h(5)}}>
												{status.symbol1 !== "" ? (
													<>
														<Content style={{...gstyle.labelWhite, marginTop:h(1)}}>Address: {ellipsis(status.address1, 25)}</Content>
														<Content style={{...gstyle.labelWhite, marginTop:h(1)}}>Name: {status.name1}</Content>
														<Content style={{...gstyle.labelWhite, marginTop:h(1)}}>Symbol: {status.symbol1}</Content>
														<Content style={{...gstyle.labelWhite, marginTop:h(1)}}>Decimals: {status.decimals1}</Content>
													</>
												):(
													<>
														<Wrap style={{...grid.rowCenterCenter, marginBottom: h(10)}}>
															
														</Wrap>
														<Wrap style={grid.rowCenterCenter}>
															<Content style={{...gstyle.textLightCenter, width: w(50)}}>Add the tokens you’ve aquired using ICICBWallet</Content>
														</Wrap>
														<Content style={{...gstyle.link, ...gstyle.textCenter}} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.ICICBWallet.io/guide/"})}}>Learn more</Content> 
													</>
												)}
											</Wrap>
											<Wrap style={grid.btnGroup}>
												<DefaultButton btnProps={{onPress: () => {importToken()}}}>NEXT</DefaultButton>
											</Wrap>
										</>
									)}
									{status.tabKey === 1 && (
										<>
											<Wrap style={{...grid.rowCenterCenter, paddingTop: h(2), paddingBottom: h(2), paddingLeft: w(3), paddingRight: w(3), backgroundColor: colors.bgLight, marginBottom: h(3)}}>
												<Wrap style={{marginRight: w(2)}}>
													<Icon.Exclamation color={colors.bgButton} />
												</Wrap>
												<Wrap style={{flex: 1}}>
													<Content style={gstyle.labelWhite}>Anyone can create a token, including creating fake versions of existing tokens. <Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.ICICBWallet.io/guide/"})}}>Learn more</Content>  about <Content>scams and security risks</Content></Content>
												</Wrap>
											</Wrap>
											<DefaultInput
												label="Token Address"
												visibleValue={false}
												inputProps={{
													placeholder: "Ox...",
													onChangeText: (txt:string) => checkToken(txt),
													value:	  status.address2
												}}
											/>
											<DefaultInput
												label="Token Symbol"
												visibleValue={false}
												inputProps={{
													placeholder: "GNO",
													value:	  status.symbol2,
													editable: false
												}}
											/>
											<DefaultInput
												label="Token Decimals"
												visibleValue={false}
												inputProps={{
													placeholder: "18",
													value:	status.decimals2,
													editable: false
												}}
											/>
											<Wrap style={grid.btnGroup}>
												<DefaultButton btnProps={{onPress: () => {importToken()}}}>NEXT</DefaultButton>
											</Wrap>
										</>
									)}
								</Wrap>
							</ScrollWrap>
						</Wrap>
					</Wrap>
				</Wrap>
			</FunctionLayout>
			
			{
				status.loading && <Loading />
			}
		</>
	)
}
