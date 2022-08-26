import React from "react"
import {  grid, gstyle, h, w } from "../components/style"
import { setting as style } from "../components/StyledComponents"
import { BgImage, Content, OpacityButton, ScrollWrap, Wrap } from "../components/commons"
import Icon from "../components/Icon"

const menuItems = [
	{
		key: "general",
		icon: (color: string) => <Icon.Global color={color} />,
		label: "General",
		desc: "Currency conversion, primary currency, language and search engine",
		component: "General"
	},
	{
		key: "advanced",
		icon: (color: string) => <Icon.Wallet2 color={color} />,
		label: "Advanced",
		desc: "Access developer features, reset account, setup testnets, state logs, IPES gateway and custom RPC",
		component: "Advanced"
	},
	{
		key: "contact",
		icon: (color: string) => <Icon.Activity color={color} />,
		label: "Contact",
		desc: "Add, edit, remove, and manage your accounts",
		component: "Contact"
	},
	{
		key: "security",
		icon: (color: string) => <Icon.Share color={color} />,
		label: "Security & privacy",
		desc: "Privacy settings, MetaMetrics, private key and wallet Secret Recovery Phrase",
		component: "Security"
	},
	{
		key: "networks",
		icon: (color: string) => <Icon.Setting color={color} />,
		label: "Networks",
		desc: "Add and edit custom RPC networks",
		component: "Networks"
	},
	{
		key: "experimental",
		icon: (color: string) => <Icon.Support color={color} />,
		label: "Experimental",
		desc: "WalletConnect & more...",
		component: "Experimental"
	},
	{
		key: "about",
		icon: (color: string) => <Icon.Quest color={color} />,
		label: "About",
		desc: "",
		component: "About"
	}
]

export default function ({ navigation }: any): JSX.Element {
	return (
		<BgImage source={require("../../assets/bg.png")} style={{width: w(100), height: h(100)}}>
			<Wrap style={gstyle.body}>
				<Wrap style={style.header}>
					<OpacityButton style={style.arrowLeft} onPress={() => navigation?.goBack()}>
						<Icon.ArrowLeft width={w(6)} height={w(6)} />
					</OpacityButton>
					<Content style={gstyle.title2}>Setting</Content>
				</Wrap>
				<ScrollWrap style={{flex: 1}}>
					{menuItems.map((i: any, k: number) => (
						<OpacityButton key={k} style={style.item} onPress={() => navigation?.navigate(i.component)}>
							<Wrap style={{...grid.rowCenterBetween}}>
								<Content style={{...gstyle.textLightLgCenter, paddingTop: h(1)}}>{i.label}</Content>
								<Wrap>
									<Icon.ArrowRight width={w(5)} height={w(5)} />
								</Wrap>
							</Wrap>
							<Content style={{...gstyle.labelWhite}}>{i.desc}</Content>
						</OpacityButton>
					))}
				</ScrollWrap>
			</Wrap>
		</BgImage>
	)
}