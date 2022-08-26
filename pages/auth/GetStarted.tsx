
import React from "react"
import Logo from '../../assets/logo.png'
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
			<BgImage source={require("../../assets/welcome_back.png")} style={{width: w(100), height: h(100)}}>
				<Wrap style={gstyle.body}>
					<Wrap style={{...style.header, marginTop:h(5), ...grid.rowCenterBetween}} >
						<Wrap></Wrap>
						<Picture source={Logo} style={{width:w(25), height:w(10)}}/>
						<Wrap></Wrap>
					</Wrap>
					<Wrap style={{marginTop:h(55)}}>
						<Content style={{...gstyle.textLightLgCenter}}>Welcome to ICICB Metamask</Content>
						<Content style={{...gstyle.textLightCenter}}>Connecting you to Ethereum</Content>
						<Content style={{...gstyle.textLightCenter}}>and the Decentralized Web.</Content>
						<Wrap style={grid.btnGroup}>
							<DefaultButton btnProps={{onPress: submit}}>GET START</DefaultButton>
						</Wrap>
					</Wrap>
				</Wrap>
			</BgImage>
		</>
	);
}
