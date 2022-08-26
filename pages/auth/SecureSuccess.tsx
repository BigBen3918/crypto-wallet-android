import React from "react"
import { Content,Wrap } from "../components/commons"
import { grid, gstyle } from "../components/style"
import { DefaultButton, Loading, Stepper } from "../components/elements"
import AuthLayout from "../layouts/AuthLayout"
import {DEFAULT_NETWORKS} from '../../library/constants'
import {getAddressFromMnemonic} from '../../library/wallet'
import useStore, { encrypt } from "../../useStore"

export default function ({ route, navigation }: any) {
	const [status, setStatus] = React.useState({
		loading: true
	})
	const {update,  showToast} =  useStore()

	const goBack = () => { 
		navigation?.goBack()
	}

	const submit = () => { 
		navigation?.navigate('WalletTokens')
	}

	const init = async () => {
		const {password, mnemonic} = route.params;
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
		update({vault: vault, accounts: {...accounts}, apps:{}, networks:[...DEFAULT_NETWORKS],   contacts:[], createdAccountLayer:1, currentAccount:wallet.publickey, currentNetwork:"neon", connects: [], connectHistory: [], setting: {
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
	}

	React.useEffect(() => {
		init()
	}, [])



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
						step={3} 
					/>
				}
				title="Congratulations!"
			>
				<Wrap style={grid.gridMargin2}>
					<Content style={gstyle.textLightCenter}>You’ve successfully protected your wallet. Remember to keep your Secret Recovery Phrase safe, it’s your responsibility!</Content>
				</Wrap>
				<Wrap style={grid.gridMargin2}>
					<Content style={gstyle.linkCenter}>Leave yourself a hint?</Content>
				</Wrap>
				<Wrap style={grid.gridMargin2}>
					<Content style={gstyle.textLightCenter}>ICICB Wallet cannot recover your wallet should loseit. You can find your Secret Recovery Phrase inSettings {'>'} Secuity &amp; Privacy</Content>
				</Wrap>
				<Wrap style={grid.gridMargin2}>
				<Content style={{...gstyle.link, ...gstyle.textCenter}} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.icicbwallet.io/guide/"})}}>Learn more</Content>
				</Wrap>
				<Wrap style={grid.btnGroup}>
					<DefaultButton btnProps={{onPress: submit}}><Content>Done</Content></DefaultButton>
				</Wrap>
			</AuthLayout>
			
			{
				status.loading ? <Loading /> : <></>
			}
	   </>
	);
}
