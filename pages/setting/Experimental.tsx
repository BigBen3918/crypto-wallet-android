import React from "react"
import { Switch } from "react-native-paper"
import { DefaultButton } from "../components/elements"
import { colors, grid, gstyle, h, w } from "../components/style"
import { Content, OpacityButton, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import WalletLayout from "../layouts/WalletLayout"
import useStore from "../../useStore"

export default function ({ navigation }: any) {

	const {setting, update} = useStore()

	const updateSetting = (key: SettingObjectKeyType, value: any) => {
		const sets: SettingObject = {
			currency:			key === 'currency' ? value : setting.currency,
			isFiat:				key === 'isFiat' ? value : setting.isFiat,		
			identicon:			key === "identicon" ? value : setting.identicon,
			hideToken:			key === 'hideToken' ? value : setting.hideToken,
			gasControls:		key === 'gasControls' ? value : setting.gasControls,
			showHexData:		key === 'showHexData' ? value : setting.showHexData,
			showFiatOnTestnet:	key === 'showFiatOnTestnet' ? value : setting.showFiatOnTestnet,
			showTestnet:		key === 'showTestnet' ? value : setting.showTestnet,
			showTxNonce:		key === 'showTxNonce' ? value : setting.showTxNonce,
			autoLockTimer:		key === 'autoLockTimer' ? value : setting.autoLockTimer,
			backup3Box:			key === 'backup3Box' ? value : setting.backup3Box,
			ipfsGateWay:		key === 'ipfsGateWay' ? value : setting.ipfsGateWay,
			ShowIncomingTxs:	key === 'ShowIncomingTxs' ? value : setting.ShowIncomingTxs,
			phishingDetection:	key === 'phishingDetection' ? value : setting.phishingDetection,
			joinMetaMetrics:	key === 'joinMetaMetrics' ? value : setting.joinMetaMetrics,
			unconnectedAccount: key === 'unconnectedAccount' ? value : setting.unconnectedAccount,
			tryOldWeb3Api:		key === 'tryOldWeb3Api' ? value : setting.tryOldWeb3Api,
			useTokenDetection:	key === 'useTokenDetection' ? value : setting.useTokenDetection,
			enhancedGasFeeUI:	key === 'enhancedGasFeeUI' ? value : setting.enhancedGasFeeUI,
		}
		update({setting: sets})
	}

	return (
		<WalletLayout
			navigation={navigation}
			menuKey="wallet"
			content={
				<Wrap style={gstyle.titleEff}>
					<OpacityButton style={{marginRight: w(2)}} onPress={()=>navigation?.goBack()}>
						<Icon.ArrowLeft width={w(5)} height={w(5)} />
					</OpacityButton>
					<Content style={{...gstyle.title2}}>Experimental</Content>
				</Wrap>
			}
			hideHead
		>
			<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
				<Wrap>
					<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Wallet Connect Sessions</Content>
					<Content style={gstyle.textLight}>View the list of active WalletConnect sessions</Content>
					<Wrap style={grid.gridMargin2}>
						<DefaultButton width={90} theme="warning" btnProps={{ onPress: ()=>navigation.navigate("ViewSessions")}}>View Sessions</DefaultButton>
					</Wrap>
				</Wrap>
				<Wrap style={gstyle.hr2} />
				<Wrap>
					<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Enable Enchanced Gas Fee UI</Content>
					<Content style={gstyle.textLight}>We’ve upgraded how gas estimation and customization works. Turn on if you’d like to use the new gas experience. <Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Learn more</Content></Content>
					<Wrap style={grid.rowCenter}>
						<Wrap><Switch thumbColor={colors.warning} onChange={() => updateSetting("enhancedGasFeeUI", !setting.enhancedGasFeeUI)} value={setting.enhancedGasFeeUI} /></Wrap>
						<Content  style={gstyle.labelWhite}>{setting.enhancedGasFeeUI ? "ON": "OFF"}</Content>
					</Wrap>
				</Wrap>
			</Wrap>
		</WalletLayout>
	)
}