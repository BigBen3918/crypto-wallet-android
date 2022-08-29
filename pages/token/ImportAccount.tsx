import React from "react"
import WalletConnect from '@walletconnect/client';
import { Content,  Wrap } from "../components/commons"
import { grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput } from "../components/elements"
import FunctionLayout from "../layouts/FunctionLayout"
import useStore, { decrypt, encrypt, hmac } from "../../useStore"
import { addHexPrefix, getAddressFromPrivateKey } from "../../library/wallet"


interface ImportAccountObject {
	password:	string
	privKey:	string
	loading:	boolean
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<ImportAccountObject>({
		password:   "",
		privKey:	"",
		loading:	false
	})
	const { accounts, vault, networks, currentNetwork, connects, update, showToast} = useStore()

	const updateStatus = (params:Partial<ImportAccountObject>) => setStatus({...status, ...params});

	const goBack = () => { 
		navigation?.navigate('WalletTokens')
	}

	const emitAccountChanged = (account: string) => {
		let chainId = 0;
		Object.values(networks).map(( network) => {
			if( network.chainKey === currentNetwork){
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
				connector.approveSession({chainId: chainId, accounts: [account] })
			}
		})
	}

	const importAccount = async () => {
		if(status.password === "") return showToast("Please enter wallet password", "warning");
		updateStatus({loading: true})
		const passHash = await hmac(status.password);
		const label = "Account " + ((accounts.length + 1) || "new ");
		try {
			let privKey = status.privKey.trim();
			if(privKey.startsWith("0x")) privKey = privKey.slice(2)
			const prefixed = addHexPrefix(privKey);
			const pubkey = await getAddressFromPrivateKey(prefixed);
			const plain = await decrypt(vault, passHash);
			if (plain===null || plain==='') {updateStatus({loading: false}); return showToast("Incorrect wallet password", "warning")}
			const wallet:WalletObject = JSON.parse(plain)
			var accs:AccountObject[] = [];
			let exists = false;
			Object.values(accounts).map((account) => {
				accs.push(account)
				if(account.address == pubkey) exists = true;
			})
			if(exists) {updateStatus({loading: false});  return showToast("Already exists same account", "info");}
			const info:AccountObject =  {
				"address": pubkey,
				"index":  0,
				"imported": true,
				"label":  label,
				"value":  {},
				"tokens": {}
			}
			let flag = false;
			accs.map((account, index) => {
				if(account.address === pubkey) flag = true;
			})
			if(!flag) {
				accs.push(info)
			}
			let keys = wallet.keys;
			keys[pubkey] = status.privKey;
			const walletInfo = {
				"mnemonic": wallet.mnemonic,
				"keys": keys
			}
			const w = await encrypt(JSON.stringify(walletInfo), passHash) 
			if (w===null) {updateStatus({loading: false});  return showToast("Crypto library is wrong", "warning")}
			update({currentAccount: pubkey, accounts:accs, vault: w})
			emitAccountChanged(pubkey)
			goBack()
		} catch (error) {
			updateStatus({loading: false}); 
			return showToast("Invalid privatekey", "error")
		}
	}

	return (
		<>
			<FunctionLayout
				navigation={navigation}
				title="Import Account"
				onBack={goBack}
			>
				<Wrap style={{alignSelf: "center",width: w(90), paddingTop: h(3), paddingBottom: h(3)}}>
					<Content style={gstyle.textLight}>Imported accounts are viewable in your wallet but are not recoverable with your ICICBWallet Secret Recovery Phrase.</Content>
					<Content style={gstyle.textLight}><Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.icicbwallet.io/guide/"})}}>Learn more</Content> about imported accounts here.</Content>
					<DefaultInput
						label="Paste your private key string"
						visibleValue={false}
						inputProps={{
							placeholder: "e.g.\n3a1076bf45ab97712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266",
							multiline: true,
							style: {height: h(15)},
							onChangeText: (txt:string) => updateStatus({privKey: txt}),
							value: status.privKey
						}}
					/>
					
					<DefaultInput
						label={"Enter wallet password"}
						inputProps={{
							placeholder: "Wallet password",
							onChangeText: (txt:string) => updateStatus({password: txt}),
							value: status.password
						}}
						visibleValue={true}
					/>
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						<DefaultButton width={40} btnProps={{onPress: goBack}}>Cancel</DefaultButton>
						<DefaultButton width={40} theme="warning" btnProps={{onPress: ()=>{importAccount()}}}>Import</DefaultButton>
					</Wrap>
				</Wrap>
			</FunctionLayout>
		</>
	)
}