import React from "react"
import { colors, grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput, Modal } from "../components/elements"
import { BgImage, Content, OpacityButton, ScrollWrap, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import Qrcode from "../components/qrcode"
import useStore, { copyToClipboard, decrypt, hmac } from "../../useStore"

interface RevealPhraseStatus {
	showConfirmModal:	boolean
	showKey:			boolean
	tabKey:				string
	password:			string
	privKey:			string
}

export default function ({ navigation } : any) {
	const [status, setStatus] = React.useState<RevealPhraseStatus>({
		showConfirmModal:	false,
		showKey:			false,
		tabKey:				"text",
		password:			"",
		privKey:			""
	})
		
	const updateStatus = (params:Partial<RevealPhraseStatus>) => setStatus({...status, ...params});
	
	const {vault,currentAccount, showToast} = useStore()

	const confirmPassword = async () => {
		if(status.password.length < 8) return showToast("Invalid password", "warning")
		try {
			const passHash = await hmac(status.password);   
			const plain = await decrypt(vault, passHash);
			if (plain===null || plain==='') return showToast("Incorrect password", "warning")
			const wallet = JSON.parse(plain)
			const privatekey  = wallet.keys?.[currentAccount]
			if (privatekey) {
				updateStatus({privKey: privatekey,  password: "", showConfirmModal: true})
			} else {
				showToast("Could not found wallet infomation.", "warning");
			}
		} catch(error ) {
			showToast("Incorrect password", "warning")
		}
	}


	return (
		<BgImage source={require("../../assets/bg.png")} style={{width: w(100), height: h(100)}}>
			<Wrap style={gstyle.body}>
				<Wrap style={{marginTop: h(5), height: h(15), justifyContent: "center"}}>
					<Content style={gstyle.title}>Show Private Key</Content>
				</Wrap>
				<ScrollWrap style={{flex: 1, paddingLeft: w(5), paddingRight: w(5), paddingBottom: h(12)}}>
					<Wrap style={grid.gridMargin4}>
						<Content style={{...gstyle.textLight, ...gstyle.textCenter}}>Save it somewhere safe and secret.</Content>
					</Wrap>
					<Wrap style={grid.gridMargin4}>
						<Wrap style={grid.panel}>
							<Wrap style={grid.rowCenter}>
								<Wrap style={{...grid.rowCenterCenter, width: w(12)}}>
									<Icon.EyeInvisible color={colors.danger} width={w(7)} height={w(7)} />
								</Wrap>
								<Content style={{...gstyle.labelWhite, flex: 1}}>Never disclose this key. Anyone with your private key can fully control your account, including transferring away any of your funds.</Content>
							</Wrap>
						</Wrap>
					</Wrap>
					{ !status.showKey ? (
						<Wrap style={grid.gridMargin4}>
							<DefaultInput label={"Enter password to continue"} visibleValue={true}  inputProps={{
									onChangeText: (txt:string) => updateStatus({password: txt}),
									value: status.password
							}}></DefaultInput>
						</Wrap>
					) : (
						<>
							<Wrap style={{...grid.rowCenterAround, ...grid.gridMargin4}}>
								<OpacityButton style={{flex: 1, borderBottomWidth: h(0.1), borderColor: (status.tabKey === "text" ? colors.color : colors.border)}} onPress={() => setStatus({...status, tabKey: "text"})}>
									<Content style={gstyle.textLightCenter}>// Text</Content>
								</OpacityButton>
								<OpacityButton style={{flex: 1, borderBottomWidth: h(0.1), borderColor: (status.tabKey === "qrCode" ? colors.color : colors.border)}} onPress={() => setStatus({...status, tabKey: "qrCode"})}>
									<Content style={gstyle.textLightCenter}>// QRCode</Content>
								</OpacityButton>
							</Wrap>
							{status.tabKey === "text" && (
								<>
									<Content style={{...gstyle.label, marginBottom:h(1), ...gstyle.textCenter}}>Your private key</Content>
									<Wrap style={grid.panel}>
										<Content style={{...gstyle.labelWhite, lineHeight: h(4), textAlign: "center"}}>
											{status.privKey}
										</Content>
										<Wrap style={{...grid.btnGroup, marginTop:h(2)}}>
											<DefaultButton theme="warning"  btnProps={{onPress: () => {copyToClipboard(status.privKey); showToast("Copied private key")}}}>Copy</DefaultButton>
										</Wrap>
									</Wrap>
								</>
							)}
							{status.tabKey === "qrCode" && (
								<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin3}}>
									<Qrcode.createQRCode code={status.privKey} size={w(50)} />
								</Wrap>
							)}
						</>
					)}
					<Wrap style={{...grid.btnGroup, justifyContent:"space-around"}}>
						{ !status.showKey ? (
							<>
								<DefaultButton width={40} theme="warning" btnProps={{onPress: () => navigation?.navigate("Security")}}>Cancel</DefaultButton>
								<DefaultButton width={40}  btnProps={{onPress: () => confirmPassword()}}>Next</DefaultButton>
							</>
						) : (
							<DefaultButton  btnProps={{onPress: () => navigation?.navigate("Security")}}>Done</DefaultButton>
						)}
					</Wrap>
				</ScrollWrap>
			</Wrap>
			{status.showConfirmModal && (
				<Modal
					close={() => updateStatus({showConfirmModal: false})}
					title={"Keep your Private Key safe"}
				>
					<Content style={gstyle.textLight}>Your Private Key provides full access to your account and funds</Content>
					<Content style={gstyle.label}>Do not share this with anyone.</Content>
					<Content style={gstyle.textLight}>ICICBWallet Support will not request this,</Content>
					<Wrap style={grid.gridMargin2}>
						<Content style={gstyle.link}>but phishers might.</Content>
					</Wrap>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: () => updateStatus({showKey: true, showConfirmModal: false})}}>Hold to reveal Private Key</DefaultButton>
					</Wrap>
				</Modal>
			)}
		</BgImage>
	)
}