import React from "react"
import Icon from "../../../components/Icon"
import { Modal } from "../../../components/elements"
import { grid, gstyle, w } from "../../../components/style"
import { Content, OpacityButton } from "../../../components/commons"
import useStore from "../../../../useStore"

export const languages = [
	{
		name: "German"
	},
	{
		name: "Greek"
	},
	{
		name: "English"
	},
	{
		name: "Spanish"
	},
	{
		name: "French"
	},
	{
		name: "Hindi"
	},
	{
		name: "Bahasa Indonesuan"
	},
	{
		name: "Japanese"
	},
	{
		name: "Korean"
	},
	{
		name: "Portuguese - Brazil"
	},
	{
		name: "Russian"
	},
	{
		name: "Filipino"
	},
	{
		name: "Turkish"
	},
	{
		name: "Vietnamese"
	},
	{
		name: "Chinese - China"
	}
]

export default function ({close}: {close: any}) {
	const {setting, lang, update} = useStore()
	return (
		<Modal
			close={close}
			width={70}
			title={"Current Language"}
		>
			{languages.map((i:any, k:number) => (
				<OpacityButton style={{...grid.rowCenterBetween, ...grid.gridMargin2}} onPress={() => {update({lang: i.name})}}>
					<Content style={gstyle.labelWhite}>{i.name}</Content>
					{lang === i.name && (
						<Icon.Check width={w(5)} height={w(5)} />
					)}
				</OpacityButton>
			))}
		</Modal>
	)
}