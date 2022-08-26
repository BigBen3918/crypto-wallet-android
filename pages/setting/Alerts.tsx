import React from "react"
import { Switch } from "react-native-gesture-handler"
import Icon from "../components/Icon"
import { Content, OpacityButton, Wrap } from "../components/commons"
import { colors, grid, gstyle, w } from "../components/style"
import WalletLayout from "../layouts/WalletLayout"


export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState({
		switch1: true,
		switch2: true
	})

	return (
		<WalletLayout
			navigation={navigation}
			menuKey="wallet"
			content={
				<Wrap style={gstyle.titleEff}>
					<OpacityButton style={{marginRight: w(2)}} onPress={()=>navigation?.goBack()}>
						<Icon.ArrowLeft width={w(5)} height={w(5)} />
					</OpacityButton>
					<Content style={{...gstyle.title2}}>Alerts</Content>
				</Wrap>
			}
			hideHead
		>
			<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
				<Wrap style={grid.rowCenterBetween}>
					<Content  style={{...gstyle.labelWhite, width: w(60)}}>Browsing a website with an unconnected account selected</Content>
					<Wrap style={grid.rowCenter}>
						<Icon.Exclamation color={colors.bgButton} />
						<Wrap><Switch thumbColor={colors.warning} onValueChange={() => setStatus({...status, switch1: !status.switch1})} value={status.switch1} /></Wrap>
						<Content style={{...gstyle.labelWhite, width: w(8)}}>{status.switch1 ? "ON": "OFF"}</Content>
					</Wrap>
				</Wrap>
				<Wrap style={gstyle.hr2} />
				<Wrap style={grid.rowCenterBetween}>
					<Content  style={{...gstyle.labelWhite, width: w(60)}}>When a website tries to use removed window.web3.API</Content>
					<Wrap style={grid.rowCenter}>
						<Icon.Exclamation color={colors.bgButton} />
						<Wrap><Switch thumbColor={colors.warning} onValueChange={() => setStatus({...status, switch2: !status.switch2})} value={status.switch2} /></Wrap>
						<Content style={{...gstyle.labelWhite, width: w(8)}}>{status.switch2 ? "ON": "OFF"}</Content>
					</Wrap>
				</Wrap>
			</Wrap>
		</WalletLayout>
	)
}
