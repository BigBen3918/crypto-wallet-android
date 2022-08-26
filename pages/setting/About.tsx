import React from "react"
import Icon from "../components/Icon"
import { grid, gstyle, h, w } from "../components/style"
import { Content, OpacityButton, Wrap } from "../components/commons"
import WalletLayout from "../layouts/WalletLayout"

export default function ({ navigation }: any) {
	return (
		<WalletLayout
			navigation={navigation}
			menuKey="wallet"
			content={
				<Wrap style={gstyle.titleEff}>
					<OpacityButton style={{marginRight: w(2)}} onPress={()=>navigation?.goBack()}>
						<Icon.ArrowLeft width={w(5)} height={w(5)} />
					</OpacityButton>
					<Content style={{...gstyle.title2}}>About</Content>
				</Wrap>
			}
			hideHead
		>
			<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
				<Wrap>
					<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>NeonWallet Version</Content>
					<Content style={gstyle.textLight}>1.0.0</Content>
					<Content style={gstyle.textLight}>NeonWallet is designed and built around the world.</Content>
				</Wrap>
				<Wrap style={gstyle.hr2} />
				<Wrap>
					<Content style={{...gstyle.textLightLg, paddingTop: h(1)}}>LINKS</Content>
					<Wrap style={grid.gridMargin4}>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Privacy Policy</Content>
						</Wrap>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Terms of Use</Content>
						</Wrap>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Attributions</Content>
						</Wrap>
					</Wrap>
					<Wrap style={grid.gridMargin2}>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Visit our Support Center</Content>
						</Wrap>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Visit our website</Content>
						</Wrap>
						<Wrap style={grid.gridMargin2}>
							<Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Contact us</Content>
						</Wrap>
					</Wrap>
				</Wrap>
			</Wrap>
		</WalletLayout>
	)
}