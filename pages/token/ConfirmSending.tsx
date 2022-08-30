import React from "react"
import { BigNumber } from "ethers"
import { colors,  grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput } from "../components/elements"
import { Content,  OpacityButton, Picture, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import Avatar from "../components/avatar"
import FunctionLayout from "../layouts/FunctionLayout"
import { formatUnit } from "../../library/bigmath"
import useStore, { decrypt, ellipsis, roundNumber } from "../../useStore"
import { checkTransaction, sendNFT, sendTransaction, ZeroAddress } from "../../library/wallet"

interface ConfirmSendingProps {
	route:		any
	navigation:	any
}

interface ConfirmState {
	nonce:  string
}

export default function ({ route,  navigation }: ConfirmSendingProps) {
	const {page, to, selectedNftIndex, tokenAddress,  inputAmount, inputBalance, data, chainId, explorer, nativeSymbol, nativeBalance, rpc, gasLimit, gasPrice, gasFee, symbol, decimals, nonce, tokenId} = route.params;
		
	const [status, setStatus] = React.useState<ConfirmState>({
		nonce:  nonce
	})
	const updateStatus = (params:Partial<ConfirmState>) => setStatus({...status, ...params});
	
	const {currentAccount, accounts, setting, password,  vault, transactions, currentNetwork, nfts, recents, update, showToast} = useStore()
		
	const send = async () => {
		const plain = await decrypt(vault, password);
		if (plain===null || plain==='') return showToast("Could not found wallet info", "warning")
		const wallet = JSON.parse(plain)
		const privatekey  = wallet.keys?.[currentAccount]	
		if(BigNumber.from(nativeBalance).lt(BigNumber.from(gasFee))) return showToast("Insufficient funds for gas", "warning");
		let tx;
		if(page === "money") {
			tx = await sendTransaction(rpc, chainId, privatekey, tokenAddress, to, inputBalance, status.nonce,  data, BigNumber.from(gasPrice), BigNumber.from(gasLimit), BigNumber.from(0), BigNumber.from(0))
		}
		else {
			tx = await sendNFT(rpc, chainId, privatekey,  to, tokenAddress, tokenId, nonce,  gasPrice, gasLimit)
		}
		if(tx != undefined) {
			const result = await checkTransaction(rpc, tx)
			if(result) {
				if(page === "money") {
					const newtxs = {} as  {[chainKey: string] : {[hash: string]: Transaction}};
					let flag = false;
					Object.entries(transactions).map(([_chain, _transaction]) => {
						if(_chain !== currentNetwork) newtxs[_chain] = _transaction;
						else {
							let txs = {[result.hash]: {
								from:				result.from,
								transactionId:		result.hash,
								to:					to,
								status:				result.blockNumber == null ?'pending' : 'confirmed',
								nonce:				Number(result.nonce).toString(),
								amount:				tokenAddress === ZeroAddress ? result.value : inputBalance,
								gasPrice:			result.gasPrice,
								gasLimit:			result.gas,
								gasUsed:			'0',
								total:				"0",
								hexData:			result.input.substring(2),
								rpc:				rpc,
								chainId:			chainId,
								tokenAddress:		tokenAddress,
								explorer:			explorer,
								symbol:				symbol,
								decimals:			Number(decimals),
								log:				[],
								created:			'0',
								time:				+new Date() + 100000000
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
							to:					to,
							status:				result.blockNumber == null ?'pending' : 'confirmed',
							nonce:				Number(result.nonce).toString(),
							amount:				tokenAddress === ZeroAddress ? result.value : inputBalance,
							gasPrice:			result.gasPrice,
							gasLimit:			result.gas,
							gasUsed:			result.gas,
							total:				"0",
							hexData:			result.input.substring(2),
							rpc:				rpc,
							chainId:			chainId,
							tokenAddress:		tokenAddress,
							explorer:			explorer,
							symbol:				symbol,
							decimals:			Number(decimals),
							log:				[],
							created:			'0',
							time:				+new Date() + 100000000
						}
						newtxs[currentNetwork] = txs;
					}
					let recs = [] as string[]
					recs.push(to)
					let i = 0;
					recents.forEach(element => {
						if(element.toLowerCase() !== to.toLowerCase() && i < 10) {
							recs.push(element)
							i++;
						}
					});
					update({transactions: newtxs, recents: recs})
					navigation.navigate("WalletActivity", {tokenAddress})
				}
				showToast("Successfully sent", "success")
			}
		}
		navigation.navigate("WalletTokens", {tokenAddress})
	}

	React.useEffect(() => {
		updateStatus({nonce})
	}, [])
		
	return (
		<>
			<FunctionLayout
				navigation={navigation}
				title={"Sending " + symbol}
				hideClose
				content={(
					<OpacityButton style={{marginLeft: w(2), display:'flex', flexDirection:'row'}} onPress={() => navigation.goBack()}>
						<Icon.ArrowLeft width={w(5)} height={w(5)} />
						<Content style={gstyle.textLight}>Back</Content>
					</OpacityButton>
				)}
			>
				<Wrap style={{marginLeft: w(2), paddingTop: h(5), paddingBottom: h(5),paddingLeft: w(5), marginRight: w(2), paddingRight: w(5), backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: w(1), borderColor: colors.color,  borderWidth: w(0.05)}}>
					<Wrap style={{...grid.rowCenterAround, ...grid.gridMargin2}}>
						<Wrap style={{flex: 1, paddingRight: w(5), paddingLeft: w(5)}}>
							<Wrap style={{backgroundColor: colors.bgLight, paddingTop: h(2), paddingBottom: h(2), borderRadius: w(1)}}>
								<Wrap style={{...grid.gridMargin1, alignSelf: "center"}}>
									<Avatar size={10} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} address={currentAccount} />
								</Wrap>
								<Content style={{...gstyle.textLightCenterUppercase, marginBottom: h(0)}}>{
									Object.entries(accounts).map(([index, account]) => {
										const key = index;
										if(account.address === currentAccount) return account.label
									})
								}</Content>
							</Wrap>
						</Wrap>
						<Wrap style={{...grid.rowCenterCenter, width: w(10), height: h(5), backgroundColor: colors.bgLight, borderRadius: w(1)}}>
							<Wrap style={{marginLeft: w(2)}}>
								<Icon.ArrowRight color={colors.color} width={w(5)} height={w(5)} />
							</Wrap>
						</Wrap>
						<Wrap style={{flex: 1, paddingRight: w(5), paddingLeft: w(5)}}>
							<Wrap style={{backgroundColor: colors.bgLight, paddingTop: h(2), paddingBottom: h(2),borderRadius: w(1)}}>
								<Wrap style={{...grid.gridMargin1, alignSelf: "center"}}>
								<Avatar size={10} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} address={to} />
								</Wrap>
								<Content style={{...gstyle.textLightCenterUppercase, marginBottom: h(0)}}>
									{
										ellipsis(to)
									}
								</Content>
							</Wrap>
						</Wrap>
					</Wrap>
					{page === "money" && 
						<Wrap>
							<Content style={{...gstyle.linkCenter, fontSize: w(8), marginBottom: w(0)}}>{inputAmount} {symbol}</Content>
							<Content style={gstyle.textLightCenter }></Content>
						</Wrap>
					}
					{page === "nft" && 
						<Wrap>
							<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
								<Picture source={{uri: nfts[currentNetwork]?.[selectedNftIndex]?.imageUri}} style={{width: w(15), height:w(15), borderRadius: w(1)}} />
							</Wrap>
							<Content style={gstyle.textLightCenter}>{nfts[currentNetwork]?.[selectedNftIndex]?.tokenId}</Content>
							<Content style={gstyle.textLightSmCenter}>{nfts[currentNetwork]?.[selectedNftIndex]?.tokenUri}</Content>
						</Wrap>
					}
					<Wrap>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={gstyle.label}>GAS(estimated)</Content>
							<Wrap style={grid.rowCenter}>
								<Content style={{...gstyle.label, fontWeight: "700"}}>{roundNumber(formatUnit(gasFee, 9))}</Content>
							</Wrap>
						</Wrap>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={{...gstyle.labelSm, color: colors.white}}>Linkely in  30 secondes</Content>
							<Wrap style={grid.rowCenter}>
								<Content style={{...gstyle.labelSm, fontWeight: "700", color: colors.white}}>Max fee: </Content>
								<Content style={gstyle.labelSm}>{roundNumber(formatUnit(gasFee, 9)) + nativeSymbol}</Content>
							</Wrap>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr} />
					<Wrap style={grid.gridMargin4}>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={gstyle.label}>TOTAL</Content>
							<Wrap style={grid.rowCenter}>
								<Content style={{...gstyle.label, fontWeight: "700"}}>
										{
											inputAmount + symbol +" " +roundNumber(formatUnit(gasFee, 9), 6) + nativeSymbol
										}
								</Content>
							</Wrap>
						</Wrap>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={{...gstyle.labelSm, color: colors.white}}>Amount + gas fee</Content>
							<Wrap style={grid.rowCenter}>
								<Content style={gstyle.labelSm}>
									{
										tokenAddress === ZeroAddress &&  (Number(roundNumber(formatUnit(gasFee, 9), 6)) + Number(inputAmount)) +  nativeSymbol
									}
									{
										tokenAddress !== ZeroAddress && inputAmount+ symbol +" " +roundNumber(formatUnit(gasFee, 9), 6) + nativeSymbol
									}
								</Content>
							</Wrap>
						</Wrap>
						{
							setting.showTxNonce && <Wrap style={grid.rowCenterBetween}>
								<Content style={{...gstyle.labelWhite}}>Custom Nonce</Content>
								<DefaultInput
									visibleValue={false}
									inputProps={{
										placeholder: nonce,
										style: {width: w(50)},
										onChangeText: (txt:string) => {updateStatus({nonce: txt})},
										value: status.nonce
									}}
								/>
							</Wrap>
						}
					</Wrap>
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						<DefaultButton width={40} theme="warning" btnProps={{onPress: () => {navigation?.goBack()}}}>REJECT</DefaultButton>
						<DefaultButton width={40}  btnProps={{onPress: () => {send()}}}>CONFIRM</DefaultButton>
					</Wrap>
				</Wrap>
			</FunctionLayout>
		</>
			
	)
}