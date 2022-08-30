import React from "react"
import { isValidAddress } from "ethereumjs-util"
import { colors, gfont, grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput } from "../components/elements"
import { Content, Input, OpacityButton,  Picture,  Wrap } from "../components/commons"
import Avatar from "../components/avatar"
import Barcode from '../components/captureqr'
import AccountModal from "../layouts/AccountModal"
import FunctionLayout from "../layouts/FunctionLayout"
import useStore, { ellipsis } from "../../useStore"
import captureIcon from '../../assets/scanning.png'
import Icon from "../components/Icon"

interface SendStatus {
	accountModal: 	boolean
	to:				string
	showMyAccounts:	boolean
	scanned:		boolean
}

export default function ({ route, navigation }: any) {
	const {page, tokenAddress, tokenId, selectedNftIndex} = route.params;

	const [status, setStatus] = React.useState<SendStatus>({
		accountModal:	false,
		to:				"",
		showMyAccounts:	false,
		scanned:		true
	})

	const updateStatus = (params:{[key:string]:string|number|boolean|any}) => setStatus({...status, ...params});
	
	const {currentAccount,  accounts,   setting,  recents, contacts, showToast} = useStore()

	const goBack = () => { 
		navigation?.navigate('WalletTokens')
	}

	const goSendPage = () => {
		if(status.to === "") return showToast("Please input receive address", "warning")
		if(!isValidAddress(status.to)) return showToast("Invalid public address", "warning")
		navigation?.navigate('SendAmount', {page, tokenAddress, to: status.to, tokenId, selectedNftIndex})
	}

	const setToAddress = (data: any) => {
		try {
			let uri = data['data'] || '';
			if(!isValidAddress(uri)) uri = ''
			updateStatus({scanned: true, to: uri})
		} catch (err) {
			updateStatus({scanned: true, to: ''})
		}
	}

	const close = () => {
		updateStatus({scanned: true})
		navigation?.goBack();
	}
	return (
		<>
			<FunctionLayout
				navigation={navigation}
				title="Send to"
				onBack={goBack}
			>
				<Wrap style={{backgroundColor: "rgba(0, 0, 0, 0.5)", paddingTop: h(5), paddingBottom:h(5), paddingLeft: w(2), paddingRight: w(2), borderRadius: w(2), borderColor: colors.color, borderWidth: w(0.1), margin: w(3)}}>
					<Wrap style={{display: "flex", alignItems: "center"}}>
						<Wrap style={{alignSelf: "stretch", paddingRight: w(5), paddingLeft: w(5)}}>
							<Wrap style={{alignSelf: "stretch", flexDirection: "row", alignItems: "center"}}>
								<Wrap style={{width: w(15)}}>
									<Content style={gstyle.labelWhite}>From:</Content>
								</Wrap>
								<Wrap style={{flex: 1}}>
									<OpacityButton style={{display: "flex", flexDirection: "row", alignItems: "center"}} onPress={() => updateStatus({accountModal: true})}>
										<Wrap style={{display: "flex", alignItems: "center", width: w(9)}}>
											<Avatar address={currentAccount} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>
										</Wrap>
										<Wrap style={{flex: 1, marginLeft: w(2)}}>
											{Object.entries(accounts).map(([index, account]) => {
												if(account.address === currentAccount) {
													return <Content style={gstyle.labelWhite} key={"ak " + index}>
														{ellipsis(account.label, 15)}
													</Content>
												}
											})}  
											<Content style={gstyle.labelSm}>{ellipsis(currentAccount, 30)}</Content>
										</Wrap>
									</OpacityButton>
								</Wrap>
							</Wrap>
							<Wrap style={{alignSelf: "stretch", flexDirection: "row", alignItems: "center", marginTop: h(3), marginBottom: h(3)}}>
								<Wrap style={{width: w(15)}}>
									<Content style={gstyle.labelWhite}>To:</Content>
								</Wrap>
								<Wrap style={{flex: 1}}>
									<Wrap style={{...grid.rowCenterCenter,...grid.gridMargin2, backgroundColor: 'rgba(0, 0, 0, 0.8)', 
												borderColor: colors.color, 
												borderWidth: w(0.1),
												borderRadius: w(1)}}>
										<Input
											style={{
												...gfont.t,
												flex: 1,
												color: colors.white,
												height: h(7),
												paddingLeft: w(3)
											}}
											placeholderTextColor={colors.placeholder}
											value=  {status.to}
											onChangeText= {(txt:string) => updateStatus({to: txt })}
											placeholder= {"Search, public address (0x)"}
										/>
										<Wrap style={{paddingLeft: w(3), paddingRight: w(3)}}>
											<OpacityButton onPress={() => {updateStatus({scanned: false})}}>
												<Picture source={captureIcon} style={{width:w(5), height:w(5)}}/>
											</OpacityButton>
										</Wrap>
									</Wrap>
								</Wrap>
							</Wrap>
						</Wrap>

						<Wrap style={{...grid.rowCenterCenter, paddingBottom: h(2)}}>
							<Wrap style={{flex: 1}}>
								{recents.length > 0 && <Content style={{...gstyle.labelWhite, paddingLeft: w(5)}}>Recen
								
								ts</Content>}
								{
									recents.map((account, index) => {
										if(account !== currentAccount) return <Wrap key={"ab" + index}>
											<Wrap style={gstyle.hr} />
											<Wrap style={{alignSelf: "stretch", flexDirection: "row", marginLeft:w(3), alignItems: "center"}}>
												<OpacityButton style={{display: "flex", flexDirection: "row", alignItems: "center"}} onPress={() => updateStatus({to: account})}>
													<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
														<Avatar address={account} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>
													</Wrap>
													<Wrap style={{flex: 1}}>
														<Content style={gstyle.labelSm}>{ellipsis(account, 36)}</Content>
													</Wrap>
												</OpacityButton>
											</Wrap>
										</Wrap>
									})
								}
							</Wrap>
						</Wrap>

						<OpacityButton onPress={() => updateStatus({showMyAccounts: !status.showMyAccounts})} style={{alignSelf: 'flex-start', marginLeft: w(6)}}>
							<Content style={gstyle.link}>Transfer between my accounts</Content>
						</OpacityButton>
						{(status.showMyAccounts || (recents.length === 0 && contacts.length === 0))  &&  
							Object.entries(accounts).map(([index, account]) => {
								if(account.address !== currentAccount) return <Wrap key={"kk" + index}>
									<Wrap style={gstyle.hr}/>
									<Wrap style={{alignSelf: "stretch", flexDirection: "row", marginLeft:w(3), alignItems: "center"}}>
										<OpacityButton style={{display: "flex", flexDirection: "row", alignItems: "center"}} onPress={() => updateStatus({to: account.address})}>
											<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
												<Avatar address={account.address} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>
											</Wrap>
											<Wrap style={{flex: 1}}>
												<Content style={gstyle.labelWhite}>
													{ellipsis(account.label)}
												</Content>
												<Content style={gstyle.labelSm}>{ellipsis(account.address, 36)}</Content>
											</Wrap>
										</OpacityButton>
									</Wrap>
								</Wrap>
							})
						}
						
						<Wrap style={{...grid.rowCenterCenter, paddingTop: h(4), paddingBottom: h(2)}}>
							<Wrap style={{flex: 1}}>
								{contacts.length > 0  && <Content style={{...gstyle.labelWhite, paddingLeft: w(5)}}>Contacts</Content> }
								{
									contacts.map((account, index) => (<Wrap key={"ac" + index}>
											<Wrap style={gstyle.hr} />
											<Wrap style={{alignSelf: "stretch", flexDirection: "row", marginLeft:w(3), alignItems: "center"}}>
												<OpacityButton style={{display: "flex", flexDirection: "row", alignItems: "center"}} onPress={() => updateStatus({to: account.address})}>
													<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
														<Avatar address={account.address} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={8}/>
													</Wrap>
													<Wrap style={{flex: 1}}>
														<Content style={gstyle.labelWhite}>
															{ellipsis(account.label)}
														</Content>
														<Content style={gstyle.labelSm}>{ellipsis(account.address, 36)}</Content>
													</Wrap>
												</OpacityButton>
											</Wrap>
										</Wrap>
									))
								}
							</Wrap>
						</Wrap>
					</Wrap>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: () => goSendPage()}}>Next</DefaultButton>
					</Wrap>

				</Wrap>
			</FunctionLayout>
			{status.accountModal && (
				<AccountModal close={() => updateStatus({accountModal: false})} navigation={navigation} />
			)}
			{
				!status.scanned && (
					<>
						<Barcode onScanned={(data:string)=>{setToAddress(data)}} />
						<OpacityButton style={{marginTop: h(1.1), position: 'absolute', right:w(3), top: h(5)}} onPress={() => {close()}}>		
							<Wrap>
								<Icon.X width={w(10)} height={w(10)} color={colors.danger} />
							</Wrap>
						</OpacityButton>
					</>
				)
			}
		</>
	)
}
