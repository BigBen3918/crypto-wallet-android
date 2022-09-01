import React from "react"
import { Loading } from "./elements"
import { gstyle, h, w } from "./style"
import { BgImage,  Content,  Picture,  Wrap } from "./commons"
import Logo from '../../assets/icicb_logo.png'

export const LoadScreen = () => {
	return <Wrap>
				<Wrap style={{...gstyle.subContainer, alignItems:'center'}}>
					<Wrap style={{marginTop:h(20)}}> 
						<Picture source={Logo} style={{width:w(25), height:w(10)}}/>
					</Wrap>
					<Content style={gstyle.title}>ICICB Wallet</Content>
				</Wrap>
			</Wrap>
}

export default () => (
	<BgImage source={require("../../assets/bg.png")} style={{ width: w(100), height: h(100), display:'flex', alignItems:'center'}}>
		<Wrap style={gstyle.body}>
			<LoadScreen />
		</Wrap>
		<Loading />
	</BgImage>
)