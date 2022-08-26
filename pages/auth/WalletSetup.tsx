import React from "react"
import { gstyle } from "../components/style"
import { Content,  Wrap } from "../components/commons"
import { DefaultButton } from "../components/elements"
import { walletSetup as style } from "../components/StyledComponents"
import AuthLayout from "../layouts/AuthLayout"
	
export default function ({ navigation }: any) {
	const goBack = () => { 
		navigation?.goBack()
	}

	const goImport = () => { 
		navigation?.navigate('HelpUs')
	}

	const goCreate = () => { 
		navigation?.navigate('CreatePass')
	}

	const goTerms = () => { 
		navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})
	}

	return (
		<AuthLayout onBack={goBack}
			title="Wallet Setup"
			footer={(
				<>
					<Wrap style={gstyle.hr} />
					<Content style={gstyle.textLightCenter}>
						By proceeding, you agree to these <Content style={gstyle.link} onPress={() => {goTerms()}}>Terms &amp; Conditions</Content>
					</Content>
				</>
			)}
		>
			<Wrap style={style.content}>
				<Content style={gstyle.textLightCenterUppercase}>Import an existing wallet or create a new one</Content>
				<DefaultButton btnProps={{onPress: goImport}} block>Import using secret recovery phase</DefaultButton>
				<DefaultButton theme="warning" btnProps={{onPress: goCreate}} block>Create a New Wallet</DefaultButton>
			</Wrap>
		</AuthLayout>
	);
}
