import React from "react"
import { Switch } from "react-native-paper"
import { DefaultButton, Modal } from "../components/elements"
import { Content, OpacityButton, Wrap } from "../components/commons"
import { colors, grid, gstyle, h, w } from "../components/style"
import IPFSGateway from "../layouts/modals/settings/IPFSGateway"
import WalletLayout from "../layouts/WalletLayout"
import Icon from "../components/Icon"
import useStore from "../../useStore"

interface AdvancedStatus {
	resetAccountModal:		boolean
	ipfsModal:				boolean
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<AdvancedStatus>({
		resetAccountModal:	false,
		ipfsModal:			false
	})

	const {setting, update} = useStore()
	const updateStatus = (params:Partial<AdvancedStatus>) => setStatus({...status, ...params});

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

	const resetAccount = () => {
		update({
			theme:				'',
			lang:				'en-US',
			browser:			false,
			apps:				{},		// connected app
			contacts:			[],
			recents:			[],
			transactions:		{},
			connects:		 	[],
			connectHistory:		[],
			setting:			{
				currency:		'USD',
				showTestnet:	true
			}})
			updateStatus({resetAccountModal: false})
	}

	return (
		<>
			<WalletLayout
				navigation={navigation}
				menuKey="wallet"
				content={
					<Wrap style={gstyle.titleEff}>
						<OpacityButton style={{marginRight: w(2)}} onPress={()=>navigation?.goBack()}>
							<Icon.ArrowLeft width={w(5)} height={w(5)} color={colors.color}/>
						</OpacityButton>
						<Content style={{...gstyle.title2, color: colors.white}}>Advanced</Content>
					</Wrap>
				}
				hideHead
			>
				<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>RESET ACCOUNT</Content>
						<Content style={gstyle.textLight}>Resetting your account will clear your transaction history. THis will not change the balances in your accounts or require you to re-enter your Secret Recovery Phrase.</Content>
						<Wrap style={grid.gridMargin2}>
							<DefaultButton theme="danger" btnProps={{onPress: () => updateStatus({resetAccountModal: true})}}>RESET ACCOUNT</DefaultButton>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Customize transaction nonce</Content>
						<Content style={gstyle.textLight}>Turn this on to change the nonce (transaction number) on confirmation screens. This is an advanced feature, use cautiously</Content>
						<Wrap style={grid.rowCenter}>
							<Wrap><Switch thumbColor={colors.color} onChange={() => updateSetting("showTxNonce", !setting.showTxNonce)} value={setting.showTxNonce} /></Wrap>
							<Content  style={gstyle.labelWhite}>{setting.showTxNonce ? "ON": "OFF"}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>SHOW HEX DATA</Content>
						<Content style={gstyle.textLight}>Select this to show the hex data field on the send screen</Content>
						<Wrap style={grid.rowCenter}>
							<Wrap>
								<Switch thumbColor={colors.color} onChange={() => updateSetting("showHexData", !setting.showHexData)} value={setting.showHexData} />
							</Wrap>
							<Content  style={gstyle.labelWhite}>{setting.showHexData ? "ON": "OFF"}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>SHOW TESTNET</Content>
						<Content style={gstyle.textLight}>Select this to show the test net on the network modal</Content>
						<Wrap style={grid.rowCenter}>
							<Wrap>
								<Switch thumbColor={colors.color} onChange={() => updateSetting("showTestnet", !setting.showTestnet)} value={setting.showTestnet} />
							</Wrap>
							<Content  style={gstyle.labelWhite}>{setting.showTestnet ? "ON": "OFF"}</Content>
						</Wrap>
					</Wrap>
				</Wrap>
			</WalletLayout>
			{status.resetAccountModal && (
				<Modal
					title={"Reset Account?"}
					close={() => updateStatus({resetAccountModal: false})}
				>
					<Content style={gstyle.textLightCenter}>Resetting your account will clear your transaction activity.</Content>
					<Wrap style={gstyle.hr2} />
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						<DefaultButton width={40} btnProps={{onPress: () => updateStatus({resetAccountModal: false})}}>Cancel</DefaultButton>
						<DefaultButton width={40} theme="warning" btnProps={{onPress: () => {resetAccount()}}}>Yes, reset</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{status.ipfsModal && (
				<IPFSGateway close={() => updateStatus({ipfsModal: false})} />
			)}
		</>
	)
}