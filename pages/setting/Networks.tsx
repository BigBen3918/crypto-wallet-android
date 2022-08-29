import React from "react"
import WalletConnect from '@walletconnect/client';
import { Content, OpacityButton, Picture, Wrap } from "../components/commons"
import { DefaultButton, DefaultInput, Modal } from "../components/elements"
import Icon from "../components/Icon"
import Avatar from "../components/avatar"
import WalletLayout from "../layouts/WalletLayout"
import { colors, grid, gstyle, h, w } from "../components/style"
import {DEFAULT_IMPORT_NETWORKS} from '../../library/constants'
import useStore, { getChainIcon, hmac, initChainIcons } from "../../useStore"

interface NetworksStatus {
	tabKey:				string
	showDetailsModal:	boolean
	showAddModal:		boolean
	showDeleteModal:	boolean
	selectedIndex:		number
	selectPopularIndex:	number
	inputName:			string
	inputRpc:			string
	inputExplorer:		string
	inputChainId:		string
	inputSymbol:		string
	removeKey:			string
}

export default function ({ navigation }: any) {
	const [icons, setIcons] = React.useState<{[key:string]: string}>({});
	const [status, setStatus] = React.useState<NetworksStatus>({
		tabKey:				"popular",
		showDetailsModal:	false,
		showAddModal:		false,
		showDeleteModal:	false,
		selectedIndex:		0,
		inputName:			"",
		inputChainId:		"",
		inputExplorer:		"",
		inputRpc:			"",
		inputSymbol:		"",
		removeKey:			"",
		selectPopularIndex: 0
	})

	const {networks, update, currentNetwork, connects,currentAccount, setting, showToast} = useStore()
	const updateStatus = (params: Partial<NetworksStatus>) => setStatus({...status, ...params});

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

	const addPopularNetwork = (index: number) => {
		const chain = DEFAULT_IMPORT_NETWORKS[index];
		try{
			const chainKey = chain.chainKey;
			const newNetworks:NetworkObject[] = [];
			let flag = false;
			Object.values(networks).map(( v ) => {
				newNetworks.push(v)
				if(Number(v.chainId) === Number(status.inputChainId)) flag = true;
			})
			if(flag) return showToast("Already exists same chain", "warning");
			newNetworks.push({
				"chainKey": chainKey,
				"url": chain.url,
				"rpc": chain.rpc,
				"symbol": chain.symbol,
				"testnet": chain.testnet,
				"chainId" : Number(chain.chainId),
				"label": chain.label,
				imported: true
			})
			update({networks: newNetworks, currentNetwork: chainKey})
			emitNetworkChanged(chainKey)
			updateStatus({showDetailsModal: false, showAddModal: false, selectPopularIndex: 0})
			showToast("Added new network", "success")
		} catch (err) { 
			console.log(err)
			showToast("Could not found network information", "warning")
		}
	}

	const addNetwork = async () => {
		if(status.inputName.trim() === "") return showToast("Invalid network name", "danger");
		if(status.inputRpc.trim() === "" ) return showToast("Invalid rpc url", "danger");
		if(!parseInt(status.inputChainId)) return showToast("Invalid chainId", "danger");
		if(status.inputSymbol.trim() === "") return showToast("Invalid symbol", "danger");
		if(status.inputExplorer.trim() === "") return showToast("Invalid explorer", "danger");
		try{
			const chainKey = await hmac(status.inputChainId + status.inputName);
			const newNetworks:NetworkObject[] = [];
			let flag = false;
			Object.values(networks).map(( v ) => {
				newNetworks.push(v)
				if(Number(v.chainId) === Number(status.inputChainId)) flag = true;
			})
			if(flag) return showToast("Already exists same chain", "warning");
			newNetworks.push({
				"chainKey": chainKey,
				"url": status.inputExplorer,
				"rpc": status.inputRpc,
				"symbol": status.inputSymbol,
				"testnet": (status.inputName || '').indexOf('test') > -1 ? true: false,
				"chainId" : parseInt(status.inputChainId),
				"label": status.inputName,
				imported: true
			})
			update({networks: newNetworks, currentNetwork: chainKey})
			emitNetworkChanged(chainKey)
			updateStatus({inputName:"", inputRpc:"", inputSymbol:"", inputExplorer: "", inputChainId: "", showAddModal: false})
			showToast("Added new network", "success")
		} catch (err) { 
			console.log(err)
			showToast("Could not found network information", "warning")
		}
	}

	const remove = (chainKey: string) => {
		updateStatus({showDeleteModal: true, removeKey: chainKey})
	}

	const removeNetwork = () => {
		const newNetworks:NetworkObject[] = [];
		Object.values(networks).map(( v ) => {
			if(v.chainKey != status.removeKey) newNetworks.push(v);
		})
		const current = currentNetwork === status.removeKey ? networks[0].chainKey : currentNetwork
		update({networks: newNetworks, currentNetwork: current})
		emitNetworkChanged(current)
		updateStatus({showDeleteModal: false ,selectedIndex:0});
		return showToast("Removed a network", "success")
	}

	React.useEffect(() => {
		initChainIcons().then(()=>{
			const _icons = {} as {[key: string]: string}
			DEFAULT_IMPORT_NETWORKS.map((i:any, k:number) => {
				const icon = getChainIcon(i.chainId);
				if (icon) _icons[i.chainId] = icon;
			});
			setIcons(_icons)
		});
	}, [])

	return (
		<>
			<WalletLayout
				navigation={navigation}
				menuKey="wallet"
				content={
					<Wrap style={{...gstyle.titleEff, ...grid.rowCenterBetween}}>   
						<Wrap style={grid.rowCenter}>
							<OpacityButton style={{marginRight: w(2)}} onPress={()=>navigation?.goBack()}>
								<Icon.ArrowLeft width={w(5)} height={w(5)} color={colors.color}/>
							</OpacityButton>
							<Content style={{...gstyle.title2, color: colors.white}}>Networks</Content>
						</Wrap>
						<DefaultButton width={w(7)} height={5} hideMargin btnProps={{onPress: () => updateStatus({showAddModal: true})}}>Add</DefaultButton>
					</Wrap>
				}
				hideHead
			>
				<Wrap style={grid.colBetween}>
					<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
						<Wrap style={grid.gridMargin4}>
							{Object.entries(networks).map(([index, v]) => {
								return <OpacityButton key={index} style={{...grid.rowCenterBetween, marginBottom: h(3)}} onPress={() => {updateStatus({selectedIndex: Number(index || 0)})}}>
									<Wrap style={grid.rowCenter}>
										<Wrap style={{width: w(2.5), height: w(2.5), borderRadius: 50, marginRight: w(3)}} />
										<Content style={{...gstyle.labelWhite, color: v.chainKey === currentNetwork ? colors.warning : (v.testnet ? colors.color : "#eeeeee")}}>{v.label}</Content>
									</Wrap>
									{
										v.imported && <OpacityButton onPress={() => remove(v.chainKey)}><Content style={gstyle.textDanger}>Delete</Content></OpacityButton>
									}
								</OpacityButton>
							})}
						</Wrap>
						<DefaultInput 
							label={(
								<Content style={{...gstyle.textLight, paddingTop: h(1)}}>Network Name</Content>
							)}
							visibleValue={false}
							inputProps={{
								value: networks && networks?.[status.selectedIndex || 0]?.label  || "",
								placeholder: "Network Name (optional)"
							}}
						/>
						<DefaultInput 
							label={(
								<Content style={{...gstyle.textLight, paddingTop: h(1)}}>New RPC URL</Content>
							)}
							visibleValue={false}
							inputProps={{
								value: networks &&  networks?.[status.selectedIndex || 0]?.rpc || "",
								placeholder: "New RPC Network"
							}}
						/>
						<DefaultInput 
							label={(
								<Content style={{...gstyle.textLight, paddingTop: h(1)}}>Chain ID</Content>
							)}
							visibleValue={false}
							inputProps={{
								value: networks &&  networks?.[status.selectedIndex || 0]?.chainId.toString()  || "",
								placeholder: "Chain ID"
							}}
						/>
						<DefaultInput 
							label={(
								<Content style={{...gstyle.textLight, paddingTop: h(1)}}>Symbol</Content>
							)}
							visibleValue={false}
							inputProps={{
								value: networks?.[status.selectedIndex || 0]?.symbol  || "",
								placeholder: "Symbol (optional)"
							}}
						/>
						<DefaultInput 
							label={(
								<Content style={{...gstyle.textLight, paddingTop: h(1)}}>Block Explorer URL</Content>
							)}
							visibleValue={false}
							inputProps={{
								value: networks?.[status.selectedIndex || 0]?.url  || "",
								placeholder: "Block Explorer URL (optional)"
							}}
						/>
					</Wrap>
				</Wrap>
			</WalletLayout>
			{status.showAddModal && (
				<Modal
					close={() => updateStatus({showAddModal: false})}
					title={"Add Network"}
				>
					<Wrap style={{...grid.rowCenterAround, ...grid.gridMargin2}}>
						<OpacityButton style={{flex: 1, borderBottomWidth: h(0.1), borderColor: (status.tabKey === "popular" ? colors.color : colors.border)}} onPress={() => updateStatus({tabKey: "popular"})}>
							<Content style={gstyle.textLightCenter}>// Import</Content>
						</OpacityButton>
						<OpacityButton style={{flex: 1, borderBottomWidth: h(0.1), borderColor: (status.tabKey === "custom" ? colors.color : colors.border)}} onPress={() => updateStatus({tabKey: "custom"})}>
							<Content style={gstyle.textLightCenter}>// Customize</Content>
						</OpacityButton>
					</Wrap>
					{status.tabKey === "popular" && (
						<>
							{DEFAULT_IMPORT_NETWORKS.map((i:any, k:number) => {
								return Object.values(networks).find(network => (Number(network?.chainId) === Number(i.chainId))) ? <Wrap key={k}></Wrap> : <OpacityButton key={k} style={{...grid.rowCenterBetween, paddingTop: h(1), paddingBottom: h(1)}} onPress={() => updateStatus({showDetailsModal: true, selectPopularIndex: k})}>
									<Wrap style={grid.rowCenter}>
										<Wrap style={{marginRight: w(3)}}>
												{
													icons[i.chainId] ? <Picture source={{uri: icons[i.chainId]}} style={{width: w(7), height: w(7), borderRadius: w(7)}} /> : <Avatar size={7} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} address={i.chainKey} />
												}
										</Wrap>
										<Content style={{...gstyle.labelWhite, fontWeight: "700"}}>{i.label}</Content>
									</Wrap>
									<OpacityButton onPress={() => {addPopularNetwork(k)}}><Content style={gstyle.link}>Add</Content></OpacityButton>
								</OpacityButton>
							})}
						</>
					)}
					{status.tabKey === "custom" && (
						<>
							<DefaultInput 
								label={(
									<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Network Name</Content>
								)}
								visibleValue={false}
								inputProps={{
									placeholder: "Network Name (optional)",
									onChangeText: (txt:string) => updateStatus({inputName: txt}),
									value: status.inputName,
									style:{borderColor:colors.color, borderWidth: w(0.1)}
								}}
							/>
							<DefaultInput 
								label={(
									<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>New RPC URL</Content>
								)}
								visibleValue={false}
								inputProps={{
									onChangeText: (txt:string) => updateStatus({inputRpc: txt}),
									value: status.inputRpc,
									placeholder: "New RPC Network",
									style:{borderColor:colors.color, borderWidth: w(0.1)}
								}}
							/>
							<DefaultInput 
								label={(
									<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Chain ID</Content>
								)}
								visibleValue={false}
								inputProps={{
									onChangeText: (txt:string) => updateStatus({inputChainId: txt}),
									value: status.inputChainId,
									placeholder: "Chain ID",
									style:{borderColor:colors.color, borderWidth: w(0.1)}
								}}
							/>
							<DefaultInput 
								label={(
									<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Symbol</Content>
								)}
								visibleValue={false}
								inputProps={{
									onChangeText: (txt:string) => updateStatus({inputSymbol: txt}),
									value: status.inputSymbol,
									placeholder: "Symbol (optional)",
									style:{borderColor:colors.color, borderWidth: w(0.1)}
								}}
							/>
							<DefaultInput 
								label={(
									<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>Block Explorer URL</Content>
								)}
								visibleValue={false}
								inputProps={{
									onChangeText: (txt:string) => updateStatus({inputExplorer: txt}),
									value: status.inputExplorer,
									placeholder: "Block Explorer URL (optional)",
									style:{borderColor:colors.color, borderWidth: w(0.1)}
								}}
							/>
							<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
								<DefaultButton width={40} btnProps={{onPress: () => updateStatus({inputName:"", inputRpc:"", inputSymbol:"", inputExplorer: "", inputChainId: "", showAddModal: false})}}>Cancel</DefaultButton>
								<DefaultButton width={40} btnProps={{onPress: () => addNetwork()}} theme="warning">Add</DefaultButton>
							</Wrap>
						</>
					)}
				</Modal>
			)}
			{status.showDetailsModal && (
				<Modal
					title={"Want to add this network?"}
					close={() => updateStatus({showDetailsModal: false})}
				>
					<Content style={gstyle.linkCenter}>{DEFAULT_IMPORT_NETWORKS[status.selectPopularIndex].label}</Content>
					<Content style={gstyle.textLightCenter}>This allows this network to be used within ICICBWallet</Content>
					<Wrap style={grid.panel}>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.textLight}>Display name</Content>
							<Content style={{...gstyle.textLight, fontWeight: "700"}}>{DEFAULT_IMPORT_NETWORKS[status.selectPopularIndex].label}</Content>
						</Wrap>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.textLight}>Chain ID</Content>
							<Content style={{...gstyle.textLight, fontWeight: "700"}}>{DEFAULT_IMPORT_NETWORKS[status.selectPopularIndex].chainId}</Content>
						</Wrap>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.textLight}>Network URL</Content>
							<Content style={{...gstyle.textLight, fontWeight: "700"}}>{DEFAULT_IMPORT_NETWORKS[status.selectPopularIndex].rpc}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						<DefaultButton width={40} btnProps={{onPress: () => {updateStatus({showDetailsModal: false, selectPopularIndex: 0})}}}>Cancel</DefaultButton>
						<DefaultButton width={40} btnProps={{onPress: () => {addPopularNetwork(status.selectPopularIndex)}}} theme="danger">Approve</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{status.showDeleteModal && (
				<Modal
					close={() => updateStatus({showDeleteModal: false})}
					title={"Delete Network"}
				>
					<Wrap style={grid.gridMargin3}>
						<Content style={gstyle.textLight}>Are you sure you want to delete this network?</Content>
					</Wrap>
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						<DefaultButton width={40}  btnProps={{onPress: () => updateStatus({showDeleteModal: false, removeKey: ""})}}>Cancel</DefaultButton>
						<DefaultButton width={40} theme="danger" btnProps={{onPress: () => {removeNetwork()}}}>Delete</DefaultButton>
					</Wrap>
				</Modal>
			)}
		</>
	)
}