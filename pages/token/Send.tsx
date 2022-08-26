import React from "react"
import { isValidAddress } from "ethereumjs-util"
import { colors, grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput } from "../components/elements"
import { Content, OpacityButton,  Wrap } from "../components/commons"
import Avatar from "../components/avatar"
import AccountModal from "../layouts/AccountModal"
import FunctionLayout from "../layouts/FunctionLayout"
import useStore, { ellipsis } from "../../useStore"

interface SendStatus {
	accountModal: 	boolean
	to:				string
	showMyAccounts:	boolean
}

export default function ({ route, navigation }: any) {
	const {page, tokenAddress, tokenId, selectedNftIndex} = route.params;

	const [status, setStatus] = React.useState<SendStatus>({
		accountModal:	false,
		to:				"",
		showMyAccounts:	false
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

	return (
		<>
			<FunctionLayout
				navigation={navigation}
				title="Send to"
				onBack={goBack}
			>
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
						<Wrap style={{alignSelf: "stretch", flexDirection: "row", alignItems: "center"}}>
							<Wrap style={{width: w(15)}}>
								<Content style={gstyle.labelWhite}>To:</Content>
							</Wrap>
							<Wrap style={{flex: 1}}>
								<DefaultInput
									inputProps={{
										value: status.to,
										onChangeText: (txt:string) => updateStatus({to: txt }),
										placeholderTextColor: colors.placeholder,
										placeholder: "Search, public address (0x)",
										style: {...gstyle.labelWhite}
									}}
									visibleValue={false}
								/>
							</Wrap>
						</Wrap>
					</Wrap>

					<Wrap style={{...grid.rowCenterCenter, paddingBottom: h(2)}}>
						<Wrap style={{flex: 1}}>
							{recents.length > 0 && <Content style={{...gstyle.labelWhite, paddingLeft: w(5)}}>Recents</Content>}
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
			</FunctionLayout>
			{status.accountModal && (
				<AccountModal close={() => updateStatus({accountModal: false})} navigation={navigation} />
			)}
		</>
	)
}