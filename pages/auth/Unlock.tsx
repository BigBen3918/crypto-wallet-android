import React from "react"
import { Switch } from "react-native-paper"
import { colors, grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput, Modal } from "../components/elements"
import { BgImage, Content, OpacityButton,  Picture,  ScrollWrap, Wrap } from "../components/commons"
import Logo from '../../assets/logo.png'
import {initialState} from '../../reducer'
import  useStore, { decrypt, hmac } from '../../useStore'

interface UnlockStatus {
	isRemember:					boolean
	showRemoveWalletWarning:	boolean
	password:					string
}

export default function ({ navigation }: any) {
	const {vault, update, showToast} = useStore()
	const [status, setStatus] = React.useState<UnlockStatus>({
		isRemember:					false,
		showRemoveWalletWarning:	false,
		password:					""
	})

	const updateStatus = (params:Partial<UnlockStatus>) => setStatus({...status, ...params});

	const checkPass = async () => {
		try {
			const passHash = await hmac(status.password)
			const plain = await decrypt(vault, passHash);
			if (plain===null || plain==='') return showToast("Incorrect password", "warning")
			const wallet = JSON.parse(plain)
			if(!wallet) {
				return showToast("Incorrect password.", "warning");
			}
			update({lastAccessTime: +new Date(), password: passHash})
			updateStatus({password: ""})
			navigation.navigate("WalletTokens")
		} catch (error) {
			return showToast("Incorrect password.", "warning");
		}
	}
		

	const resetWallet = () => {
		update(initialState)
		updateStatus({showRemoveWalletWarning: false, password: ""})
		navigation.navigate("GetStarted")
	}

	return (
		<>
			<BgImage source={require("../../assets/bg.png")} resizeMode="cover" style={{width: w(100), height: h(100)}}>
				<Wrap style={gstyle.body}>
					<ScrollWrap style={gstyle.container}>
						<Wrap style={{marginTop: h(10)}}>
							<Wrap style={gstyle.subContainer}>
								<Wrap style={{alignSelf: "center"}}>
									<Picture source={Logo} style={{width:w(25), height:w(10)}}/>				
								</Wrap>
								<Content style={gstyle.title}>Welcome Back!</Content>
								<DefaultInput
									label="Password"
									inputProps={{
										textContentType: "password",
										secureTextEntry: true,
										placeholder: "Password",
										onChangeText: (txt:string) => updateStatus({password: txt}),
										value: status.password
									}}
									visibleValue
								/>
								<Wrap style={{...grid.rowCenterBetween, ...grid.gridMargin3}}>
									<Content style={gstyle.labelWhite}>Remember me</Content>
									<Wrap style={grid.rowCenterCenter}>
										<Wrap><Switch thumbColor={colors.warning} onChange={() => updateStatus({isRemember: !status.isRemember})} value={status.isRemember} /></Wrap>
										<Content style={gstyle.labelWhite}>{status.isRemember ? "ON": "OFF"}</Content>
									</Wrap>
								</Wrap>
								<Wrap style={{marginBottom: h(7)}}>
									<Wrap style={grid.btnGroup}>
										<DefaultButton btnProps={{onPress: () => { checkPass() }}} >UNLOCK</DefaultButton>
									</Wrap>
								</Wrap>
								<Content style={gstyle.textLightCenter}>Wallet won't unlock? You can ERASE your wallet and setup a new one</Content>
								<OpacityButton onPress={() => updateStatus({showRemoveWalletWarning: true})}>
									<Content style={gstyle.linkCenter}>Reset Wallet</Content>
								</OpacityButton>
							</Wrap>
						</Wrap>
					</ScrollWrap>
				</Wrap>
			</BgImage>
			{status.showRemoveWalletWarning && (
				<Modal
					close={() => updateStatus({showRemoveWalletWarning: false})}
					title={"Are you sure you want to erase your wallet?"}
				>
					<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
						<Content style={gstyle.textLightCenter}>Your current wallet, accounts and assets will be <Content style={gstyle.bold}>removed from this app permanently</Content>. This action cannot be undone.</Content>
					</Wrap>
					<Content style={gstyle.textLightCenter}>You can ONLY recover this wallet with your <Content style={gstyle.bold}>Secret Recovery Phrase</Content> ICICBWallet does not have your Secret Recovery Phrase.</Content>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress:() => {updateStatus({showRemoveWalletWarning: false})}}}>Cancel</DefaultButton>
						<DefaultButton theme="danger" btnProps={{onPress:() => {resetWallet()}}}>Remove Wallet</DefaultButton>
					</Wrap>
				</Modal>
			)}
		</>
	)
}