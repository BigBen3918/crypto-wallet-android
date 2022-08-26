import React from "react"
import Icon from "../components/Icon"
import Logo from '../../assets/logo.png'
import NetworkModal from "./NetworkModal"
import Avatar from "../components/avatar"
import AccountModal from "./AccountModal"
import { colors, grid, gstyle, h, w } from "../components/style"
import { functionLayout as style } from "../components/StyledComponents"
import { BgImage, Content, OpacityButton, Picture, ScrollWrap, Wrap } from "../components/commons"
import useStore from "../../useStore"
import { ZeroAddress } from "../../library/wallet"


interface FunctionLayoutProps {
	navigation?:		any
	title?:				string | JSX.Element
	hideClose?:   		boolean
	content?:			any
	children:			any
	onBack?:			any
	footer?:			any
}

interface FunctionLayoutStatus {
	networkModal: 	boolean
	accountModal: 	boolean
}

export default function ({ navigation, title, hideClose, content, children, onBack, footer }: FunctionLayoutProps) {
	const [status, setStatus] = React.useState<FunctionLayoutStatus>({
		networkModal:	false,
		accountModal:	false
	})
		
	const updateStatus = (params:Partial<FunctionLayoutStatus>) => setStatus({...status, ...params});
	const {currentAccount,setting, currentNetwork, networks} = useStore()

	return (
		<BgImage source={require("../../assets/bg.png")} style={{width: w(100), height: h(100)}}>
			<Wrap style={gstyle.body}>
				<Wrap style={style.header}>
					<OpacityButton onPress={() => navigation.navigate("WalletTokens")}>
						<Picture source={Logo} style={{ width: w(20), height: w(8) }} />
					</OpacityButton>
					<Wrap style={style.content}>
						<OpacityButton style={style.network} onPress={() => updateStatus({networkModal: true})}>
							<Content style={{...gstyle.labelWhite, marginRight: w(2)}}>
								{Object.values(networks).map(( network ) => {
									if( network.chainKey === currentNetwork){
										return network.label
									}}) 
								}
							</Content>
							<Wrap style={{paddingTop: w(1)}}><Icon.ArrowBottom /></Wrap>
						</OpacityButton>
						<OpacityButton  onPress={() => updateStatus({accountModal: true})}>
							<Avatar size={8} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} address={currentAccount || ZeroAddress} />
						</OpacityButton>
					</Wrap>
				</Wrap>
				{!hideClose && (
					<OpacityButton 
						style={{...grid.rowCenterEnd, marginTop: h(-2), paddingLeft: w(2), paddingRight: w(2)}} 
						onPress={onBack}
					>
						<Content style={gstyle.labelWhite}>CANCEL</Content>
						<Wrap style={{paddingTop: h(2), marginLeft: w(1)}}><Icon.X width={w(7)} height={w(7)} color={colors.danger} /></Wrap>
					</OpacityButton>
				)}
				<ScrollWrap style={gstyle.container} contentContainerStyle={gstyle.scrollviewContainer}>
					{ content && content }
					{ title && (
						<Content style={{...gstyle.title, marginTop: h(0)}}>{title}</Content>
					)}
					{children}
				</ScrollWrap>
				{footer && (
					<Wrap style={style.footer}>
						{footer}
					</Wrap>
				)}
			</Wrap>
			{status.networkModal && (
				<NetworkModal close={() => updateStatus({networkModal: false})} navigation={navigation} />
			)}
			{status.accountModal && (
				<AccountModal close={() => updateStatus({accountModal:  false})} navigation={navigation} />
			)}
		</BgImage>
	)
}