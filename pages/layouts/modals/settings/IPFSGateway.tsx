import React from "react"
import Icon from "../../../components/Icon"
import { Modal } from "../../../components/elements"
import { grid, gstyle, w } from "../../../components/style"
import { Content, OpacityButton } from "../../../components/commons"

export const IPFSs = [
	{
		name: "https://gateway.pinata.cloud/"
	},
	{
		name: "https://cloudflare-ipfs.com/ipfs"
	},
	{
		name: "https://hardbin.com/ipfs"
	},
	{
		name: "https://ipfs.eternum.io/ipfs"
	},
	{
		name: "https://upfs.infura.io/ipfs"
	},
	{
		name: "https://gateway.ipfs.io/ipfs"
	},
	{
		name: "https://ipfs.io/ipfs"
	}
]

export default function ({close}: {close: any}) {
	const index = 0
	
	return (
		<Modal
			close={close}
			width={70}
			title={"IPFS Gateway"}
		>
			{IPFSs.map((i:any, k:number) => (
				<OpacityButton style={{...grid.rowCenterBetween, ...grid.gridMargin2}}>
					<Content style={gstyle.labelWhite}>{i.name}</Content>
					{k === index && (
						<Icon.Check width={w(5)} height={w(5)} />
					)}
				</OpacityButton>
			))}
		</Modal>
	)
}