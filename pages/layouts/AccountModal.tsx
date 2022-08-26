import React from "react"
import WalletConnect from '@walletconnect/client';
import Icon from "../components/Icon"
import Avatar from "../components/avatar"
import {  grid, gstyle, h, w } from "../components/style"
import { Content, OpacityButton, Wrap } from "../components/commons"
import { DefaultButton, DefaultInput, Loading, Modal } from "../components/elements"
import { formatUnit } from "../../library/bigmath"
import { getAddressFromMnemonic } from "../../library/wallet"
import useStore, { decrypt, encrypt, hmac, roundNumber } from "../../useStore"

interface AccountModalStatus {
	password:				string
	showConfirmPassModal:	boolean
	loading:				boolean
}

export default function ({close, navigation}: any) {
	const [status, setStatus] = React.useState<AccountModalStatus>({
		password:				"",
		showConfirmPassModal:	false,
		loading:				false
	})
	
	const {currentAccount, accounts, networks, connects, vault,  setting, createdAccountLayer, currentNetwork, update, showToast} = useStore()

	const updateStatus = (params:Partial<AccountModalStatus>) => setStatus({...status, ...params});

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

	const createAccount = async () => {
		if(status.password.length < 8) return showToast("Invalid password", "warning")
		updateStatus({showConfirmPassModal: false, loading: true})
		var label = "Account "+ ((accounts.length + 1) || (Object.values(accounts).length +1));
		try {
			const passHash = await hmac(status.password);
			const plain = await decrypt(vault, passHash);
			if (plain===null || plain==='')  {updateStatus({loading: false}); return showToast("Incorrect password", "warning") }
			const wallet:WalletObject = JSON.parse(plain)
			const mnemonic = wallet.mnemonic;
			var layer = createdAccountLayer + 1;
			var newAccount = await getAddressFromMnemonic(mnemonic, layer);
			var flag= false;
			var accs:AccountObject[] = [];
			Object.values(accounts).map(( account ) => {
				accs.push(account)
				if(account.address === newAccount.publickey) {
					flag = true;
					return;
				}
			})
			if(flag) update({createdAccountLayer: layer + 1})
			else {
				const info:AccountObject = 
				{
					"address": newAccount.publickey,
					"imported": false,
					"index": 0,
					"label":label,
					"value":{},
					"tokens":{}
				}
				accs.push(info)
				let keys = wallet.keys;
				keys[newAccount.publickey] = newAccount.privatekey;
				const walletInfo = {
					"mnemonic": wallet.mnemonic,
					"keys": keys
				}
				const w = await encrypt(JSON.stringify(walletInfo), passHash) 
				if (w===null) {updateStatus({loading: false});  return showToast("Crypto library is wrong", "warning")}
				update({currentAccount: newAccount.publickey, accounts:accs, createdAccountLayer: layer + 1, vault: w})
				emitAccountChanged(newAccount.publickey)
				updateStatus({loading: false})
				close()
			}
		} catch(error) {
			updateStatus({loading: false}); 
			return showToast("Incorrect password", "warning") 
		}
	}

	return (
		<>
			<Modal 
				close={close} 
				title={"Accounts"}
				footer={(
					<>
						<Wrap style={grid.btnGroup}>
							<DefaultButton btnProps={{onPress: () => updateStatus({showConfirmPassModal: true, password:""})}}>Create new account</DefaultButton>
						</Wrap>
						<Wrap style={grid.btnGroup}>
							<DefaultButton btnProps={{onPress: () => {navigation?.navigate("ImportAccount"); close()}}}>Import an account</DefaultButton>
						</Wrap>
					</>
				)}
			>
				<Wrap>
					<Wrap style={{marginBottom: h(5)}}>
						{Object.entries(accounts).map(([index, account]) => (
							<React.Fragment key={index}>
								<OpacityButton style={{...grid.rowCenterBetween}} onPress={() => {update({currentAccount: account.address}); emitAccountChanged(account.address); close()}}>
									<Wrap style={grid.rowCenter}>
										<Wrap style={{marginRight: w(2)}}>
											<Avatar type={setting.identicon === "jazzicons" ? "Zazzicon":"Blockies"} size={10} address={account.address} />
										</Wrap>
										<Wrap>
											<Content style={gstyle.labelWhite}>{account.label}</Content>
											<Content style={gstyle.labelSm}>{roundNumber(formatUnit(account.value[currentNetwork]  || "0", 18), 8)}</Content>
										</Wrap>
									</Wrap>
									{account.imported && <Content style={gstyle.labelSm}>Imported</Content>}
									{account.address === currentAccount && (
										<Icon.Check width={w(5)} height={w(5)} />
									)}
								</OpacityButton>
								<Wrap style={gstyle.hr} />
							</React.Fragment>
						))}
					</Wrap>
				</Wrap>
			</Modal>
			{status.showConfirmPassModal && (
				<Modal
					close={() => updateStatus({showConfirmPassModal: false})}
					width={90}
					title={"Create Account"}
				>
					<DefaultInput
						label={"Enter wallet password"}
						inputProps={{
							placeholder: "Wallet password",
							onChangeText: (txt:string) => updateStatus({password: txt}),
							value: status.password
						}}
						visibleValue={true}
					/>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: () => {createAccount()}}}>Confirm</DefaultButton>
					</Wrap>
				</Modal>
			)}
			{
				status.loading ? <Loading /> : <></>
			}
		</>
	)
}