import React from "react"
import { BigNumber, ethers } from "ethers"
import { colors,  grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput, Modal } from "../components/elements"
import { Content, Input, OpacityButton, Picture, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import Avatar from "../components/avatar"
import FunctionLayout from "../layouts/FunctionLayout"
import useStore, { ellipsis, roundNumber } from "../../useStore"
import { bmul, bsub, formatUnit, parseUnit } from "../../library/bigmath"
import { estimateNftSend, getSendInfo, ZeroAddress } from "../../library/wallet"

interface SendAmountStatus {
	showChangePageModal: 		boolean
	toAddress:		  			string
	accountFlg:		 			boolean
	page:			   			"money" | "nft"
	tokenAddress:	   			string
	inputBalance:		   		string
	inputAmount:				string
	balance:					string
	hexData:					string
	rpc:						string
	data:						string
	inputNonce:					string
	chainId:					number
	explorer:				  	string
	nativeSymbol:				string
	nativeBalance:				string
	rawTransactionData:			string
	gasLimit:					string
	gasPrice:					string
	gasFee:						string
	symbol:						string
	decimals:					string
	error:						string
	selectedNftIndex:			number
	tokenId:					string
}

interface SendAmountProps {
	route:			any
	navigation:		any
}

export default function ({ route,  navigation }: SendAmountProps) {
	const {page,  tokenAddress, to, tokenId, selectedNftIndex} = route.params;

	const [status, setStatus] = React.useState<SendAmountStatus>({
		showChangePageModal: 		false,
		toAddress:		  			to,
		accountFlg:		 			true,
		page:			   			page,
		tokenAddress:	   			tokenAddress,
		inputBalance:				'0',
		inputAmount:			 	'0',
		balance:				  	'0',
		data:						'',
		inputNonce:					'',
		chainId:					0,
		explorer:				  	'',
		nativeSymbol:				'',
		nativeBalance:				'',
		rawTransactionData:			'',
		hexData:					'',
		rpc:						'',
		gasLimit:					'',
		gasPrice:					'',
		gasFee:						'',
		symbol:						'',
		decimals:					'18',
		error:						'',
		selectedNftIndex:			0,
		tokenId:					""
	})
	const updateStatus = (params:Partial<SendAmountStatus>) => setStatus({...status, ...params});
	const {currentAccount, accounts,  tokens, currentNetwork, setting, nfts, networks, showToast} = useStore()

	const confirmSend = () => {
		if(status.error !== "" ) return showToast(status.error, "warning");
		if(status.page === "money" && status.inputAmount === "0") return showToast("Please input amount", "warning") 
		
		updateStatus({inputBalance: "0",   inputAmount: "0"})
		navigation?.navigate("ConfirmSending", {page: status.page, tokenId:status.tokenId, selectedNftIndex: status.selectedNftIndex, to: status.toAddress, tokenAddress: status.tokenAddress, inputAmount: status.inputAmount, inputBalance:status.inputBalance, data: status.hexData, chainId: status.chainId, explorer: status.explorer, nativeSymbol: status.nativeSymbol, nativeBalance: status.nativeBalance, rpc: status.rpc, gasLimit: status.gasLimit, gasPrice: status.gasPrice, gasFee: status.gasFee, symbol: status.symbol, decimals: status.decimals, nonce: status.inputNonce})
	}

	const setMax = async ()=> {
		let fee;
		const  rows = await getSendInfo(status.rpc, currentAccount, status.toAddress || "0xBEea22240fDDc880018d35EadDDEe147f0472515", status.tokenAddress,  BigNumber.from(status.balance)._hex.toString() || "0", status.hexData === "" ?  "0x" : status.hexData)
		if(!rows || (rows && rows.length < 3)) return;
		let gasPrice = rows[0]?.result
		let nonce = rows[1]?.result
		let limit = rows[2]?.result
		let rawTransactionData = rows[3];
		fee = bmul(gasPrice, limit).div(status.tokenAddress === ZeroAddress ? 1 : 1e9);
		const max = status.tokenAddress === ZeroAddress ?  bsub(status.balance, fee).toString() : status.balance;
		updateStatus({inputBalance:  max,  rawTransactionData, inputAmount: roundNumber(formatUnit(max, Number(status.decimals))), gasPrice: gasPrice, inputNonce:nonce, gasLimit: limit, gasFee: fee.toString()})
	}

	const checkTokenStatus = async (text: string, data: string) => {
		let newText = '';
		let numbers = '0123456789.'; 
		for (var i=0; i < text.length; i++) {
			if(numbers.indexOf(text[i]) > -1 ) {
		 		newText = newText + text[i];
			}  
		} 
		if(text=="") newText="";
		const amount = newText; 
		updateStatus({inputAmount: amount})
		if(data.startsWith("0x")) data = data.replace("0x", "")
		let hexData = ''; 
		if(!data.startsWith("0x")) hexData = "0x"+data;
		if(hexData.length % 2 == 1) hexData = "0x0"+data;
		if(Number(amount) > Number(formatUnit(status.balance, Number(status.decimals)))) return updateStatus({inputAmount: amount, error: "Insufficient  balance"});	

		if(!ethers.utils.isHexString(hexData)) {
			updateStatus({inputAmount: amount,  inputBalance:parseUnit(amount, Number(status.decimals)).toString(), data: data, hexData:hexData});
			return updateStatus({inputAmount: amount, error: "Invalid hex data"});
		}
		if(Number(amount) === 0) return updateStatus({inputAmount: amount, inputBalance:parseUnit(amount, Number(status.decimals)).toString(), data: data, error: ""})
		const  rows = await getSendInfo(status.rpc, currentAccount, status.toAddress || "0xBEea22240fDDc880018d35EadDDEe147f0472515", status.tokenAddress,  parseUnit(amount, Number(status.decimals))._hex.toString() || "0", hexData || "")
		if(!rows || (rows && rows.length < 3)) return;
		let gasPrice = rows[0]?.result
		let nonce = rows[1]?.result
		let limit = rows[2]?.result; 
		let rawTransactionData = rows[3]
		const gasFee = Number(bmul(gasPrice, limit).div(1e9)).toString();
		updateStatus({ inputAmount: amount, rawTransactionData, inputBalance:parseUnit(amount, Number(status.decimals)).toString(), hexData, data: data, gasLimit: limit, gasPrice, inputNonce:nonce, gasFee: gasFee, error: ""}) 
	}
	
	const tokenInit = async () => {
		let address = status.tokenAddress;
		if(!address || address === null ) address = ZeroAddress;
		let symbol = '';
		let balance = '';
		let decimals = '18';
		let rpc = '', chainId = 0, explorer = '';
		let psymbol = '';
		let nativeBalance  = '';
		console.log(address)
		Object.values(networks).map(( network) => {
			if( network.chainKey === currentNetwork){
				symbol =  network.symbol;
				psymbol = network.symbol;
		}})
		if(address === ZeroAddress) {		
			Object.values(accounts).map(( account) => {
				if(account.address === currentAccount) {
					balance = account.value[currentNetwork] || '0'		
					nativeBalance = account.value[currentNetwork] || '0'		
				}
			})
			decimals = '18';
		}
		else {
			Object.values(accounts).map((account) => {
				if(account.address === currentAccount) {
					nativeBalance = account.value[currentNetwork] || '0'		
				}
			})
			Object.values(accounts).map((account) => {
				if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][address]) {
					balance = account.tokens[currentNetwork][address].toString()  || '0'		
				}
			})	
			tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => 
			{
				if(address == key) {
					symbol = value.symbol
					decimals = value.decimals;
				}
			})
		}

		Object.values(networks).map(( network) => {
			if( network.chainKey === currentNetwork){
				rpc =  network.rpc || ''
				chainId = network.chainId;
				explorer = network.url;
		}})

		let rows;
		if(status.page === "money") {
			rows = await getSendInfo(rpc, currentAccount, status.toAddress || "0xBEea22240fDDc880018d35EadDDEe147f0472515", address,  "0x1", "")
		}
		else {
			rows = await estimateNftSend(rpc, currentAccount, status.toAddress, status.tokenAddress, status.tokenId || tokenId)
		}
		if(!rows || (rows && rows.length < 3)) return showToast("Could not estimate gas limit");
		let gasPrice = rows[0]?.result || 0;
		let nonce = rows[1]?.result || 0;
		let limit = rows[2]?.result || 0;
		let rawTransactionData = rows[3] || '';
		gasPrice = (ethers.BigNumber.from(gasPrice).toString());
		const gasFee = Number(bmul(gasPrice, limit).div(1e9)).toString();
		const updateData = {symbol, rawTransactionData, nativeBalance, nativeSymbol:psymbol, tokenAddress: address, tokenId: status.tokenId === "" ? tokenId: status.tokenId, selectedNftIndex: status.selectedNftIndex || selectedNftIndex, balance, rpc, explorer, chainId,  gasPrice: gasPrice, gasLimit: limit, inputNonce: nonce, error:"", gasFee}
		updateStatus(updateData);
	}

	React.useEffect(() => {
		tokenInit()
	}, [status.tokenAddress, currentNetwork, currentAccount])

	return (
		<>
			<FunctionLayout
				navigation={navigation}
				title="Amount"
				onBack={() => navigation?.goBack()}
				hideClose
				content={(
					<Wrap style={grid.rowBetween}>
						<OpacityButton style={{marginLeft: w(2), display: 'flex', flexDirection: 'row'}} onPress={() => navigation.goBack()}>
							<Icon.ArrowLeft width={w(5)} height={w(5)} color={colors.color}/>
							<Content style={{...gstyle.labelWhite, color: colors.color}}>Back</Content>
						</OpacityButton>
						<OpacityButton style={{marginRight: w(3)}} onPress={() => navigation.navigate("WalletTokens")}>
							<Content style={gstyle.labelWhite}>Cancel</Content>
						</OpacityButton>
					</Wrap>
				)}
				footer={(
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: () => {confirmSend()}}}>Next</DefaultButton>
					</Wrap>
				)}
			>
				<Wrap style={{...grid.modalContent, paddingTop: 0} }>
					<Wrap style={{display: "flex", alignItems: "center"}}>
						<OpacityButton style={{...grid.rowBetween, paddingTop: h(1), paddingBottom: h(1), paddingRight: w(1), paddingLeft: w(7), backgroundColor: colors.bgButton, marginBottom: h(2)}} onPress={() => updateStatus({showChangePageModal: true})}>
							<Content style={{...gstyle.labelWhite, paddingLeft: w(4), paddingRight: w(7)}}>
								{status.page === "money" && status.tokenAddress === ZeroAddress ? (networks && Object.values(networks).map(( network) => {
									if( network.chainKey === currentNetwork){
										return " " + network.symbol
									}})) :  (
									tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {
										if(key === status.tokenAddress) return value.symbol
									}))									  
								}
								{status.page === "nft" && "Collectible"}
							</Content>
							<Wrap style={{marginTop: h(1)}}> 
								<Icon.ArrowBottom/> 
							</Wrap>
						</OpacityButton>
						{status.page === "money" && 
							<Wrap>
								<Wrap style={{...grid.rowCenterBetween, width: w(90), paddingTop: h(2), paddingBottom: h(2)}}>
									<Wrap style={{width: w(8)}}></Wrap>
									<Input keyboardType="numeric" autoFocus style={{fontSize: w(10), width:w(65),  color: colors.white, textAlign: "center"}} value={status.inputAmount} onChangeText = {(txt: string) => {checkTokenStatus(txt, status.data);}} />
									<Wrap style={{width: w(13)}}>
										<OpacityButton onPress={() => {setMax()}}>
											<Content style={gstyle.link}>Max</Content>
										</OpacityButton>
									</Wrap>
								</Wrap>
								<Wrap style={grid.rowCenterCenter}>
									<Content style={gstyle.textLightCenter}>Balance: &nbsp;
										{status.tokenAddress === ZeroAddress ? (
											accounts && Object.values(accounts).map(( account ) => {
												if(account.address === currentAccount) {
													return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
											}})
										) : (
											accounts && Object.values(accounts).map(( account ) => {	
												if(account.address === currentAccount) {
													return tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {
														if(key === status.tokenAddress) {
															return roundNumber(formatUnit(account.tokens[currentNetwork][key].toString(), Number(value.decimals)))
														}
													})
												}
											}))
										}
										{
											status.tokenAddress === ZeroAddress ?  (networks && Object.values(networks).map(( network) => {
												if( network.chainKey === currentNetwork){
													return " " + network.symbol
												  }})) : (
												tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {
													if(key === status.tokenAddress) return value.symbol
												}))
										}
									</Content>
								</Wrap>
								<Wrap style={grid.rowCenterCenter}>
									<Content style={{...gstyle.textDanger, ...gstyle.textCenter}}>{status.error}</Content>
								</Wrap>
								{
									setting.showHexData && status.tokenAddress === ZeroAddress && <Wrap style={grid.rowCenterCenter}>
										<DefaultInput
											label="hex data"
											visibleValue={false}
											inputProps={{
												placeholder: "e.g.\n0x3843",
												multiline: true,
												style: {height: h(10), width: w(80)},
												onChangeText: (txt:string) => {checkTokenStatus(status.inputAmount, txt)},
												value: status.data
											}}
										/>
									</Wrap>
								}
							</Wrap>
						}
						{status.page === "nft" &&
							<Wrap>
								<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
									<Picture source={{uri: nfts[currentNetwork]?.[status.selectedNftIndex]?.imageUri}} style={{width: w(55), height:w(55), borderRadius: w(1)}} />
								</Wrap>
								<Content style={gstyle.textLightCenter}>{nfts[currentNetwork]?.[status.selectedNftIndex]?.tokenUri.replace("https://ipfs.io/ipfs/", "")}</Content>
								<Content style={gstyle.textLightSmCenter}>{ellipsis(nfts[currentNetwork]?.[status.selectedNftIndex]?.tokenId, 30)}</Content>
							</Wrap>
						}
					</Wrap>
				</Wrap>
			</FunctionLayout>
			{status.showChangePageModal && (
				<Modal
					close={() => updateStatus({showChangePageModal: false})}
					width={80}
				> 
						<>
							<OpacityButton onPress={() => {updateStatus({page: "money", tokenAddress: ZeroAddress, showChangePageModal: false})}}>
								<Wrap style={grid.rowCenter}>
									<Wrap style={{marginRight: w(2)}}>
										<Avatar address={currentNetwork} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>
									</Wrap>
									<Wrap style={{display: "flex", flexDirection: "column"}}>
										<Content style={{...gstyle.labelWhite, fontWeight: "700"}}>
											{
											Object.values(accounts).map(( account) => {
												if(account.address === currentAccount) {											
													return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
												}}
											)}
											{
												networks && Object.values(networks).map(( network ) => {
													if( network.chainKey === currentNetwork){
														return " " + network.symbol
												}})
											}
										</Content>
									</Wrap>
								</Wrap>
							</OpacityButton>
							<Wrap style={gstyle.hr} />
						</>
					{
						tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {
							const v= Object.entries(accounts).map(([index, account]) => {	
								if(account.address === currentAccount && account.tokens?.[currentNetwork] && account.tokens?.[currentNetwork][key]) {
									return <Wrap key={"cm" + index}>
										<OpacityButton onPress={() => updateStatus({page: "money", tokenAddress: key, showChangePageModal: false})}>
											<Wrap style={grid.rowCenter}>
												<Wrap style={{marginRight: w(2)}}>
													<Avatar address={key || ZeroAddress} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>
												</Wrap>
												<Wrap style={{display: "flex", flexDirection: "column"}}>
													<Content style={{...gstyle.labelWhite, fontWeight: "700"}}>{
														roundNumber(formatUnit(account.tokens[currentNetwork][key].toString(), Number(value.decimals)))  +" " + value.symbol
													}</Content>
												</Wrap>
											</Wrap> 
										</OpacityButton>
										<Wrap style={gstyle.hr} />
									</Wrap>
								}
							})
							if(v) {
								return v
							}
						})
					}
					{
						 nfts[currentNetwork] && nfts[currentNetwork].map((nft: NFTObject, index: number) => {
							if(nft.owner === currentAccount) return (
								<Wrap key= {index}>
									<OpacityButton  onPress={() => {updateStatus({page: "nft", tokenAddress: nft.contract,  tokenId: nft.tokenId, showChangePageModal: false, selectedNftIndex: index})}}>
										<Wrap style={grid.rowCenter}>
											<Wrap style={{marginRight: w(2)}}>
												<Picture source={{uri: nft.imageUri}} style={{width: w(8), height:w(8), borderRadius: w(1)}} />
											</Wrap>
											<Wrap style={{display: "flex", flexDirection: "column"}}>
												<Content style={{...gstyle.labelWhite, fontWeight: "700"}}>{
													ellipsis(nft.tokenId, 20)
												}</Content>
											</Wrap>
										</Wrap>
									</OpacityButton>
									<Wrap style={gstyle.hr} />
								</Wrap>
						)})
					}
				</Modal>
			)}
		</>
			
	)
}
