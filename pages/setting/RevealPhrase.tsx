import React from "react"
import { colors, grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput, Modal } from "../components/elements"
import { BgImage, Content, OpacityButton, ScrollWrap, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import Qrcode from "../components/qrcode"
import useStore, { copyToClipboard, decrypt, hmac } from "../../useStore"

interface RevealPhraseStatus {
	showConfirmModal: 	boolean
	showKey:			boolean
	tabKey:				string
	password:			string
	phrase:				string
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<RevealPhraseStatus>({
		showConfirmModal:	false,
		showKey:			false,
		tabKey:				"text",
		password:			"",
		phrase:				""
	})

	const {vault,   showToast} = useStore()
	const updateStatus = (params:Partial<RevealPhraseStatus>) => setStatus({...status, ...params});

	const confirmPassword = async () => {
		if(status.password.length < 8) return showToast("Invalid password", "warning")
		try {
			const passHash = await hmac(status.password);
			const plain = await decrypt(vault, passHash);
			if (plain===null || plain==='') return showToast("Incorrect password", "warning")
			const wallet = JSON.parse(plain)
			updateStatus({phrase:  wallet.mnemonic, showConfirmModal: true});
		} catch(error ) {
			showToast("Incorrect password", "warning")
		}
	}

	return (
		<BgImage source={require("../../assets/bg.png")} style={{width: w(100), height: h(100)}}>
			<Wrap style={gstyle.body}>
				<Wrap style={{marginTop: h(5), height: h(15), justifyContent: "center"}}>
					<Content style={gstyle.title}>Reveal Secret Recovery Phrase</Content>
				</Wrap>
				<ScrollWrap style={{flex: 1, paddingLeft: w(5), paddingRight: w(5), paddingBottom: h(15)}}>
					<Wrap style={grid.gridMargin4}>
						<Content style={gstyle.textLight}>The Secret Recovery Phrase (SRP) gives full access to your wallet, funds and accounts.</Content>
						<Content style={gstyle.textLight}>ICICBWallet is a non-custodial wallet. That means, you are the owner of your SRP.</Content>
					</Wrap>
					<Wrap style={grid.gridMargin4}>
						<Wrap style={grid.panel}>
							<Wrap style={grid.rowCenter}>
								<Wrap style={{...grid.rowCenterCenter, width: w(10)}}>
									<Icon.EyeInvisible color={colors.danger} width={w(7)} height={w(7)} />
								</Wrap>
								<Content style={{...gstyle.labelWhite, flex: 1}}>Make sure nobody is looking at your screen. ICICBWallet Support will never request this.</Content>
							</Wrap>
						</Wrap>
					</Wrap>
					{ !status.showKey ? (
						<Wrap style={grid.gridMargin4}>
							<DefaultInput
								visibleValue={true}
								label={"Enter password to continue"}
								inputProps={{
									onChangeText: (txt:string) => updateStatus({password: txt}),
									value: status.password
								}}
							/>
						</Wrap>
					) : (
						<>
							<Wrap style={{...grid.rowCenterAround, ...grid.gridMargin4}}>
								<OpacityButton style={{flex: 1, borderBottomWidth: h(0.1), borderColor: (status.tabKey === "text" ? colors.color : colors.border)}} onPress={() => updateStatus({tabKey: "text"})}>
									<Content style={gstyle.textLightCenter}>// Text</Content>
								</OpacityButton>
								<OpacityButton style={{flex: 1, borderBottomWidth: h(0.1), borderColor: (status.tabKey === "qrCode" ? colors.color : colors.border)}} onPress={() => updateStatus({tabKey: "qrCode"})}>
									<Content style={gstyle.textLightCenter}>// QRCode</Content>
								</OpacityButton>
							</Wrap>
							{status.tabKey === "text" && (
								<>
									<Content style={{...gstyle.label, ...gstyle.textCenter}}>Your Secret Recovery Phrase</Content>
									<Wrap style={{...grid.panel}}>
										<Content style={{...gstyle.labelLg, lineHeight: h(4), textAlign: "center"}}>
											{status.phrase}
										</Content>
										<Wrap style={{...grid.btnGroup, marginTop:h(2)}}>
											<DefaultButton  btnProps={{onPress: () => {copyToClipboard(status.phrase); showToast("Copied secret phrase")}}}>Copy</DefaultButton>
										</Wrap>
									</Wrap>
								</>
							)}
							{status.tabKey === "qrCode" && (
								<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin3}}>
									<Qrcode.createQRCode code={status.phrase} size={w(50)} />
								</Wrap>
							)}
						</>
					)}
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						{ !status.showKey ? (
							<>
								<DefaultButton width={40} theme="init" btnProps={{onPress: () => navigation?.navigate("Security")}}>Cancel</DefaultButton>
								<DefaultButton width={40} theme="warning" btnProps={{onPress: () => confirmPassword()}}>Next</DefaultButton>
							</>
						) : (
							<DefaultButton theme="warning" btnProps={{onPress: () => navigation?.navigate("Security")}}>Done</DefaultButton>
						)}
					</Wrap>
				</ScrollWrap>
			</Wrap>
			{status.showConfirmModal && (
				<Modal
					close={() => updateStatus({showConfirmModal: false})}
					title={"Keep your SRP safe"}
				>
					<Content style={gstyle.textLight}>Your Secret Recovery Phrase provides full access to your wallet and funds.</Content>
					<Content style={gstyle.textLight}>Do you share this with anyone. ICICBWallet Support will not request this,</Content>
					<Wrap style={grid.gridMargin2}>
						<Content style={gstyle.link}>but phishers might.</Content>
					</Wrap>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: () => updateStatus({showKey: true, showConfirmModal: false})}}>Hold to reveal SRP</DefaultButton>
					</Wrap>
				</Modal>
			)}
		</BgImage>
	)
}