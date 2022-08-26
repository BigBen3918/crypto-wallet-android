import React from 'react';
import WalletConnect from "@walletconnect/client";
import { colors, grid, gstyle, h, w } from '../components/style';
import { BgImage, Content, OpacityButton, Picture, Wrap } from '../components/commons';
import Icon from '../components/Icon';
import Avatar from '../components/avatar';
import Barcode from '../components/captureqr'
import { DefaultButton, Modal } from '../components/elements';
import useStore, { ellipsis, roundNumber } from '../../useStore'
import { formatUnit } from '../../library/bigmath';

export default function ({navigation} : any) {
	const {currentAccount, connects,currentNetwork, connectHistory, accounts,  setting, networks, showToast, update} = useStore(); 
	const [status, setStatus] = React.useState({
		scanned :	false,
		data:		'',
		name:		"",
		description:"",
		url:		"",
		uri:		"",
		icon:		"",
		peerId:		"",
		bridge:		"",
		session:	null as any,
		connector:	null as WalletConnect | null
	});

	const updateStatus = (params : {[key : string] : string|number|boolean | any}) => setStatus({...status, ...params});
	
	const connect = async (code: any) => {
		const uri = code['data'] || '';
		const connector = new WalletConnect({uri:uri, bridge:'https://bridge.walletconnect.org'});
		if (!connector.connected) {
			await connector.createSession();
			updateStatus({data: uri})
			connector?.on("session_request", (error:any, payload) => {
				if (error) {
					throw error;
				}
				try{
					const { peerMeta } = payload.params[0];
					if(!peerMeta) return;
					const description = peerMeta['description'];
					const name = peerMeta['name'];
					const url = peerMeta['url'];
					const icon = peerMeta['icons'][0];
					updateStatus({name, url, icon, description, uri, peerId: connector.peerId, session: connector.session, bridge: connector.bridge, scanned: true, connector: connector})
				} catch(ex){
					throw ex;
				}
			});
		}
	}

	const close = () => {
		navigation?.goBack();
	}

	const approveRequest = () => {
		const data: WalletConnectSession = {
			name:	status.name,
			url:	status.url,
			icon:	status.icon,
			description: status.description,
			uri:	status.uri,
			peerId:	status.peerId,
			bridge: status.bridge,
			session: status.session
		}
		let chainId = 0;
		Object.values(networks).map(( network) => {
			if( network.chainKey === currentNetwork){
				chainId = network.chainId;
		}})
		status.connector?.approveSession({chainId: chainId, accounts: [currentAccount]})
		const cons = [...connects, data]
		let history = [] as WalletConnectHistory[];
		connectHistory.forEach(element => {
			if(element.url !== status.url) history.push(element)
		});
		history.push({
			...data, time: +new Date()
		})
		update({connects: cons, connectHistory: history})
		updateStatus({scanned: true})
		showToast("Connected to " + status.url, "success")
		navigation.navigate("WalletTokens")
	}
	
	const rejectRequest = () => {
		status.connector?.rejectSession()
		showToast("Rejected to " + status.url, "warning")
	}

	return (
		<>
			{
				!status.scanned && (
					<>
						<Barcode onScanned={(data:string)=>{connect(data)}} />
						<OpacityButton style={{marginTop: h(1.1), position: 'absolute', right:w(3), top: h(5)}} onPress={() => {close()}}>		
							<Wrap>
								<Icon.X width={w(10)} height={w(10)} color={colors.danger} />
							</Wrap>
						</OpacityButton>
					</>
				)
			}
            {status.scanned && (
				<BgImage source={require("../../assets/bg.png")} style={{ width: w(100), height: h(100), display:'flex', alignItems:'center', alignContent:'center', justifyContent:'center'}}>
                    <Wrap style={{width: w(90)}}>
						<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
							<Picture source={{uri: status.icon}} style={{width: w(10), height: w(10)}} />
						</Wrap>
						<Content style={gstyle.textLightCenter}>{status.url}</Content>
						<Wrap style={grid.rowCenterCenter}>
							<Wrap style={{width: w(1), height: w(1), backgroundColor: colors.warning, marginRight: w(2)}} />
							<Content style={gstyle.labelWhite}>
								{Object.values(networks).map((network) => {
									if( network.chainKey === currentNetwork){
										return network.label
									}}) 
								}
							</Content>
							<Wrap style={{width: w(1), height: w(1), backgroundColor: colors.warning, marginLeft: w(2)}} />
						</Wrap>
						<Content style={{...gstyle.textLightLgCenter, marginTop: h(2)}}>Connect to this site?</Content>
						<Content style={gstyle.textLightCenter}>By clicking connect, you allow this dapp to view your public address. This is an important security step to protect your data from potential phishing risks.</Content>
						<Wrap style={{...grid.rowCenter, paddingTop: h(1), paddingBottom: h(1), borderColor: colors.border, borderWidth: w(0.1), borderRadius: w(2), ...grid.gridMargin4}}>
							<Wrap style={{display: "flex", alignItems: "center", width: w(15)}}>
								<Avatar address={currentAccount} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} size={6}/>
							</Wrap>
							<Wrap style={{flex: 1}}>
								<Content style={gstyle.labelWhite}>
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return ellipsis(account.label, 15)
										}
									})}  :
									{
										ellipsis(currentAccount, 15)
									}
								</Content>
								<Content style={gstyle.labelWhite}>Balance: 
									{Object.values(accounts).map((account) => {
										if(account.address === currentAccount) {
											return roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)
									}})}  
									{
										networks && Object.values(networks).map((network) => {
											if( network.chainKey === currentNetwork){
												return " " + network.symbol
										}})
									}
								</Content>
							</Wrap>
						</Wrap>
						<Wrap style={grid.btnGroup}>
							<DefaultButton theme="danger" btnProps={{onPress: () => {rejectRequest(), close()}}}>Cancel</DefaultButton>
							<DefaultButton theme="warning" btnProps={{onPress: () => {approveRequest()}}}>Connect</DefaultButton>
						</Wrap>
					</Wrap>
                </BgImage>
            )}
		</>
	);
}
