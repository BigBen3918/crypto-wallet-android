
import React from "react"
import Carousel from 'react-native-snap-carousel';
import AuthLayout from "../layouts/AuthLayout";
import { DefaultButton } from "../components/elements";
import { grid, gstyle, h, w } from "../components/style";
import { Content, Picture, Wrap } from "../components/commons";
import { getStarted as style } from "../components/StyledComponents";

interface ProjectWalletStatus{
	showModal:		boolean
	activeSlide:	number
}

interface DataObject {
	title:	string
	desc:	string
	image:	ImageData
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<ProjectWalletStatus>({
		showModal:		true,
		activeSlide:	0
	})
		
	const updateStatus = (params:Partial<ProjectWalletStatus>) => setStatus({...status, ...params});

	const data = [
		{
			title: "Welcome to neon Wallet",
			desc: "Thrusted by Millions, Neon Wallet is a secure wallet making the world of web3 accessible to all.",
			image: require("../../assets/start/banner_1.webp")
		},
		{
			title: "Manage your digital assets",
			desc: "Store, spend and send digital assets like tokens, ethereum, unique collectibles.",
			image: require("../../assets/start/banner_2.webp")
		},
		{
			title: "Your gateway to web3",
			desc: "Logion with Neon Wallet and make transactions to invest, earn, play games, sell and more!",
			image: require("../../assets/start/banner_7.webp")
		}
	] as DataObject[]
		
	let _carousel;

	const submit = async () => { 
		navigation?.navigate('WalletSetup')
	}

	const _renderItem = ({item, index}:{item:DataObject, index: number}) => (
		<Wrap key={index}>
			<Content style={gstyle.title}>{item.title}</Content>
			<Content style={gstyle.textLightCenter}>{item.desc}</Content>
			<Wrap style={style.imageWrapper}>
				<Picture source={item.image} style={{height: h(40), width: w(80)}} />
			</Wrap>
		</Wrap>
	)

	return (
		<>
			<AuthLayout>
				<Wrap style={style.carosel}>
					<Carousel
						ref={(c:any) => { _carousel = c; }}
						data={data}
						renderItem={_renderItem}
						sliderWidth={w(86)}
						itemWidth={w(86)}
						layout={"default"}
						onSnapToItem={(index:number) => updateStatus({activeSlide: index }) }
					/>
				</Wrap>
				<Wrap style={grid.btnGroup}>
					<DefaultButton btnProps={{onPress: submit}}>GET START</DefaultButton>
				</Wrap>
			</AuthLayout>
		</>
	);
}
