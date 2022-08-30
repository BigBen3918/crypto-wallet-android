
import React from "react"
import Logo from '../../assets/icicb_logo.png'
import { DefaultButton } from "../components/elements";
import { grid, gstyle, h, w} from "../components/style";
import { BgImage, Content, Picture, Wrap } from "../components/commons";
import { authLayout as style } from "../components/StyledComponents"

export default function ({ navigation }: any) {

	const submit = async () => { 
		navigation?.navigate('WalletSetup')
	}

	return (
		<>
			<BgImage source={require("../../assets/bg.png")} style={{width: w(100), height: h(100)}}>
				<Wrap style={gstyle.body}>
					<Wrap style={{...style.header, marginTop:h(10), ...grid.rowCenterBetween}} >
						<Wrap></Wrap>
						<Picture source={Logo} style={{width:w(30), height:w(12)}}/>
						<Wrap></Wrap>
					</Wrap>
					<Wrap style={{marginTop:h(20)}}>
						<Content style={{...gstyle.textLightLgCenter}}>Welcome to ICICB Metamask</Content>
						<Content style={{...gstyle.textLightCenter, marginTop: h(3)}}>Connecting you to ICICB blockchain </Content>
						<Content style={{...gstyle.textLightCenter}}>and the decentralised wallet.</Content>
						<Wrap style={{...grid.btnGroup, marginTop: h(25)}}>
							<DefaultButton btnProps={{onPress: submit}}>GET START</DefaultButton>
						</Wrap>
					</Wrap>
				</Wrap>
			</BgImage>
		</>
	);
}
