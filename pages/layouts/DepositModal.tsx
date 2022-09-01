import React from "react"
import Qrcode from "../components/qrcode"
import {  colors, grid, gstyle, h, w } from "../components/style"
import { Content, OpacityButton, Wrap } from "../components/commons"
import { DefaultButton, DefaultInput, Loading, Modal } from "../components/elements"
import useStore, { ellipsis } from "../../useStore";
import { ZeroAddress } from "../../library/wallet"

export default function ({close, navigation}: any) {
	
	const {currentAccount, update} = useStore()

	return (
		<>
			<Modal 
				close={close} 
				title={"Deposit"}
			>
				<Wrap>
					<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin3}}>
						<Qrcode.createQRCode code={currentAccount || ZeroAddress} size={w(50)} />
					</Wrap>
					<Content style={{...gstyle.textLight, textAlign:'center'}}>{ellipsis(currentAccount, 25)}</Content>
				</Wrap>
			</Modal>
		</>
	)
}