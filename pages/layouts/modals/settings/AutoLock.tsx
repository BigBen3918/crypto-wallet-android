import React from "react"
import { Modal } from "../../../components/elements"
import { grid, gstyle, w } from "../../../components/style"
import { Content, OpacityButton} from "../../../components/commons"
import Icon from "../../../components/Icon"
import useStore from "../../../../useStore"

export const autoLocks = [
	{
		time: 5,
		name: "After 5 minutes"
	},
	{
		time: 10,
		name: "After 10 minutes"
	},
	{
		time: 0,
		name: "Never"
	}
]

export default function ({close}: {close: any}) {
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
		<Modal
			close={close}
			width={70}
			title={"Session AutoEnd Time"}
		>
			{autoLocks.map((i:any, k:number) => (
				<OpacityButton style={{...grid.rowCenterBetween, ...grid.gridMargin2}} key={k} onPress={() => {updateSetting("autoLockTimer", Number(i.time))}}>
					<Content style={gstyle.labelWhite}>{i.name}</Content>
					{Number(i.time) === setting.autoLockTimer && (
						<Icon.Check width={w(5)} height={w(5)} />
					)}
				</OpacityButton>
			))}
		</Modal>
	)
}