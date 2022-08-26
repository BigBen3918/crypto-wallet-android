import React from "react"
import {WebView} from 'react-native-webview';
import Icon from "../components/Icon";
import { Loading } from "../components/elements";
import { gstyle, h, w } from "../components/style"
import {Content, OpacityButton,  Wrap } from "../components/commons"
import { authLayout as style } from "../components/StyledComponents"


interface WebViewInterface {
	loading:	boolean
	connected:	boolean
}

export default function ({route, navigation }: any) {
	const {url} = route.params;

    const [status, setStatus] = React.useState<WebViewInterface>({
        loading:	true,
		connected:	false
    })

	const updateStatus = (params:Partial<WebViewInterface>) => setStatus({...status, ...params});

	const goBack = () => { 
		navigation?.goBack()
	}

	React.useEffect(() => {
		try {
			fetch(url)
			.then((response) => {
			  if (response.status === 200) {
				updateStatus({loading: false, connected: true})
			  } else {
				updateStatus({loading: false, connected: false})	
			  }
			})
			.catch((error) => {
			  updateStatus({loading: false, connected: false})
			})
		} catch(ex) {}
	}, [])

	return (
		<>
			<Wrap style={{width: w(100), height: h(100)}}>
				<Wrap style={gstyle.body}>
					<Wrap style={{...style.header, marginTop:h(3)}} >
						<Wrap style={{width: w(10)}} >
							{goBack && (
								<OpacityButton onPress={goBack}>
									<Icon.ArrowLeft color="black" width={w(5)} height={w(5)} />
								</OpacityButton>
							)}
						</Wrap>
						<Wrap style={{width:w(80)}}>
							<Content style={{...gstyle.textLight, ...gstyle.textCenter,  paddingTop: h(2), color: "black"}}>{url}</Content>
						</Wrap>
						<Wrap style={{width: w(7)}} />
					</Wrap>
					{
						status.connected && <WebView source={{ uri: url}}/>
					}
					{
						!status.connected && <Content style={{...gstyle.textCenter, ...gstyle.textLightLg, ...gstyle.textDanger, marginTop: h(10)}}> Connecting... </Content>
					}
				</Wrap>
			</Wrap>
			
            {
                status.loading ? <Loading /> : <></>
            }
		</>
	)
}
