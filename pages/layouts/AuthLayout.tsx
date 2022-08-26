import React from "react"
import Icon from "../components/Icon"
import Logo from '../../assets/logo.png'
import { gstyle, h, w } from "../components/style"
import { authLayout as style } from "../components/StyledComponents"
import { BgImage, Content, OpacityButton, Picture, ScrollWrap, Wrap } from "../components/commons"

interface AuthLayoutProps {
	title?:				string
	content?:			any
	children:			any
	onBack?:			any
	footer?:			any
}

export default function ({ title, content, children, onBack, footer }: AuthLayoutProps) {
   
	const goBack = () => {
		onBack()
	}
	
	return (
		<BgImage source={require("../../assets/bg.png")} style={{width: w(100), height: h(100)}}>
			<Wrap style={gstyle.body}>
				<Wrap style={{...style.header, marginTop:h(3)}} >
					<Wrap style={{width: w(7)}} >
						{onBack && (
							<OpacityButton style={style.prev_btn} onPress={goBack}>
								<Icon.ArrowLeft {...style.prev_icon} width={w(5)} height={w(5)} />
							</OpacityButton>
						)}
					</Wrap>
					<Wrap>
						<Picture source={Logo} style={{width:w(25), height:w(10)}}/>
					</Wrap>
					<Wrap style={{width: w(7)}} />
				</Wrap>
				<ScrollWrap style={style.container} contentContainerStyle={gstyle.scrollviewContainer}>
					{ content && content }
					{ title && (
						<Content style={gstyle.title}>{title}</Content>
					)}
					{children}
				</ScrollWrap>
				{footer && (
					<Wrap style={style.footer}>
						{footer}
					</Wrap>
				)}
			</Wrap>
		</BgImage>
	)
}
