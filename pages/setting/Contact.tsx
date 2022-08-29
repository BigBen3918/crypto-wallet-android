import React from "react"
import {ethers} from 'ethers'
import { Content, OpacityButton, Wrap } from "../components/commons"
import { DefaultButton, DefaultInput, Modal } from "../components/elements"
import { colors, grid, gstyle, h, w } from "../components/style"
import Icon from "../components/Icon"
import Avartar from '../components/avatar'
import WalletLayout from "../layouts/WalletLayout"
import useStore, { copyToClipboard, ellipsis } from '../../useStore'

interface ContactStatus {
	addModal:	boolean
	label:	 	string
	address:	string
	memo:	  	string
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<ContactStatus>({
		addModal:	false,
		label:		"",
		address:	"",
		memo:		""
	})

	const updateStatus = (params:Partial<ContactStatus>) => setStatus({...status, ...params});

	const {contacts, setting, showToast, update} = useStore()

	const addContact = () => {
		if(status.label.trim() === "") return showToast("Invalid name", "danger");
		if(!ethers.utils.isAddress(status.address)) return showToast("Invalid address", "danger");
		let flag = false;
		contacts.map((i:ContactObject, k:number) => {
			if(i.address===status.address || i.label === status.label) flag = true;
		})
		if(flag) return showToast("Already exists same account", "warning");
		let cts = [...contacts, {
			label:				status.label,
			address:			status.address,
			memo:				status.memo
		}];
		update({contacts: cts})
		updateStatus({addModal: false, label:"", address:"", memo: ""})
		showToast("Added new contact address", "success")
	}

	return (
		<>
			<WalletLayout
				navigation={navigation}
				menuKey="wallet"
				content={
					<Wrap style={gstyle.titleEff}>
						<OpacityButton style={{marginRight: w(2)}} onPress={()=>navigation?.goBack()}>
							<Icon.ArrowLeft width={w(5)} height={w(5)} color={colors.color}/>
						</OpacityButton>
						<Content style={{...gstyle.title2, color: colors.white}}>Contacts</Content>
					</Wrap>
				}
				footer={(
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: () => updateStatus({addModal: true})}}>Add Contact</DefaultButton>
					</Wrap>
				)}
				hideHead
			>
				<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
					<Content style={gstyle.textLight}>Others</Content>
					{contacts.map((i:ContactObject, k:number) => (
						<OpacityButton key={k} style={{...grid.rowCenter, paddingTop: h(3), paddingBottom: h(3), borderColor: colors.border, borderTopWidth: w(0.2), borderBottomWidth: w(0.2)}}  onPress = {() => {copyToClipboard(i.address); showToast("Copied address", "success")}} >
							<Wrap style={{marginRight: w(4)}}>
								<Avartar address={i.address} size={8} type={setting.identicon === "jazzicons" ?"Zazzicon" : "Blockies"}/>
							</Wrap>
							<Wrap style={grid.colBetween}>
								<Content style={gstyle.labelWhite}>{i.label}</Content>
								<Content style={gstyle.labelWhite}>{ellipsis(i.address, 20)}</Content>
							</Wrap>
						</OpacityButton>
					))}
				</Wrap>
			</WalletLayout>
			{status.addModal && (
				<Modal
					title={"Add Contact"}
					close={() => updateStatus({addModal: false})}
				>
					<DefaultInput
						label={"Name"}
						visibleValue={false}
						inputProps={{
							placeholder: "Name",
							onChangeText: (txt:string) => updateStatus({label: txt}),
							value: status.label,
							style:{borderColor: colors.color, borderWidth: w(0.1)}
						}}
					/>
					<DefaultInput
						label={"Address"}
						visibleValue={false}
						inputProps={{
							placeholder: "Public address (0x), or ENS",
							onChangeText: (txt:string) => updateStatus({address: txt}),
							value: status.address,
							style:{borderColor: colors.color, borderWidth: w(0.1)}
						}}
					/>
					<DefaultInput
						label={"Memo"}
						visibleValue={false}
						inputProps={{
							placeholder: "Memo",
							onChangeText: (txt:string) => updateStatus({memo: txt}),
							value: status.memo,
							style:{borderColor: colors.color, borderWidth: w(0.1)}
						}}
					/>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: () => {addContact()}}}>Add Contact</DefaultButton>
					</Wrap>
				</Modal>
			)}
		</>
	)
}