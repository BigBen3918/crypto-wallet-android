import React from "react"
import WalletConnect from '@walletconnect/client';
import { DefaultButton, Modal } from "../components/elements"
import { colors, grid, gstyle, h, w } from "../components/style"
import { Content, OpacityButton, Wrap } from "../components/commons"
import useStore from "../../useStore"


interface InputStatus {
	close:		Function
	navigation:	any
}

export default function ({close, navigation}: InputStatus) {
	const { currentNetwork, currentAccount,  connects, setting, networks, update} = useStore()

	const emitNetworkChanged = (chainKey: string) => {
		let chainId = 0;
		Object.values(networks).map(( network) => {
			if( network.chainKey === chainKey){
				chainId = network.chainId;
		}})
		connects && Object.values(connects).map(async (peerInfo: WalletConnectSession) => {
			let connector = new WalletConnect({
				uri: peerInfo.uri,
				bridge: peerInfo.bridge,
				session: peerInfo.session,
				clientMeta: {
					description: peerInfo.description,
					url: peerInfo.url,
					icons: [peerInfo.icon],
					name: peerInfo.name
				}
			})
			if (connector) {
				connector.approveSession({chainId: chainId, accounts: [currentAccount] })
			}
		})
	}
		
	return (
		<Modal close={close} title="Networks" width={80} footer={
			<Wrap style={grid.btnGroup}>
				<DefaultButton btnProps={{onPress: () => {navigation.navigate("Networks"); close(); }}}>ADD A NETWORK</DefaultButton>
			</Wrap>
		}>
			<Wrap style={grid.gridMargin4}>
				{Object.entries(networks).map(([index, network]) => {
					if(setting.showTestnet || !network.testnet){
						return <OpacityButton key={index} style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: h(2)}} onPress={() => {
							update({currentNetwork: network.chainKey}); emitNetworkChanged(network.chainKey); close()
						}}>
							<Wrap style={{width: w(2), height: w(2), backgroundColor: network.chainKey === currentNetwork ? colors.warning : colors.bgOpacity, marginRight: w(5)}} />
							<Content style={gstyle.labelWhite}>{network.label}</Content>
							<Wrap style={{width: w(2), height: w(2), backgroundColor: network.chainKey === currentNetwork ? colors.warning : colors.bgOpacity, marginLeft: w(5)}} />
						</OpacityButton>
					}
				})}
			</Wrap>
		</Modal>
	)
}