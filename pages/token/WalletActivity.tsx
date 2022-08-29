import React from "react"
import SvgUri from 'react-native-svg-uri-updated';
import { colors, grid, gstyle, h, w } from "../components/style"
import { Content, OpacityButton, Picture, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import Avatar from "../components/avatar"
import CopiedModal from "../layouts/CopiedModal"
import AccountModal from "../layouts/AccountModal"
import FunctionLayout from "../layouts/FunctionLayout"
import { FunctionalButton } from "../components/elements"
import { ZeroAddress } from "../../library/wallet"
import { formatUnit } from "../../library/bigmath"
import useStore, { copyToClipboard, ellipsis, getChainIcon, getTokenIcon, initChainIcons, initTokenIcons, roundNumber, toDate } from '../../useStore'

interface WalletTokenStatus {
	showMenu:	  	boolean
	copiedModal:	boolean
	accountModal:   boolean
	tokenAddress:   string
	balance:		string
	symbol:		 	string
	txs:			Transaction[]
}

export default function ({route, navigation }: any) {
	const {tokenAddress} = route.params;
	
	const [icons, setIcons] = React.useState<{[key:string]: string}>({});
	const [tokenIcons, setTokenIcons] = React.useState<{[key:string]: string}>({});

	const [status, setStatus] = React.useState<WalletTokenStatus>({
		showMenu:			false,
		copiedModal:		false,
		accountModal:		false,
		tokenAddress:		ZeroAddress,
		balance:			"0",
		symbol:				"",
		txs:				[],
	})
	const updateStatus = (params:Partial<WalletTokenStatus>) => setStatus({...status, ...params});

	const {currentAccount, currentNetwork, transactions, setting, accounts,  tokens, networks} = useStore()
		
	const checkTokenStatus = () => {
		let symbol = '';
		let balance = '';
		let decimals = '18';
		if(tokenAddress === ZeroAddress) {
			Object.values(accounts).map(( account ) => {
				if(account.address === currentAccount) {
					balance = account.value[currentNetwork] || '0'		
				}
			})
			Object.values(networks).map(( network) => {
				if( network.chainKey === currentNetwork){
					symbol =  network.symbol
					decimals = '18';
			}})
		}
		else {
			Object.values(accounts).map(( account) => {
				if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][tokenAddress]) {
					balance = account.tokens[currentNetwork][tokenAddress].toString()  || '0'		
				}
			})	
			tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => 
			{
				if(key === tokenAddress) {
					symbol = value.symbol
					decimals = value.decimals
				}
			})
		}
		const currentTxs = transactions[currentNetwork];
		let txs:Transaction[] = [];
		if(!currentTxs || Object.entries(currentTxs).length === 0) return updateStatus({symbol, tokenAddress: tokenAddress, balance});
		{Object.values(currentTxs).map(( tx ) => {
			if(tx.tokenAddress == tokenAddress && (tx.from.toLowerCase() === currentAccount.toLowerCase() || tx.to.toLowerCase() === currentAccount.toLowerCase())) {
				txs.push(tx)
			}
		})}  
		txs = txs.sort((a, b) => {return a.time>b.time? -1: 1})
		updateStatus({txs: txs, symbol, tokenAddress: tokenAddress, balance})
	}

	React.useEffect(() => {
		checkTokenStatus()
		
		initChainIcons().then(()=>{
			const _icons = {} as {[key: string]: string}
			for (let k in networks) {
				const icon = getChainIcon(networks[k].chainId);
				if (icon) _icons[networks[k].chainId] = icon;
			}
			setIcons(_icons)
		});
		
		initTokenIcons().then(()=>{
			const _icons = {} as {[key: string]: string}
			if(currentNetwork === "neon") {
				if(tokens[currentNetwork]) Object.entries(tokens[currentNetwork]).map(([key, value]) => {			
					Object.values(accounts).map( async(account) => {	
						if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][key]) {
							const icon = await getTokenIcon(key);
							if (icon) _icons[key] = icon;
						}
					})
				})
			}
			setTokenIcons(_icons)
		});
	}, [])

	React.useEffect(() => {
		checkTokenStatus()
	}, [currentAccount, currentNetwork, transactions, accounts])
		
	return (
		<>
			<FunctionLayout
				navigation={navigation} 
				hideClose
			>
				<Wrap style={{alignSelf: "stretch", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: h(2)}}>
					<Wrap style={{...grid.rowCenterBetween, width: w(100)}}>
						<OpacityButton style={{width: w(5),  display:'flex', alignContent:'center', justifyContent:'center'}} onPress = {() => {navigation.navigate("WalletTokens")}}> 
							<Wrap style={{marginLeft: w(1)}}>
								<Icon.ArrowLeft color={colors.color}/>
							</Wrap>
						</OpacityButton>
						<Wrap>
							<Content style={{...gstyle.textCenter, ...gstyle.labelLg}}>
								{Object.entries(accounts).map(([index, account]) => {
									if(account.address === currentAccount) {
										return ellipsis(account.label, 15) 
									}
								})}  
							</Content>
							<OpacityButton style={grid.rowCenter} onPress={() => {copyToClipboard(currentAccount); updateStatus({copiedModal: true})}}>
								<Content style={{...gstyle.textCenter, ...gstyle.labelSm}}>{ellipsis(currentAccount, 15)}</Content>
								<Wrap style={{marginLeft: w(2)}}><Icon.Copy color="white" width={w(3)} /></Wrap>
							</OpacityButton>
						</Wrap>
						<Wrap style={{width: w(5)}}></Wrap>
					</Wrap>
					<Wrap style={{...gstyle.hr2, marginTop: h(0), backgroundColor: colors.color}} />
					<Wrap>
					{
						status.tokenAddress !== ZeroAddress && <>
							{
								currentNetwork === "rinkeby" ? (tokenIcons[status.tokenAddress] ?  
									<Picture source={{uri: tokenIcons[status.tokenAddress]}} style={{width: w(18), height: w(18), borderRadius: w(10)}} resizeMode="stretch" resizeMethod="scale" />
									:
									<Avatar address={status.tokenAddress} type={setting.identicon === 'jazzicons'? "Zazzicon": "Blockies"} size={12}/>
								) :
								<Avatar address={status.tokenAddress} type={setting.identicon === 'jazzicons'? "Zazzicon": "Blockies"} size={12}/>
							}
						</>
					}
					{
						status.tokenAddress === ZeroAddress && networks && Object.entries(networks).map(([index, network]) => {
							if(network.chainKey === currentNetwork)  return <Wrap key={index}>
								{
									icons[network.chainId] ? 
									(icons[network.chainId].toLowerCase().endsWith(".svg") ? 
									<Wrap>
										  <SvgUri width={"40"} height={"40"} source={{uri:icons[network.chainId]}}
											/>
									</Wrap>: 
										<Picture source={{uri: icons[network.chainId]}} style={{width: w(18), height: w(18), borderRadius: w(10)}} resizeMode="stretch" resizeMethod="scale" />
									)
									:
									<Avatar address={currentNetwork} type={setting.identicon === 'jazzicons'? "Zazzicon": "Blockies"} size={12}/>
								}
							</Wrap>
						})
					}
					</Wrap>
					<Content style={{...gstyle.labelWhite, fontSize: w(6), color: colors.color}}>
						{roundNumber(formatUnit(status.balance || '0', 18), 8)} {status.symbol}
					</Content> 
					<Wrap style={{alignSelf: "center", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: w(80), marginTop:h(2), marginBottom: h(3)}}>
						<FunctionalButton label="Buy" btnProps={{disabled: true}}>
							<Icon.Receive color={colors.color} />
						</FunctionalButton>
						<FunctionalButton label="Send" btnProps={{onPress: ()=>navigation.navigate("Send", {page: "money", tokenAddress: status.tokenAddress, tokenId: "", selectedNftIndex: 0})}}>
							<Icon.Send color={colors.color} />
						</FunctionalButton>
						<FunctionalButton label="Swap" btnProps={{disabled: true}}>
							<Icon.Swap color={colors.color} />
						</FunctionalButton>
					</Wrap>
					<Wrap style={grid.colBetween}>
						 {!status.txs || status.txs === null || Object.entries(status.txs).length === 0 ? (
							<Content style={{marginTop: h(3), ...gstyle.textLightCenter}}>You have no transaction</Content>
						) : (
							<Wrap>
								<Wrap style={{marginBottom: h(4)}}> 
									{status.txs.length > 0 && status.txs.map((tx, index)=> (
										<OpacityButton key={index} style={{borderBottomWidth: h(0.1), borderTopWidth: h(0.1), borderColor: colors.border, paddingRight: w(5), paddingLeft: w(5), paddingTop: h(2), paddingBottom: h(2)}} onPress={() => navigation.navigate("TsxDetails", {tx: tx})}>
											<Wrap style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
												<Wrap style={grid.rowCenterBetween}>
													<Wrap style={{marginRight: w(2)}}>
														{
															tx.from === currentAccount.toLowerCase() ? <Icon.Send  width={w(5)} height={w(5)} color={colors.color}/> : <Icon.Receive width={w(5)} height={w(5)} color={colors.color}/>
														}
													</Wrap>
													<Wrap>
														<Wrap style={grid.rowCenter}>
															<Content style={gstyle.labelWhite}>{tx.from === currentAccount.toLowerCase() ? 'SEND' : 'RECEIVE'}</Content>
														</Wrap>
														<Content style={{...gstyle.labelSm, color: colors.danger}}>{tx.status === "confirmed" ? toDate(Number(tx.time)) : tx.status} 
															<Content style={gstyle.labelSm}> / {tx.from === currentAccount.toLowerCase() ? 'To ' + ellipsis(tx.to, 8) : 'From ' + ellipsis(tx.from, 8)}</Content>
														</Content>
													</Wrap>
												</Wrap>
												
												<Content style={{textAlign:'right', ...gstyle.labelWhite}}>
													{`${tx.from === currentAccount.toLowerCase() ? '-' : ''} ${roundNumber(formatUnit(tx.amount, Number(tx.decimals)))} ${tx.symbol}`}
												</Content>
											</Wrap>
										</OpacityButton>
									))}
								</Wrap>
							</Wrap>
						)}
						<Wrap style={{marginBottom: h(10), display: "flex", alignItems: "center"}}>
							<Content style={gstyle.labelWhite}>Need help? Contact <Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.ICICBWallet.io/guide/"})}}>ICICB wallet Support</Content></Content>
						</Wrap>
					</Wrap>
				</Wrap>
			</FunctionLayout>
			{status.accountModal && (
				<AccountModal close={() => updateStatus({accountModal: false})}  navigation={navigation}/>
			)}
			{status.copiedModal && (
				<CopiedModal close={() => updateStatus({copiedModal: false})} />
			)}
		</>
	);
}
