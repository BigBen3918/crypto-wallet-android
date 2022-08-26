import React from "react"
import { Checkbox, Switch } from "react-native-paper"
import Icon from "../components/Icon"
import { Content, Wrap } from "../components/commons"
import { colors, grid, gstyle, h, w } from "../components/style"
import { createPass as style } from "../components/StyledComponents"
import { DefaultButton, DefaultInput, Stepper } from "../components/elements"
import AuthLayout from "../layouts/AuthLayout"
import useStore, { hmac } from "../../useStore"

interface CreatePassStatus {
	newPass:		string
	confirmPass:	string
	isAccept:		boolean
	isMatch:		boolean
	isRemember:		boolean
	passStatus:		string
}

export default function ({  navigation }: any) {
	const passStatus = ["", "Week", "Medium", "Strong", "Very Strong"]
	const {showToast} = useStore()

	const [status, setStatus] = React.useState<CreatePassStatus>({
		newPass:		"",
		confirmPass:	"",
		isAccept:		false,
		isMatch:		false,
		isRemember:		false,
		passStatus:		passStatus[0]
	})
    
	const updateStatus = (params:Partial<CreatePassStatus>) => setStatus({...status, ...params});

	const changeNewPass = (txt: string) => {
		let ps = passStatus[~~(txt.length / 3) < 4 ? txt.length % 3 : txt.length % 3];
		updateStatus({
			newPass: txt,
			isMatch: txt !== "" && txt === status.confirmPass,
			passStatus: ps
		})
	}

	const changeConfirmPass = (txt: string) => {
		updateStatus({
			confirmPass: txt,
			isMatch: status.newPass !== "" &&  status.newPass=== txt
		})
	}

	const goBack = () => { 
		navigation?.goBack()
	}	

	const submit = async () => { 
		if(status.newPass !== status.confirmPass) {
			return showToast("Invalid confirm password")
		}
		if(status.newPass.length < 8) return showToast("Invalid password (Min length:8)")
		
		const passHash = await hmac(status.newPass)

		navigation?.navigate('SecureWallet1', {password: passHash})
	}

	return (
		<AuthLayout 
			onBack={goBack}
			content={
				<Stepper 
					data={[
						{label: "Create Password"}, 
						{label: "Secure Wallet"},
						{label: "Confirm Secure Recovery Phrase"}
					]} 
					step={0} 
				/>
			}
			title="Create Password"
		>
			<Content style={gstyle.textLightCenter}>This password will unlock your NeonwWallet only on this device</Content>
			<DefaultInput
				label="New password"
				inputProps={{
					textContentType: "password",
					secureTextEntry: true,
					placeholder: "New password",
					onChangeText: (txt:string) => changeNewPass(txt)
				}}
				visibleValue
			/>
			<DefaultInput
				label="Confirm password"
				inputProps={{
					textContentType: "password",
					secureTextEntry: true,
					placeholder: "Confirm password",
					onChangeText: (txt:string) => changeConfirmPass(txt)
				}}
				visibleValue
				warning={
					<Content style={gstyle.labelWhite}>Must be at least 8 characters</Content>
				}
			>
				{status.isMatch && (
					<Wrap style={{position: "absolute", top: h(6.5), right: w(1)}}>
						<Icon.Check color={colors.warning} width={30} height={30} />
					</Wrap>
				)}
			</DefaultInput>
			
			<Wrap style={{alignSelf: "stretch", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
				<Content style={gstyle.labelWhite}>Remember me</Content>
				<Wrap style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
					<Wrap><Switch thumbColor={colors.warning} onChange={() => updateStatus({isRemember: !status.isRemember})} value={status.isRemember} /></Wrap>
					<Content  style={gstyle.labelWhite}>{status.isRemember ? "ON": "OFF"}</Content>
				</Wrap>
			</Wrap>
			<Wrap style={style.checkBox}>
				<Checkbox status={status.isAccept ? "checked" : "unchecked"} color={colors.warning} uncheckedColor={colors.bgLight} onPress={() => updateStatus({isAccept: !status.isAccept})} />
				<Content style={gstyle.labelWhite}>I understand that NeonWallet cannot recover this password for me. <Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Learn more</Content>.</Content>
			</Wrap>
			<Wrap style={grid.btnGroup}>
				<DefaultButton
					btnProps={{
						onPress: submit,
						disabled: !(status.isMatch && status.isAccept)
					}}
				>
					Create password
				</DefaultButton>
			</Wrap>
		</AuthLayout>
	);
}
