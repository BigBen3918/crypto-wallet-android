import React from "react"
import { BigNumber, ethers } from "ethers"
import { colors,  grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput } from "../components/elements"
import { Content,  OpacityButton,  Wrap } from "../components/commons"
import Avatar from "../components/avatar"
import FunctionLayout from "../layouts/FunctionLayout"
import { formatUnit, parseUnit } from "../../library/bigmath"
import useStore, { decrypt, ellipsis, hmac, roundNumber } from "../../useStore"
import { callRpc, getNonceAndGasPrice } from "../../library/wallet"

interface ConfirmSendingProps {
	route:		any
	navigation:	any
}


export default function ({ route,  navigation }: ConfirmSendingProps) {
	const {params} = route;
	const [status, setStatus] = React.useState({
		params :				{} as any,
		abi:					[] as any,
		contractParamsValues:	{} as any,
		txParams:				{} as any,
		rpc:					"" as string,
		chainId:				0  as number,
		explorer:				"" as string,
		password:				"" as string,
		tabIndex:				1  as number,
		gasLimit:				"" as string,
		symbol:					"" as string,
		method:					"" as string,
		value:					"" as string,
		gasPrice:				"" as string,
		nonce:					"" as string,
		encodeData:				"" as string

	});

	const updateStatus = (params : {[key : string] : string|number|boolean | any}) => setStatus({...status, ...params});
	const {currentAccount, accounts,  vault, currentNetwork, setting, nfts, networks, showToast} = useStore()

	const getTypeParams = (parsedUrl: any) => {
		try{
			const { parameters } = parsedUrl;
			let contractParamsKeys = [] as any
			let contractParamsValues = [] as any
			let txParams = {} as any;
			if (!parsedUrl.function_name) txParams = { to: parsedUrl.target_address }
			parameters && Object.keys(parameters).forEach(key => {
				if (["value"].includes(key))
					txParams = { ...txParams, "value": parseUnit(parameters[key], 18) }
				if (["gas", "gasPrice",].includes(key))
					txParams = { ...txParams, "gasPrice": parseUnit(parameters[key], 18) }
				if (["gasLimit"].includes(key))
					txParams = { ...txParams, [key]: parameters[key] }
				if (["number", "ethereum_address", "string"].includes(key)) {
					contractParamsKeys.push(key);
					contractParamsValues.push(parameters[key]);
				}
			})
			
			let temp = 0;
			let abi = `function ${parsedUrl.function_name}(` as any;
	
			contractParamsKeys.forEach((key: string) => {
				const type = {
					"ethereum_address": "address",
					"number": " uint",
					"string": "string"
				} as any
				abi += `${type[key]} param${temp++},`
			})
	
			if (contractParamsKeys.length == 0) {
				if (Number(txParams['value']) > 0)
					abi = [abi.slice(0, abi.length) + ") payable"];
				else abi = [abi.slice(0, abi.length) + ")"]
			}
			else if (Number(txParams['value']) > 0)
				abi = [abi.slice(0, abi.length - 1) + ") payable"]
			else abi = [abi.slice(0, abi.length - 1) + ")"]
	
			return { abi, contractParamsValues, txParams }
		} catch(err) {
			showToast("Unknown Error", "error");
			return navigation.navigate("WalletTokens")
		}
	}

	const makeTransaction = async (type: boolean) => {
		if(type) {
			try {
				if(status.password.length < 8) return showToast("Invalid password", "warning")
				let privKey = "";
				try {
					const passHash = await hmac(status.password);   
					const plain = await decrypt(vault, passHash);
					if (plain===null || plain==='') return showToast("Incorrect password", "warning")
					const w = JSON.parse(plain)
					privKey  = w.keys?.[currentAccount]
				} catch(err) {
					return showToast("Incorrect password", "warning")
				}
				const provider = new ethers.providers.JsonRpcProvider(status.rpc)
				let wallet = new ethers.Wallet(privKey, provider); 
				if (status?.params && status.params?.function_name) {
					let transaction = {
						from: currentAccount,
						to: status.params?.target_address || '',
						data: status.encodeData,
						chainId: status.chainId,
						gasPrice: status.gasPrice,
						nonce: status.nonce,
						gasLimit: status.gasLimit,
						...status?.txParams 
					};
					let rawTransaction = await wallet.signTransaction(transaction);
					let params = [] as object[]
					params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
					const transxrow = await callRpc(status.rpc, params)
					const tx = transxrow?.[0]?.result 
					if(tx){
						showToast("Success", "success")
						navigation.navigate("WalletTokens")
					} else {
						showToast("Could not execute successfully", "danger")
						navigation.navigate("WalletTokens")
					}
					return tx;
				} else {
					let transaction = {
						from: currentAccount,
						to: status.params?.target_address,
						chainId: status.chainId,
						gasPrice: status.gasPrice,
						nonce: status.nonce,
						gasLimit: status.gasLimit,
						value: status.value,
					};
					let rawTransaction = await wallet.signTransaction(transaction);
					let params = [] as object[]
					params.push({jsonrpc: "2.0", method: "eth_sendRawTransaction", params: [rawTransaction], id: 1})
					const transxrow = await callRpc(status.rpc, params)
					const tx = transxrow?.[0]?.result 
					if(tx){
						showToast("Success", "success")
						navigation.navigate("WalletTokens")
					} else {
						return showToast("Could not execute successfully", "danger")
					}
					return tx;
				}
			} catch (err) {
				console.log(err)
			}
		} else {
			navigation.navigate("WalletTokens")
		}
	}
	React.useEffect(()=> {
		const uri = params["params"] || "";
		const paramValues = getTypeParams(uri)
		if(paramValues){
			const {abi, contractParamsValues, txParams} = paramValues;
			let rpc="", chainId=0, explorer="", nonce="", gasPrice="", symbol="";
			Object.values(networks).map(async ( network) => {
				if( network.chainKey === currentNetwork){
					rpc =  network.rpc || ''
					chainId = network.chainId;
					explorer = network.url;
					symbol = network.symbol;
					const r = await getNonceAndGasPrice(rpc, currentAccount);
					nonce = r?.["nonce"]
					gasPrice = r?.["gasPrice"]		
					if(uri?.function_name) {
						let iface = new ethers.utils.Interface(abi);
						const encode = iface.encodeFunctionData(uri?.function_name, ([...contractParamsValues]))
						let rows = await callRpc(rpc, [
							{
								jsonrpc: "2.0", method: "eth_estimateGas", params: [{
								from: currentAccount,
								to: uri?.target_address || '',
								data: encode,
								...txParams,
								chainId: BigNumber.from(chainId).toHexString().replace("0x0", "0x"),
								gasPrice,
								nonce
								}], id: 1
							}
						])
						const gasLimit = rows?.[0]?.result || 0;
						updateStatus({params: uri, abi,  contractParamsValues, txParams, rpc, symbol, chainId, explorer, nonce, gasPrice, gasLimit, encodeData: encode})
					} else {
						let value = BigNumber.from(uri?.parameters?.value).toHexString();
						value = value.replace("0x0", "0x");
						let gasLimitRows = await callRpc(rpc, [
							{
								jsonrpc: "2.0", method: "eth_estimateGas", params: [{
								from: currentAccount,
								to: uri?.target_address || '',
								value,
								chainId: BigNumber.from(chainId).toHexString().replace("0x0", "0x"),
								gasPrice: gasPrice,
								nonce: nonce
								}], id: 1
							}
						])
						console.log({
							jsonrpc: "2.0", method: "eth_estimateGas", params: [{
							from: currentAccount,
							to: uri?.target_address || '',
							value,
							chainId: BigNumber.from(chainId).toHexString().replace("0x0", "0x"),
							gasPrice: gasPrice,
							nonce: nonce
							}], id: 1
						})
						console.log("gasLimitRows", gasLimitRows)
						const gasLimit = gasLimitRows?.[0]?.result || 0;
						if(gasLimit == 0){
							showToast("Could not estimate gasLimit", "warning");
						}
						updateStatus({params: uri, abi,  contractParamsValues, value, txParams, rpc, symbol, chainId, explorer, nonce, gasPrice, gasLimit, encodeData: ""})
					}
				}
			})
		}
	}, [])

	return (
		<>
			<FunctionLayout
				navigation={navigation}
				hideClose
			>
				<Wrap style={{padding: w(3)}}>
					<Wrap style={{...grid.rowCenter, paddingTop: h(1), paddingBottom: h(1), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2), ...grid.gridMargin4, backgroundColor: colors.bgOpacity}}>
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
					<Wrap style={{borderColor: colors.color, borderWidth: w(0.1), backgroundColor: colors.bgLight, padding: w(2), borderRadius: w(2)}}>
						{
							<Wrap style={{...grid.rowCenter, justifyContent:"flex-start", marginBottom: h(1)}}>
								<OpacityButton style={{padding:w(1), paddingLeft: w(3), paddingRight: w(3),  borderWidth:w(0.4), borderColor:"transparent",  borderBottomColor:status.tabIndex===1?'red':'rgb(144, 59, 255)'}} onPress={() => {updateStatus({tabIndex:1})}}>
									<Content style={gstyle.labelWhite}>Details</Content>
								</OpacityButton>
								{(status.params.function_name) && <OpacityButton style={{padding:w(1), paddingLeft: w(3), paddingRight: w(3), borderWidth:w(0.4), borderColor:"transparent", borderBottomColor:status.tabIndex===2?'red':'rgb(144, 59, 255)'}} onPress={() => {updateStatus({tabIndex:2})}}>
									<Content style={gstyle.labelWhite}>Data</Content>
								</OpacityButton>}
							</Wrap>
						}
						{
							(status.tabIndex === 1) && <>
								<Wrap style={{ paddingTop: h(2), paddingLeft: w(2), paddingRight: w(2), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2)}}>
									<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
										<Wrap>
											<Content style={gstyle.textLight}>Total: </Content>
											<Content style={gstyle.textLight}>Amount + gas fee: </Content>
										</Wrap>
										<Content style={gstyle.textLight}>
										{
											status.params?.function_name == "" ? roundNumber(Number(formatUnit(status.gasLimit || "0", 9))  + Number(formatUnit(status.value || "0", 18))).toString().concat(" ", status.symbol) : roundNumber(Number(formatUnit(status.gasLimit || "0", 9))).concat(" ", status.symbol)
										}
										</Content>
									</Wrap>
								</Wrap>
								<Wrap style={{marginTop: h(2)}}></Wrap>
								
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
									<Content style={gstyle.textLight}>TargetAddress: </Content>
									<Content style={gstyle.textLight}>{ellipsis(status.params?.target_address, 20)}</Content>
								</Wrap>
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
									<Content style={gstyle.textLight}>Nonce: </Content>
									<Content style={gstyle.textLight}>{Number(status.nonce)}</Content>
								</Wrap>
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center"}}>
									<Content style={gstyle.textLight}>GasPrice: </Content>
									<Content style={gstyle.textLight}>{roundNumber(Number(formatUnit(status.gasPrice || "0", 9)))}</Content>
								</Wrap>
								<DefaultInput
									label={"Enter wallet password"}
									inputProps={{
										placeholder: "Wallet password",
										onChangeText: (txt:string) => updateStatus({password: txt}),
										value: status.password,
										style: {borderColor: colors.color, borderWidth: w(0.1)}
									}}
									visibleValue={true}
								/>
							</>
						}
						{
							status.tabIndex === 2 && <>
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center", padding: w(3)}}>
									<Content style={gstyle.textLight}>FUNCTION TYPE: </Content>
									<Content style={gstyle.textLight}>{status.params?.function_name} </Content>
								</Wrap>
								<Wrap style={{...grid.rowCenterBetween, alignContent:"center", padding: w(3)}}>
									<Content style={gstyle.textLight}>Target Address: </Content>
									<Content style={gstyle.textLight}>{ellipsis(status.params?.target_address, 20)} </Content>
								</Wrap>
								<Wrap style={{alignContent:"center", padding: w(3)}}>
									<Content style={gstyle.textLight}>Parameters: </Content>
									{
										status.params?.parameters && Object.entries(status.params?.parameters).map(([key, value]: any) => (
											<Content key={key} style={gstyle.textLight}>{key + ": "+ ellipsis(value, 15)}</Content>
										))
									}
								</Wrap>
							</>
						}
						<Wrap style={{...grid.btnGroup, marginTop: h(1), justifyContent:'space-around'}}>
							<DefaultButton theme="warning" width={40} btnProps={{onPress: () => {makeTransaction(false)}}}>Reject</DefaultButton>
							<DefaultButton width={40} btnProps={{onPress: () => {makeTransaction(true)}}}>Allow</DefaultButton>
						</Wrap>
					</Wrap>
				</Wrap>
			</FunctionLayout>
		</>
	)
}