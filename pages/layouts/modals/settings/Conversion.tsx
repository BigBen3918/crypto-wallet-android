import React from "react"
import Icon from "../../../components/Icon"
import { Modal } from "../../../components/elements"
import { grid, gstyle, w } from "../../../components/style"
import { Content, OpacityButton, Wrap } from "../../../components/commons"
import useStore from "../../../../useStore"

export const conversations = [
	{
		symbol: "1ST",
		name: "FirstBlood"
	},
	{
		symbol: "ADT",
		name: "adToken"
	},
	{
		symbol: "ADX",
		name: "AdEx"
	},
	{
		symbol: "AUD",
		name: "Australian Dollar"
	},
	{
		symbol: "BAT",
		name: "Basic Attention Token"
	},
	{
		symbol: "BNT",
		name: "Bancor"
	},
	{
		symbol: "BTC",
		name: "Bitcoin"
	},
	{
		symbol: "CAD",
		name: "Canadian Dollar"
	},
	{
		symbol: "CFI",
		name: "Cofound.it"
	},
	{
		symbol: "CRB",
		name: "CreditBit"
	},
	{
		symbol: "CVC",
		name: "Civic"
	},
	{
		symbol: "DAI",
		name: "DAI"
	},
	{
		symbol: "DASH",
		name: "Dash"
	},
	{
		symbol: "DGD",
		name: "DigixDAO"
	},
	{
		symbol: "ETC",
		name: "Ethereum Classic"
	},
	{
		symbol: "EUR",
		name: "Euro"
	}
]

export default function ({close}: {close: any}) {
	const {setting,  update} = useStore()
		
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
			title={"Base Currency"}
		>
			{conversations.map((i:any, k:number) => (
				<OpacityButton key={k} style={{...grid.rowCenterBetween, ...grid.gridMargin2}} onPress={() => {updateSetting("currency", i.symbol)}}>
					<Wrap style={grid.rowCenter}>
						<Content style={{...gstyle.labelWhite}}>{i.symbol}</Content>
						<Content style={gstyle.labelWhite}> - </Content>
						<Content style={gstyle.labelWhite}>{i.name}</Content>
					</Wrap>
					{i.symbol === setting.currency && (
						<Icon.Check width={w(5)} height={w(5)} />
					)}
				</OpacityButton>
			))}
		</Modal>
	)
}