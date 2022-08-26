import React, { useEffect } from "react"

interface TokenObject {
	name: string
}

const tokens = [
	{name: "Ethereum Mainnet"},
	{name: "Ethereum Testnet"}
] as TokenObject[]

interface SwapStatus {
	token: number
}
			
export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<SwapStatus>({
		token: 0
	})

	return (
		<>
			{/* <View style={S.body}>
				<View style={{...style.middle, paddingLeft: w(2), paddingRight: w(2), paddingTop: h(2), paddingBottom: h(3), backgroundColor: Colors.bgSecondary}}>
					<Image source={Logo} />
					<View style={style.middle}>
						<TouchableOpacity style={{...style.middle, height: h(5), paddingLeft: w(2), paddingRight: w(2), backgroundColor: Colors.bgEff}}><Text style={{...S.text, marginRight: w(2)}}>{tokens[status.token].name}</Text><Icon.ArrowBottom /></TouchableOpacity>
						<View></View>
					</View>
				</View>
				<View style={{...S.container, width: w(90), marginLeft: w(5), marginTop: h(1)}}>
					<View style={S.content2}>
						<TouchableOpacity style={style.flexLeft} onPress={() => navigation?.navigate('WalletTokens')}><Text style={S.link}>CANCEL</Text></TouchableOpacity>
						<Text style={S.title}>SWAP</Text>
						<View style={S.inputform}>
							<View style={style.middle}>
								<Text style={{...S.label}}>New password</Text>
							</View>
							<TextInput secureTextEntry={true} style={{...S.input, ...S.block}} placeholderTextColor={Colors.placeholder} placeholder="Enter your secret Recovery Phase" />
						</View>
					</View>
					<View>
						<View style={S.hr} />
						<View style={{...S.btnGroup, ...S.pb3}}>
							<TouchableOpacity style={style.flexLeft} onPress={() => navigation?.navigate('WalletTokens')}><Text style={S.link}>Terms of Service</Text></TouchableOpacity>
						</View>
					</View>
				</View>
			</View> */}
		</>
	)
}
