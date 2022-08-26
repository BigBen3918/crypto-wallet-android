import React from "react"
import { Loading } from "./elements"
import { gstyle, h, w } from "./style"
import { BgImage,  Content,  Wrap } from "./commons"
import Icon from "./Icon"

export const LoadScreen = () => {
	return <Wrap>
				<Wrap style={{...gstyle.subContainer, alignItems:'center'}}>
					<Wrap style={{marginTop:h(20)}}> 
							<Icon.SmLogo width={w(20)} height={w(20)} />
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