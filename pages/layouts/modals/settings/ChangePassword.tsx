import React from "react"
import { grid, gstyle, h } from "../../../components/style"
import { Content, Wrap } from "../../../components/commons"
import { DefaultButton, DefaultInput, Modal } from "../../../components/elements"
import useStore, { decrypt, encrypt, hmac } from "../../../../useStore"

interface ChangePassStatus {
	yourpass:			string
	newpass:			string
	confirmpass:		string
	strength:			string
	isRemember:			boolean
	isAccept:			boolean
}

export default function ({close}: any) {
	const [status, setStatus] = React.useState<ChangePassStatus>({
		yourpass:			"",
		newpass:			"",
		confirmpass:		"",
		strength:			"Weak",
		isRemember:			false,
		isAccept:			false
	})
	const updateStatus = (params:Partial<ChangePassStatus>) => setStatus({...status, ...params});

	const {vault,  update, showToast} = useStore()
	
	const changeNewPass = (txt:string) => {
		let strength = "Weak"
		let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
		let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
		if(strongPassword.test(txt)) {
			strength = "Strong"
		} else if(mediumPassword.test(txt)) {
			strength = "Medium"
		}
		updateStatus({newpass: txt, strength: strength})
	}


	const change = async () => {
		if(status.yourpass.length < 8) return showToast("Invalid password", "warning")
		try {
			const passHash = await hmac(status.yourpass);
			const newpass = await hmac(status.newpass);
			const plain = await decrypt(vault, passHash);
			if (plain===null || plain==='') return showToast("Incorrect new password", "warning")
			const wallet = JSON.parse(plain)
			if(status.newpass.length < 8)   return showToast("Invalid new password", "warning")
			if(status.newpass !== status.confirmpass)   return showToast("Invalid confirm password", "warning")
			const p = await hmac(status.newpass)
			const v = await encrypt(JSON.stringify(wallet), p) 
			if (v===null) return showToast("Crypto library is wrong", "warning")
			update({vault: v, password: newpass})
			close()
			showToast("Changed password", "success")
		} catch(error ) {
			showToast("Incorrect password", "warning")
		}
	}

	return (
		<Modal close={close} title={"Change Password"}>
			<Content style={{...gstyle.textCenter, ...gstyle.labelWhite, paddingTop: h(1)}}>This password will unlock your ICICB Wallet only on this device.</Content>
			<DefaultInput
				visibleValue={true}
				label={"Your password"}
				inputProps={{
					placeholder: "Your password",
					onChangeText: (txt:string) => updateStatus({yourpass: txt}),
					value: status.yourpass
				}}
			/>
			<DefaultInput
				visibleValue={true}
				label={"New password"}
				inputProps={{
					placeholder: "New password",
					onChangeText: (tx:string) => changeNewPass(tx),
					value: status.newpass
				}}
				warning={(
					<Content style={gstyle.labelWhite}>Password Strength: <Content style={gstyle.textDanger}>{status.strength}</Content></Content>
				)}
			/>
			<DefaultInput
				visibleValue={true}
				label={"Confirm password"}
				inputProps={{
					placeholder: "Confirm password",
					onChangeText: (tx:string) => updateStatus({confirmpass: tx}),
					value: status.confirmpass
				}}
				warning={(
					<Content style={gstyle.labelWhite}>Must be at least 8 characters</Content>
				)}
			/>
			{
				<Wrap style={grid.btnGroup}>
					<DefaultButton btnProps={{onPress: () => {change()}}}>Change password</DefaultButton>
				</Wrap>
			}
		</Modal>
	)
}