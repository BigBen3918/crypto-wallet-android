import React from "react"
import { Switch } from "react-native-paper"
import { Content, Wrap } from "../components/commons"
import { colors, grid, gstyle } from "../components/style"
import { DefaultButton, DefaultInput } from "../components/elements"
import { importFromSeed as style } from "../components/StyledComponents"
import AuthLayout from "../layouts/AuthLayout"
import useStore, { hmac } from "../../useStore"
import { checkMnemonic } from "../../library/wallet"

interface ImportStatus {
	isRemember:	boolean
	password1:  string
	password2:  string
	phrase:		string
}

export default function ({ navigation }: any) {
	const {showToast} = useStore()
	const [status, setStatus] = React.useState<ImportStatus>({
		isRemember:	false,
		password1:	'',
		password2:	'',
		phrase:		''
	})
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});


	const goBack = () => {
		navigation?.goBack()
	}

	const submit = async () => { 
		if(status.phrase == null || status.phrase.trim() === "") return showToast("Invalid mnemonic")		
		const words = status.phrase.trim().split(" ");
		if(words.length % 12 !== 0)  return showToast("Invalid mnemonic")	

		if(status.password1 !== status.password2) {
			return showToast("Invalid confirm password")
		}
		if(status.password1.length < 8) return showToast("Invalid password (Min length:8)")		
		const passHash = await hmac(status.password1)
		if(!checkMnemonic(status.phrase))  return showToast( "Invalid Secret Recovery Phrase", "error");

		navigation?.navigate('SecureSuccess', {password:passHash, mnemonic: status.phrase.trim()})
	}

	const goTerms = () => { 
		navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})
	}

	return (
		<AuthLayout onBack={goBack}
			title="Import From seed"
			footer={(
				<>
					<Wrap style={gstyle.hr} />
					<Content style={gstyle.textLightCenter}>
						By proceeding, you agree to these <Content style={gstyle.link} onPress={() => {goTerms()}}>Terms &amp; Conditions</Content>
					</Content>
				</>
			)}
		>
			<DefaultInput
				label="Secret Recovery Phrase"
				inputProps={{
					secureTextEntry: false,
					placeholder: "Enter your secret Recovery Phase",
					onChangeText: (txt:string) => updateStatus({phrase: txt})
				}}
				visibleValue={false}
			/>
			<DefaultInput
				label="New password"
				inputProps={{
					textContentType: "password",
					secureTextEntry: true,
					placeholder: "New password",
					onChangeText: (txt:string) => updateStatus({password1: txt})
				}}
				visibleValue
			/>
			<DefaultInput
				label="Confirm password"
				inputProps={{
					textContentType: "password",
					secureTextEntry: true,
					placeholder: "Confirm password",
					onChangeText: (txt:string) => updateStatus({password2: txt})
				}}
				visibleValue
				warning={
					<Content style={gstyle.labelWhite}>Must be at least 8 characters</Content>
				}
			/>
			<Wrap style={style.rememberMe}>
				<Content style={gstyle.labelWhite}>Remember me</Content>
				<Wrap style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
					<Wrap><Switch thumbColor={colors.warning} onChange={() => updateStatus({ isRemember: !status.isRemember})} value={status.isRemember} /></Wrap>
					<Content style={gstyle.labelWhite}>{status.isRemember ? "ON": "OFF"}</Content>
				</Wrap>
			</Wrap>
			<Wrap style={grid.btnGroup}>
				<DefaultButton btnProps={{onPress: submit}}>Import</DefaultButton>
			</Wrap>
		</AuthLayout>
	);
}
