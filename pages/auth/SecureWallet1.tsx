import React from "react"
import AuthLayout from "../layouts/AuthLayout";
import { grid, gstyle, h } from "../components/style";
import { DefaultButton, Stepper } from "../components/elements";
import { Content, Picture, Wrap } from "../components/commons";

export default function ({route, navigation }: any) {
	const {password} = route.params;

	const goBack = () => { 
		navigation?.goBack()
	}

	const submit = () => { 
		navigation?.navigate('SecureWallet2', {password: password})
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
					step={1} 
				/>
			}
			title="Secure your wallet"
		>
			<Wrap style={grid.gridMargin2}>
				<Picture source={require("../../assets/secure_wallet.jpg")} style={{height: h(30)}} />
			</Wrap>
			<Content style={gstyle.textLightCenter}>Don't risk losing your funds. Protect your wallet by saving your <Content style={gstyle.link}>Secret Recovery Phrase</Content> in a place you trust. It's the only way to recover your wallet if you get locked out of the app or get a new device.</Content>
			<Wrap style={{marginTop: h(5), marginBottom: h(5)}}>
				<Content style={{...gstyle.link, ...gstyle.textCenter}} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Remind me later</Content>
				<Content style={gstyle.textLightSmCenter}>(Not recommended)</Content>
			</Wrap>
			<Wrap>
				<Wrap style={grid.btnGroup}>
					<DefaultButton btnProps={{onPress: submit}}>Start</DefaultButton>
				</Wrap>
				<Content style={gstyle.textLightSmCenter}>Highly recommended</Content>
			</Wrap>
		</AuthLayout>
	);
}
