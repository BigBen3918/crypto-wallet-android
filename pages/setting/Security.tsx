import React from "react"
import { Switch } from "react-native-gesture-handler"
import { colors, grid, gstyle, h, w } from "../components/style"
import { Content, OpacityButton, Picture, Wrap } from "../components/commons"
import { DefaultButton, DropdownButton, Modal } from "../components/elements"
import Icon from "../components/Icon"
import WalletLayout from "../layouts/WalletLayout"
import AutoLock from "../layouts/modals/settings/AutoLock"
import ChangePassword from "../layouts/modals/settings/ChangePassword"
import useStore from "../../useStore"

interface SecurityStatus {
	changePassModal:		boolean
	showIncome:				boolean
	autoLockModal:			boolean
	showKeyModal:			boolean
	showClearDataModal: 	boolean
	showClearHistoryModal:	boolean
	showClearCookiesModal:	boolean
	privacyMode:			boolean
	participate:			boolean
	showDeleteMetaMetricsModal: boolean
	showDeleteWalletModal:		boolean
	getIncome:				boolean
}

export default function ({ navigation }: any) {

	const [status, setStatus] = React.useState<SecurityStatus>({
		changePassModal:		false,
		showIncome:				true,
		autoLockModal:			false,
		showKeyModal:			false,
		showClearDataModal:		false,
		showClearHistoryModal:	false,
		showClearCookiesModal:	false,
		privacyMode:			true,
		participate: 			true,
		showDeleteMetaMetricsModal: false,
		showDeleteWalletModal: false,
		getIncome: 				false
	})

		
	const {setting,  update} = useStore()
	const updateStatus = (params:Partial<SecurityStatus>) => setStatus({...status, ...params});

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
						<OpacityButton style={{marginRight: w(2)}} onPress={()=>navigation?.goBack()}>
							<Icon.ArrowLeft width={w(5)} height={w(5)} />
						</OpacityButton>
						<Content style={{...gstyle.title2}}>Security &amp; Privacy</Content>
					</Wrap>
				}
				hideHead
			>
				<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Protect your wallet</Content>
						<Wrap style={grid.gridMargin2}>
							<Picture source={require("../../assets/secure_wallet.jpg")} style={{height: h(30), width: w(90)}} />
						</Wrap>
						<Content style={gstyle.textLight}>Protect your wallet by saving your Secret Recovery Phrase in various places like on a piece of paper, password manager and/or the cloud.</Content>
						<Wrap style={grid.gridMargin2}>
							<DefaultButton width={90} theme="warning" btnProps={{ onPress: ()=>navigation.navigate("RevealPhrase")}}>REVEAL SECRET RECOVERY PHRASE</DefaultButton>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Password</Content>
						<Wrap style={grid.gridMargin2}>
							<DefaultButton btnProps={{onPress: () => updateStatus({changePassModal: true})}}>Change password</DefaultButton>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Show Incoming Transactions</Content>
						<Content style={gstyle.textLight}>Select this to use Etherscan to show incoming transactions in the transactions list</Content>
						<Wrap style={grid.rowCenter}>
							<Wrap><Switch  thumbColor={colors.warning} onValueChange={() => updateSetting("ShowIncomingTxs", !setting.ShowIncomingTxs)} value={setting.ShowIncomingTxs} /></Wrap>
							<Content  style={gstyle.labelWhite}>{setting.ShowIncomingTxs ? "ON": "OFF"}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Auto-lock</Content>
						<Content style={gstyle.textLight}>Choose the amount of time before the application automatically locks</Content>
						<Wrap>
							<DropdownButton dropdown={() => updateStatus({autoLockModal: true})}>{(Number(setting.autoLockTimer)|| "Never")}</DropdownButton>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr2} />
					<Wrap>
						<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Show private key for "{"account1"}"</Content>
						<Content style={gstyle.textLight}>This is the private key for the current selected account: {"account1"}. Never disclose this key. Anyone with your private key can fully control your account, including transferring away any of your funds.</Content>
						<Wrap style={grid.gridMargin2}>
							<DefaultButton theme="danger" btnProps={{onPress: () => navigation.navigate("ShowPrivateKey")}}>Show private key</DefaultButton>
						</Wrap>
					</Wrap>
				</Wrap>
			</WalletLayout>
			{status.changePassModal && (
				<ChangePassword close={() => updateStatus({changePassModal: false})} />
			)}
			{status.autoLockModal && (
				<AutoLock close={() => updateStatus({autoLockModal: false})} />
			)}
			{status.showKeyModal && (
				<Modal
					close={() => updateStatus({showKeyModal: false})}
					title={"Show "}
				>
					<Content style={gstyle.textLightCenter}>Really</Content>
					<Wrap style={grid.btnGroup}>
						<DefaultButton theme="init" btnProps={{onPress: ()=>updateStatus({showKeyModal: false})}}>Cancel</DefaultButton>
						<DefaultButton theme="danger">Clear Browser History</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{status.showClearDataModal && (
				<Modal
					close={() => updateStatus({showClearDataModal: false})}
					title={"Clear privacy data"}
				>
					<Content style={gstyle.textLightCenter}>Really</Content>
					<Wrap style={grid.btnGroup}>
						<DefaultButton theme="init" btnProps={{onPress: ()=>updateStatus({showClearDataModal: false})}}>Cancel</DefaultButton>
						<DefaultButton theme="danger">Clear</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{status.showClearHistoryModal && (
				<Modal
					close={() => updateStatus({showClearHistoryModal: false})}
					title={"Clear Browser History"}
				>
					<Content style={gstyle.textLightCenter}>Really</Content>
					<Wrap style={grid.btnGroup}>
						<DefaultButton theme="init" btnProps={{onPress: ()=>updateStatus({showClearHistoryModal: false})}}>Cancel</DefaultButton>
						<DefaultButton theme="danger">Clear</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{status.showClearCookiesModal && (
				<Modal
					close={() => updateStatus({showClearCookiesModal: false})}
					title={"Clear Browser Cookies"}
				>
					<Content style={gstyle.textLightCenter}>We are about to remove your browser's cookies. Are you sure?</Content>
					<Wrap style={grid.btnGroup}>
						<DefaultButton theme="init" btnProps={{onPress: ()=>updateStatus({showClearCookiesModal: false})}}>Cancel</DefaultButton>
						<DefaultButton theme="danger">Clear</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{status.showDeleteMetaMetricsModal && (
				<Modal
					close={() => updateStatus({showDeleteMetaMetricsModal: false})}
					title={"Delete MetaMetrics data?"}
				>
					<Content style={gstyle.textLightCenter}>We are about to remove all your MetaMetrics data. Are you sure?</Content>
					<Wrap style={grid.btnGroup}>
						<DefaultButton theme="init" btnProps={{onPress: ()=>updateStatus({showDeleteMetaMetricsModal: false})}}>Cancel</DefaultButton>
						<DefaultButton theme="danger">Clear</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{status.showDeleteWalletModal && (
				<Modal
					close={() => updateStatus({showDeleteWalletModal: false})}
					title={"Are you sure you want to erase your wallet?"}
				>
					<Content style={gstyle.textLightCenter}>Your current wallet, accounts and assets will be removed from this app permanently. This action cannot be undone.</Content>
					<Wrap style={grid.btnGroup}>
						<DefaultButton theme="init" btnProps={{onPress: ()=>updateStatus({showDeleteWalletModal: false})}}>Cancel</DefaultButton>
						<DefaultButton theme="danger">Clear</DefaultButton>
					</Wrap>
				</Modal>
			)}
		</>
	)
}