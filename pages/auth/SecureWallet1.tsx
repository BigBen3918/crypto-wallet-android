import React from "react"
import AuthLayout from "../layouts/AuthLayout";
import { grid, gstyle, h } from "../components/style";
import { DefaultButton, Loading, Stepper } from "../components/elements";
import { Content, OpacityButton, Picture, Wrap } from "../components/commons";
import { createMnemonic, getAddressFromMnemonic } from "../../library/wallet";
import useStore, { encrypt } from "../../useStore";
import { DEFAULT_NETWORKS } from "../../library/constants";

export default function ({route, navigation }: any) {
	const {password} = route.params;

	const [status, setStatus] = React.useState({
		loading: false
	})
	const {update,  showToast} =  useStore()
	
	const goBack = () => { 
		navigation?.goBack()
	}

	const submit = () => { 
		navigation?.navigate('SecureWallet2', {password: password})
	}
	const remindMe = () => {
		(async () => {
			let phrase =  createMnemonic();
			let flag = true;
			while(flag) {
				const arr =phrase.split(" ");
				const set = new Set(arr)
				if(set.size !== arr.length) {
					phrase = createMnemonic()
				} else {
					flag = false;
					break;
				}
			}
			const mnemonic = phrase;
			const wallet = await getAddressFromMnemonic(mnemonic, 0);
			const passHash = password;
			const initWallet = {
				"mnemonic": mnemonic,
				"keys": {
					[wallet.publickey] : wallet.privatekey
				}
			}
			const vault = await encrypt(JSON.stringify(initWallet), passHash) 
			if (vault===null) return showToast("crypto library is wrong", "warning")
	
			const accounts:AccountObject[] = [{
				"address": wallet.publickey,
				"imported": false,
				"index": 0,
				"label":"Account 1",
				"value":{},
				"tokens":{}
			}];
			update({vault: vault, accounts: {...accounts}, apps:{}, networks:[...DEFAULT_NETWORKS],   contacts:[], createdAccountLayer:1, currentAccount:wallet.publickey, currentNetwork:"rinkeby", connects: [], connectHistory: [], setting: {
					currency:			'USD',
					isFiat: 			true,
					identicon:			"jazzicons",
					hideToken:			false,
					gasControls:		false,
					showHexData:		false,
					showFiatOnTestnet:	false,
					showTestnet:		true,
					showTxNonce:		false,
					autoLockTimer:		5,
					backup3Box:			false,
					ipfsGateWay:		'',
					ShowIncomingTxs:	false,
					phishingDetection:	false,
					joinMetaMetrics:	false,
					unconnectedAccount:	false,
					tryOldWeb3Api:		false,
					useTokenDetection:	false,
					enhancedGasFeeUI:	false
				}, 
				tokens: {},
				nfts:   {},
				recents: [],
				browser: false,
				password: passHash
			})
			setStatus({loading: false})
			navigation?.navigate('WalletTokens')
		})()
	}

	return (
		<>
			<AuthLayout
				onBack={goBack}
				content={
					<Stepper
						data={[
							{label: "Create Password"}, 
							{label: "Secure Wallet"},
							{label: "Confirm Secure Recovery Phrase"}
						]} 
						step={1} 
					/>
				}
				title="Secure your wallet"
			>
				<Wrap style={grid.gridMargin2}>
					<Picture source={require("../../assets/secure_wallet.jpg")} style={{height: h(30)}} />
				</Wrap>
				<Content style={gstyle.textLightCenter}>Don't risk losing your funds. Protect your wallet by saving your <Content style={gstyle.link}>Secret Recovery Phrase</Content> in a place you trust. It's the only way to recover your wallet if you get locked out of the app or get a new device.</Content>
				<Wrap style={{marginTop: h(5), marginBottom: h(5)}}>
					<OpacityButton onPress={() => {setStatus({loading: true}); remindMe()}}><Content style={{...gstyle.link, ...gstyle.textCenter}}>Remind me later</Content></OpacityButton>
					<Content style={gstyle.textLightSmCenter}>(Not recommended)</Content>
				</Wrap>
				<Wrap>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: submit}}>Start</DefaultButton>
					</Wrap>
					<Content style={gstyle.textLightSmCenter}>Highly recommended</Content>
				</Wrap>
			</AuthLayout>
			{
				status.loading ? <Loading /> : <></>
			}
		</>
	);
}
