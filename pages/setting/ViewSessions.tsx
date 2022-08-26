import React from "react"
import {grid, gstyle, h, w } from "../components/style"
import { DefaultButton, Modal } from "../components/elements"
import { setting as style } from "../components/StyledComponents"
import { BgImage, Content, OpacityButton, Picture, ScrollWrap, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import useStore, { ellipsis } from "../../useStore"

interface SessionStatus {
	uri:		string
	showModal:	boolean
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<SessionStatus>({
		uri:		"",
		showModal:	false
	})
	
	const updateStatus = (params:Partial<SessionStatus>) => setStatus({...status, ...params});

	const { connects, connectHistory, showToast, update} = useStore()

	const killSession = () => {
		let cons = [] as WalletConnectSession[];
		let histories = [] as WalletConnectHistory[];
		connects.forEach(element => {
			if(element.uri !== status.uri) cons.push(element)
		})
		connectHistory.forEach(element => {
			if(element.uri !== status.uri) histories.push(element)
		})
		update({connects: cons, connectHistory: histories})
		updateStatus({showModal: false, uri: ""})
		showToast("Killed session")
	}

	return (
		<BgImage source={require("../../assets/bg.png")} style={{width: w(100), height: h(100)}}>
			<Wrap style={gstyle.body}>
				<Wrap style={style.header}>
					<OpacityButton style={style.arrowLeft} onPress={() => navigation?.goBack()}>
						<Icon.ArrowLeft width={w(6)} height={w(6)} />
					</OpacityButton>
					<Content style={gstyle.title}>Wallet Connect  Sessions</Content>
				</Wrap>
				<ScrollWrap style={{flex: 1}}>
					{connectHistory.map((i: WalletConnectHistory, k: number) => (
						<OpacityButton key={k} style={style.item} onPress={() => {updateStatus({uri: i.uri, showModal: true})}}>
							<Wrap style={{...grid.rowBetween}}>
								<Wrap style={{...grid.rowCenterCenter, alignContent:"center", width: w(10)}}>
									<Picture source={{uri: i.icon}} style={{width:w(8), height:w(8)}}/>
								</Wrap>
								<Wrap style={{width: w(80), marginLeft: w(3)}}>
									<Content style={{...gstyle.labelLg, paddingTop: h(1)}}>{i.name}</Content>
									<Content style={{...gstyle.labelSm}}>{ellipsis(i.uri, 50)}</Content>
									<Content style={{...gstyle.label}}>{i.url}</Content>
									<Content style={{...gstyle.label}}>{i.description}</Content>
								</Wrap>
							</Wrap>
						</OpacityButton>
					))}
				</ScrollWrap>
			</Wrap>
			{status.showModal && (
				<Modal
					title={"Kill Session"}
					close={() => updateStatus({showModal: false})}
				>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: () => {killSession()}}}>End Session</DefaultButton>
					</Wrap>
				</Modal>
			)}
		</BgImage>
	)
}