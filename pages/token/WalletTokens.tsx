import React from "react"
import SvgUri from 'react-native-svg-uri-updated';
import { colors, grid, gstyle, h, w } from "../components/style"
import { walletTokens as style } from "../components/StyledComponents"
import { Content, OpacityButton, Picture,  Wrap } from "../components/commons"
import { DefaultButton, DefaultInput, FunctionalButton, Modal } from "../components/elements"
import Icon from "../components/Icon"
import Avatar from "../components/avatar"
import NetworkModal from "../layouts/NetworkModal"
import AccountModal from "../layouts/AccountModal"
import CopiedModal from "../layouts/CopiedModal"
import { formatUnit } from "../../library/bigmath"
import { ZeroAddress } from "../../library/wallet"
import WalletLayout from "../layouts/WalletLayout"
import useStore, { copyToClipboard, ellipsis, getChainIcon, getTokenIcon, initChainIcons, initTokenIcons, roundNumber } from '../../useStore'

interface WalletTokenStatus {
	tabKey:					string
	showMenu:				boolean
	copiedModal:			boolean
	accountModal:			boolean
	networkModal:			boolean
	showChangeAccountNameModal: boolean
	accountLabel:			string
	nftFlags:				boolean[]
	showNftModal:			boolean
	selectedNft:			number
}

export default function ({ navigation }: any) {
	const [icons, setIcons] = React.useState<{[key:string]: string}>({});
	const [tokenIcons, setTokenIcons] = React.useState<{[key:string]: string}>({});

	const [status, setStatus] = React.useState<WalletTokenStatus>({
		tabKey:			"tokens",
		showMenu:		false,
		copiedModal:	false,
		accountModal:	false,
		networkModal:	false,
		showChangeAccountNameModal: false,
		accountLabel:	"",
		nftFlags:		[],
		showNftModal:	false,
		selectedNft:	0
	})

	const updateStatus = (params:Partial<WalletTokenStatus>) => setStatus({...status, ...params});

	const {currentAccount, accounts, setting,  tokens, currentNetwork, nfts, networks, update, showToast} = useStore()

	const setAccountName = () => {
		if(status.accountLabel.trim() === "") return showToast("Enter account label", "warning")
		const newAccounts:AccountObject[] = [];
		Object.values(accounts).map(( account) => {
			var newAccount:AccountObject = {
				"address": account.address,
				"imported": account.imported,
				"index": account.index,
				"label": account.address === currentAccount ? status.accountLabel: account.label,
				"tokens": account.tokens,
				"value": account.value
			};
			newAccounts.push(newAccount)
		})
		update({accounts: {...newAccounts}})
		updateStatus({showChangeAccountNameModal: false})
	}

	const showNFT = (index: number) => {
		updateStatus({showNftModal: true, selectedNft: index})
	}

	React.useEffect(() => {
		initChainIcons().then(()=>{
			const _icons = {} as {[key: string]: string}
			Object.values(networks).map((network: NetworkObject) => {
				const icon = getChainIcon(network.chainId);
				if (icon) _icons[network.chainId] = icon;
			})
			setIcons(_icons)
		});
		initTokenIcons().then(()=>{
			const _icons = {} as {[key: string]: string}
			if(currentNetwork === "neon") {
				tokens && tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {			
					Object.values(accounts).map(async  (account) => {	
						if(account.address === currentAccount && account.tokens[currentNetwork] && account.tokens[currentNetwork][key]) {
							const icon = await getTokenIcon(key);
							if (icon) _icons[key] = icon;
						}
					})
				})
			}
			setTokenIcons(_icons)
		});
	}, [networks, tokens])

	return (
		<>
			<WalletLayout
				navigation={navigation}
				menuKey="wallet"
				content={(
					<OpacityButton style={grid.rowCenterCenter} onPress={() => updateStatus({networkModal: true})}>
						<Wrap style={{width: w(1), height: w(1), backgroundColor: colors.color, marginRight: w(2)}} />
						<Content style={gstyle.labelWhite}>
							{Object.values(networks).map((network) => {
								if( network.chainKey === currentNetwork){
									return network.label
								}}) 
							}
						</Content>
						<Wrap style={{width: w(1), height: w(1), backgroundColor: colors.color, marginLeft: w(2)}} />
					</OpacityButton>
				)}
			>
				<Wrap style={{alignSelf: "stretch", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: h(2)}}>
					<OpacityButton style={{...grid.rowCenterCenter, ...grid.gridMargin1}} onPress={() => updateStatus({accountModal: true})}>
						<Avatar  type={setting.identicon === "jazzicons"? "Zazzicon":"Blockies"} address={currentAccount || ZeroAddress} />
					</OpacityButton>
					<OpacityButton onPress={() => updateStatus({showChangeAccountNameModal: true, accountLabel: (() => {
							 let label = ""
							 Object.values(accounts).map((account) => {
								if(account.address === currentAccount) {
									label = account.label
								}
							})
							return label
						})()})}>
						<Content style={{...gstyle.labelLg, paddingTop: h(1)}}>
							{Object.values(accounts).map((account) => {
								if(account.address === currentAccount) {
									return ellipsis(account.label, 15)
								}
							})}  
						</Content>
					</OpacityButton>
					<Wrap style={grid.rowCenterBetween}>
						<Wrap style={gstyle.hr} />
						<Content style={gstyle.labelWhite}>
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
						<Wrap style={gstyle.hr} />
					</Wrap>
					<OpacityButton style={style.key} onPress={() => {copyToClipboard(currentAccount); updateStatus({ copiedModal: true})}}>
						<Content style={gstyle.labelWhite}>{ellipsis(currentAccount)}</Content>
					</OpacityButton>
					<Wrap style={style.btnWrapper}>
						<FunctionalButton label="Buy" btnProps={{disabled: true}}>
							<Icon.Receive color={colors.color} />
						</FunctionalButton>
						<FunctionalButton label="Send" btnProps={{onPress: ()=>navigation.navigate("Send", {page: "money", tokenAddress: ZeroAddress, tokenId: "", selectedNftIndex: 0})}}>
							<Icon.Send color={colors.color} />
						</FunctionalButton>
						<FunctionalButton label="Swap" btnProps={{disabled: true}}>
							<Icon.Swap color={colors.color} />
						</FunctionalButton>
					</Wrap>
					<Wrap style={grid.colBetween}>
						<Wrap style={grid.rowCenterAround}>
							<OpacityButton style={{flex: 1,  backgroundColor:  (status.tabKey === "tokens" ? colors.color : "#534326"),  paddingTop: h(1.6), borderTopLeftRadius: w(2), borderTopRightRadius: w(2)}} onPress={() => updateStatus({tabKey: "tokens"})}>
								<Content style={{...gstyle.textLightCenter, color: colors.black}}>TOKENS</Content>
							</OpacityButton>
							<OpacityButton style={{flex: 1,  backgroundColor: (status.tabKey === "nfts" ? colors.color: "#534326" ),paddingTop: h(1.6), borderTopLeftRadius: w(2), borderTopRightRadius: w(2)}} onPress={() => updateStatus({tabKey: "nfts"})}>
								<Content style={{...gstyle.textLightCenter, color: colors.black}}>NFT'S</Content>
							</OpacityButton>
						</Wrap>
						{status.tabKey === "tokens" && (
							<>
							   <OpacityButton style={style.tokenItem} onPress={() => navigation?.navigate('WalletActivity', {tokenAddress: ZeroAddress})}>
									<Wrap style={grid.rowCenterBetween}>
										<Wrap style={grid.rowCenterCenter}>
											<Wrap style={{marginRight: w(2)}}>
												{networks && Object.entries(networks).map(([index, network]) => {
													if(network.chainKey === currentNetwork)  return <Wrap key={"wtk" + index}>
														{
															icons[network.chainId] ? 
															(icons[network.chainId]?.toLowerCase().endsWith(".svg") ? 
															<Wrap>
																  <SvgUri width={"25"} height={"25"} source={{uri:icons[network.chainId]}}
																	/>
															</Wrap>: 
																<Picture source={{uri: icons[network.chainId]}} style={{width: w(7), height: w(7), borderRadius: w(80)}} resizeMode="stretch" resizeMethod="scale" />
															)
															:
															<Avatar address={currentNetwork} type={setting.identicon === 'jazzicons'? "Zazzicon": "Blockies"} size={8}/>
														}
													</Wrap>
												})}
											</Wrap>
											<Wrap style={{display: "flex", flexDirection: "column"}}>
												<Content style={{...gstyle.labelWhite, fontWeight: "700"}}>
													{
													Object.values(accounts).map(( account ) => {
														if(account.address === currentAccount) {											
															return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
														}}
													)}
													{
														networks && Object.values(networks).map((network) => {
															if( network.chainKey === currentNetwork){
																return " " + network.symbol
														}})
													}
												</Content>
											</Wrap>
										</Wrap>
										<Wrap style={{marginRight: w(1)}}>
											<Icon.ArrowRight />
										</Wrap>
									</Wrap>
								</OpacityButton>
								<Wrap>
									<Wrap style={{marginBottom: h(4)}}>
									{!tokens[currentNetwork] ? (
										<Content style={{marginTop: h(3), ...gstyle.textLightCenter}}>You have no tokens</Content>
									) : (
										<>
											{
												tokens[currentNetwork] && Object.entries(tokens[currentNetwork]).map(([key, value]) => {
													const v= Object.entries(accounts).map(([index, account]) => {	
														if(account.address === currentAccount && account.tokens?.[currentNetwork] && account.tokens?.[currentNetwork][key]) {
															return <OpacityButton key={index} style={style.tokenItem} onPress={() => navigation?.navigate('WalletActivity', {tokenAddress: key})}>
																		 <Wrap style={grid.rowCenterBetween}>
																			 <Wrap style={grid.rowCenterCenter}>
																				 <Wrap style={{marginRight: w(2)}}>
																				 {
																					currentNetwork.toString().indexOf("neon") > -1 && tokenIcons[key] ? 
																					(tokenIcons[key] .toLowerCase().endsWith(".svg") ? 
																					<Wrap>
																						<SvgUri width={"25"} height={"25"} source={{uri: tokenIcons[key]}}
																							/>
																					</Wrap>: 
																						<Picture source={{uri: tokenIcons[key] }} style={{width: w(7), height: w(7), borderRadius: w(80)}} resizeMode="stretch" resizeMethod="scale" />
																					)
																					:
																					<Avatar address={key || ZeroAddress} type={setting.identicon === 'jazzicons'? "Zazzicon": "Blockies"} size={8}/>
																				}
																				 </Wrap>
																				 <Wrap style={{display: "flex", flexDirection: "column"}}>
																					 <Content style={{...gstyle.labelWhite, fontWeight: "700"}}>{
																						 roundNumber(formatUnit(account.tokens[currentNetwork]?.[key]?.toString(), Number(value.decimals)))  +" " + value.symbol
																					 }</Content>
																				 </Wrap>
																			 </Wrap>
																			 <Wrap style={{marginRight: w(1)}}>
																				 <Icon.ArrowRight />
																			 </Wrap>
																		 </Wrap>
																	 </OpacityButton>
														}
													})
													if(v) {
														return v
													}
												})
											}
										</>
									)}
									</Wrap>
									<Wrap style={{marginBottom: h(10), display: "flex", alignItems: "center"}}>
										<Content style={gstyle.labelWhite}>Don't see your token?</Content>
										<OpacityButton onPress={() => navigation?.navigate('ImportToken')}>
											<Content style={gstyle.linkCenter}>Import Tokens</Content>
										</OpacityButton>
									</Wrap>
								</Wrap>
							</>
						)}
						  {status.tabKey === "nfts" && (
							<>
								<Wrap style={{marginBottom: h(4)}}>
									{!nfts[currentNetwork] ? (
										<Content style={{marginTop: h(3), ...gstyle.textLightCenter}}>You have no NFTs</Content>
									) : (
										<>
											{
												nfts[currentNetwork] && nfts[currentNetwork].map((nft: NFTObject, index: number) => {
													if(nft.owner === currentAccount) return (
														<OpacityButton key={index} style={{borderBottomWidth: h(0.1), borderColor: colors.border, paddingRight: w(5), paddingLeft: w(5), paddingTop: h(2), paddingBottom: h(2), 
															backgroundColor: 'rgba(0, 0, 0, 0.3)'}} onPress={() => showNFT(index)}>
															<Wrap style={grid.rowCenter}>
																{/* <Wrap style={{marginRight: w(1)}}>
																	{!status.nftFlags[index] ? <Icon.ArrowRight /> : <Icon.ArrowBottom />}
																</Wrap> */}
																<Wrap style={grid.rowCenterCenter}>
																	<Wrap style={{marginRight: w(2)}}>
																		<Picture source={{uri: nft?.imageUri}} style={{width: w(10), height:w(10), borderRadius: w(1)}} />
																	</Wrap>
																	<Wrap style={{...grid.colBetween}}>
																		<Content style={gstyle.labelWhite}>{nft?.name}</Content>
																		<Content style={gstyle.labelSm}>{nft.tokenUri.replace("https://ipfs.io/ipfs/", "")}</Content>
																	</Wrap>
																</Wrap>
															</Wrap>	
														</OpacityButton>
												)})
											}
										</>
									)}
								</Wrap>
								<Wrap style={{marginBottom: h(10), display: "flex", alignItems: "center"}}>
									<Content style={gstyle.labelWhite}>Don't see your token?</Content>
									<OpacityButton onPress={() => navigation?.navigate('ImportNft')}>
										<Content style={gstyle.linkCenter}>Import NFT</Content>
									</OpacityButton>
								</Wrap>
							</>
						)} 
					</Wrap>
				</Wrap>
			</WalletLayout>
			{status.copiedModal && (
				<CopiedModal close={() => updateStatus({copiedModal: false})} />
			)}
			{status.accountModal && (
				<AccountModal close={() => updateStatus({accountModal: false})} navigation={navigation} />
			)}
			{status.networkModal && (
				<NetworkModal close={() => updateStatus({networkModal: false})} navigation={navigation} />
			)}
			{status.showChangeAccountNameModal && (
				<Modal
					close={() => updateStatus({showChangeAccountNameModal: false})}
					title="Change Account Name"
				>
					<DefaultInput
						visibleValue={false}
						label={"Enter your account name"}
						inputProps={{
							placeholder: "Account Name",
							value: status.accountLabel,
							style:{borderColor: colors.color, borderWidth: w(0.1)},
							onChangeText: (txt:string) => updateStatus({accountLabel: txt})
						}}
					></DefaultInput>
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						<DefaultButton width={40} theme="warning" btnProps={{onPress: () => updateStatus({showChangeAccountNameModal: false})}}>Cancel</DefaultButton>
						<DefaultButton width={40}  btnProps={{onPress: () => {setAccountName()}}}>Change</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{status.showNftModal && (
				<Modal
					close={() => updateStatus({showNftModal: false})}
					title={nfts[currentNetwork]?.[status.selectedNft]?.name}
				>
					<Wrap style={{marginTop: h(-2)}}>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: nfts[currentNetwork]?.[status.selectedNft]?.imageUri}} style={{width: w(60), height:w(60), borderRadius: w(1)}} />
						</Wrap>
						<Content style={gstyle.textLight}>{ellipsis(nfts[currentNetwork]?.[status.selectedNft]?.tokenUri.replace("https://ipfs.io/ipfs/", ""), 30)}</Content>
						<Content style={gstyle.textLightSm}>{ellipsis(nfts[currentNetwork]?.[status.selectedNft]?.tokenId, 35)}</Content>
						<Wrap style={grid.rowCenterCenter}> 
							<DefaultButton width={90} btnProps={{onPress: () => {updateStatus({showNftModal: false}); navigation.navigate("Send", {page: "nft", tokenAddress: nfts[currentNetwork]?.[status.selectedNft]?.contract, tokenId: nfts[currentNetwork]?.[status?.selectedNft]?.tokenId, selectedNftIndex: status.selectedNft})}}}>Send</DefaultButton>
							{/* <DefaultButton width={20} theme="init">
								<Icon.Favorite color={colors.warning} />
							</DefaultButton> */}
						</Wrap>
					</Wrap>
				</Modal>
			)}
		</>
	);
}
