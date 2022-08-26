import React from "react"
import { Switch } from "react-native-paper"
import { Content, OpacityButton, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import { colors, grid, gstyle, h, w } from "../components/style"
import Conversion from "../layouts/modals/settings/Conversion"
import SearchEngine from "../layouts/modals/settings/SearchEngine"
import Language from "../layouts/modals/settings/Language"
import WalletLayout from "../layouts/WalletLayout"
import Avartar from '../components/avatar'
import useStore from '../../useStore'

interface GeneralStatus {
	conversionModal:	boolean
	langModal:			boolean
	engineModal:		boolean
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<GeneralStatus>({
		conversionModal:	false,
		langModal:			false,
		engineModal:		false
	})

	const {setting, update} = useStore()
	const updateStatus = (params:Partial<GeneralStatus>) => setStatus({...status, ...params});

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
		<>
			<WalletLayout
				navigation={navigation}
				menuKey="wallet"
				content={
					<Wrap style={gstyle.titleEff}>
						<OpacityButton style={{marginRight: w(7)}} onPress={()=>navigation?.goBack()}>
							<Icon.ArrowLeft width={w(5)} height={w(5)} />
						</OpacityButton>
						<Content style={{...gstyle.title2}}>General</Content>
					</Wrap>
				}
				hideHead
			>
				<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Hide Tokens Without Balance</Content>
						<Content style={gstyle.textLight}>Prevents tokens with no balance from displaying in your token listing.</Content>
						<Wrap style={grid.rowCenter}>
							<Switch thumbColor={colors.warning} onChange={() => updateSetting("hideToken", !setting.hideToken)} value={setting.hideToken} />
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Account Identicon</Content>
						<Content style={gstyle.textLight}>Jazzicons and Blockies are two different styles of unique icons that help you identify an account at a glance.</Content>
						<Wrap style={grid.rowCenter}>
							<OpacityButton style={{...grid.rowCenter, flex: 1}} onPress={() => {updateSetting("identicon", "jazzicons")}}>
								<Wrap style={{marginRight: w(3), borderRadius: w(10), borderWidth: w(0.5), borderColor: setting.identicon === "jazzicons"? colors.warning:"transparent"}}>
									<Avartar address="0xf0AB1A62b3Ca931619D3108159f0c4010873702B" type={"Zazzicon"} size={10} />
								</Wrap>
								<Content style={gstyle.labelWhite}>Zazzicon</Content>
							</OpacityButton>
							<OpacityButton style={{...grid.rowCenter, flex: 1}} onPress={() => {updateSetting("identicon", "blokies")}}>
								<Wrap style={{marginRight: w(3), borderRadius: w(10), borderWidth: w(0.5), borderColor: setting.identicon === "blokies"? colors.warning:"transparent"}}>
									<Avartar address="0xf0AB1A62b3Ca931619D3108159f0c4010873702B" type={"Blockies"} size={10} />
								</Wrap>
								<Content style={gstyle.labelWhite}>Blockies</Content>
							</OpacityButton>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
				</Wrap>
			</WalletLayout>
			{status.conversionModal && (
				<Conversion close={() => updateStatus({conversionModal: false})} />
			)}
			{status.langModal && (
				<Language close={() => updateStatus({langModal: false})} />
			)}
			{status.engineModal && (
				<SearchEngine close={() => updateStatus({engineModal: false})} />
			)}
		</>
	)
}