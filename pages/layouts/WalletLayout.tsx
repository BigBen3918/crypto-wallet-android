import React from "react"
import { colors, grid, gstyle, h, w } from "../components/style"
import { walletLayout as style } from "../components/StyledComponents"
import { DefaultButton, DefaultInput, Modal } from "../components/elements"
import { BgImage, ButtonWithoutFeedback, Content, OpacityButton, Picture, ScrollWrap, Wrap } from "../components/commons"
import Logo from '../../assets/logo.png'
import SideLogo from '../../assets/icicb_logo.png'
import Menu from '../../assets/menu.png'
import Search from '../../assets/search.png'
import Icon from "../components/Icon"
import CopiedModal from "./CopiedModal"
import Avatar from "../components/avatar"
import AccountModal from "./AccountModal"
import NetworkModal from "./NetworkModal"
import { formatUnit } from "../../library/bigmath"
import { ZeroAddress } from "../../library/wallet"
import WalletConnectDetect from '../components/walletconnect'
import useStore, { ellipsis, roundNumber } from "../../useStore"

interface AuthLayoutProps {
	navigation:			any
	menuKey:			string
	title?:				string
	content?:			any
	children:			any
	footer?:			any
	hideHead?:			boolean
}

interface LayoutStatus {		
	showMenu:		boolean
	networkModal:	boolean
	accountModal:	boolean
	copied:			boolean
	showChangeAccountNameModal:	boolean
	accountLabel:	string
}

export default function ({ navigation, menuKey, title, content, children, footer, hideHead }: AuthLayoutProps) {
	const [status, setStatus] = React.useState<LayoutStatus>({
		showMenu:		false,
		networkModal:	false,
		accountModal:	false,
		copied:			false,
		showChangeAccountNameModal:	false,
		accountLabel:	""
	})

	const updateStatus = (params:Partial<LayoutStatus>) => setStatus({...status, ...params});
	const {currentAccount, accounts, setting, currentNetwork, networks, showToast, update} = useStore()
		
	const menuItems = [
		[{ key: "wallet",		 icon: (color:string) => <Icon.Wallet2 color={color} />,   label: "Wallet",				 event: () => {update({browser: false})}}],
		[{ key: "viewetherscan",  icon: (color:string) => <Icon.Eye color={color} />,	   label: "View on explorer",	  event: () => {viewOnExplorer()}}],
		[{ key: "settings",		icon: (color:string) => <Icon.Setting color={color} />,   label: "Settings",				event: () => {navigation.navigate("Setting")}}],
		[{ key: "support",		   icon: (color:string) => <Icon.Support color={color} />, label: "Support",				   event: () => {navigation?.navigate('WebView', {url: "https://docs.icicbwallet.io/guide/"})} }],
		[{ key: "lock",		   icon: (color:string) => <Icon.SmallLock color={color} />, label: "Lock",				   event: () => {update({lastAccessTime: 0, password: ''}); navigation.navigate("Unlock")} }
		]
	]

	const onMenu = () => {
		updateStatus({showMenu: true})
	}

	const closeMenu = () => {
		updateStatus({showMenu: false})
	}

	const viewOnExplorer = () => {
		Object.values(networks).map((network) => {
			if( network.chainKey === currentNetwork){
				const url = network.url + "address/"+currentAccount			
				navigation.navigate("WebView", {url: url})
			}	
		})
	}

	const walletConnect = () => {
		navigation.navigate("WalletconnectCapture")
	}

	const setAccountName = () => {
		if(status.accountLabel.trim() === "") return showToast("Enter account label", "warning")
		const newAccounts:AccountObject[] = [];
		Object.values(accounts).map(( account ) => {
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


	return (
		<BgImage source={require("../../assets/bg.png")} style={{width: w(100), height: h(100)}}>
			<Wrap style={gstyle.body}>
				{ !hideHead ? 
					<Wrap style={style.header}>
						<OpacityButton onPress={onMenu}>
							<Picture source={Menu} style={{ width: w(6), height: w(4) }} />
						</OpacityButton>
						<OpacityButton style={{paddingLeft: w(0), paddingTop: h(2)}} onPress={() => navigation.navigate("WalletTokens")}>
							<Picture source={Logo} style={{ width: w(25), height: w(10) }} />
						</OpacityButton>
						<OpacityButton onPress={walletConnect}>
							<Picture source={Search} style={{ width: w(6), height: w(6) }} />
						</OpacityButton>
					</Wrap>
					:
					<Wrap style={{marginTop:h(5)}}></Wrap>
				 }
				{ content && content }
				<ScrollWrap style={gstyle.container} contentContainerStyle={gstyle.scrollviewContainer}>
					{ title && (
						<Content style={gstyle.title}>{title}</Content>
					)}
					{children}
				</ScrollWrap>
				{ footer }
				{status.showMenu && (
					<ButtonWithoutFeedback onPress={closeMenu}>
						<Wrap style={style.container}>
							<ButtonWithoutFeedback onPress={()=>{}}>
								<Wrap style={{flex: 1, width: w(70), backgroundColor: colors.bgModal}}>
									<OpacityButton style={{paddingTop: h(2), display:'flex', flexDirection:'row', justifyContent:'center'}} onPress={() => navigation.navigate("WalletTokens")}>
										<Picture source={SideLogo} style={{ width: w(22), height: w(8) }} />
									</OpacityButton>
									<ScrollWrap>
										<Wrap style={{paddingTop: h(2)}}>
											<Wrap style={{alignSelf: "stretch", display: "flex", justifyContent: "center", alignItems: "center"}}>
												<OpacityButton style={grid.gridMargin1} onPress={() => updateStatus({accountModal: true})}>
													<Avatar size={15} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} address={currentAccount || ZeroAddress} />
												</OpacityButton>
												<OpacityButton onPress={() => updateStatus({showChangeAccountNameModal: true, accountLabel: (() => {
													let label = ""
													Object.entries(accounts).map(([index, account]) => {
														const key = index;
														if(account.address === currentAccount) {
															label = account.label
														}
													})
													return label
												})()})}>
												{Object.entries(accounts).map(([index, account]) => {
													if(account.address === currentAccount) {
														return <Wrap key = {"cak" + index} >
															<Content style={{...gstyle.labelLg, paddingTop: h(1)}}> {ellipsis(account.label, 15)}</Content>
															{account.imported && <Content key = {"cadk" + index} style={gstyle.textLightSmCenter}>Imported</Content>}
														</Wrap>
													}
												})}  
											</OpacityButton>
												<Wrap style={grid.rowCenterBetween}>
													<Wrap style={gstyle.hr} />
													<Content style={gstyle.labelSm}>
													{Object.entries(accounts).map(([index, account]) => {
														const key = index;
														if(account.address === currentAccount) {
															return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
													}})}  
													{
														networks && Object.entries(networks).map(([index, network]) => {
															const key = index;
															if( network.chainKey === currentNetwork){
																return " " + network.symbol
														}})
													}
													</Content>
													<Wrap style={gstyle.hr} />
												</Wrap>
												<OpacityButton style={style.key}>
													<Content style={gstyle.labelWhite} onPress={() => updateStatus({copied: true})}>{ellipsis(currentAccount)}</Content>
												</OpacityButton>
												<Wrap style={{alignSelf: "center", display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: w(60), marginBottom: h(3)}}>
													<OpacityButton style={style.btn} onPress={()=>navigation.navigate("Send", {page:"money", tokenAddress: ZeroAddress, tokenId: ''})}>
														<Wrap style={{marginRight: w(1)}}><Icon.Send color={colors.color} /></Wrap>
														<Content style={{...gstyle.labelWhite, paddingLeft: w(2)}}>Send</Content>
													</OpacityButton>
												</Wrap>
												<Wrap style={{alignSelf: "stretch", height: h(0.1), backgroundColor: colors.color}} />
												<Wrap style={style.menu}>
													{menuItems.map((g:any, gk:number) => (
														<Wrap key={"gks" + gk}>
															{g.map((i:any, k:number) => (
																<OpacityButton key={"key" + k} style={{...style.item, backgroundColor: menuKey === i.key ? colors.border : "auto"}} onPress={() => {updateStatus({showMenu: false}); i.event()}}>
																	<Wrap style={{marginRight: w(1)}}>
																		{i.icon(menuKey === i.key ? colors.warning : colors.color)}
																	</Wrap>
																	<Content style={{...style.itemContent, color: menuKey === i.key ? colors.warning : colors.color}}>{i.label}</Content>
																</OpacityButton>
															))}
															{gk !== menuItems.length - 1 && <Wrap style={gstyle.hr2} />}
														</Wrap>
													))}
												</Wrap>
											</Wrap>
										</Wrap>
									</ScrollWrap>
								</Wrap>
							</ButtonWithoutFeedback>
						</Wrap>
					</ButtonWithoutFeedback>
				)}
				{status.copied && (
					<CopiedModal close={() => updateStatus({copied: false})} />
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
							onChangeText: (txt:string) => updateStatus({accountLabel: txt}),
							style:{borderColor: colors.color, borderWidth: w(0.1)}
						}}
					></DefaultInput>
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						<DefaultButton width={40} btnProps={{onPress: () => updateStatus({showChangeAccountNameModal: false})}}>Cancel</DefaultButton>
						<DefaultButton width={40} theme="warning" btnProps={{onPress: () => {setAccountName()}}}>Change</DefaultButton>
					</Wrap>
				</Modal>
			)}
			</Wrap>
			<WalletConnectDetect/>
		</BgImage>
	)
}
