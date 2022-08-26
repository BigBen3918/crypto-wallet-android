import React from "react"
import Icon from "../../../components/Icon"
import { Modal } from "../../../components/elements"
import { grid, gstyle, w } from "../../../components/style"
import { Content, OpacityButton } from "../../../components/commons"

export const engines = [
	{
		name: "DuckDuckGo"
	},
	{
		name: "Google"
	}
]


export default function ({close}: {close: any}) {
	const index = 0
	return (
		<Modal
			close={close}
			width={70}
			title={"Search Engine"}
		>
			{engines.map((i:any, k:number) => (
				<OpacityButton key={k} style={{...grid.rowCenterBetween, ...grid.gridMargin2}}>
					<Content style={gstyle.labelWhite}>{i.name}</Content>
					{k === index && (
						<Icon.Check width={w(5)} height={w(5)} />
					)}
				</OpacityButton>
			))}
		</Modal>
	)
}