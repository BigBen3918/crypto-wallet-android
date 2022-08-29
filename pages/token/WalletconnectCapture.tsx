import React from 'react';
import WalletConnect from "@walletconnect/client";
import qs from 'qs';
import { colors, grid, gstyle, h, w } from '../components/style';
import { BgImage, Content, OpacityButton, Picture, Wrap } from '../components/commons';
import Icon from '../components/Icon';
import Avatar from '../components/avatar';
import Barcode from '../components/captureqr'
import { DefaultButton, Modal } from '../components/elements';
import useStore, { ellipsis, roundNumber } from '../../useStore'
import { formatUnit, parseUnit } from '../../library/bigmath';
import { BigNumber, ethers } from 'ethers';

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
	
	const parseTransaction = (uri: string) => {
		let prefix;
		let address_regex = '(0x[\\w]{40})';
		if (uri.substring(9, 11).toLowerCase() === '0x') {
			prefix = null;
		} else {
			let cutOff = uri.indexOf('-', 9);
			if (cutOff === -1) {
				return showToast('Missing prefix');
			}
			prefix = uri.substring(9, cutOff);
			const rest = uri.substring(cutOff + 1);
			// Adapting the regex if ENS name detected
			if(rest.substring(0,2).toLowerCase() !== '0x'){
				address_regex = '([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,})';
			}
		}
		const full_regex = '^ethereum:(' + prefix + '-)?'+address_regex + '\\@?([\\w]*)*\\/?([\\w]*)*';
		const exp = new RegExp(full_regex);
		const data = uri.match(exp);
		if(!data) {
			return showToast('Couldn not parse the url');
		}
		let parameters = uri.split('?') as any;
		parameters = parameters.length > 1 ? parameters[1] : '';
		const params = qs.parse(parameters);
		const obj = {
			scheme: 'ethereum',
			target_address: data[2],
		} as any;

		if(prefix){
			obj.prefix = prefix;
		}

		if(data[3]){
			obj.chain_id = data[3];
		}

		if(data[4]){
			obj.function_name = data[4];
		}
		
		if(Object.keys(params).length){
			obj.parameters = params;
			const amountKey = obj.function_name === 'transfer' ? 'uint256' : 'value';
			if(obj.parameters[amountKey]) {
				obj.parameters[amountKey] = BigNumber.from(roundNumber(formatUnit(parseUnit(obj.parameters[amountKey], 18), 18) || "0")).toString();
				if (!isFinite(obj.parameters[amountKey])) return showToast('Invalid amount')
				if (obj.parameters[amountKey] < 0) return showToast('Invalid amount')
			}
		}
		return obj;
	}

	const connect = async (code: any) => {
		try {
			const uri = code?.['data'] || '';
			if(uri.startsWith("ethereum")){
				const data = parseTransaction(uri);
				if(data){
					navigation.navigate("ContractTransaction", {params: data})	
				}
			}
			else {
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
		} catch(error) {
			navigation.navigate("WalletTokens")
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
						<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
							<DefaultButton width={40} theme="danger" btnProps={{onPress: () => {rejectRequest(), close()}}}>Cancel</DefaultButton>
							<DefaultButton width={40} theme="warning" btnProps={{onPress: () => {approveRequest()}}}>Connect</DefaultButton>
						</Wrap>
					</Wrap>
                </BgImage>
            )}
		</>
	);
}
