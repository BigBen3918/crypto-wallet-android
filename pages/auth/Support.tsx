import React from "react"
import AuthLayout from "../layouts/AuthLayout";
import Icon from "../components/Icon";
import { Content, Picture, Wrap } from "../components/commons";
import { colors, grid, gstyle, h, w } from "../components/style";
import { DefaultButton, ImageInput } from "../components/elements";
import Logo from '../../assets/icicb_logo.png'

export default function ({ navigation }: any) {
	const goBack = () => { 
		navigation?.navigate('SecureWallet')
	}

	const submit = () => { 
		navigation?.navigate('SecureWallet')
	}

	return (
		<AuthLayout
			onBack={goBack}
			content={
				<>
					<Wrap style={{...grid.rowCenterCenter, marginBottom: h(-2)}}>
						<Picture source={Logo} style={{width:w(25), height:w(10)}}/>
					</Wrap>
				</>
			}
			title="ICICB Wallet Support"
			footer={(
				<Wrap style={{...grid.rowCenterBetween, marginTop: h(2)}}>
					<Wrap style={{...grid.rowCenterBetween, ...grid.gridMargin2}}>
						<Wrap style={{width: h(6), height: h(6), backgroundColor: colors.bgButton, marginRight: w(5)}}></Wrap>
						<Wrap style={{width: h(6), height: h(6), backgroundColor: colors.bgButton}}></Wrap>
					</Wrap>
					<DefaultButton btnProps={{onPress: submit}} width={40}><Content>Follow</Content></DefaultButton>
				</Wrap>
			)}
		>
			<Content style={gstyle.textLightCenter}>
				<Content style={gstyle.link}>ICICB WALLET</Content> / PRIVACY POLICY
			</Content>
			<ImageInput 
				icon={<Icon.Search color={colors.danger} />} 
				inputProps={{
					placeholder: "Search"
				}}
			/>
			<Wrap>
				<Content style={gstyle.textLightLgCenter}>Basic Safety and Security Tips for ICICB Wallet</Content>
				<Content style={gstyle.textLightSmCenter}>Updated 1 month ago</Content>
				<Content style={gstyle.textLightLg}>What is a Secret Recovery Phrase and how do I back it up</Content>
				<Content style={gstyle.textLight}>The use of a seed phrase, or Secret Recovery Phrase, is a standard most crypto wallets use. It's generated randomly when you create your...</Content>
				<Content style={gstyle.textLight}>The use of a seed phrase, or Secret Recovery Phrase, is a standard most crypto wallets use. It's generated randomly when you create your The use of a seed phrase, or Secret Recovery Phrase, is a standard most crypto wallets use. It's generated randomly when you create your The use of a seed phrase, or Secret Recovery Phrase, is a standard most crypto wallets use. It's generated randomly when you create your...</Content>
				<Content style={gstyle.textLight}>The use of a seed phrase, or Secret Recovery Phrase, is a standard most crypto wallets use. It's generated randomly when you create your The use of a seed phrase, or Secret Recovery Phrase, is a standard most crypto wallets use. It's generated randomly when you create your...</Content>
			</Wrap>
		</AuthLayout>
	);
}